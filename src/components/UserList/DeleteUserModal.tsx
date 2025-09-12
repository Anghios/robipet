import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface DeleteConfirm {
  userId: number;
  username: string;
}

interface DeleteUserModalProps {
  deleteConfirm: DeleteConfirm;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteUserModal({ deleteConfirm, onConfirm, onCancel }: DeleteUserModalProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const injectShakeStyle = () => {
    const existingStyle = document.getElementById('shake-animation-modal');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'shake-animation-modal';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .shake-on-hover:hover {
          animation: shake 0.5s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  // Inject styles when component mounts
  React.useEffect(() => {
    injectShakeStyle();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl shadow-2xl border border-red-600/30 p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-600/20 rounded-xl border border-red-600/30">
            <Icon icon="mdi:alert" className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-dark-primary">{t('config.deleteUserModal.title')}</h3>
            <p className="text-dark-secondary text-sm">{t('config.deleteUserModal.subtitle')}</p>
          </div>
        </div>
        
        <div className="mb-6 p-4 bg-red-900/20 rounded-xl border border-red-600/30">
          <p className="text-dark-primary text-center">
            {t('config.deleteUserModal.message', { username: deleteConfirm.username })}
          </p>
          <p className="text-dark-secondary text-sm text-center mt-2">
            {t('config.deleteUserModal.warning')}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
            {t('config.deleteUserModal.cancelButton')}
          </button>
          <button
            data-delete-confirm
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shake-on-hover"
          >
            {isDeleting ? (
              <>
                <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                {t('config.deleteUserModal.deleting')}
              </>
            ) : (
              <>
                <Icon icon="mdi:delete" className="w-5 h-5" />
                {t('config.deleteUserModal.deleteButton')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}