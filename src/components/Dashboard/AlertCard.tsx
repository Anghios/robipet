import { Icon } from '@iconify/react';

type AlertType = 'urgent' | 'warning' | 'upcoming' | 'info';

interface AlertCardProps {
  type: AlertType;
  icon: string;
  title: string;
  description: string;
  date?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const alertStyles: Record<AlertType, {
  bg: string;
  border: string;
  iconBg: string;
  iconColor: string;
  badge: string;
  badgeText: string;
}> = {
  urgent: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
    iconColor: 'text-red-400',
    badge: 'bg-red-500',
    badgeText: 'text-white'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    iconBg: 'bg-yellow-500/20',
    iconColor: 'text-yellow-400',
    badge: 'bg-yellow-500',
    badgeText: 'text-black'
  },
  upcoming: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    badge: 'bg-blue-500',
    badgeText: 'text-white'
  },
  info: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    iconBg: 'bg-slate-500/20',
    iconColor: 'text-slate-400',
    badge: 'bg-slate-500',
    badgeText: 'text-white'
  }
};

export default function AlertCard({
  type,
  icon,
  title,
  description,
  date,
  action
}: AlertCardProps) {
  const styles = alertStyles[type];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-xl p-4 flex items-center gap-4`}>
      <div className={`${styles.iconBg} w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon icon={icon} className={`w-5 h-5 ${styles.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-white truncate">{title}</h4>
        </div>
        <p className="text-sm text-slate-400 truncate">{description}</p>
        {date && (
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <Icon icon="mdi:calendar" className="w-3 h-3" />
            {date}
          </p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
