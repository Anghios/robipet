import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import DocumentLinkSelector from './DocumentLinkSelector';

interface MedicalReviewFormData {
  visit_date: string;
  visit_type: 'routine' | 'illness' | 'emergency' | 'follow_up';
  status: 'pending' | 'completed';
  veterinarian: string;
  clinic_name: string;
  reason: string;
  cost: string;
  diagnosis: string;
  treatment: string;
  next_visit: string;
  notes: string;
}

interface MedicalReviewFormProps {
  formData: MedicalReviewFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: MedicalReviewFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  documents?: any[];
  linkedDocumentIds?: number[];
  onLinkedDocsChange?: (ids: number[]) => void;
}

export default function MedicalReviewForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel,
  documents = [],
  linkedDocumentIds = [],
  onLinkedDocsChange
}: MedicalReviewFormProps) {
  const { t } = useTranslation();
  const { getCurrencyIcon } = useSettings();

  const handleInputChange = (field: keyof MedicalReviewFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Status selector */}
      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:flag" className="w-4 h-4 text-purple-400" />
          {t('portfolio.common.status')}
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('status', 'pending')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              formData.status === 'pending'
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:border-slate-500/70'
            }`}
          >
            <Icon icon="mdi:clock-outline" className="w-5 h-5" />
            {t('portfolio.common.pending')}
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('status', 'completed')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              formData.status === 'completed'
                ? 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:border-slate-500/70'
            }`}
          >
            <Icon icon="mdi:check-circle" className="w-5 h-5" />
            {t('portfolio.common.completed')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.visitDateLabel')} {formData.status === 'completed' && '*'}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.visit_date}
              onChange={(e) => handleInputChange('visit_date', e.target.value)}
              required={formData.status === 'completed'}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          {formData.status === 'pending' && (
            <p className="text-xs text-slate-500 mt-1">{t('portfolio.medicalReviews.form.dateOptionalHint')}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:clipboard-pulse" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.visitTypeLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.visit_type}
              onChange={(e) => handleInputChange('visit_type', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all appearance-none"
            >
              <option value="routine">{t('portfolio.medicalReviews.form.visitTypeRoutine')}</option>
              <option value="illness">{t('portfolio.medicalReviews.form.visitTypeIllness')}</option>
              <option value="emergency">{t('portfolio.medicalReviews.form.visitTypeEmergency')}</option>
              <option value="follow_up">{t('portfolio.medicalReviews.form.visitTypeFollowUp')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medicalReviews.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:account-tie" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:hospital-building" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.clinicLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.clinic_name}
              onChange={(e) => handleInputChange('clinic_name', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medicalReviews.form.clinicPlaceholder')}
            />
            <Icon icon="mdi:domain" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:clipboard-text" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.reasonLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medicalReviews.form.reasonPlaceholder')}
            />
            <Icon icon="mdi:help-circle" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon={getCurrencyIcon()} className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.costLabel')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medicalReviews.form.costPlaceholder')}
            />
            <Icon icon="mdi:cash" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.nextVisitLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.next_visit}
              onChange={(e) => handleInputChange('next_visit', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-arrow-right" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:clipboard-pulse" className="w-4 h-4 text-purple-400" />
          {t('portfolio.medicalReviews.form.diagnosisLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.diagnosis}
            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all resize-none"
            placeholder={t('portfolio.medicalReviews.form.diagnosisPlaceholder')}
          />
          <Icon icon="mdi:medical-bag" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:pill" className="w-4 h-4 text-purple-400" />
          {t('portfolio.medicalReviews.form.treatmentLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.treatment}
            onChange={(e) => handleInputChange('treatment', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all resize-none"
            placeholder={t('portfolio.medicalReviews.form.treatmentPlaceholder')}
          />
          <Icon icon="mdi:bandage" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-purple-400" />
          {t('portfolio.medicalReviews.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all resize-none"
            placeholder={t('portfolio.medicalReviews.form.notesPlaceholder')}
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
          className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.medicalReviews.form.updatingText') : t('portfolio.medicalReviews.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5" />
              <span>{isEditing ? t('portfolio.medicalReviews.form.updateButton') : t('portfolio.medicalReviews.form.saveButton')}</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
          <span>{t('portfolio.medicalReviews.form.cancelButton')}</span>
        </button>
      </div>
    </div>
  );
}
