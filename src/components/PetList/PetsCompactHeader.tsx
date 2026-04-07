import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PetsCompactHeader() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Robipet" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-lg font-semibold text-white hidden sm:block">Robipet</span>
            </a>

            {/* Divider */}
            <div className="h-6 w-px bg-slate-700 mx-1" />

            {/* Page Title */}
            <div className="flex items-center gap-2">
              <Icon icon="mdi:paw" className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-medium text-sm">
                {t('navigation.pets')}
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Quick Links */}
            <a
              href="/"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={t('navigation.home')}
            >
              <Icon icon="mdi:home" className="w-5 h-5" />
            </a>

            <a
              href="/config"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={t('navigation.config')}
            >
              <Icon icon="mdi:cog" className="w-5 h-5" />
            </a>

            {/* User Menu */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Icon icon="mdi:account" className="w-4 h-4 text-white" />
                </div>
                <Icon
                  icon="mdi:chevron-down"
                  className={`w-4 h-4 text-slate-400 transition-transform hidden sm:block ${showUserMenu ? 'rotate-180' : ''}`}
                />
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-1 w-48 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-50">
                  <div className="p-3 border-b border-slate-700">
                    <p className="font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <a
                      href="/config"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Icon icon="mdi:cog" className="w-4 h-4" />
                      {t('navigation.config')}
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Icon icon="mdi:logout" className="w-4 h-4" />
                      {t('navigation.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
