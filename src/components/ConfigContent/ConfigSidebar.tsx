import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation.ts';

interface ConfigSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function ConfigSidebar({ currentSection, onSectionChange }: ConfigSidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="w-full lg:w-64 bg-dark-card rounded-2xl shadow-xl border border-dark p-4 lg:p-6 h-fit">
      <nav className="flex lg:flex-col gap-2 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
        <button
          onClick={() => onSectionChange('general')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full lg:w-full text-left whitespace-nowrap lg:whitespace-normal ${
            currentSection === 'general' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
              : 'text-dark-primary hover:bg-dark-card-hover'
          }`}
        >
          <span className="text-lg"><Icon icon="mdi:cog" className="w-5 h-5 text-dark-accent" /></span>
          <span>{t('config.general')}</span>
        </button>
        
        <button
          onClick={() => onSectionChange('usuarios')}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full lg:w-full text-left whitespace-nowrap lg:whitespace-normal ${
            currentSection === 'usuarios' 
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
              : 'text-dark-primary hover:bg-dark-card-hover'
          }`}
        >
          <span className="text-lg"><Icon icon="mdi:account-group" className="w-5 h-5 text-dark-accent" /></span>
          <span>{t('config.users')}</span>
        </button>
      </nav>
    </aside>
  );
}