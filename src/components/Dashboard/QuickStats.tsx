import { Icon } from '@iconify/react';
import { useSettings } from '../../hooks/useSettings';
import { formatDateObj } from '../../utils/petUtils';

interface QuickStatsProps {
  totalVaccines: number;
  completedVaccines: number;
  currentWeight: number;
  totalWeightRecords: number;
  lastReviewDate?: string;
  urgentAlerts: number;
  warningAlerts: number;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function QuickStats({
  totalVaccines,
  completedVaccines,
  currentWeight,
  totalWeightRecords,
  lastReviewDate,
  urgentAlerts,
  warningAlerts,
  t
}: QuickStatsProps) {
  const { getDateFormat, getWeightUnitLabel, formatWeight } = useSettings();

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('dashboard.stats.today');
    if (diffDays === 1) return t('dashboard.stats.yesterday');
    if (diffDays < 7) return t('dashboard.stats.daysAgo', { days: diffDays });
    if (diffDays < 30) return t('dashboard.stats.weeksAgo', { weeks: Math.floor(diffDays / 7) });
    return formatDateObj(date, getDateFormat());
  };

  const stats = [
    {
      icon: 'mdi:needle',
      label: t('dashboard.stats.vaccines'),
      value: `${completedVaccines}/${totalVaccines}`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: 'mdi:scale-balance',
      label: t('dashboard.stats.weight'),
      value: currentWeight > 0 ? `${formatWeight(currentWeight)} ${getWeightUnitLabel()}` : '-',
      subValue: totalWeightRecords > 0 ? t('dashboard.stats.records', { count: totalWeightRecords }) : undefined,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: 'mdi:stethoscope',
      label: t('dashboard.stats.lastReview'),
      value: lastReviewDate ? formatDate(lastReviewDate) : t('dashboard.stats.noReviews'),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    },
    {
      icon: 'mdi:bell-alert',
      label: t('dashboard.stats.alerts'),
      value: urgentAlerts + warningAlerts,
      subValue: urgentAlerts > 0 ? t('dashboard.stats.urgent', { count: urgentAlerts }) : undefined,
      color: urgentAlerts > 0 ? 'text-red-400' : warningAlerts > 0 ? 'text-yellow-400' : 'text-green-400',
      bgColor: urgentAlerts > 0 ? 'bg-red-500/20' : warningAlerts > 0 ? 'bg-yellow-500/20' : 'bg-green-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-slate-800 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`${stat.bgColor} w-8 h-8 rounded-lg flex items-center justify-center`}>
              <Icon icon={stat.icon} className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className="text-sm text-slate-400">{stat.label}</span>
          </div>
          <div className="pl-11">
            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
            {stat.subValue && (
              <p className="text-xs text-slate-500 mt-0.5">{stat.subValue}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
