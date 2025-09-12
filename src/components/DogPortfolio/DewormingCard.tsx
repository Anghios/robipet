import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface Deworming {
  id: number;
  product_name: string;
  treatment_date: string;
  next_treatment_date?: string;
  weight_at_treatment?: number;
  veterinarian?: string;
  notes?: string;
  status?: 'pending' | 'completed';
}

interface DewormingCardProps {
  deworming: Deworming;
  formatDate: (date: string) => string;
  onEdit: (deworming: Deworming) => void;
  onComplete: (deworming: Deworming) => void;
  onDelete: (deworming: Deworming) => void;
}

export default function DewormingCard({
  deworming,
  formatDate,
  onEdit,
  onComplete,
  onDelete
}: DewormingCardProps) {
  const { t } = useTranslation();
  // Add shake animation CSS once
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

  const status = deworming.status || 'pending';

  const getDewormingStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { icon: 'mdi:clock-outline', label: t('portfolio.dewormings.card.statusPending'), color: 'bg-yellow-500/20 text-yellow-400' };
      case 'completed':
        return { icon: 'mdi:check-circle', label: t('portfolio.dewormings.card.statusCompleted'), color: 'bg-green-500/20 text-green-400' };
      default:
        return { icon: 'mdi:clock-outline', label: t('portfolio.dewormings.card.statusPending'), color: 'bg-yellow-500/20 text-yellow-400' };
    }
  };

  const statusInfo = getDewormingStatusInfo();

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400/30 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white group-hover:text-emerald-50 transition-colors duration-300 mb-2">{deworming.product_name}</h4>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-all duration-300 ${statusInfo.color} group-hover:scale-105`}>
            <Icon icon={statusInfo.icon} className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
            {statusInfo.label}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-blue-400 group-hover/item:text-blue-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('portfolio.dewormings.card.dateLabel')}
          </span>
          <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{formatDate(deworming.treatment_date)}</span>
        </div>
        
        {deworming.weight_at_treatment && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:scale" className="w-4 h-4 text-purple-400 group-hover/item:text-purple-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.dewormings.card.weightLabel')}
            </span>
            <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{deworming.weight_at_treatment} kg</span>
          </div>
        )}
        
        {deworming.next_treatment_date && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-yellow-400 group-hover/item:text-yellow-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.dewormings.card.nextLabel')}
            </span>
            <span className="text-yellow-400 font-medium group-hover/item:text-yellow-300 transition-colors duration-200">{formatDate(deworming.next_treatment_date)}</span>
          </div>
        )}
        
        {deworming.veterinarian && deworming.veterinarian.trim() && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400 group-hover/item:text-teal-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.dewormings.card.veterinarianLabel')}
            </span>
            <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{deworming.veterinarian}</span>
          </div>
        )}
        
        {deworming.notes && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/notes">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/notes:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 group-hover/notes:text-amber-300 group-hover/notes:scale-110 transition-all duration-200" />
              {t('portfolio.dewormings.card.notesLabel')}
            </span>
            <span className="text-white text-sm italic group-hover/notes:text-slate-100 transition-colors duration-200">{deworming.notes}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50 group-hover:border-emerald-400/30 transition-colors duration-300">
        <button
          onClick={() => onEdit(deworming)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-blue-500/25 hover:scale-105 hover:-translate-y-0.5 group/edit"
          title={t('portfolio.dewormings.card.editTitle')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4 mr-2 group-hover/edit:scale-110 transition-transform duration-200" /> 
          <span className="group-hover/edit:tracking-wide transition-all duration-200">{t('portfolio.dewormings.card.editButton')}</span>
        </button>
        {status === 'pending' && (
          <button
            onClick={() => onComplete(deworming)}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-green-500/25 hover:scale-105 hover:-translate-y-0.5 group/complete"
            title={t('portfolio.dewormings.card.applyTitle')}
          >
            <Icon icon="mdi:check" className="w-4 h-4 mr-2 group-hover/complete:scale-110 transition-transform duration-200" /> 
            <span className="group-hover/complete:tracking-wide transition-all duration-200">{t('portfolio.dewormings.card.applyButton')}</span>
          </button>
        )}
        <button
          onClick={() => onDelete(deworming)}
          className="px-4 py-2.5 bg-gradient-to-r from-red-500/80 to-rose-600/80 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-red-500/25 hover:scale-105 hover:-translate-y-0.5 group/delete animate-none hover:animate-pulse"
          title={t('portfolio.dewormings.card.deleteTitle')}
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