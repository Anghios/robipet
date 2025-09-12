import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface MedicationFormData {
  medication_name: string;
  dosage: string;
  frequency_hours: string;
  start_date: string;
  end_date: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'pending';
}

interface MedicationFormProps {
  formData: MedicationFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: MedicationFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function MedicationForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel
}: MedicationFormProps) {
  const { t } = useTranslation();
  
  const handleInputChange = (field: keyof MedicationFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl border border-purple-500/30">
          <Icon icon="mdi:pill" className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {isEditing ? t('portfolio.medications.form.editTitle') : t('portfolio.medications.form.newTitle')}
          </h4>
          <p className="text-slate-400 text-sm">
            {isEditing ? t('portfolio.medications.form.editSubtitle') : t('portfolio.medications.form.newSubtitle')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:pill" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.medicationNameLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.medication_name}
              onChange={(e) => handleInputChange('medication_name', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medications.form.medicationNamePlaceholder')}
            />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:eyedropper" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.dosageLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medications.form.dosagePlaceholder')}
            />
            <Icon icon="mdi:scale-balance" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:clock" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.frequencyLabel')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.frequency_hours}
              onChange={(e) => handleInputChange('frequency_hours', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medications.form.frequencyPlaceholder')}
            />
            <Icon icon="mdi:timer" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.medications.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:account-tie" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar-start" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.startDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar-end" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.endDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-check" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:checkbox-marked-circle" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.statusLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 appearance-none"
            >
              <option value="pending">{t('portfolio.medications.form.statusPending')}</option>
              <option value="completed">{t('portfolio.medications.form.statusCompleted')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Icon icon="mdi:clock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="mb-8 group">
        <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-purple-400" />
          {t('portfolio.medications.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
            placeholder={t('portfolio.medications.form.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex gap-4 pt-6 border-t border-slate-700/50">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500/90 to-pink-600/90 hover:from-purple-500 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/save"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.medications.form.updatingText') : t('portfolio.medications.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
              <span className="group-hover/save:tracking-wide transition-all">{isEditing ? t('portfolio.medications.form.updateButton') : t('portfolio.medications.form.saveButton')}</span>
            </>
          )}
        </button>
        <button 
          onClick={onCancel}
          className="px-6 py-4 bg-gradient-to-r from-slate-600/90 to-slate-700/90 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/cancel"
        >
          <Icon icon="mdi:close" className="w-5 h-5 group-hover/cancel:scale-110 transition-transform" />
          <span className="group-hover/cancel:tracking-wide transition-all">{t('portfolio.medications.form.cancelButton')}</span>
        </button>
      </div>
    </div>
  );
}