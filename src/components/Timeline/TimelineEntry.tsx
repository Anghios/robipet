import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { formatDateObj } from '../../utils/petUtils';

export type TimelineType = 'vaccine' | 'medication' | 'deworming' | 'medical_review' | 'weight';

interface TimelineEntryProps {
  type: TimelineType;
  date: string;
  title: string;
  subtitle?: string;
  details?: Record<string, string>;
  status?: 'pending' | 'completed' | 'expired';
  isLeft: boolean;
  t: (key: string) => string;
}

const typeConfig: Record<TimelineType, {
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  vaccine: {
    icon: 'mdi:needle',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  medication: {
    icon: 'mdi:pill',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  deworming: {
    icon: 'mdi:bug',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30'
  },
  medical_review: {
    icon: 'mdi:stethoscope',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  weight: {
    icon: 'mdi:scale-balance',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/30'
  }
};

export default function TimelineEntry({
  type,
  date,
  title,
  subtitle,
  details,
  status,
  isLeft,
  t
}: TimelineEntryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getDateFormat } = useSettings();
  const config = typeConfig[type];

  const formatDate = (dateStr: string): string => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return formatDateObj(d, getDateFormat());
  };

  const getStatusBadge = () => {
    if (!status) return null;

    const statusStyles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      expired: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    const statusLabels = {
      pending: t('timeline.status.pending'),
      completed: t('timeline.status.completed'),
      expired: t('timeline.status.expired')
    };

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  return (
    <div className={`flex items-start gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Content Card */}
      <div
        className={`flex-1 ${config.bgColor} ${config.borderColor} border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] ${isLeft ? 'mr-4' : 'ml-4'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon icon={config.icon} className={`w-5 h-5 ${config.color} flex-shrink-0`} />
            <h4 className="font-medium text-white truncate">{title}</h4>
          </div>
          {getStatusBadge()}
        </div>

        {subtitle && (
          <p className="text-sm text-slate-400 mb-2">{subtitle}</p>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Icon icon="mdi:calendar" className="w-3 h-3" />
          <span>{formatDate(date)}</span>
        </div>

        {/* Expandable Details */}
        {details && Object.keys(details).length > 0 && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 mt-3 pt-3 border-t border-slate-700/50' : 'max-h-0'}`}>
            <div className="space-y-1">
              {Object.entries(details).map(([key, value]) => (
                value && (
                  <div key={key} className="flex items-start gap-2 text-sm">
                    <span className="text-slate-500 min-w-[80px]">{key}:</span>
                    <span className="text-slate-300">{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {details && Object.keys(details).length > 0 && (
          <div className="flex items-center justify-center mt-2">
            <Icon
              icon={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'}
              className="w-4 h-4 text-slate-500"
            />
          </div>
        )}
      </div>

      {/* Timeline Node */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center`}>
          <Icon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
        </div>
      </div>

      {/* Spacer for opposite side */}
      <div className="flex-1" />
    </div>
  );
}
