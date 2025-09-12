import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../hooks/useTranslation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AuthenticatedNavigation() {
  const { t, loading } = useTranslation();
  const [currentPath, setCurrentPath] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    
    // Cargar usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload(); // Recargar para activar el AuthGuard
  };

  // Mostrar un indicador de carga mientras se cargan las traducciones
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-gradient-dark shadow-2xl backdrop-blur-md border-b border-dark-hover">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full overflow-hidden">
                <img src="/logo.png" alt="Robipet Logo" className="w-8 h-8 object-contain" />
              </div>
              <span className="text-xl font-bold text-white hidden sm:block">Robipet</span>
            </div>
            <div className="animate-pulse text-white/70 text-sm">Cargando...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-dark shadow-2xl backdrop-blur-md border-b border-dark-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full overflow-hidden">
              <img src="/logo.png" alt="Robipet Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">Robipet</span>
          </div>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <a 
              href="/" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPath === '/' 
                  ? 'bg-white/20 text-white shadow-md' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon icon="mdi:home" className="w-5 h-5" />
              <span className="hidden sm:inline">{t('navigation.home')}</span>
            </a>
            
            <a 
              href="/pets" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPath === '/pets' 
                  ? 'bg-white/20 text-white shadow-md' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon icon="mdi:paw" className="w-5 h-5" />
              <span className="hidden sm:inline">{t('navigation.pets')}</span>
            </a>
            
            <a 
              href="/config" 
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPath.startsWith('/config') 
                  ? 'bg-white/20 text-white shadow-md' 
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon icon="mdi:cog" className="w-5 h-5" />
              <span className="hidden sm:inline">{t('navigation.config')}</span>
            </a>

            {/* User info and logout */}
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/20">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-white/90 text-sm">{user?.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-200' 
                    : 'bg-blue-500/20 text-blue-200'
                }`}>
                  <Icon icon={user?.role === 'admin' ? 'mdi:crown' : 'mdi:account'} className="w-4 h-4" />
                </span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200"
                title="Cerrar sesión"
              >
                <Icon icon="mdi:logout" className="w-5 h-5" />
                <span className="hidden sm:inline">{t('navigation.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}