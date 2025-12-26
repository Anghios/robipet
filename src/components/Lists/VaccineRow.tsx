import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface Vaccine {
  id: number;
  vaccine_name: string;
  vaccine_date: string;
  next_due_date?: string;
  veterinarian?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

interface VaccineRowProps {
  vaccine: Vaccine;
  formatDate: (date: string) => string;
  onEdit: (vaccine: Vaccine) => void;
  onComplete: (vaccine: Vaccine) => void;
  onDelete: (vaccine: Vaccine) => void;
}

export default function VaccineRow({
  vaccine,
  formatDate,
  onEdit,
  onComplete,
  onDelete
}: VaccineRowProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const status = vaccine.status || 'pending';

  const statusConfig = {
    pending: { icon: 'mdi:clock-outline', color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: t('portfolio.common.pending') },
    completed: { icon: 'mdi:check-circle', color: 'text-green-400', bg: 'bg-green-500/10', label: t('portfolio.common.completed') },
    overdue: { icon: 'mdi:alert-circle', color: 'text-red-400', bg: 'bg-red-500/10', label: t('portfolio.common.expired') }
  };

  const config = statusConfig[status] || statusConfig.pending;

  const hasDetails = vaccine.veterinarian || vaccine.notes || vaccine.next_due_date;

  return (
    <div className={`rounded-xl ${config.bg} border border-slate-700/50 hover:border-slate-600 transition-all overflow-hidden`}>
      {/* Main Row */}
      <div
        className={`flex items-center gap-4 p-4 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        {/* Status Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
          <Icon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">{vaccine.vaccine_name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} hidden sm:inline`}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:calendar" className="w-3.5 h-3.5" />
              {formatDate(vaccine.vaccine_date)}
            </span>
            {vaccine.next_due_date && (
              <span className="flex items-center gap-1 hidden sm:flex">
                <Icon icon="mdi:calendar-clock" className="w-3.5 h-3.5 text-yellow-400" />
                {formatDate(vaccine.next_due_date)}
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
          {status === 'pending' && (
            <button
              onClick={() => onComplete(vaccine)}
              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              title={t('portfolio.vaccines.markCompleted')}
            >
              <Icon icon="mdi:check" className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onEdit(vaccine)}
            className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
            title={t('portfolio.common.edit')}
          >
            <Icon icon="mdi:pencil" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(vaccine)}
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
            {vaccine.next_due_date && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-400">{t('portfolio.vaccines.nextDueDate')}:</span>
                <span className="text-white">{formatDate(vaccine.next_due_date)}</span>
              </div>
            )}
            {vaccine.veterinarian && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400" />
                <span className="text-slate-400">{t('portfolio.vaccines.veterinarian')}:</span>
                <span className="text-white">{vaccine.veterinarian}</span>
              </div>
            )}
            {vaccine.notes && (
              <div className="col-span-full flex items-start gap-2 text-sm">
                <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="text-slate-400">{t('portfolio.vaccines.notes')}:</span>
                <span className="text-slate-300 italic">{vaccine.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
