import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface WeightRecord {
  id: number;
  weight_kg: number;
  measurement_date: string;
  notes?: string;
  added_by_user?: string;
}

interface WeightCardProps {
  weightHistory: WeightRecord[];
  currentWeight: number;
  formatDate: (date: string) => string;
  onEdit: (weightRecord: WeightRecord) => void;
  onDelete: (weightRecord: WeightRecord) => void;
}

export default function WeightCard({
  weightHistory,
  currentWeight,
  formatDate,
  onEdit,
  onDelete
}: WeightCardProps) {
  const { t } = useTranslation();

  // Preparar datos para la gráfica
  const getChartData = () => {
    if (!weightHistory || weightHistory.length === 0) return [];
    
    return [...weightHistory]
      .sort((a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime())
      .map((record, index) => ({
        date: record.measurement_date,
        weight: record.weight_kg,
        index
      }));
  };

  const chartData = getChartData();
  const maxWeight = chartData.length > 0 ? Math.max(...chartData.map(d => d.weight)) : currentWeight;
  const minWeight = chartData.length > 0 ? Math.min(...chartData.map(d => d.weight)) : currentWeight;
  const weightRange = maxWeight - minWeight || 1;

  return (
    <>
      {/* Current Weight Display */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-2xl text-center text-white shadow-xl">
          <span className="block text-5xl font-bold mb-2">{currentWeight} kg</span>
          <span className="text-xl opacity-90">{t('home.weight.currentWeight')}</span>
        </div>
      </div>

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <div className="mb-8">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl p-6">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <Icon icon="mdi:chart-line" className="mr-3 w-6 h-6 text-green-400" />
              {t('portfolio.weight.weightEvolution')}
            </h4>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-600/30">
              <svg 
                viewBox="0 0 600 200" 
                className="w-full h-40 mb-3"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="60" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 30" fill="none" stroke="rgb(71 85 105)" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="600" height="200" fill="url(#grid)" />
                
                {/* Chart line */}
                <polyline
                  points={chartData.map((point, index) => 
                    `${(index / (chartData.length - 1)) * 560 + 20},${180 - ((point.weight - minWeight) / weightRange) * 140}`
                  ).join(' ')}
                  fill="none"
                  stroke="url(#weightGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="weightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#06d6a0', stopOpacity: 1}} />
                  </linearGradient>
                </defs>
                
                {/* Data points */}
                {chartData.map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={(index / (chartData.length - 1)) * 560 + 20}
                      cy={180 - ((point.weight - minWeight) / weightRange) * 140}
                      r="5"
                      fill="#10b981"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="hover:r-7 transition-all cursor-pointer"
                    />
                    <text
                      x={(index / (chartData.length - 1)) * 560 + 20}
                      y={180 - ((point.weight - minWeight) / weightRange) * 140 - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#e2e8f0"
                      className="font-medium"
                    >
                      {point.weight}kg
                    </text>
                  </g>
                ))}
                
                {/* Date labels */}
                {chartData.map((point, index) => (
                  <text
                    key={`date-${index}`}
                    x={(index / (chartData.length - 1)) * 560 + 20}
                    y={195}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#94a3b8"
                    className="font-medium"
                  >
                    {new Date(point.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
                  </text>
                ))}
              </svg>
              
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full mr-2"></div>
                  {t('portfolio.weight.progressText', { count: chartData.length })}
                </span>
                <span>
                  {t('portfolio.weight.rangeText', { min: minWeight, max: maxWeight })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weight History */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h4 className="text-xl font-bold text-white">{t('home.weight.measurements')}</h4>
        </div>
        <div className="divide-y divide-slate-700">
          {weightHistory && weightHistory.length > 0 ? (
            [...weightHistory]
              .sort((a, b) => new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime())
              .map((record) => (
            <div key={record.id} className="p-6 hover:bg-slate-700/50 transition-colors">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="text-blue-400 font-medium">
                  {formatDate(record.measurement_date)}
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {record.weight_kg} kg
                </div>
                <div className="text-slate-300 italic text-sm">
                  {record.notes || t('home.weight.noObservations')}
                </div>
                <div className="text-slate-400 text-xs">
                  <div className="flex items-center">
                    <span className="mr-1">👤</span>
                    {t('home.weight.addedBy')}: {record.added_by_user || 'Usuario'}
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(record)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all text-sm font-medium"
                    title={t('portfolio.weight.editRecordTitle')}
                  >
                    <Icon icon="mdi:pencil" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(record)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all text-sm font-medium inline-flex items-center justify-center"
                    title={t('portfolio.weight.deleteRecordTitle')}
                  >
                    <Icon icon="mdi:delete" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
              ))
          ) : (
            <div className="p-6 text-center py-12">
              <Icon icon="mdi:scale-balance" className="text-6xl block mb-4 mx-auto text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('portfolio.weight.noWeightHistory')}</h3>
              <p className="text-slate-400">{t('portfolio.weight.addFirstWeightRecord')}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}