import { useState, useEffect } from 'react';

export function useConfigNavigation() {
  const [currentSection, setCurrentSection] = useState('general');

  useEffect(() => {
    // Obtener la sección de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section') || 'general';
    setCurrentSection(section);

    // Escuchar cambios en la URL
    const handlePopState = () => {
      const newParams = new URLSearchParams(window.location.search);
      const newSection = newParams.get('section') || 'general';
      setCurrentSection(newSection);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSectionChange = (section: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('section', section);
    window.history.pushState({}, '', url);
    setCurrentSection(section);
  };

  return {
    currentSection,
    handleSectionChange
  };
}