import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';

interface MedicalReview {
  id: number;
  visit_date?: string;
  visit_type: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  veterinarian?: string;
  clinic_name?: string;
  cost?: number;
  notes?: string;
  status?: 'pending' | 'completed';
}

interface MedicalReviewRowProps {
  review: MedicalReview;
  formatDate: (date: string) => string;
  onEdit: (review: MedicalReview) => void;
  onComplete: (review: MedicalReview) => void;
  onDelete: (review: MedicalReview) => void;
}

export default function MedicalReviewRow({
  review,
  formatDate,
  onEdit,
  onComplete,
  onDelete
}: MedicalReviewRowProps) {
  const { t } = useTranslation();
  const { getCurrencySymbol, getCurrencyIcon } = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const status = review.status || 'completed';
  const isPending = status === 'pending';

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

  const hasDetails = review.diagnosis || review.treatment || review.veterinarian || review.clinic_name || review.notes || review.cost;

  return (
    <div className={`rounded-xl ${isPending ? 'bg-yellow-500/10' : config.bg} border border-slate-700/50 hover:border-slate-600 transition-all overflow-hidden`}>
      {/* Main Row */}
      <div
        className={`flex items-center gap-4 p-4 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        {/* Type Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${isPending ? 'bg-yellow-500/20' : config.bg} flex items-center justify-center`}>
          <Icon icon={isPending ? 'mdi:clock-outline' : config.icon} className={`w-5 h-5 ${isPending ? 'text-yellow-400' : config.color}`} />
        </div>

        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">
              {review.reason || visitTypeLabels[review.visit_type] || review.visit_type}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} hidden sm:inline`}>
              {visitTypeLabels[review.visit_type] || review.visit_type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full hidden sm:inline ${
              isPending
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {isPending ? t('portfolio.common.pending') : t('portfolio.common.completed')}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
            {review.visit_date ? (
              <span className="flex items-center gap-1">
                <Icon icon="mdi:calendar" className="w-3.5 h-3.5" />
                {formatDate(review.visit_date)}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-400/70 italic">
                <Icon icon="mdi:calendar-question" className="w-3.5 h-3.5" />
                {t('portfolio.medicalReviews.noDateYet')}
              </span>
            )}
            {review.veterinarian && (
              <span className="flex items-center gap-1 hidden sm:flex">
                <Icon icon="mdi:doctor" className="w-3.5 h-3.5" />
                {review.veterinarian}
              </span>
            )}
            {review.cost && (
              <span className="flex items-center gap-1 text-green-400">
                <Icon icon={getCurrencyIcon()} className="w-3.5 h-3.5" />
                {review.cost}{getCurrencySymbol()}
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        {hasDetails && (
          <Icon
            icon="mdi:chevron-down"
            className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isPending && (
            <button
              onClick={() => onComplete(review)}
              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              title={t('portfolio.medicalReviews.markCompleted')}
            >
              <Icon icon="mdi:check" className="w-4 h-4" />
            </button>
          )}
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

      {/* Expanded Details */}
      {isExpanded && hasDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {review.diagnosis && (
              <div className="flex items-start gap-2 text-sm">
                <Icon icon="mdi:clipboard-pulse-outline" className="w-4 h-4 text-red-400 mt-0.5" />
                <div>
                  <span className="text-slate-400">{t('portfolio.medicalReviews.diagnosis')}:</span>
                  <p className="text-white">{review.diagnosis}</p>
                </div>
              </div>
            )}
            {review.treatment && (
              <div className="flex items-start gap-2 text-sm">
                <Icon icon="mdi:medical-bag" className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <span className="text-slate-400">{t('portfolio.medicalReviews.treatment')}:</span>
                  <p className="text-white">{review.treatment}</p>
                </div>
              </div>
            )}
            {review.veterinarian && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400" />
                <span className="text-slate-400">{t('portfolio.medicalReviews.veterinarian')}:</span>
                <span className="text-white">{review.veterinarian}</span>
              </div>
            )}
            {review.clinic_name && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:hospital-building" className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400">{t('portfolio.medicalReviews.clinicName')}:</span>
                <span className="text-white">{review.clinic_name}</span>
              </div>
            )}
            {review.cost && (
              <div className="flex items-center gap-2 text-sm">
                <Icon icon={getCurrencyIcon()} className="w-4 h-4 text-green-400" />
                <span className="text-slate-400">{t('portfolio.medicalReviews.cost')}:</span>
                <span className="text-white">{review.cost}{getCurrencySymbol()}</span>
              </div>
            )}
            {review.notes && (
              <div className="col-span-full flex items-start gap-2 text-sm">
                <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 mt-0.5" />
                <span className="text-slate-400">{t('portfolio.medicalReviews.notes')}:</span>
                <span className="text-slate-300 italic">{review.notes}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
