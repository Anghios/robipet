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

interface EditUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

interface EditUserModalProps {
  editingUser: User;
  editForm: EditUser;
  isUpdating?: boolean;
  onFormChange: (form: EditUser) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function EditUserModal({ 
  editingUser, 
  editForm, 
  isUpdating = false,
  onFormChange, 
  onSubmit, 
  onClose 
}: EditUserModalProps) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-card rounded-2xl shadow-2xl border border-dark-hover p-8 w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-dark rounded-xl">
            <Icon icon="mdi:pencil" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-dark-primary">{t('config.editUserModal.title')}</h3>
            <p className="text-dark-secondary text-sm">{editingUser.name}</p>
          </div>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:account" className="w-4 h-4 text-dark-accent" />
              {t('config.editUserModal.nameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('config.editUserModal.namePlaceholder')}
                value={editForm.name}
                onChange={(e) => onFormChange({...editForm, name: e.target.value})}
                required
                disabled={isUpdating}
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Icon icon="mdi:account-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:at" className="w-4 h-4 text-dark-accent" />
              {t('config.editUserModal.usernameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('config.editUserModal.usernamePlaceholder')}
                value={editForm.username}
                onChange={(e) => onFormChange({...editForm, username: e.target.value})}
                required
                disabled={isUpdating}
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Icon icon="mdi:account-circle-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:email" className="w-4 h-4 text-dark-accent" />
              {t('config.editUserModal.emailLabel')}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder={t('config.editUserModal.emailPlaceholder')}
                value={editForm.email}
                onChange={(e) => onFormChange({...editForm, email: e.target.value})}
                disabled={isUpdating}
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Icon icon="mdi:email-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:lock" className="w-4 h-4 text-dark-accent" />
              {t('config.editUserModal.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder={t('config.editUserModal.passwordPlaceholder')}
                value={editForm.password}
                onChange={(e) => onFormChange({...editForm, password: e.target.value})}
                disabled={isUpdating}
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <Icon icon="mdi:lock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:shield-account" className="w-4 h-4 text-dark-accent" />
              {t('config.editUserModal.roleLabel')}
            </label>
            <div className="relative">
              <select
                value={editForm.role}
                onChange={(e) => onFormChange({...editForm, role: e.target.value})}
                disabled={isUpdating}
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="user">{t('config.editUserModal.roleUser')}</option>
                <option value="admin">{t('config.editUserModal.roleAdmin')}</option>
              </select>
              <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary pointer-events-none" />
              <Icon icon="mdi:shield-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                  {t('config.editUserModal.saving')}
                </>
              ) : (
                <>
                  <Icon icon="mdi:content-save" className="w-5 h-5" />
                  {t('config.editUserModal.saveButton')}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
              {t('config.editUserModal.cancelButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}