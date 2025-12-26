import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface MedicalReview {
  id: number;
  visit_date: string;
  visit_type: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  veterinarian?: string;
  clinic_name?: string;
  cost?: number;
  notes?: string;
}

interface MedicalReviewRowProps {
  review: MedicalReview;
  formatDate: (date: string) => string;
  onEdit: (review: MedicalReview) => void;
  onDelete: (review: MedicalReview) => void;
}

export default function MedicalReviewRow({
  review,
  formatDate,
  onEdit,
  onDelete
}: MedicalReviewRowProps) {
  const { t } = useTranslation();

  const visitTypeConfig: Record<string, { icon: string; color: string; bg: string }> = {
    routine: { icon: 'mdi:stethoscope', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    illness: { icon: 'mdi:emoticon-sick-outline', color: 'text-red-400', bg: 'bg-red-500/10' },
    emergency: { icon: 'mdi:ambulance', color: 'text-red-500', bg: 'bg-red-500/20' },
    follow_up: { icon: 'mdi:calendar-check', color: 'text-purple-400', bg: 'bg-purple-500/10' }
  };

  const config = visitTypeConfig[review.visit_type] || visitTypeConfig.routine;

  const visitTypeLabels: Record<string, string> = {
    routine: t('portfolio.medicalReviews.card.visitTypeRoutine'),
    illness: t('portfolio.medicalReviews.card.visitTypeIllness'),
    emergency: t('portfolio.medicalReviews.card.visitTypeEmergency'),
    follow_up: t('portfolio.medicalReviews.card.visitTypeFollowUp')
  };

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${config.bg} border border-slate-700/50 hover:border-slate-600 transition-colors`}>
      {/* Type Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}>
        <Icon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-white truncate">
            {review.reason || visitTypeLabels[review.visit_type] || review.visit_type}
          </h4>
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
            {visitTypeLabels[review.visit_type] || review.visit_type}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <Icon icon="mdi:calendar" className="w-3.5 h-3.5" />
            {formatDate(review.visit_date)}
          </span>
          {review.veterinarian && (
            <span className="flex items-center gap-1 hidden sm:flex">
              <Icon icon="mdi:doctor" className="w-3.5 h-3.5" />
              {review.veterinarian}
            </span>
          )}
          {review.clinic_name && (
            <span className="flex items-center gap-1 hidden md:flex">
              <Icon icon="mdi:hospital-building" className="w-3.5 h-3.5" />
              {review.clinic_name}
            </span>
          )}
          {review.cost && (
            <span className="flex items-center gap-1 text-green-400">
              <Icon icon="mdi:currency-eur" className="w-3.5 h-3.5" />
              {review.cost}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(review)}
          className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
          title={t('portfolio.common.edit')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(review)}
          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
          title={t('portfolio.common.delete')}
        >
          <Icon icon="mdi:delete" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
