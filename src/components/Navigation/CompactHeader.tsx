import { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface Pet {
  id: number;
  name: string;
  species?: string;
  breed?: string;
  photo_url?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface CompactHeaderProps {
  currentPet?: Pet | null;
  availablePets: Pet[];
  onPetChange: (petId: string) => void;
  onSearchOpen?: () => void;
}

export default function CompactHeader({
  currentPet,
  availablePets,
  onPetChange,
  onSearchOpen
}: CompactHeaderProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPetDropdown(false);
      }
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

  const getPetInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getPetGradient = (name: string) => {
    const colors = [
      'from-rose-500 to-pink-600',
      'from-violet-500 to-purple-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-red-500 to-rose-600'
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo + Pet Selector */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Robipet" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-lg font-semibold text-white hidden sm:block">Robipet</span>
            </a>

            {/* Divider */}
            {currentPet && (
              <div className="h-6 w-px bg-slate-700 mx-1" />
            )}

            {/* Pet Selector */}
            {currentPet && availablePets.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowPetDropdown(!showPetDropdown)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {currentPet.photo_url ? (
                    <img
                      src={currentPet.photo_url}
                      alt={currentPet.name}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-700"
                    />
                  ) : (
                    <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getPetGradient(currentPet.name)} flex items-center justify-center ring-2 ring-slate-700`}>
                      <span className="text-white text-xs font-bold">{getPetInitial(currentPet.name)}</span>
                    </div>
                  )}
                  <span className="text-white font-medium text-sm max-w-[100px] truncate">
                    {currentPet.name}
                  </span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`w-4 h-4 text-slate-400 transition-transform ${showPetDropdown ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Pet Dropdown */}
                {showPetDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-50">
                    <div className="p-2 border-b border-slate-700">
                      <span className="text-xs text-slate-500 uppercase tracking-wider px-2">
                        {t('header.switchPet')}
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                      {availablePets.map((pet) => (
                        <button
                          key={pet.id}
                          onClick={() => {
                            onPetChange(pet.id.toString());
                            setShowPetDropdown(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                            pet.id === currentPet?.id
                              ? 'bg-blue-600/20 text-blue-400'
                              : 'text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {pet.photo_url ? (
                            <img
                              src={pet.photo_url}
                              alt={pet.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getPetGradient(pet.name)} flex items-center justify-center`}>
                              <span className="text-white text-sm font-bold">{getPetInitial(pet.name)}</span>
                            </div>
                          )}
                          <div className="flex-1 text-left">
                            <p className="font-medium">{pet.name}</p>
                            {pet.breed && (
                              <p className="text-xs text-slate-500">{pet.breed}</p>
                            )}
                          </div>
                          {pet.id === currentPet?.id && (
                            <Icon icon="mdi:check" className="w-4 h-4 text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-700">
                      <a
                        href="/pets"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <Icon icon="mdi:plus" className="w-4 h-4" />
                        {t('header.managePets')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Search Button */}
            {onSearchOpen && (
              <button
                onClick={onSearchOpen}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={t('header.search')}
              >
                <Icon icon="mdi:magnify" className="w-5 h-5" />
              </button>
            )}

            {/* Quick Links */}
            <a
              href="/pets"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:flex"
              title={t('navigation.pets')}
            >
              <Icon icon="mdi:paw" className="w-5 h-5" />
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
