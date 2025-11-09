import { useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface PageTitleProps {
  titleKey: string;
  fallback?: string;
}

export default function PageTitle({ titleKey, fallback = 'RobiPet' }: PageTitleProps) {
  const { t, locale, loading } = useTranslation();

  useEffect(() => {
    // Only update document title when translations are loaded
    // This prevents flashing from initial title to "RobiPet" to final title
    if (!loading) {
      const title = t(titleKey);
      if (title && title !== titleKey) {
        document.title = title;
      } else if (fallback) {
        document.title = fallback;
      }
    }
  }, [titleKey, locale, t, fallback, loading]);

  // Also listen for locale change events
  useEffect(() => {
    const handleLocaleChange = () => {
      // Small delay to ensure translations are loaded
      setTimeout(() => {
        const title = t(titleKey);
        if (title && title !== titleKey) {
          document.title = title;
        } else if (fallback) {
          document.title = fallback;
        }
      }, 50);
    };

    window.addEventListener('localeChanged', handleLocaleChange);
    return () => window.removeEventListener('localeChanged', handleLocaleChange);
  }, [titleKey, t, fallback]);

  return null; // This component doesn't render anything
}
