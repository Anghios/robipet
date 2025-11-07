import { Icon } from '@iconify/react';
import UsersList from './UsersList';
import ConfigSidebar from './ConfigContent/ConfigSidebar.tsx';
import ConfigSkeleton from './ConfigContent/ConfigSkeleton.tsx';
import SectionHeader from './ConfigContent/SectionHeader.tsx';
import Toast from './Visuals/Toast';
import { useTranslation } from '../hooks/useTranslation';
import { useConfigNavigation } from '../hooks/useConfigNavigation.ts';
import { useToast } from '../hooks/useToast';

export default function ConfigContent() {
  const { t, locale, changeLanguage, loading } = useTranslation();
  const { currentSection, handleSectionChange } = useConfigNavigation();
  const { toast, showToast, hideToast } = useToast();

  const renderContent = () => {
    if (currentSection === 'general') {
      return (
        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          <SectionHeader icon="mdi:cog" title={t('config.general')} />

          {/* Database Management */}
          <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Icon icon="mdi:database" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-primary">{t('config.database.title')}</h3>
                <p className="text-dark-secondary text-sm">
                  {t('config.database.description')}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={async () => {
                  try {
                    // Obtener usuario autenticado
                    const userData = localStorage.getItem('user');
                    if (!userData) {
                      showToast(t('config.database.exportError') + ': No authenticated user', 'error');
                      return;
                    }
                    const user = JSON.parse(userData);

                    const response = await fetch(`/api/export_database?userId=${user.id}`, {
                      method: 'GET',
                      headers: {
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

                    // Mostrar toast de éxito
                    showToast(t('config.database.exportSuccess'), 'success');
                  } catch (error) {
                    console.error('Error exportando base de datos:', error);
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    showToast(
                      `${t('config.database.exportError')}: ${errorMessage}`,
                      'error'
                    );
                  }
                }}
                className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-100"
              >
                <Icon icon="mdi:download" className="w-6 h-6 group-hover:animate-pulse" />
                <span className="font-semibold">{t('config.database.exportButton')}</span>
              </button>

              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.sqlite';
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;

                    // Obtener token de autenticación
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

                      // Si la respuesta es exitosa (2xx), consideramos que la importación fue exitosa
                      // independientemente del contenido de la respuesta
                      if (response.ok) {
                        showToast(t('config.database.importSuccess'), 'success');
                        setTimeout(() => {
                          window.location.reload();
                        }, 2000);
                        return;
                      }

                      // Solo si hay un error, intentamos obtener más detalles
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
                      showToast(
                        `${t('config.database.importError')}: ${errorMessage}`,
                        'error'
                      );
                    }
                  };
                  input.click();
                }}
                className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-100"
              >
                <Icon icon="mdi:upload" className="w-6 h-6 group-hover:animate-pulse" />
                <span className="font-semibold">{t('config.database.importButton')}</span>
              </button>
            </div>

            <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 mt-4">
              <div className="flex items-start gap-3">
                <Icon icon="mdi:alert" className="w-5 h-5 text-amber-400 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-300 text-sm">
                    {t('config.database.importWarning')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Idioma */}
          <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                <Icon icon="mdi:translate" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-primary">{t('config.language.title')}</h3>
                <p className="text-dark-secondary text-sm">
                  {t('config.language.description')}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => {
                    changeLanguage('en');
                    window.dispatchEvent(new Event('localeChanged'));
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className={`group flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all duration-200 font-medium hover:shadow-lg ${
                    locale === 'en'
                      ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500/30 shadow-lg'
                      : 'border-dark-hover bg-dark-secondary hover:border-blue-400/50 hover:bg-dark-card'
                  }`}
                >
                  <div className="relative">
                    <Icon icon="flag:us-4x3" className="w-8 h-8 rounded-lg shadow-md" />
                    {locale === 'en' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:check" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-dark-primary text-lg">{t('config.language.english')}</div>
                  </div>
                  <Icon 
                    icon="mdi:chevron-right" 
                    className={`w-5 h-5 transition-transform duration-200 ${
                      locale === 'en' ? 'text-blue-400' : 'text-dark-secondary group-hover:text-dark-accent'
                    }`} 
                  />
                </button>
                
                <button
                  onClick={() => {
                    changeLanguage('es');
                    window.dispatchEvent(new Event('localeChanged'));
                    setTimeout(() => window.location.reload(), 100);
                  }}
                  className={`group flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all duration-200 font-medium hover:shadow-lg ${
                    locale === 'es'
                      ? 'border-blue-500 bg-blue-900/20 ring-2 ring-blue-500/30 shadow-lg'
                      : 'border-dark-hover bg-dark-secondary hover:border-blue-400/50 hover:bg-dark-card'
                  }`}
                >
                  <div className="relative">
                    <Icon icon="flag:es-4x3" className="w-8 h-8 rounded-lg shadow-md" />
                    {locale === 'es' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon icon="mdi:check" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-dark-primary text-lg">{t('config.language.spanish')}</div>
                  </div>
                  <Icon 
                    icon="mdi:chevron-right" 
                    className={`w-5 h-5 transition-transform duration-200 ${
                      locale === 'es' ? 'text-blue-400' : 'text-dark-secondary group-hover:text-dark-accent'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Icon icon="mdi:information" className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-300 text-sm">
                      {t('config.language.reloadMessage')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Moneda */}
          <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <Icon icon="mdi:currency-usd" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-primary">{t('config.currency.title')}</h3>
                <p className="text-dark-secondary text-sm">
                  {t('config.currency.description')}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <select
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                defaultValue="eur"
                disabled
              >
                <option value="eur">{t('config.currency.eur')}</option>
                <option value="usd">{t('config.currency.usd')}</option>
              </select>
              <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary pointer-events-none" />
              <Icon icon="mdi:currency-eur" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>

          {/* Formato de Fecha */}
          <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-4 lg:p-8">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Icon icon="mdi:calendar" className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-dark-primary">{t('config.dateFormat.title')}</h3>
                <p className="text-dark-secondary text-sm">
                  {t('config.dateFormat.description')}
                </p>
              </div>
            </div>
            
            <div className="relative">
              <select
                className="w-full pl-12 pr-4 py-3 border border-dark-hover rounded-xl bg-dark-card text-dark-primary focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                defaultValue="dmySlash"
                disabled
              >
                <option value="dmySlash">{t('config.dateFormat.dmySlash')}</option>
                <option value="mdySlash">{t('config.dateFormat.mdySlash')}</option>
                <option value="ymdDash">{t('config.dateFormat.ymdDash')}</option>
                <option value="dmyDot">{t('config.dateFormat.dmyDot')}</option>
              </select>
              <Icon icon="mdi:chevron-down" className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary pointer-events-none" />
              <Icon icon="mdi:calendar-outline" className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-secondary" />
            </div>
          </div>
        </div>
      );
    }

    if (currentSection === 'usuarios') {
      return (
        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          <SectionHeader icon="mdi:account-group" title={t('config.users')} />
          <UsersList />
        </div>
      );
    }

    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold text-dark-primary mb-6">{t('config.errors.sectionNotFound')}</h2>
        <div className="p-4 bg-yellow-900 rounded-lg">
          <p className="text-yellow-200">
            {t('config.errors.debugMessage', { section: currentSection })}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <ConfigSkeleton />;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <ConfigSidebar
          currentSection={currentSection}
          onSectionChange={handleSectionChange}
        />

        {/* Content Area */}
        <div className="flex-1 bg-dark-card rounded-2xl shadow-xl border border-dark overflow-hidden">
          {renderContent()}
        </div>
      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast
          toast={toast}
          onClose={hideToast}
          duration={5000}
        />
      )}
    </>
  );
}