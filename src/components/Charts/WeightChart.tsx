import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import { formatDateObj, formatDateShort } from '../../utils/petUtils';

interface WeightRecord {
  id: number;
  weight_kg: number;
  measurement_date: string;
  notes?: string;
}

interface WeightChartProps {
  weightHistory: WeightRecord[];
  currentWeight: number;
}

interface ChartDataPoint {
  date: string;
  displayDate: string;
  weight: number;
  fullDate: string;
}

export default function WeightChart({ weightHistory, currentWeight }: WeightChartProps) {
  const { t, locale } = useTranslation();
  const { getDateFormat, getWeightUnitLabel, formatWeight } = useSettings();

  const chartData: ChartDataPoint[] = [...weightHistory]
    .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())
    .map((record) => ({
      date: record.measurement_date,
      displayDate: formatDateShort(record.measurement_date, getDateFormat()),
      weight: parseFloat(formatWeight(record.weight_kg)),
      fullDate: formatDateObj(new Date(record.measurement_date), getDateFormat())
    }));

  const minWeight = Math.min(...chartData.map(d => d.weight));
  const maxWeight = Math.max(...chartData.map(d => d.weight));
  const avgWeight = chartData.reduce((sum, d) => sum + d.weight, 0) / chartData.length;

  // Calcular dominio Y con padding
  const yPadding = (maxWeight - minWeight) * 0.2 || 1;
  const yMin = Math.max(0, Math.floor((minWeight - yPadding) * 10) / 10);
  const yMax = Math.ceil((maxWeight + yPadding) * 10) / 10;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-2xl">
          <p className="text-slate-400 text-sm mb-1">{data.fullDate}</p>
          <p className="text-2xl font-bold text-green-400">
            {data.weight} <span className="text-base font-normal">{getWeightUnitLabel()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
      <h4 className="text-xl font-bold text-white mb-6 flex items-center">
        <svg className="w-6 h-6 mr-3 text-green-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
        </svg>
        {t('portfolio.weight.weightEvolution')}
      </h4>

      <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/30">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="displayDate"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[yMin, yMax]}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${parseFloat(value).toFixed(1)}${getWeightUnitLabel()}`}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={avgWeight}
              stroke="#60a5fa"
              strokeDasharray="5 5"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="weight"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#weightGradient)"
              dot={{ fill: '#10b981', stroke: '#ffffff', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-700/50 text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center text-slate-400">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full mr-2"></div>
              {t('portfolio.weight.progressText', { count: chartData.length })}
            </span>
            <span className="flex items-center text-slate-400">
              <div className="w-3 h-0.5 bg-blue-400 mr-2" style={{ borderStyle: 'dashed' }}></div>
              {t('portfolio.weight.average')}: {avgWeight.toFixed(1)} {getWeightUnitLabel()}
            </span>
          </div>
          <span className="text-slate-400">
            {t('portfolio.weight.rangeText', { min: minWeight.toFixed(1), max: maxWeight.toFixed(1), unit: getWeightUnitLabel() })}
          </span>
        </div>
      </div>
    </div>
  );
}
