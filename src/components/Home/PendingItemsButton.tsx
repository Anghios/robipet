import { Icon } from '@iconify/react';

interface PendingItemsButtonProps {
  totalPending: number;
  onClick: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function PendingItemsButton({ totalPending, onClick, t }: PendingItemsButtonProps) {
  const hasPending = totalPending > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] group ${
        hasPending
          ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500/30 hover:border-amber-400/50'
          : 'bg-gradient-to-r from-green-500/15 to-emerald-500/10 border-green-500/30 hover:border-green-400/50'
      }`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
        hasPending ? 'bg-amber-500/20' : 'bg-green-500/20'
      }`}>
        <Icon
          icon={hasPending ? 'mdi:clipboard-alert-outline' : 'mdi:clipboard-check-outline'}
          className={`w-5 h-5 ${hasPending ? 'text-amber-400' : 'text-green-400'}`}
        />
      </div>

      <div className="flex-1 min-w-0 text-left">
        <h4 className="font-medium text-white">
          {hasPending ? t('home.pending.viewAll') : t('home.pending.allClear')}
        </h4>
        <p className="text-sm text-slate-400">
          {hasPending
            ? t('home.pending.pendingItems', { count: totalPending })
            : t('home.pending.allClearDesc')
          }
        </p>
      </div>

      {hasPending && (
        <span className="flex-shrink-0 min-w-[28px] h-7 flex items-center justify-center text-sm font-bold rounded-full bg-amber-500/20 text-amber-400 px-2">
          {totalPending}
        </span>
      )}

      <Icon
        icon="mdi:chevron-right"
        className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors flex-shrink-0"
      />
    </button>
  );
}
