import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';

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
  const { getWeightUnitLabel } = useSettings();

  const handleInputChange = (field: keyof WeightFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:weight-kilogram" className="w-4 h-4 text-cyan-400" />
            {t('home.weight.weightKg')} ({getWeightUnitLabel()})
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={formData.weight_kg}
              onChange={(e) => handleInputChange('weight_kg', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
              placeholder={t('portfolio.weight.weightPlaceholder')}
            />
            <Icon icon="mdi:scale-balance" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm font-medium">{getWeightUnitLabel()}</span>
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-cyan-400" />
            {t('home.weight.date')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.measurement_date}
              onChange={(e) => handleInputChange('measurement_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-cyan-400" />
          {t('home.weight.notes')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 pl-11 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all resize-none"
            placeholder={t('home.weight.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-5 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('home.weight.updating') : t('home.weight.saving')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5" />
              <span>{isEditing ? t('home.weight.update') : t('home.weight.save')}</span>
            </>
          )}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-all flex items-center gap-2"
        >
          <Icon icon="mdi:close" className="w-5 h-5" />
          <span>{t('home.weight.cancel')}</span>
        </button>
      </div>
    </div>
  );
}
