import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useConfirmationModals } from '../../hooks/useConfirmationModals';
import ConfirmationModal from '../Visuals/ConfirmationModal';
import { getModalProps } from '../../utils/modalConfigs';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import { formatDateObj } from '../../utils/petUtils';

interface FileWithName {
  file: File;
  displayName: string;
}

interface ExistingFileData {
  id: number;
  document_id: number;
  file_name: string;
  file_path: string;
  original_name: string;
  created_at: string;
}

interface DocumentsFormData {
  document_name: string;
  document_type: 'certificate' | 'medical' | 'insurance' | 'identification' | 'other';
  upload_date: string;
  file_path: string;
  description: string;
  veterinarian: string;
  notes: string;
  file?: File;
  files?: File[];
  filesWithNames?: FileWithName[];
  existingFiles?: ExistingFileData[];
  filesToDelete?: number[];
  filesUpdated?: ExistingFileData[];
  linked_type?: string;
  linked_id?: number | null;
}

interface LinkableItems {
  vaccines: Array<{ id: number; vaccine_name: string; vaccine_date: string }>;
  medications: Array<{ id: number; medication_name: string; start_date: string }>;
  dewormings: Array<{ id: number; product_name: string; treatment_date: string }>;
  medicalReviews: Array<{ id: number; visit_type: string; visit_date: string; reason?: string }>;
}

interface DocumentsFormProps {
  formData: DocumentsFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: DocumentsFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  linkableItems?: LinkableItems;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return { icon: 'mdi:file-pdf-box', color: 'text-red-400' };
    case 'doc':
    case 'docx':
      return { icon: 'mdi:file-word-box', color: 'text-blue-500' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return { icon: 'mdi:file-image-box', color: 'text-green-400' };
    case 'txt':
      return { icon: 'mdi:file-document-box', color: 'text-slate-400' };
    case 'zip':
    case 'rar':
      return { icon: 'mdi:file-compress', color: 'text-yellow-400' };
    default:
      return { icon: 'mdi:file-box', color: 'text-slate-400' };
  }
};

export default function DocumentsForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel,
  linkableItems
}: DocumentsFormProps) {
  const { t } = useTranslation();
  const { getDateFormat } = useSettings();
  const [isDragging, setIsDragging] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLinkedLabel = () => {
    if (!formData.linked_type || !formData.linked_id || !linkableItems) return '';
    switch (formData.linked_type) {
      case 'vaccine': {
        const v = linkableItems.vaccines.find(v => v.id === formData.linked_id);
        return v ? `${v.vaccine_name} - ${formatDateObj(new Date(v.vaccine_date + 'T00:00:00'), getDateFormat())}` : '';
      }
      case 'medication': {
        const m = linkableItems.medications.find(m => m.id === formData.linked_id);
        return m ? `${m.medication_name} - ${formatDateObj(new Date(m.start_date + 'T00:00:00'), getDateFormat())}` : '';
      }
      case 'deworming': {
        const d = linkableItems.dewormings.find(d => d.id === formData.linked_id);
        return d ? `${d.product_name} - ${formatDateObj(new Date(d.treatment_date + 'T00:00:00'), getDateFormat())}` : '';
      }
      case 'review': {
        const r = linkableItems.medicalReviews.find(r => r.id === formData.linked_id);
        return r ? `${r.reason || r.visit_type} - ${formatDateObj(new Date(r.visit_date + 'T00:00:00'), getDateFormat())}` : '';
      }
      default: return '';
    }
  };

  const {
    activeModal,
    closeModal,
    openDeleteDocumentFileModal,
    openDeleteSelectedFileModal
  } = useConfirmationModals();

  const handleInputChange = (field: keyof DocumentsFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const currentFilesWithNames = formData.filesWithNames || [];
    const newFilesWithNames = newFiles.map(file => ({
      file,
      displayName: file.name.replace(/\.[^/.]+$/, "")
    }));
    onFormChange({ ...formData, filesWithNames: [...currentFilesWithNames, ...newFilesWithNames] });
  };

  const confirmDeleteDocumentFile = () => {
    if (activeModal && activeModal.item) {
      const fileData = activeModal.item;
      const index = formData.existingFiles?.findIndex(f => f.id === fileData.id) ?? -1;

      if (index >= 0) {
        const filesToDelete = [...(formData.filesToDelete || [])];
        if (fileData.id && !filesToDelete.includes(fileData.id)) {
          filesToDelete.push(fileData.id);
        }
        const newFiles = formData.existingFiles?.filter((_, i) => i !== index) || [];
        onFormChange({
          ...formData,
          existingFiles: newFiles,
          filesToDelete: filesToDelete
        });
      }
    }
    closeModal();
  };

  const confirmDeleteSelectedFile = () => {
    if (activeModal && activeModal.item) {
      const index = activeModal.item.index;
      const newFilesWithNames = formData.filesWithNames?.filter((_, i) => i !== index) || [];
      onFormChange({ ...formData, filesWithNames: newFilesWithNames });
    }
    closeModal();
  };

  const modalProps = getModalProps(activeModal, {
    confirmDeleteVaccine: () => {},
    confirmCompleteVaccine: () => {},
    confirmDeleteWeight: () => {},
    confirmDeleteMedication: () => {},
    confirmCompleteMedication: () => {},
    confirmDeleteDeworming: () => {},
    confirmCompleteDeworming: () => {},
    confirmDeleteMedicalReview: () => {},
    confirmDeleteDocumentFile: confirmDeleteDocumentFile,
    confirmDeleteSelectedFile: confirmDeleteSelectedFile
  }, t, getDateFormat());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
              <Icon icon="mdi:file-document" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.documentNameLabel')} {(formData.filesWithNames && formData.filesWithNames.length > 1) ? '*' : ''}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.document_name}
                onChange={(e) => handleInputChange('document_name', e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
                placeholder={
                  formData.filesWithNames && formData.filesWithNames.length > 1
                    ? t('portfolio.documents.form.documentNamePlaceholder')
                    : t('portfolio.documents.form.singleFileDocumentPlaceholder')
                }
              />
              <Icon icon="mdi:tag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="group">
            <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
              <Icon icon="mdi:format-list-bulleted-type" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.documentTypeLabel')}
            </label>
            <div className="relative">
              <select
                value={formData.document_type}
                onChange={(e) => handleInputChange('document_type', e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all appearance-none"
              >
                <option value="certificate">{t('portfolio.documents.form.certificateOption')}</option>
                <option value="medical">{t('portfolio.documents.form.medicalOption')}</option>
                <option value="insurance">{t('portfolio.documents.form.insuranceOption')}</option>
                <option value="identification">{t('portfolio.documents.form.identificationOption')}</option>
                <option value="other">{t('portfolio.documents.form.otherOption')}</option>
              </select>
              <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Icon icon="mdi:file-chart" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="group">
            <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
              <Icon icon="tabler:upload" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.uploadDateLabel')}
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.upload_date}
                onChange={(e) => handleInputChange('upload_date', e.target.value)}
                required
                className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
              />
              <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="group">
            <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
              <Icon icon="mdi:link-variant" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.linkLabel')}
            </label>
            <button
              type="button"
              onClick={() => setShowLinkModal(true)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-left transition-all hover:border-slate-500 relative"
            >
              {formData.linked_type && formData.linked_id ? (
                <span className="text-teal-300">{getLinkedLabel()}</span>
              ) : (
                <span className="text-slate-400">{t('portfolio.documents.form.linkNone')}</span>
              )}
              <Icon icon="mdi:link-variant" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Icon icon="mdi:chevron-right" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="group md:col-span-2">
            <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
              <Icon icon="mdi:file-upload" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.fileLabel')}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFiles(e.target.files);
                }
                e.target.value = '';
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFiles(e.dataTransfer.files);
                }
              }}
              className={['flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all', isDragging ? 'border-teal-400 bg-teal-500/10' : 'border-slate-600/50 bg-slate-700/30 hover:border-slate-500 hover:bg-slate-700/50'].join(' ')}
            >
              <Icon icon={isDragging ? 'mdi:file-download' : 'mdi:cloud-upload'} className={['w-8 h-8 transition-colors', isDragging ? 'text-teal-400' : 'text-slate-500'].join(' ')} />
              <p className={['text-sm transition-colors', isDragging ? 'text-teal-300' : 'text-slate-400'].join(' ')}>
                {isDragging ? t('portfolio.documents.form.dropzoneActive') : t('portfolio.documents.form.dropzoneText')}
              </p>
            </div>
          </div>
        </div>

        {/* Files selected for upload */}
        {formData.filesWithNames && formData.filesWithNames.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Icon icon="mdi:file-plus-box" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.filesSelected')} ({formData.filesWithNames.length})
            </h4>
            <div className="bg-teal-500/5 rounded-xl border border-teal-500/20 overflow-hidden max-h-48 overflow-y-auto">
              {formData.filesWithNames.map((fileWithName, index) => (
                <div key={`${fileWithName.file.name}-${index}`} className="flex items-center gap-3 p-3 border-b border-teal-500/10 last:border-b-0 hover:bg-teal-500/10 transition-colors">
                  {(() => {
                    const { icon, color } = getFileIcon(fileWithName.file.name);
                    return <Icon icon={icon} className={`w-5 h-5 ${color} flex-shrink-0`} />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{fileWithName.file.name}</p>
                    <p className="text-xs text-teal-500">{(fileWithName.file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <input
                    type="text"
                    value={fileWithName.displayName}
                    onChange={(e) => {
                      const updatedFiles = [...(formData.filesWithNames || [])];
                      updatedFiles[index] = { ...fileWithName, displayName: e.target.value };
                      onFormChange({ ...formData, filesWithNames: updatedFiles });
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-teal-300 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
                    placeholder={t('portfolio.documents.form.fileNamePlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => openDeleteSelectedFileModal({ displayName: fileWithName.displayName, file: fileWithName.file, index })}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Icon icon="mdi:delete" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Existing files (for editing) */}
        {isEditing && formData.existingFiles && formData.existingFiles.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Icon icon="mdi:file-multiple" className="w-4 h-4 text-blue-400" />
              {t('portfolio.documents.form.currentFiles')} ({formData.existingFiles.length})
            </h4>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden max-h-48 overflow-y-auto">
              {formData.existingFiles.map((fileData, index) => (
                <div key={`existing-${fileData.id}-${index}`} className="flex items-center gap-3 p-3 border-b border-slate-700/30 last:border-b-0 hover:bg-slate-700/20 transition-colors">
                  {(() => {
                    const { icon, color } = getFileIcon(fileData.original_name);
                    return <Icon icon={icon} className={`w-5 h-5 ${color} flex-shrink-0`} />;
                  })()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300 truncate">{fileData.original_name}</p>
                    <p className="text-xs text-slate-500">{formatDateObj(new Date(fileData.created_at), getDateFormat())}</p>
                  </div>
                  <input
                    type="text"
                    value={fileData.file_name}
                    onChange={(e) => {
                      const updatedFiles = [...(formData.existingFiles || [])];
                      const updatedFile = { ...fileData, file_name: e.target.value };
                      updatedFiles[index] = updatedFile;
                      const filesUpdated = [...(formData.filesUpdated || [])];
                      const existingIndex = filesUpdated.findIndex(f => f.id === fileData.id);
                      if (existingIndex >= 0) {
                        filesUpdated[existingIndex] = updatedFile;
                      } else {
                        filesUpdated.push(updatedFile);
                      }
                      onFormChange({
                        ...formData,
                        existingFiles: updatedFiles,
                        filesUpdated: filesUpdated
                      });
                    }}
                    className="flex-1 px-3 py-2 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-blue-300 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all"
                    placeholder={t('portfolio.documents.form.fileNamePlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const fileUrl = `/api/${fileData.file_path}`;
                      window.open(fileUrl, '_blank');
                    }}
                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <Icon icon="mdi:eye" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteDocumentFileModal(fileData)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Icon icon="mdi:delete" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
              <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400" />
              {t('portfolio.documents.form.veterinarianLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.veterinarian}
                onChange={(e) => handleInputChange('veterinarian', e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
                placeholder={t('portfolio.documents.form.veterinarianPlaceholder')}
              />
              <Icon icon="mdi:hospital-building" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:text-box" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.descriptionLabel')}
          </label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all resize-none"
              placeholder={t('portfolio.documents.form.descriptionPlaceholder')}
            />
            <Icon icon="mdi:text" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:note-text" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.notesLabel')}
          </label>
          <div className="relative">
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all resize-none"
              placeholder={t('portfolio.documents.form.notesPlaceholder')}
            />
            <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-700/50">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                <span>{isEditing ? t('portfolio.documents.form.updatingText') : t('portfolio.documents.form.savingText')}</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:content-save" className="w-5 h-5" />
                <span>{isEditing ? t('portfolio.documents.form.updateButton') : t('portfolio.documents.form.saveButton')}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
            <span>{t('portfolio.documents.form.cancelButton')}</span>
          </button>
        </div>
      </form>

      {activeModal && modalProps && (
        <ConfirmationModal
          isOpen={activeModal.isOpen}
          onClose={closeModal}
          onConfirm={modalProps.onConfirm}
          title={modalProps.title}
          message={modalProps.message}
          confirmText={modalProps.confirmText}
          confirmColor={modalProps.confirmColor}
          icon={modalProps.icon}
        />
      )}

      {showLinkModal && linkableItems && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLinkModal(false)}>
          <div className="bg-slate-800 border border-slate-700/50 rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Icon icon="mdi:link-variant" className="w-5 h-5 text-teal-400" />
                {t('portfolio.documents.form.linkLabel')}
              </h3>
              <button type="button" onClick={() => setShowLinkModal(false)} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <Icon icon="mdi:close" className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-3 space-y-2 styled-scrollbar">
              {/* None option */}
              <button
                type="button"
                onClick={() => {
                  onFormChange({ ...formData, linked_type: '', linked_id: null });
                  setShowLinkModal(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  !formData.linked_type || !formData.linked_id
                    ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300'
                    : 'bg-slate-700/30 border border-transparent hover:bg-slate-700/50 text-slate-300'
                }`}
              >
                <Icon icon="mdi:link-variant-off" className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span className="font-medium">{t('portfolio.documents.form.linkNone')}</span>
              </button>

              {/* Vaccines */}
              {linkableItems.vaccines.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2 flex items-center gap-1.5">
                    <Icon icon="mdi:needle" className="w-3.5 h-3.5" />
                    {t('portfolio.documents.form.linkVaccines')}
                  </p>
                  {linkableItems.vaccines.map((v) => (
                    <button
                      key={`vaccine-${v.id}`}
                      type="button"
                      onClick={() => {
                        onFormChange({ ...formData, linked_type: 'vaccine', linked_id: v.id });
                        setShowLinkModal(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left ${
                        formData.linked_type === 'vaccine' && formData.linked_id === v.id
                          ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300'
                          : 'bg-slate-700/30 border border-transparent hover:bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      <Icon icon="mdi:needle" className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{v.vaccine_name}</p>
                        <p className="text-xs text-slate-500">{formatDateObj(new Date(v.vaccine_date + 'T00:00:00'), getDateFormat())}</p>
                      </div>
                      {formData.linked_type === 'vaccine' && formData.linked_id === v.id && (
                        <Icon icon="mdi:check-circle" className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Medications */}
              {linkableItems.medications.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2 flex items-center gap-1.5">
                    <Icon icon="mdi:pill" className="w-3.5 h-3.5" />
                    {t('portfolio.documents.form.linkMedications')}
                  </p>
                  {linkableItems.medications.map((m) => (
                    <button
                      key={`medication-${m.id}`}
                      type="button"
                      onClick={() => {
                        onFormChange({ ...formData, linked_type: 'medication', linked_id: m.id });
                        setShowLinkModal(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left ${
                        formData.linked_type === 'medication' && formData.linked_id === m.id
                          ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300'
                          : 'bg-slate-700/30 border border-transparent hover:bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      <Icon icon="mdi:pill" className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{m.medication_name}</p>
                        <p className="text-xs text-slate-500">{formatDateObj(new Date(m.start_date + 'T00:00:00'), getDateFormat())}</p>
                      </div>
                      {formData.linked_type === 'medication' && formData.linked_id === m.id && (
                        <Icon icon="mdi:check-circle" className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Dewormings */}
              {linkableItems.dewormings.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2 flex items-center gap-1.5">
                    <Icon icon="mdi:bug-outline" className="w-3.5 h-3.5" />
                    {t('portfolio.documents.form.linkDewormings')}
                  </p>
                  {linkableItems.dewormings.map((d) => (
                    <button
                      key={`deworming-${d.id}`}
                      type="button"
                      onClick={() => {
                        onFormChange({ ...formData, linked_type: 'deworming', linked_id: d.id });
                        setShowLinkModal(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left ${
                        formData.linked_type === 'deworming' && formData.linked_id === d.id
                          ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300'
                          : 'bg-slate-700/30 border border-transparent hover:bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      <Icon icon="mdi:bug-outline" className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{d.product_name}</p>
                        <p className="text-xs text-slate-500">{formatDateObj(new Date(d.treatment_date + 'T00:00:00'), getDateFormat())}</p>
                      </div>
                      {formData.linked_type === 'deworming' && formData.linked_id === d.id && (
                        <Icon icon="mdi:check-circle" className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Reviews */}
              {linkableItems.medicalReviews.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-2 flex items-center gap-1.5">
                    <Icon icon="mdi:stethoscope" className="w-3.5 h-3.5" />
                    {t('portfolio.documents.form.linkReviews')}
                  </p>
                  {linkableItems.medicalReviews.map((r) => (
                    <button
                      key={`review-${r.id}`}
                      type="button"
                      onClick={() => {
                        onFormChange({ ...formData, linked_type: 'review', linked_id: r.id });
                        setShowLinkModal(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left ${
                        formData.linked_type === 'review' && formData.linked_id === r.id
                          ? 'bg-teal-500/15 border border-teal-500/30 text-teal-300'
                          : 'bg-slate-700/30 border border-transparent hover:bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      <Icon icon="mdi:stethoscope" className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{r.reason || r.visit_type}</p>
                        <p className="text-xs text-slate-500">{formatDateObj(new Date(r.visit_date + 'T00:00:00'), getDateFormat())}</p>
                      </div>
                      {formData.linked_type === 'review' && formData.linked_id === r.id && (
                        <Icon icon="mdi:check-circle" className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
