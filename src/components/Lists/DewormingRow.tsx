import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface Deworming {
  id: number;
  product_name: string;
  treatment_date: string;
  next_treatment_date?: string;
  weight_at_treatment?: number;
  veterinarian?: string;
  notes?: string;
  status?: 'pending' | 'completed';
}

interface DewormingRowProps {
  deworming: Deworming;
  formatDate: (date: string) => string;
  onEdit: (deworming: Deworming) => void;
  onComplete: (deworming: Deworming) => void;
  onDelete: (deworming: Deworming) => void;
}

export default function DewormingRow({
  deworming,
  formatDate,
  onEdit,
  onComplete,
  onDelete
}: DewormingRowProps) {
  const { t } = useTranslation();
  const status = deworming.status || 'pending';
  const isPending = status === 'pending';

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${isPending ? 'bg-orange-500/10' : 'bg-slate-800/50'} border border-slate-700/50 hover:border-slate-600 transition-colors`}>
      {/* Status Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isPending ? 'bg-orange-500/20' : 'bg-green-500/20'} flex items-center justify-center`}>
        <Icon
          icon={isPending ? 'mdi:bug-outline' : 'mdi:check-circle'}
          className={`w-5 h-5 ${isPending ? 'text-orange-400' : 'text-green-400'}`}
        />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-white truncate">{deworming.product_name}</h4>
          {deworming.weight_at_treatment && (
            <span className="text-sm text-slate-400 hidden sm:inline">• {deworming.weight_at_treatment} kg</span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Icon icon="mdi:calendar" className="w-3.5 h-3.5" />
            {formatDate(deworming.treatment_date)}
          </span>
          {deworming.next_treatment_date && (
            <span className="flex items-center gap-1">
              <Icon icon="mdi:calendar-clock" className="w-3.5 h-3.5" />
              {formatDate(deworming.next_treatment_date)}
            </span>
          )}
          {deworming.veterinarian && (
            <span className="flex items-center gap-1 hidden sm:flex">
              <Icon icon="mdi:hospital-building" className="w-3.5 h-3.5" />
              {deworming.veterinarian}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isPending && (
          <button
            onClick={() => onComplete(deworming)}
            className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
            title={t('portfolio.dewormings.card.applyTitle')}
          >
            <Icon icon="mdi:check" className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onEdit(deworming)}
          className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          title={t('portfolio.common.edit')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(deworming)}
          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          title={t('portfolio.common.delete')}
        >
          <Icon icon="mdi:delete" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
