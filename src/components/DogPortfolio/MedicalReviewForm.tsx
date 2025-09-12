import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface MedicalReviewFormData {
  visit_date: string;
  visit_type: 'routine' | 'illness' | 'emergency' | 'follow_up';
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
}

export default function MedicalReviewForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel
}: MedicalReviewFormProps) {
  const { t } = useTranslation();
  
  const handleInputChange = (field: keyof MedicalReviewFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl border border-purple-500/30">
          <Icon icon="mdi:stethoscope" className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {isEditing ? t('portfolio.medicalReviews.form.editTitle') : t('portfolio.medicalReviews.form.newTitle')}
          </h4>
          <p className="text-slate-400 text-sm">
            {isEditing ? t('portfolio.medicalReviews.form.editSubtitle') : t('portfolio.medicalReviews.form.newSubtitle')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.visitDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.visit_date}
              onChange={(e) => handleInputChange('visit_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:clipboard-pulse" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.visitTypeLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.visit_type}
              onChange={(e) => handleInputChange('visit_type', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 appearance-none"
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
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medicalReviews.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:account-tie" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:hospital-building" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.clinicLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.clinic_name}
              onChange={(e) => handleInputChange('clinic_name', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medicalReviews.form.clinicPlaceholder')}
            />
            <Icon icon="mdi:domain" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:clipboard-text" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.reasonLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medicalReviews.form.reasonPlaceholder')}
            />
            <Icon icon="mdi:help-circle" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:currency-eur" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.costLabel')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medicalReviews.form.costPlaceholder')}
            />
            <Icon icon="mdi:cash" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:clipboard-pulse" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.diagnosisLabel')}
          </label>
          <div className="relative">
            <textarea
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
              placeholder={t('portfolio.medicalReviews.form.diagnosisPlaceholder')}
            />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:pill" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.treatmentLabel')}
          </label>
          <div className="relative">
            <textarea
              value={formData.treatment}
              onChange={(e) => handleInputChange('treatment', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
              placeholder={t('portfolio.medicalReviews.form.treatmentPlaceholder')}
            />
            <Icon icon="mdi:bandage" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medicalReviews.form.nextVisitLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.next_visit}
              onChange={(e) => handleInputChange('next_visit', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-arrow-right" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="mb-8 group">
        <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-purple-400" />
          {t('portfolio.medicalReviews.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
            placeholder={t('portfolio.medicalReviews.form.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex gap-4 pt-6 border-t border-slate-700/50">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-500 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/save"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.medicalReviews.form.updatingText') : t('portfolio.medicalReviews.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
              <span className="group-hover/save:tracking-wide transition-all">{isEditing ? t('portfolio.medicalReviews.form.updateButton') : t('portfolio.medicalReviews.form.saveButton')}</span>
            </>
          )}
        </button>
        <button 
          onClick={onCancel}
          className="px-6 py-4 bg-gradient-to-r from-slate-600/90 to-slate-700/90 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/cancel"
        >
          <Icon icon="mdi:close" className="w-5 h-5 group-hover/cancel:scale-110 transition-transform" />
          <span className="group-hover/cancel:tracking-wide transition-all">{t('portfolio.medicalReviews.form.cancelButton')}</span>
        </button>
      </div>
    </div>
  );
}