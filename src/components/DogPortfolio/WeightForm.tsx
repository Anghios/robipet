import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface WeightFormData {
  weight_kg: string;
  measurement_date: string;
  notes: string;
}

interface WeightFormProps {
  formData: WeightFormData;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (data: WeightFormData) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function WeightForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel
}: WeightFormProps) {
  const { t } = useTranslation();

  const handleInputChange = (field: keyof WeightFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl border border-blue-500/30">
          <Icon icon="mdi:scale" className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {isEditing ? t('home.weight.editRecord') : t('home.weight.newRecord')}
          </h4>
          <p className="text-slate-400 text-sm">
            {isEditing ? t('portfolio.weight.editFormSubtitle') : t('portfolio.weight.newFormSubtitle')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:weight-kilogram" className="w-4 h-4 text-blue-400" />
            {t('home.weight.weightKg')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => handleInputChange('weight_kg', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.weight.weightPlaceholder')}
            />
            <Icon icon="mdi:scale-balance" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-blue-400" />
            {t('home.weight.date')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.measurement_date}
              onChange={(e) => handleInputChange('measurement_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="mb-8 group">
        <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-blue-400" />
          {t('home.weight.notes')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
            placeholder={t('home.weight.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex gap-4 pt-6 border-t border-slate-700/50">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/save"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('home.weight.updating') : t('home.weight.saving')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
              <span className="group-hover/save:tracking-wide transition-all">{isEditing ? t('home.weight.update') : t('home.weight.save')}</span>
            </>
          )}
        </button>
        <button 
          onClick={onCancel}
          className="px-6 py-4 bg-gradient-to-r from-slate-600/90 to-slate-700/90 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/cancel"
        >
          <Icon icon="mdi:close" className="w-5 h-5 group-hover/cancel:scale-110 transition-transform" />
          <span className="group-hover/cancel:tracking-wide transition-all">{t('home.weight.cancel')}</span>
        </button>
      </div>
    </div>
  );
}