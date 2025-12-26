import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface Medication {
  id: number;
  medication_name: string;
  start_date: string;
  end_date?: string;
  dosage?: string;
  frequency_hours?: number;
  veterinarian?: string;
  notes?: string;
  status?: 'pending' | 'completed';
}

interface MedicationRowProps {
  medication: Medication;
  formatDate: (date: string) => string;
  onEdit: (medication: Medication) => void;
  onComplete: (medication: Medication) => void;
  onDelete: (medication: Medication) => void;
}

export default function MedicationRow({
  medication,
  formatDate,
  onEdit,
  onComplete,
  onDelete
}: MedicationRowProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const status = medication.status || 'pending';
  const isActive = status === 'pending';

  const hasDetails = medication.veterinarian || medication.notes || medication.end_date || medication.frequency_hours;

  return (
    <div className={`rounded-xl ${isActive ? 'bg-blue-500/10' : 'bg-slate-800/50'} border border-slate-700/50 hover:border-slate-600 transition-all overflow-hidden`}>
      {/* Main Row */}
      <div
        className={`flex items-center gap-4 p-4 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        {/* Status Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isActive ? 'bg-blue-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
          <Icon
            icon={isActive ? 'mdi:pill' : 'mdi:check-circle'}
            className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-green-400'}`}
          />
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">{medication.medication_name}</h4>
            {medication.dosage && (
              <span className="text-sm text-slate-400 hidden sm:inline">• {medication.dosage}</span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'} hidden sm:inline`}>
              {isActive ? t('portfolio.common.active') : t('portfolio.common.completed')}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:calendar-start" className="w-3.5 h-3.5" />
              {formatDate(medication.start_date)}
            </span>
            {medication.frequency_hours && (
              <span className="flex items-center gap-1 hidden sm:flex">
                <Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />
                {t('portfolio.medications.every')} {medication.frequency_hours}h
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        {hasDetails && (
          <Icon
            icon="mdi:chevron-down"
            className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isActive && (
            <button
              onClick={() => onComplete(medication)}
              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              title={t('portfolio.medications.card.completeTitle')}
            >
              <Icon icon="mdi:check" className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(medication)}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
            title={t('portfolio.common.edit')}
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(medication)}
            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            title={t('portfolio.common.delete')}
          >
            <Icon icon="mdi:delete" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && hasDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {medication.dosage && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:pill" className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">{t('portfolio.medications.dosage')}:</span>
                <span className="text-white">{medication.dosage}</span>
              </div>
            )}
            {medication.frequency_hours && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:clock-outline" className="w-4 h-4 text-purple-400" />
                <span className="text-slate-400">{t('portfolio.medications.frequency')}:</span>
                <span className="text-white">{t('portfolio.medications.every')} {medication.frequency_hours}h</span>
              </div>
            )}
            {medication.end_date && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:calendar-end" className="w-4 h-4 text-orange-400" />
                <span className="text-slate-400">{t('portfolio.medications.endDate')}:</span>
                <span className="text-white">{formatDate(medication.end_date)}</span>
              </div>
            )}
            {medication.veterinarian && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400" />
                <span className="text-slate-400">{t('portfolio.medications.veterinarian')}:</span>
                <span className="text-white">{medication.veterinarian}</span>
              </div>
            )}
            {medication.notes && (
              <div className="col-span-full flex items-start gap-2 text-sm">
                <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="text-slate-400">{t('portfolio.medications.notes')}:</span>
                <span className="text-slate-300 italic">{medication.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
