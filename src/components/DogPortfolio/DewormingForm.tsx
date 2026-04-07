import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import DocumentLinkSelector from './DocumentLinkSelector';

interface DewormingFormData {
  product_name: string;
  treatment_date: string;
  next_treatment_date: string;
  weight_at_treatment: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'pending';
}

interface DewormingFormProps {
  formData: DewormingFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: DewormingFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  documents?: any[];
  linkedDocumentIds?: number[];
  onLinkedDocsChange?: (ids: number[]) => void;
}

export default function DewormingForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel,
  documents = [],
  linkedDocumentIds = [],
  onLinkedDocsChange
}: DewormingFormProps) {
  const { t } = useTranslation();
  const { getWeightUnitLabel } = useSettings();

  const handleInputChange = (field: keyof DewormingFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:pill" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.productLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => handleInputChange('product_name', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
              placeholder={t('portfolio.dewormings.form.productPlaceholder')}
            />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.treatmentDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.treatment_date}
              onChange={(e) => handleInputChange('treatment_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:scale" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.weightLabel')} ({getWeightUnitLabel()})
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={formData.weight_at_treatment}
              onChange={(e) => handleInputChange('weight_at_treatment', e.target.value)}
              placeholder={t('portfolio.dewormings.form.weightPlaceholder')}
              className="w-full px-4 py-3 pl-11 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
            />
            <Icon icon="mdi:weight-kilogram" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">{getWeightUnitLabel()}</span>
          </div>
          <div className="flex items-center gap-2 mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Icon icon="mdi:lightbulb" className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-300">
              {t('portfolio.dewormings.form.weightInfo')}
            </p>
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.nextDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.next_treatment_date}
              onChange={(e) => handleInputChange('next_treatment_date', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-arrow-right" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all"
              placeholder={t('portfolio.dewormings.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:hospital-building" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:checkbox-marked-circle" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.statusLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all appearance-none"
            >
              <option value="pending">{t('portfolio.dewormings.form.statusPending')}</option>
              <option value="completed">{t('portfolio.dewormings.form.statusCompleted')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Icon icon="mdi:clock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-orange-400" />
          {t('portfolio.dewormings.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 transition-all resize-none"
            placeholder={t('portfolio.dewormings.form.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {onLinkedDocsChange && documents.length > 0 && (
        <DocumentLinkSelector
          documents={documents}
          linkedDocumentIds={linkedDocumentIds}
          onLinkedDocsChange={onLinkedDocsChange}
        />
      )}

      <div className="flex gap-3 pt-4 border-t border-slate-700/50">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.dewormings.form.updatingText') : t('portfolio.dewormings.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5" />
              <span>{isEditing ? t('portfolio.dewormings.form.updateButton') : t('portfolio.dewormings.form.saveButton')}</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
          <span>{t('portfolio.dewormings.form.cancelButton')}</span>
        </button>
      </div>
    </div>
  );
}
