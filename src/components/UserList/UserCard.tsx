import React from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface User {
  id: number;
  name: string;
  email?: string;
  username: string;
  role: string;
  created_at: string;
}

interface DeleteConfirm {
  userId: number;
  username: string;
}

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDeleteConfirm: (confirm: DeleteConfirm) => void;
}

export default function UserCard({ user, onEdit, onDeleteConfirm }: UserCardProps) {
  const { t, locale } = useTranslation();
  const injectShakeStyle = () => {
    const existingStyle = document.getElementById('shake-animation');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'shake-animation';
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

  const handleDeleteClick = () => {
    onDeleteConfirm({ userId: user.id, username: user.username });
  };

  // Inject styles when component mounts
  React.useEffect(() => {
    injectShakeStyle();
  }, []);

  return (
    <div className="bg-gradient-card border border-dark-hover rounded-2xl p-4 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-blue-500/30">
      <div className="flex items-start justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className={`flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-xl ${
            user.role === 'admin' 
              ? 'bg-purple-900/20 border border-purple-600/30' 
              : 'bg-blue-900/20 border border-blue-600/30'
          }`}>
            <Icon 
              icon={user.role === 'admin' ? 'mdi:crown' : 'mdi:account'} 
              className={`w-6 h-6 lg:w-8 lg:h-8 ${
                user.role === 'admin' ? 'text-purple-400' : 'text-blue-400'
              }`} 
            />
          </div>
          <div>
            <h4 className="font-bold text-dark-primary text-lg lg:text-xl mb-2">{user.name}</h4>
            <span className={`px-3 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm rounded-full font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-900/40 text-purple-300 border border-purple-600/30' 
                : 'bg-blue-900/40 text-blue-300 border border-blue-600/30'
            }`}>
              {user.role === 'admin' ? t('config.userCard.admin') : t('config.userCard.user')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 lg:space-y-4 mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-3 text-dark-secondary text-sm lg:text-base">
          <Icon icon="mdi:at" className="w-4 h-4 lg:w-5 lg:h-5 text-dark-accent" />
          <span className="font-medium">{t('config.userCard.username')}</span>
          <span>{user.username}</span>
        </div>
        {user.email && (
          <div className="flex items-center gap-2 lg:gap-3 text-dark-secondary text-sm lg:text-base">
            <Icon icon="mdi:email" className="w-4 h-4 lg:w-5 lg:h-5 text-dark-accent" />
            <span className="font-medium">{t('config.userCard.email')}</span>
            <span className="truncate">{user.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 lg:gap-3 text-dark-secondary text-xs lg:text-sm">
          <Icon icon="mdi:calendar" className="w-4 h-4 lg:w-5 lg:h-5 text-dark-accent" />
          <span className="font-medium">{t('config.userCard.created')}</span>
          <span>{new Date(user.created_at).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')}</span>
        </div>
      </div>
      
      <div className="flex gap-2 lg:gap-3">
        <button
          onClick={() => onEdit(user)}
          className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm lg:text-base rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1 lg:gap-2 shadow-md hover:shadow-lg"
        >
          <Icon icon="mdi:pencil" className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">{t('config.userCard.editButton')}</span>
        </button>
        <button
          data-user-delete={user.id}
          onClick={handleDeleteClick}
          className="flex-1 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm lg:text-base rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1 lg:gap-2 shadow-md hover:shadow-lg shake-on-hover"
        >
          <Icon icon="mdi:delete" className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="hidden sm:inline">{t('config.userCard.deleteButton')}</span>
        </button>
      </div>
    </div>
  );
}