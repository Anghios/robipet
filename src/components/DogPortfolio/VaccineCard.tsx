import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface Vaccine {
  id: number;
  vaccine_name: string;
  vaccine_date: string;
  veterinarian?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'overdue';
}

interface VaccineCardProps {
  vaccine: Vaccine;
  formatDate: (date: string) => string;
  onEdit: (vaccine: Vaccine) => void;
  onComplete: (vaccine: Vaccine) => void;
  onDelete: (vaccine: Vaccine) => void;
  getVaccineStatusColor: (status: string) => string;
  getVaccineStatusBadge: (status: string) => JSX.Element;
}

export default function VaccineCard({
  vaccine,
  formatDate,
  onEdit,
  onComplete,
  onDelete,
  getVaccineStatusColor,
  getVaccineStatusBadge
}: VaccineCardProps) {
  const { t, locale } = useTranslation();
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

  const status = vaccine.status || 'pending';

  const getVaccineStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { icon: 'mdi:clock-outline', label: t('portfolio.common.pending'), color: 'bg-yellow-500/20 text-yellow-400' };
      case 'completed':
        return { icon: 'mdi:check-circle', label: t('portfolio.common.completed'), color: 'bg-green-500/20 text-green-400' };
      case 'overdue':
        return { icon: 'mdi:alert-circle', label: t('portfolio.common.expired'), color: 'bg-red-500/20 text-red-400' };
      default:
        return { icon: 'mdi:clock-outline', label: t('portfolio.common.pending'), color: 'bg-yellow-500/20 text-yellow-400' };
    }
  };

  const statusInfo = getVaccineStatusInfo();

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400/30 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white group-hover:text-emerald-50 transition-colors duration-300 mb-2">{vaccine.vaccine_name}</h4>
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
            {t('portfolio.vaccines.date')}:
          </span>
          <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{formatDate(vaccine.vaccine_date, locale)}</span>
        </div>
        
        {vaccine.veterinarian && vaccine.veterinarian.trim() && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400 group-hover/item:text-teal-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.vaccines.veterinarian')}:
            </span>
            <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{vaccine.veterinarian}</span>
          </div>
        )}
        
        {vaccine.notes && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/notes">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/notes:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 group-hover/notes:text-amber-300 group-hover/notes:scale-110 transition-all duration-200" />
              {t('portfolio.vaccines.notes')}:
            </span>
            <span className="text-white text-sm italic group-hover/notes:text-slate-100 transition-colors duration-200">{vaccine.notes}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50 group-hover:border-emerald-400/30 transition-colors duration-300">
        <button
          onClick={() => onEdit(vaccine)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-blue-500/25 hover:scale-105 hover:-translate-y-0.5 group/edit"
          title={t('portfolio.vaccines.editVaccineTitle')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4 mr-2 group-hover/edit:scale-110 transition-transform duration-200" /> 
          <span className="group-hover/edit:tracking-wide transition-all duration-200">{t('portfolio.common.edit')}</span>
        </button>
        {status === 'pending' && (
          <button
            onClick={() => onComplete(vaccine)}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500/80 to-emerald-600/80 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-green-500/25 hover:scale-105 hover:-translate-y-0.5 group/complete"
            title={t('portfolio.vaccines.markCompleted')}
          >
            <Icon icon="mdi:check" className="w-4 h-4 mr-2 group-hover/complete:scale-110 transition-transform duration-200" /> 
            <span className="group-hover/complete:tracking-wide transition-all duration-200">{t('portfolio.vaccines.complete')}</span>
          </button>
        )}
        <button
          onClick={() => onDelete(vaccine)}
          className="px-4 py-2.5 bg-gradient-to-r from-red-500/80 to-rose-600/80 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-red-500/25 hover:scale-105 hover:-translate-y-0.5 group/delete animate-none hover:animate-pulse"
          title={t('portfolio.vaccines.deleteVaccineTitle')}
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