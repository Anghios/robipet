import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface VaccineFormData {
  vaccine_name: string;
  vaccine_date: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'pending';
}

interface VaccineFormProps {
  formData: VaccineFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: VaccineFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function VaccineForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel
}: VaccineFormProps) {
  const { t } = useTranslation();
  const handleInputChange = (field: keyof VaccineFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:shield-plus" className="w-4 h-4 text-emerald-400" />
            {t('portfolio.vaccines.vaccineName')} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.vaccine_name}
              onChange={(e) => handleInputChange('vaccine_name', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder="e.g.: Rabies, DHPP, etc."
            />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-emerald-400" />
            {t('portfolio.vaccines.veterinarian')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder="Veterinarian's name"
            />
            <Icon icon="mdi:account-tie" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-emerald-400" />
            {t('portfolio.vaccines.vaccineDate')} *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.vaccine_date}
              onChange={(e) => handleInputChange('vaccine_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:checkbox-marked-circle" className="w-4 h-4 text-emerald-400" />
            {t('portfolio.vaccines.status')}
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 appearance-none"
            >
              <option value="pending">{t('portfolio.common.pending')}</option>
              <option value="completed">{t('portfolio.common.completed')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Icon icon="mdi:clock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-emerald-400" />
          {t('portfolio.vaccines.notes')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all resize-none"
            placeholder="Observations about the vaccine, reactions, booster date..."
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.common.updating') : t('portfolio.common.saving')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5" />
              <span>{isEditing ? t('portfolio.common.update') : t('portfolio.common.save')}</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
          <span>{t('portfolio.common.cancel')}</span>
        </button>
      </div>
    </div>
  );
}