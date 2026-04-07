import { Icon } from '@iconify/react';

interface ChartPoint {
  date: string;
  value: number;
}

interface HealthCardProps {
  icon: string;
  iconColor: string;
  bgGradient: string;
  borderColor: string;
  title: string;
  value: number | string;
  valueUnit?: string;
  subtitle: string;
  onClick: () => void;
  fullWidth?: boolean;
  showChart?: boolean;
  chartData?: ChartPoint[];
}

export default function HealthCard({
  icon,
  iconColor,
  bgGradient,
  borderColor,
  title,
  value,
  valueUnit,
  subtitle,
  onClick,
  fullWidth = false,
  showChart = false,
  chartData = []
}: HealthCardProps) {
  // Generate simple sparkline path
  const generateSparkline = () => {
    if (!chartData.length) return '';

    const width = 200;
    const height = 40;
    const padding = 4;

    const values = chartData.map(d => d.value);
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05;
    const range = max - min || 1;

    const points = chartData.map((point, i) => {
      const x = padding + (i / (chartData.length - 1 || 1)) * (width - padding * 2);
      const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const sparklinePath = showChart ? generateSparkline() : '';

  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? 'col-span-2' : ''} p-5 bg-gradient-to-br ${bgGradient} rounded-2xl border ${borderColor} text-left transition-all hover:scale-[1.02] hover:shadow-lg group`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon icon={icon} className={`w-5 h-5 ${iconColor}`} />
            <span className="text-sm text-slate-400 font-medium">{title}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-white">{value}</span>
            {valueUnit && <span className="text-lg text-slate-400">{valueUnit}</span>}
          </div>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        {showChart && chartData.length > 1 ? (
          <div className="w-24 h-12">
            <svg viewBox="0 0 200 40" className="w-full h-full">
              <defs>
                <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={sparklinePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={iconColor}
              />
            </svg>
          </div>
        ) : (
          <Icon
            icon="mdi:chevron-right"
            className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors"
          />
        )}
      </div>
    </button>
  );
}
