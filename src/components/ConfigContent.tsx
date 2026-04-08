import { Icon } from '@iconify/react';
import UsersList from './UsersList';
import Toast from './Visuals/Toast';
import { useTranslation } from '../hooks/useTranslation';
import { useConfigNavigation } from '../hooks/useConfigNavigation.ts';
import { useToast } from '../hooks/useToast';
import { useSettings } from '../hooks/useSettings';

export default function ConfigContent() {
  const { t, locale, changeLanguage, loading } = useTranslation();
  const { currentSection, handleSectionChange } = useConfigNavigation();
  const { toast, showToast, hideToast } = useToast();
  const { settings, updateSetting, getCurrencyIcon } = useSettings();

  const sections = [
    { id: 'general', icon: 'mdi:cog', label: t('config.general') },
    { id: 'usuarios', icon: 'mdi:account-group', label: t('config.users') },
    { id: 'notificaciones', icon: 'mdi:bell', label: t('config.notifications') },
  ];

  const handleExportDatabase = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showToast(t('config.database.exportError') + ': No authenticated', 'error');
        return;
      }

      const response = await fetch('/api/export_database', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/octet-stream'
        }
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al exportar');
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `database_backup_${new Date().toISOString().split('T')[0]}.sqlite`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showToast(t('config.database.exportSuccess'), 'success');
    } catch (error) {
      console.error('Error exportando base de datos:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(`${t('config.database.exportError')}: ${errorMessage}`, 'error');
    }
  };

  const handleImportDatabase = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sqlite';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const token = localStorage.getItem('authToken');
      if (!token) {
        showToast(t('config.database.importError') + ': No authenticated', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('database', file);

      try {
        const response = await fetch('/api/import_database', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          showToast(t('config.database.importSuccess'), 'success');
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return;
        }

        const contentType = response.headers.get('content-type');
        let errorMessage = `Error HTTP: ${response.status}`;

        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch (e) {
            // Si no se puede parsear el JSON, usar el mensaje por defecto
          }
        }

        throw new Error(errorMessage);
      } catch (error) {
        console.error('Error importando base de datos:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        showToast(`${t('config.database.importError')}: ${errorMessage}`, 'error');
      }
    };
    input.click();
  };

  const renderGeneralContent = () => (
    <div className="space-y-4">
      {/* Database Management */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Icon icon="mdi:database" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t('config.database.title')}</h3>
            <p className="text-slate-400 text-sm">{t('config.database.description')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportDatabase}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            <Icon icon="mdi:download" className="w-5 h-5" />
            <span className="font-medium">{t('config.database.exportButton')}</span>
          </button>

          <button
            onClick={handleImportDatabase}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
          >
            <Icon icon="mdi:upload" className="w-5 h-5" />
            <span className="font-medium">{t('config.database.importButton')}</span>
          </button>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-3">
          <div className="flex items-start gap-2">
            <Icon icon="mdi:alert" className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-amber-300 text-sm">{t('config.database.importWarning')}</p>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Icon icon="mdi:translate" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t('config.language.title')}</h3>
            <p className="text-slate-400 text-sm">{t('config.language.description')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => {
              changeLanguage('en');
              window.dispatchEvent(new Event('localeChanged'));
              setTimeout(() => window.location.reload(), 100);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              locale === 'en'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="flag:us-4x3" className="w-7 h-5 rounded shadow-sm" />
            <span className={`font-medium ${locale === 'en' ? 'text-blue-400' : 'text-white'}`}>
              {t('config.language.english')}
            </span>
            {locale === 'en' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-blue-400 ml-auto" />
            )}
          </button>

          <button
            onClick={() => {
              changeLanguage('es');
              window.dispatchEvent(new Event('localeChanged'));
              setTimeout(() => window.location.reload(), 100);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              locale === 'es'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="flag:es-4x3" className="w-7 h-5 rounded shadow-sm" />
            <span className={`font-medium ${locale === 'es' ? 'text-blue-400' : 'text-white'}`}>
              {t('config.language.spanish')}
            </span>
            {locale === 'es' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-blue-400 ml-auto" />
            )}
          </button>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Icon icon="mdi:currency-usd" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t('config.currency.title')}</h3>
            <p className="text-slate-400 text-sm">{t('config.currency.description')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => updateSetting('currency', 'eur')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              settings.currency === 'eur'
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="mdi:currency-eur" className="w-6 h-6" />
            <span className={`font-medium ${settings.currency === 'eur' ? 'text-green-400' : 'text-white'}`}>
              {t('config.currency.eur')}
            </span>
            {settings.currency === 'eur' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400 ml-auto" />
            )}
          </button>

          <button
            onClick={() => updateSetting('currency', 'usd')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              settings.currency === 'usd'
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="mdi:currency-usd" className="w-6 h-6" />
            <span className={`font-medium ${settings.currency === 'usd' ? 'text-green-400' : 'text-white'}`}>
              {t('config.currency.usd')}
            </span>
            {settings.currency === 'usd' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400 ml-auto" />
            )}
          </button>

          <button
            onClick={() => updateSetting('currency', 'gbp')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              settings.currency === 'gbp'
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="mdi:currency-gbp" className="w-6 h-6" />
            <span className={`font-medium ${settings.currency === 'gbp' ? 'text-green-400' : 'text-white'}`}>
              {t('config.currency.gbp')}
            </span>
            {settings.currency === 'gbp' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-green-400 ml-auto" />
            )}
          </button>
        </div>
      </div>

      {/* Weight Unit */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
            <Icon icon="mdi:weight" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t('config.weightUnit.title')}</h3>
            <p className="text-slate-400 text-sm">{t('config.weightUnit.description')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => updateSetting('weightUnit', 'kg')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              settings.weightUnit !== 'lb'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="mdi:weight-kilogram" className="w-6 h-6" />
            <span className={`font-medium ${settings.weightUnit !== 'lb' ? 'text-orange-400' : 'text-white'}`}>
              {t('config.weightUnit.kg')}
            </span>
            {settings.weightUnit !== 'lb' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-orange-400 ml-auto" />
            )}
          </button>

          <button
            onClick={() => updateSetting('weightUnit', 'lb')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
              settings.weightUnit === 'lb'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
            }`}
          >
            <Icon icon="mdi:weight-pound" className="w-6 h-6" />
            <span className={`font-medium ${settings.weightUnit === 'lb' ? 'text-orange-400' : 'text-white'}`}>
              {t('config.weightUnit.lb')}
            </span>
            {settings.weightUnit === 'lb' && (
              <Icon icon="mdi:check-circle" className="w-5 h-5 text-orange-400 ml-auto" />
            )}
          </button>
        </div>
      </div>

      {/* Date Format */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Icon icon="mdi:calendar" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{t('config.dateFormat.title')}</h3>
            <p className="text-slate-400 text-sm">{t('config.dateFormat.description')}</p>
          </div>
        </div>

        <div className="relative">
          <select
            className="w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer"
            value={settings.dateFormat || 'dmySlash'}
            onChange={(e) => updateSetting('dateFormat', e.target.value)}
          >
            <option value="dmySlash">{t('config.dateFormat.dmySlash')}</option>
            <option value="mdySlash">{t('config.dateFormat.mdySlash')}</option>
            <option value="ymdDash">{t('config.dateFormat.ymdDash')}</option>
            <option value="dmyDot">{t('config.dateFormat.dmyDot')}</option>
          </select>
          <Icon icon="mdi:calendar-outline" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );

  const renderUsersContent = () => (
    <UsersList />
  );

  const renderNotificationsContent = () => (
    <div className="space-y-4">
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-8">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
            <Icon icon="mdi:bell-outline" className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">{t('config.notifications')}</h3>
          <p className="text-slate-400 text-sm max-w-md">{t('config.notificationsPlaceholder')}</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentSection) {
      case 'general':
        return renderGeneralContent();
      case 'usuarios':
        return renderUsersContent();
      case 'notificaciones':
        return renderNotificationsContent();
      default:
        return (
          <div className="text-center py-12">
            <Icon icon="mdi:alert-circle" className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300">{t('config.errors.sectionNotFound')}</h3>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-slate-900">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Section Navigation */}
        <div className="mb-6">
          <div className="flex w-full bg-slate-800/60 rounded-xl p-1 border border-slate-700/50">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  currentSection === section.id
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                }`}
              >
                <Icon icon={section.icon} className={`w-5 h-5 ${currentSection === section.id ? 'text-blue-400' : ''}`} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[60vh]">
          {renderContent()}
        </div>
      </main>

      {/* Toast notifications */}
      {toast && (
        <Toast
          toast={toast}
          onClose={hideToast}
          duration={5000}
        />
      )}
    </div>
  );
}
