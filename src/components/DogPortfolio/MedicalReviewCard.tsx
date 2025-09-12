import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface MedicalReview {
  id: number;
  reason: string;
  visit_type: 'routine' | 'illness' | 'emergency' | 'follow_up';
  visit_date: string;
  veterinarian?: string;
  clinic_name?: string;
  diagnosis?: string;
  treatment?: string;
  next_visit?: string;
  notes?: string;
  cost?: string;
}

interface MedicalReviewCardProps {
  review: MedicalReview;
  formatDate: (date: string) => string;
  onEdit: (review: MedicalReview) => void;
  onDelete: (review: MedicalReview) => void;
}

export default function MedicalReviewCard({ review, formatDate, onEdit, onDelete }: MedicalReviewCardProps) {
  const { t } = useTranslation();
  // Añadir la animación de shake CSS una sola vez
  useEffect(() => {
    if (!document.getElementById('shake-animation')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'shake-animation';
      styleElement.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translateX(2px) rotate(1deg); }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);
  const getVisitTypeInfo = (visitType: string) => {
    switch (visitType) {
      case 'routine':
        return { icon: 'mdi:refresh', label: t('portfolio.medicalReviews.card.visitTypeRoutine'), color: 'bg-blue-500/20 text-blue-400' };
      case 'illness':
        return { icon: 'mdi:thermometer-alert', label: t('portfolio.medicalReviews.card.visitTypeIllness'), color: 'bg-red-500/20 text-red-400' };
      case 'emergency':
        return { icon: 'mdi:alert', label: t('portfolio.medicalReviews.card.visitTypeEmergency'), color: 'bg-orange-500/20 text-orange-400' };
      case 'follow_up':
        return { icon: 'mdi:clipboard-text', label: t('portfolio.medicalReviews.card.visitTypeFollowUp'), color: 'bg-green-500/20 text-green-400' };
      default:
        return { icon: 'mdi:clipboard-text', label: t('portfolio.medicalReviews.card.visitTypeFollowUp'), color: 'bg-green-500/20 text-green-400' };
    }
  };

  const visitTypeInfo = getVisitTypeInfo(review.visit_type);

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400/30 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white group-hover:text-emerald-50 transition-colors duration-300 mb-2">{review.reason}</h4>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-all duration-300 ${visitTypeInfo.color} group-hover:scale-105`}>
            <Icon icon={visitTypeInfo.icon} className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
            {visitTypeInfo.label}
          </span>
          {review.cost && (
            <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full text-sm font-bold group-hover:bg-green-500/30 group-hover:text-green-200 group-hover:scale-105 transition-all duration-300">
              {review.cost}€
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-blue-400 group-hover/item:text-blue-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('portfolio.medicalReviews.card.dateLabel')}
          </span>
          <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{formatDate(review.visit_date)}</span>
        </div>
        
        {review.veterinarian && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400 group-hover/item:text-teal-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.medicalReviews.card.veterinarianLabel')}
            </span>
            <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{review.veterinarian}</span>
          </div>
        )}
        
        {review.clinic_name && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:hospital-building" className="w-4 h-4 text-purple-400 group-hover/item:text-purple-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.medicalReviews.card.clinicLabel')}
            </span>
            <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{review.clinic_name}</span>
          </div>
        )}
        
        {review.diagnosis && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/diag">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/diag:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:clipboard-pulse" className="w-4 h-4 text-red-400 group-hover/diag:text-red-300 group-hover/diag:scale-110 transition-all duration-200" />
              {t('portfolio.medicalReviews.card.diagnosisLabel')}
            </span>
            <span className="text-white text-sm group-hover/diag:text-slate-100 transition-colors duration-200">{review.diagnosis}</span>
          </div>
        )}
        
        {review.treatment && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/treat">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/treat:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:medical-bag" className="w-4 h-4 text-green-400 group-hover/treat:text-green-300 group-hover/treat:scale-110 transition-all duration-200" />
              {t('portfolio.medicalReviews.card.treatmentLabel')}
            </span>
            <span className="text-white text-sm group-hover/treat:text-slate-100 transition-colors duration-200">{review.treatment}</span>
          </div>
        )}
        
        {review.next_visit && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-yellow-400 group-hover/item:text-yellow-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.medicalReviews.card.nextVisitLabel')}
            </span>
            <span className="text-yellow-400 font-medium group-hover/item:text-yellow-300 transition-colors duration-200">{formatDate(review.next_visit)}</span>
          </div>
        )}
        
        {review.notes && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/notes">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/notes:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 group-hover/notes:text-amber-300 group-hover/notes:scale-110 transition-all duration-200" />
              {t('portfolio.medicalReviews.card.notesLabel')}
            </span>
            <span className="text-white text-sm italic group-hover/notes:text-slate-100 transition-colors duration-200">{review.notes}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50 group-hover:border-emerald-400/30 transition-colors duration-300">
        <button
          onClick={() => onEdit(review)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-blue-500/25 hover:scale-105 hover:-translate-y-0.5 group/edit"
          title={t('portfolio.medicalReviews.card.editTitle')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4 mr-2 group-hover/edit:scale-110 transition-transform duration-200" /> 
          <span className="group-hover/edit:tracking-wide transition-all duration-200">{t('portfolio.medicalReviews.card.editButton')}</span>
        </button>
        <button
          onClick={() => onDelete(review)}
          className="px-4 py-2.5 bg-gradient-to-r from-red-500/80 to-rose-600/80 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-red-500/25 hover:scale-105 hover:-translate-y-0.5 group/delete animate-none hover:animate-pulse"
          title={t('portfolio.medicalReviews.card.deleteTitle')}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = 'shake 0.5s ease-in-out infinite';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animation = 'none';
          }}
        >
          <Icon icon="mdi:delete" className="w-4 h-4 group-hover/delete:scale-125 group-hover/delete:rotate-12 transition-all duration-200" />
        </button>
      </div>
    </div>
  );
}