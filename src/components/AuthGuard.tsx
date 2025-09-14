import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Footer from './Footer';
import { useTranslation } from '../hooks/useTranslation';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Hacer la verificación de auth inmediatamente sin delay
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);

          // Verificar que el usuario aún existe en la base de datos
          try {
            const response = await fetch('/api/verify-session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId: parsedUser.id })
            });

            if (response.ok) {
              const result = await response.json();
              if (result.valid) {
                setUser(parsedUser);
                setIsAuthenticated(true);
              } else {
                // Usuario no existe en la DB, limpiar sesión
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                setUser(null);
              }
            } else {
              // Error de servidor, limpiar sesión por seguridad
              localStorage.removeItem('user');
              setIsAuthenticated(false);
              setUser(null);
            }
          } catch (verifyError) {
            // Error de red, mantener sesión local pero marcar para re-verificación
            setUser(parsedUser);
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        // Muy pequeño delay para evitar flashing pero mantener suavidad
        setTimeout(() => setIsLoading(false), 150);
      }
    };

    checkAuth();

    // Verificar sesión periódicamente cada 30 segundos
    const intervalId = setInterval(async () => {
      const userData = localStorage.getItem('user');
      if (userData && isAuthenticated) {
        try {
          const parsedUser = JSON.parse(userData);
          const response = await fetch('/api/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: parsedUser.id })
          });

          if (response.ok) {
            const result = await response.json();
            if (!result.valid) {
              // Usuario no existe en la DB, cerrar sesión
              localStorage.removeItem('user');
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        } catch (error) {
          // Error de red, no cerrar sesión automáticamente
          console.warn('Error verificando sesión:', error);
        }
      }
    }, 30000); // 30 segundos

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-primary">
        {/* Skeleton Navigation */}
        <nav className="bg-dark-card shadow-lg border-b border-dark-hover">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
                  <div className="ml-3 h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 w-16 bg-gray-700 rounded animate-pulse my-6"></div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>

        {/* Skeleton Content */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-8 p-8 bg-gray-800 rounded-2xl animate-pulse">
            <div className="h-10 w-64 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 w-96 bg-gray-700 rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
                <div className="h-4 w-3/4 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-gray-700 rounded"></div>
                  <div className="h-3 w-5/6 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <>{children}</>;
}

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await onLogin(username, password);
    
    if (!success) {
      setError(t('auth.invalidCredentials'));
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 overflow-hidden shadow-lg">
                <img src="/logo.png" alt="Robipet Logo" className="w-16 h-16 object-contain" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">{t('auth.welcome')}</h1>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-8 p-4 bg-red-500/20 backdrop-blur border border-red-400/30 rounded-xl">
                <p className="text-red-200 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="mdi:account-outline" className="w-6 h-6 text-white/50" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-white/50 text-lg"
                    placeholder={t('auth.userPlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="mdi:lock-outline" className="w-6 h-6 text-white/50" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-5 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-white/50 text-lg"
                    placeholder={t('auth.passwordPlaceholder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    {t('auth.loggingIn')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="mdi:login" className="w-5 h-5" />
                    {t('auth.loginButton')}
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}