import { Icon } from '@iconify/react';

interface AlertBannerProps {
  type: 'urgent' | 'warning' | 'info';
  title: string;
  description: string;
  onAction?: () => void;
  t: (key: string) => string;
}

const alertStyles = {
  urgent: {
    bg: 'bg-gradient-to-r from-red-500/20 to-red-600/10',
    border: 'border-red-500/30',
    icon: 'mdi:alert-circle',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/20'
  },
  warning: {
    bg: 'bg-gradient-to-r from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/30',
    icon: 'mdi:alert',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/20'
  },
  info: {
    bg: 'bg-gradient-to-r from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    icon: 'mdi:information',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/20'
  }
};

export default function AlertBanner({
  type,
  title,
  description,
  onAction,
  t
}: AlertBannerProps) {
  const styles = alertStyles[type];

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl ${styles.bg} border ${styles.border} ${onAction ? 'cursor-pointer hover:scale-[1.01] transition-transform' : ''}`}
      onClick={onAction}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
        <Icon icon={styles.icon} className={`w-5 h-5 ${styles.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white">{title}</h4>
        <p className="text-sm text-slate-400 truncate">{description}</p>
      </div>
      {onAction && (
        <Icon icon="mdi:chevron-right" className="w-5 h-5 text-slate-500" />
      )}
    </div>
  );
}
