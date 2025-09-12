import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

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
}

export default function DewormingForm({
  formData,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancel
}: DewormingFormProps) {
  const { t } = useTranslation();
  
  const handleInputChange = (field: keyof DewormingFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-xl border border-orange-500/30">
          <Icon icon="mdi:bug" className="w-8 h-8 text-orange-400" />
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white mb-1">
            {isEditing ? t('portfolio.dewormings.form.editTitle') : t('portfolio.dewormings.form.newTitle')}
          </h4>
          <p className="text-slate-400 text-sm">
            {isEditing ? t('portfolio.dewormings.form.editSubtitle') : t('portfolio.dewormings.form.newSubtitle')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:pill" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.productLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) => handleInputChange('product_name', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.dewormings.form.productPlaceholder')}
            />
            <Icon icon="mdi:medical-bag" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.treatmentDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.treatment_date}
              onChange={(e) => handleInputChange('treatment_date', e.target.value)}
              required
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-today" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:scale" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.weightLabel')}
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={formData.weight_at_treatment}
              onChange={(e) => handleInputChange('weight_at_treatment', e.target.value)}
              placeholder={t('portfolio.dewormings.form.weightPlaceholder')}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:weight-kilogram" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Icon icon="mdi:lightbulb" className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <p className="text-xs text-blue-300">
              {t('portfolio.dewormings.form.weightInfo')}
            </p>
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.nextDateLabel')}
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.next_treatment_date}
              onChange={(e) => handleInputChange('next_treatment_date', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
            />
            <Icon icon="mdi:calendar-arrow-right" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:doctor" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.veterinarianLabel')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.veterinarian}
              onChange={(e) => handleInputChange('veterinarian', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70"
              placeholder={t('portfolio.dewormings.form.veterinarianPlaceholder')}
            />
            <Icon icon="mdi:hospital-building" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
        
        <div className="group">
          <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
            <Icon icon="mdi:checkbox-marked-circle" className="w-4 h-4 text-orange-400" />
            {t('portfolio.dewormings.form.statusLabel')}
          </label>
          <div className="relative">
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 appearance-none"
            >
              <option value="pending">{t('portfolio.dewormings.form.statusPending')}</option>
              <option value="completed">{t('portfolio.dewormings.form.statusCompleted')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Icon icon="mdi:clock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="mb-8 group">
        <label className="block text-slate-300 font-semibold mb-3 text-sm flex items-center gap-2 group-hover:text-slate-200 transition-colors">
          <Icon icon="mdi:note-text" className="w-4 h-4 text-orange-400" />
          {t('portfolio.dewormings.form.notesLabel')}
        </label>
        <div className="relative">
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 pl-12 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 focus:bg-slate-700/80 transition-all duration-300 hover:border-slate-500/70 resize-none"
            placeholder={t('portfolio.dewormings.form.notesPlaceholder')}
          />
          <Icon icon="mdi:pencil" className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
        </div>
      </div>
      
      <div className="flex gap-4 pt-6 border-t border-slate-700/50">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-400 to-red-400 hover:from-orange-400 hover:to-red-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/save"
        >
          {isSaving ? (
            <>
              <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
              <span>{isEditing ? t('portfolio.dewormings.form.updatingText') : t('portfolio.dewormings.form.savingText')}</span>
            </>
          ) : (
            <>
              <Icon icon="mdi:content-save" className="w-5 h-5 group-hover/save:scale-110 transition-transform" />
              <span className="group-hover/save:tracking-wide transition-all">{isEditing ? t('portfolio.dewormings.form.updateButton') : t('portfolio.dewormings.form.saveButton')}</span>
            </>
          )}
        </button>
        <button 
          onClick={onCancel}
          className="px-6 py-4 bg-gradient-to-r from-slate-600/90 to-slate-700/90 hover:from-slate-600 hover:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 hover:scale-[1.02] hover:-translate-y-0.5 group/cancel"
        >
          <Icon icon="mdi:close" className="w-5 h-5 group-hover/cancel:scale-110 transition-transform" />
          <span className="group-hover/cancel:tracking-wide transition-all">{t('portfolio.dewormings.form.cancelButton')}</span>
        </button>
      </div>
    </div>
  );
}