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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:pill" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.medicationNameLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.medication_name}
              onChange={(e) => handleInputChange('medication_name', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medications.form.medicationNamePlaceholder')}
            />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:eyedropper" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.dosageLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medications.form.dosagePlaceholder')}
            />
            <Icon icon="mdi:scale-balance" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:clock" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.frequencyLabel')}
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.frequency_hours}
              onChange={(e) => handleInputChange('frequency_hours', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medications.form.frequencyPlaceholder')}
            />
            <Icon icon="mdi:timer" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
              placeholder={t('portfolio.medications.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:account-tie" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar-start" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.startDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar-end" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.endDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-check" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group md:col-span-2">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:checkbox-marked-circle" className="w-4 h-4 text-purple-400" />
            {t('portfolio.medications.form.statusLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all appearance-none"
            >
              <option value="pending">{t('portfolio.medications.form.statusPending')}</option>
              <option value="completed">{t('portfolio.medications.form.statusCompleted')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Icon icon="mdi:clock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-purple-400" />
          {t('portfolio.medications.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all resize-none"
            placeholder={t('portfolio.medications.form.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.medications.form.updatingText') : t('portfolio.medications.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5" />
              <span>{isEditing ? t('portfolio.medications.form.updateButton') : t('portfolio.medications.form.saveButton')}</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
          <span>{t('portfolio.medications.form.cancelButton')}</span>
        </button>
      </div>
    </div>
  );
}
