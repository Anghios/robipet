import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  icon: string;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  confirmColor, 
  icon 
}: ConfirmationModalProps) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">
            <Icon icon={icon} className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-slate-300 mb-6 leading-relaxed">{message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-500 transition-all focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800 inline-flex items-center justify-center gap-2"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
              {t('confirmationModal.cancel')}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-all focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 inline-flex items-center justify-center gap-2 ${confirmColor}`}
              onMouseEnter={(e) => {
                if (confirmText === 'Eliminar' || 
                    confirmText === t('confirmationModal.delete') || 
                    confirmText === 'Quitar' || 
                    confirmText === 'Remove' ||
                    confirmText === 'Delete') {
                  e.currentTarget.style.animation = 'shake 0.5s ease-in-out infinite';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animation = 'none';
              }}
            >
              <Icon icon={(confirmText === 'Eliminar' || 
                           confirmText === t('confirmationModal.delete') || 
                           confirmText === 'Quitar' || 
                           confirmText === 'Remove' ||
                           confirmText === 'Delete') ? 'mdi:delete' : 'mdi:check'} className="w-5 h-5" />
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}