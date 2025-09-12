import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Pet } from '../../types/Pet';
import { useTranslation } from '../../hooks/useTranslation';

interface DeleteModalProps {
  pet: Pet;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteModal({ pet, onConfirm, onCancel, isDeleting = false }: DeleteModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gradient-card rounded-2xl shadow-2xl border border-red-600/30 p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-xl border border-red-600/30">
            <Icon icon="mdi:alert" className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-dark-primary">{t('petList.deleteModal.title')}</h3>
            <p className="text-dark-secondary text-sm">{t('petList.deleteModal.subtitle')}</p>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-red-900/20 rounded-xl border border-red-600/30">
          <p className="text-dark-primary text-center">
            {t('petList.deleteModal.message', { name: pet.name })}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
            {t('petList.deleteModal.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.animation = 'shake 0.5s ease-in-out infinite';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animation = 'none';
            }}
          >
            {isDeleting ? (
              <>
                <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                {t('petList.deleteModal.deleting')}
              </>
            ) : (
              <>
                <Icon icon="mdi:delete" className="w-5 h-5" />
                {t('petList.deleteModal.delete')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}