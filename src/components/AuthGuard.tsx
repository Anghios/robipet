import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Footer from './Footer';
import SharedHeader from './Navigation/SharedHeader';
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
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);

          // Verificar que el token sigue siendo válido
          try {
            const response = await fetch('/api/verify-session', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              }
            });

            if (response.ok) {
              const result = await response.json();
              if (result.valid) {
                setUser(parsedUser);
                setIsAuthenticated(true);
              } else {
                // Token inválido, limpiar sesión
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
                setIsAuthenticated(false);
                setUser(null);
              }
            } else {
              // Error de servidor o token inválido, limpiar sesión
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
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
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (token && userData && isAuthenticated) {
        try {
          const response = await fetch('/api/verify-session', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (!result.valid) {
              // Token expirado o inválido, cerrar sesión
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            // Token inválido, cerrar sesión
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            setUser(null);
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

      if (result.success && result.token) {
        // Guardar token JWT y datos del usuario
        localStorage.setItem('authToken', result.token);
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
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900" />;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <>
      <SharedHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}

interface LoginFormProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const ANIMAL_POOL = ['🐶','🐱','🐰','🐦','🐹','🐸','🦊','🐧','🐢','🦉','🐠','🦜','🐿️','🦎','🐴','🐍','🐨','🦩','🐙','🦋','🐬','🦔','🐳','🦁','🐝','🦀','🐺','🦈','🐞','🦒'];
const ANIMAL_SIZES = ['text-lg', 'text-xl', 'text-2xl'];

function spawnAnimal(index: number) {
  // Pick a zone around the card: 0=left, 1=right, 2=top, 3=bottom
  const zone = Math.floor(Math.random() * 4);
  let x: number, y: number;
  switch (zone) {
    case 0: x = 3 + Math.random() * 24;  y = 8 + Math.random() * 70;  break; // left
    case 1: x = 73 + Math.random() * 23; y = 8 + Math.random() * 70;  break; // right
    case 2: x = 8 + Math.random() * 82;  y = 3 + Math.random() * 16;  break; // top
    default: x = 8 + Math.random() * 82; y = 74 + Math.random() * 10; break; // bottom
  }
  return {
    emoji: ANIMAL_POOL[index % ANIMAL_POOL.length],
    x: `${x}%`,
    y: `${y}%`,
    size: ANIMAL_SIZES[Math.floor(Math.random() * ANIMAL_SIZES.length)],
    dur: `${2 + Math.random() * 1.5}s`,
    delay: `-${Math.random() * 2}s`,
  };
}

function LoginForm({ onLogin }: LoginFormProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [animals, setAnimals] = useState<Array<ReturnType<typeof spawnAnimal>>>([]);

  useEffect(() => {
    const count = username.length + password.length;
    setAnimals(current => {
      if (count > current.length) {
        const additions = [];
        for (let i = current.length; i < count; i++) {
          additions.push(spawnAnimal(i));
        }
        return [...current, ...additions];
      }
      if (count < current.length) {
        return current.slice(0, count);
      }
      return current;
    });
  }, [username, password]);

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
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      {/* Background animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          {/* Logo + Brand */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-5">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl animate-[pulse_4s_ease-in-out_infinite]" />
              <div className="relative flex items-center justify-center w-20 h-20 bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/10">
                <img src="/logo.png" alt="Robipet Logo" className="w-14 h-14 object-contain" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('auth.welcome')}</h1>
          </div>

          {/* Card */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-xl shadow-black/20">
              {/* Error message */}
              {error && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
                  <Icon icon="mdi:alert-circle" className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon icon="mdi:account-outline" className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder-slate-600"
                      placeholder={t('auth.userPlaceholder')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon icon="mdi:lock-outline" className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all placeholder-slate-600"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/25 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span>{t('auth.loggingIn')}</span>
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

      {/* Floating animals - randomly positioned, appear as you type */}
      <div className="absolute inset-0 bottom-20 pointer-events-none z-20 overflow-hidden">
        {animals.map((animal, i) => (
          <div
            key={`${i}-${animal.x}-${animal.y}`}
            className={['absolute', animal.size].join(' ')}
            style={{ left: animal.x, top: animal.y }}
          >
            <span className="inline-block animate-bounce" style={{ animationDuration: animal.dur, animationDelay: animal.delay }}>
              {animal.emoji}
            </span>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}