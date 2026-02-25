import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import WeightChart from '../Charts/WeightChart';

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
  const { getWeightUnitLabel, formatWeight } = useSettings();

  return (
    <>
      {/* Current Weight Display */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-2xl text-center text-white shadow-xl">
          <span className="block text-5xl font-bold mb-2">{formatWeight(currentWeight)} {getWeightUnitLabel()}</span>
          <span className="text-xl opacity-90">{t('home.weight.currentWeight')}</span>
        </div>
      </div>

      {/* Weight Chart */}
      {weightHistory && weightHistory.length > 1 && (
        <div className="mb-8">
          <WeightChart weightHistory={weightHistory} currentWeight={currentWeight} />
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
                  {formatWeight(record.weight_kg)} {getWeightUnitLabel()}
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