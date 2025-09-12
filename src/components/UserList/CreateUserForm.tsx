import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface NewUser {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

interface CreateUserFormProps {
  newUser: NewUser;
  onUserChange: (user: NewUser) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CreateUserForm({ newUser, onUserChange, onSubmit, onCancel }: CreateUserFormProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-dark rounded-xl">
          <Icon icon="mdi:account-plus" className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-dark-primary">{t('config.createUserForm.title')}</h3>
          <p className="text-dark-secondary text-sm">{t('config.createUserForm.subtitle')}</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:account" className="w-4 h-4 text-dark-accent" />
              {t('config.createUserForm.nameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('config.createUserForm.namePlaceholder')}
                value={newUser.name}
                onChange={(e) => onUserChange({...newUser, name: e.target.value})}
                required
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Icon icon="mdi:account-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:at" className="w-4 h-4 text-dark-accent" />
              {t('config.createUserForm.usernameLabel')}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={t('config.createUserForm.usernamePlaceholder')}
                value={newUser.username}
                onChange={(e) => onUserChange({...newUser, username: e.target.value})}
                required
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Icon icon="mdi:account-circle-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:email" className="w-4 h-4 text-dark-accent" />
              {t('config.createUserForm.emailLabel')}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder={t('config.createUserForm.emailPlaceholder')}
                value={newUser.email}
                onChange={(e) => onUserChange({...newUser, email: e.target.value})}
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Icon icon="mdi:email-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
              <Icon icon="mdi:lock" className="w-4 h-4 text-dark-accent" />
              {t('config.createUserForm.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder={t('config.createUserForm.passwordPlaceholder')}
                value={newUser.password}
                onChange={(e) => onUserChange({...newUser, password: e.target.value})}
                required
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <Icon icon="mdi:lock-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-primary flex items-center gap-2">
            <Icon icon="mdi:shield-account" className="w-4 h-4 text-dark-accent" />
            {t('config.createUserForm.roleLabel')}
          </label>
          <div className="relative max-w-xs">
            <select
              value={newUser.role}
              onChange={(e) => onUserChange({...newUser, role: e.target.value})}
              className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="user">{t('config.createUserForm.roleUser')}</option>
              <option value="admin">{t('config.createUserForm.roleAdmin')}</option>
            </select>
            <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary pointer-events-none" />
            <Icon icon="mdi:shield-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Icon icon="mdi:close" className="w-5 h-5" />
            {t('config.createUserForm.cancelButton')}
          </button>
          <button 
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          >
            <Icon icon="mdi:plus" className="w-5 h-5" />
            {t('config.createUserForm.createButton')}
          </button>
        </div>
      </form>
    </div>
  );
}