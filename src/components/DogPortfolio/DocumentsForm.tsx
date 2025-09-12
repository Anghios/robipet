import { Icon } from '@iconify/react';
import { useConfirmationModals } from '../../hooks/useConfirmationModals';
import ConfirmationModal from '../Visuals/ConfirmationModal';
import { getModalProps } from '../../utils/modalConfigs';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

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
}

interface DocumentsFormProps {
  formData: DocumentsFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: DocumentsFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

// Helper function to get file icon based on file extension
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
  onCancel
}: DocumentsFormProps) {
  const { t } = useTranslation();
  
  // Hooks para el sistema de modales
  const {
    activeModal,
    closeModal,
    openDeleteDocumentFileModal,
    openDeleteSelectedFileModal
  } = useConfirmationModals();

  const handleInputChange = (field: keyof DocumentsFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  // Funciones de confirmación para los modales
  const confirmDeleteDocumentFile = () => {
    if (activeModal && activeModal.item) {
      const fileData = activeModal.item;
      
      // Encontrar el índice del archivo en existingFiles
      const index = formData.existingFiles?.findIndex(f => f.id === fileData.id) ?? -1;
      
      if (index >= 0) {
        // Marcar archivo para eliminar y removerlo de la lista visual
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

  // Obtener las propiedades del modal
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
  }, t);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mb-8 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-teal-500/10 transition-all duration-500">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-teal-500/20 to-cyan-600/20 rounded-xl border border-teal-500/30">
          <Icon icon="mdi:file-document-multiple" className="w-8 h-8 text-teal-400" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {isEditing ? t('portfolio.documents.form.editTitle') : t('portfolio.documents.form.newTitle')}
          </h4>
          <p className="text-slate-400 text-sm">
            {isEditing ? t('portfolio.documents.form.editSubtitle') : t('portfolio.documents.form.newSubtitle')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:file-document" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.documentNameLabel')} {(formData.filesWithNames && formData.filesWithNames.length > 1) ? '*' : ''}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.document_name}
              onChange={(e) => handleInputChange('document_name', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={
                formData.filesWithNames && formData.filesWithNames.length > 1 
                  ? t('portfolio.documents.form.documentNamePlaceholder')
                  : t('portfolio.documents.form.singleFileDocumentPlaceholder')
              }
            />
            <Icon icon="mdi:tag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          {formData.filesWithNames && formData.filesWithNames.length > 1 && (
            <p className="mt-2 text-xs text-slate-400">
              <Icon icon="mdi:information" className="inline w-3 h-3 mr-1" />
              {t('portfolio.documents.form.multipleFilesInfo', { count: formData.filesWithNames.length })}
            </p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:format-list-bulleted-type" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.documentTypeLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.document_type}
              onChange={(e) => handleInputChange('document_type', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 appearance-none"
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
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="tabler:upload" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.uploadDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.upload_date}
              onChange={(e) => handleInputChange('upload_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>


        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:file-upload" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.fileLabel')}
          </label>
          <div className="relative">
            <input
              type="file"
              multiple
              onChange={(e) => {
                const fileList = e.target.files;
                if (fileList && fileList.length > 0) {
                  const newFiles = Array.from(fileList);
                  const currentFilesWithNames = formData.filesWithNames || [];
                  
                  // Convertir archivos nuevos a FileWithName con nombres por defecto
                  const newFilesWithNames = newFiles.map(file => ({
                    file,
                    displayName: file.name.replace(/\.[^/.]+$/, "") // Quitar extensión para edición
                  }));
                  
                  const allFilesWithNames = [...currentFilesWithNames, ...newFilesWithNames];
                  onFormChange({ ...formData, filesWithNames: allFilesWithNames });
                } else {
                  onFormChange({ ...formData, filesWithNames: [] });
                }
              }}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-500/20 file:text-teal-400 hover:file:bg-teal-500/30 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:paperclip" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          

        </div>
      </div>

      {/* Archivos seleccionados para subir - Ocupa todo el ancho */}
      {formData.filesWithNames && formData.filesWithNames.length > 0 && (
        <div className="mb-8">
          <h4 className="text-base font-medium text-slate-300 mb-4 flex items-center gap-2">
            <Icon icon="mdi:file-plus-box" className="w-5 h-5 text-teal-400" />
            {t('portfolio.documents.form.filesSelected')} ({formData.filesWithNames.length})
          </h4>
          
          {/* Lista de archivos nuevos en formato tabla */}
          <div className="bg-teal-500/5 rounded-xl border border-teal-500/20 overflow-hidden">
            {/* Cabecera de la tabla */}
            <div className="flex items-center gap-4 p-4 bg-teal-500/10 border-b border-teal-500/20 text-sm font-medium text-slate-400">
              <div className="flex-shrink-0 w-6"></div>
              <div className="flex-1 min-w-0 max-w-sm">{t('portfolio.documents.form.filesSelected')}</div>
              <div className="flex-1 min-w-0">{t('portfolio.documents.form.fileNameLabel')}</div>
              <div className="flex-shrink-0 w-24 text-center">{t('portfolio.documents.form.actionsLabel')}</div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {formData.filesWithNames.map((fileWithName, index) => (
                <div key={`${fileWithName.file.name}-${index}`} className="flex items-center gap-4 p-4 border-b border-teal-500/10 last:border-b-0 hover:bg-teal-500/10 transition-colors group">
                  
                  {/* Icono */}
                  <div className="flex-shrink-0">
                    {(() => {
                      const { icon, color } = getFileIcon(fileWithName.file.name);
                      return <Icon icon={icon} className={`w-6 h-6 ${color}`} />;
                    })()}
                  </div>
                  
                  {/* Información del archivo */}
                  <div className="flex-1 min-w-0 max-w-sm">
                    <p className="text-sm text-slate-300 truncate font-medium" title={fileWithName.file.name}>
                      {fileWithName.file.name}
                    </p>
                    <p className="text-xs text-teal-500 mt-1">
                      {(fileWithName.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  
                  {/* Campo de edición del nombre */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={fileWithName.displayName}
                      onChange={(e) => {
                        const updatedFiles = [...(formData.filesWithNames || [])];
                        updatedFiles[index] = { ...fileWithName, displayName: e.target.value };
                        onFormChange({ ...formData, filesWithNames: updatedFiles });
                      }}
                      className="w-full px-4 py-3 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-teal-300 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all placeholder-slate-500"
                      placeholder={formData.filesWithNames && formData.filesWithNames.length === 1 
                        ? t('portfolio.documents.form.documentNameLabel') + '...' 
                        : t('portfolio.documents.form.fileNamePlaceholder')}
                    />
                  </div>
                  
                  {/* Acción de eliminar */}
                  <div className="flex items-center justify-center gap-2 flex-shrink-0 w-24">
                    <button
                      type="button"
                      onClick={() => openDeleteSelectedFileModal({ displayName: fileWithName.displayName, file: fileWithName.file, index })}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                      title={t('portfolio.documents.form.deleteFileTitle')}
                    >
                      <Icon icon="mdi:delete" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Archivos existentes (para edición) - Ocupa todo el ancho */}
      {isEditing && formData.existingFiles && formData.existingFiles.length > 0 && (
        <div className="mb-8">
          <h4 className="text-base font-medium text-slate-300 mb-4 flex items-center gap-2">
            <Icon icon="mdi:file-multiple" className="w-5 h-5 text-blue-400" />
            {t('portfolio.documents.form.currentFiles')} ({formData.existingFiles.length})
          </h4>
          
          {/* Lista de archivos en formato tabla */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Cabecera de la tabla */}
            <div className="flex items-center gap-4 p-4 bg-slate-700/30 border-b border-slate-700/30 text-sm font-medium text-slate-400">
              <div className="flex-shrink-0 w-6"></div>
              <div className="flex-1 min-w-0 max-w-sm">{t('portfolio.documents.form.originalFileLabel')}</div>
              <div className="flex-1 min-w-0">{t('portfolio.documents.form.fileNameLabel')}</div>
              <div className="flex-shrink-0 w-24 text-center">{t('portfolio.documents.form.actionsLabel')}</div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {formData.existingFiles.map((fileData, index) => (
                <div key={`existing-${fileData.id}-${index}`} className="flex items-center gap-4 p-4 border-b border-slate-700/30 last:border-b-0 hover:bg-slate-700/20 transition-colors group">
                  
                  {/* Icono */}
                  <div className="flex-shrink-0">
                    {(() => {
                      const { icon, color } = getFileIcon(fileData.original_name);
                      return <Icon icon={icon} className={`w-6 h-6 ${color}`} />;
                    })()}
                  </div>
                  
                  {/* Nombre original */}
                  <div className="flex-1 min-w-0 max-w-sm">
                    <p className="text-sm text-slate-300 truncate font-medium" title={fileData.original_name}>
                      {fileData.original_name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(fileData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {/* Campo de edición del nombre */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={fileData.file_name}
                      onChange={(e) => {
                        const updatedFiles = [...(formData.existingFiles || [])];
                        const updatedFile = { ...fileData, file_name: e.target.value };
                        updatedFiles[index] = updatedFile;
                        
                        // Trackear archivos actualizados para enviar al backend
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
                      className="w-full px-4 py-3 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-blue-300 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all placeholder-slate-500"
                      placeholder={t('portfolio.documents.form.fileNamePlaceholder')}
                    />
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center justify-center gap-2 flex-shrink-0 w-24">
                    <button
                      type="button"
                      onClick={() => {
                        // Abrir archivo para ver/descargar
                        const fileUrl = `/api/${fileData.file_path}`;
                        window.open(fileUrl, '_blank');
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                      title={t('portfolio.documents.form.viewFileTitle')}
                    >
                      <Icon icon="mdi:eye" className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteDocumentFileModal(fileData)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                      title={t('portfolio.documents.form.deleteFileTitle')}
                    >
                      <Icon icon="mdi:delete" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.documents.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:hospital-building" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:text-box" className="w-4 h-4 text-teal-400" />
            {t('portfolio.documents.form.descriptionLabel')}
          </label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
              placeholder={t('portfolio.documents.form.descriptionPlaceholder')}
            />
            <Icon icon="mdi:text" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="mb-8 group">
        <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-teal-400" />
          {t('portfolio.documents.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
            placeholder={t('portfolio.documents.form.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex gap-4 pt-6 border-t border-slate-700/50">
        <button 
          type="submit"
          disabled={isSaving}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-500/90 to-cyan-600/90 hover:from-teal-500 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/save"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.documents.form.updatingText') : t('portfolio.documents.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
              <span className="group-hover/save:tracking-wide transition-all">{isEditing ? t('portfolio.documents.form.updateButton') : t('portfolio.documents.form.saveButton')}</span>
            </>
          )}
        </button>
        <button 
          type="button"
          onClick={onCancel}
          className="px-6 py-4 bg-gradient-to-r from-slate-600/90 to-slate-700/90 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/cancel"
        >
          <Icon icon="mdi:close" className="w-5 h-5 group-hover/cancel:scale-110 transition-transform" />
          <span className="group-hover/cancel:tracking-wide transition-all">{t('portfolio.documents.form.cancelButton')}</span>
        </button>
      </div>
      </form>

      {/* Modal de confirmación */}
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
    </>
  );
}