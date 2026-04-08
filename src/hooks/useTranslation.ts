import { useState, useEffect } from 'react';

type Locale = 'es' | 'en';
type TranslationObject = Record<string, any>;

export const useTranslation = () => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<TranslationObject>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar idioma: primero localStorage (rápido), luego BD (fuente de verdad)
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
      setLocale(savedLocale);
    }

    // Sincronizar con la BD
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('/api/settings', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(settings => {
          if (settings?.language && (settings.language === 'es' || settings.language === 'en')) {
            localStorage.setItem('locale', settings.language);
            if (settings.language !== savedLocale) {
              setLocale(settings.language as Locale);
            }
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    loadTranslations(locale);
  }, [locale]);

  const loadTranslations = async (lang: Locale) => {
    try {
      setLoading(true);

      // Get version to bust cache
      let version = Date.now();
      try {
        const versionResponse = await fetch('/version.json', { cache: 'no-store' });
        const versionData = await versionResponse.json();
        version = versionData.timestamp || Date.now();
      } catch {
        // If version.json doesn't exist, use timestamp
      }

      // Load from public folder with cache busting
      const response = await fetch(`/locales/${lang}.json?v=${version}`);
      const translations = await response.json();
      setTranslations(translations);
      setLoading(false);
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback al inglés si falla cargar el idioma
      if (lang !== 'en') {
        try {
          const response = await fetch(`/locales/en.json?v=${Date.now()}`);
          const translations = await response.json();
          setTranslations(translations);
        } catch (fallbackError) {
          console.error('Error loading fallback translations:', fallbackError);
        }
      }
      setLoading(false);
    }
  };

  // Función de traducción con soporte para claves anidadas y parámetros
  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations;

    // Navegar por el objeto anidado usando la clave con puntos
    for (const k of keys) {
      value = value?.[k];
    }

    // Si no se encuentra la traducción, devolver la clave
    // Solo mostrar warning si ya terminó de cargar (para evitar warnings durante la carga inicial)
    if (typeof value !== 'string') {
      if (!loading) {
        console.warn(`Translation not found for key: ${key}`);
      }
      return key;
    }
    
    // Reemplazar parámetros en el texto (ej: {name} -> "Max")
    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => 
          str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
        value
      );
    }
    
    return value;
  };

  // Función para cambiar idioma
  const changeLanguage = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocale(newLocale);

    // Guardar en BD
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ key: 'language', value: newLocale })
      }).catch(() => {});
    }
  };

  // Función para obtener el idioma actual
  const getCurrentLanguage = () => locale;

  return { 
    t, 
    locale, 
    changeLanguage, 
    getCurrentLanguage,
    loading,
    isSpanish: locale === 'es',
    isEnglish: locale === 'en'
  };
};