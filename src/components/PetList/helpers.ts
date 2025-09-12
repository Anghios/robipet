import type { Pet, NewPet } from '../../types/Pet';

export const calculateAge = (birthDate: string): string => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  
  if (years > 0) {
    return `${years} año${years > 1 ? 's' : ''}`;
  } else {
    return `${months} mes${months > 1 ? 'es' : ''}`;
  }
};

export const calculateAgeWithTranslation = (birthDate: string, t: any): string => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  const remainingDaysAfterYears = diffDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);
  const days = remainingDaysAfterYears % 30;
  
  if (years > 0) {
    // Show years and months for pets over 1 year
    const yearText = years > 1 ? t('petList.helpers.age.years') : t('petList.helpers.age.year');
    if (months > 0) {
      const monthText = months > 1 ? t('petList.helpers.age.months') : t('petList.helpers.age.month');
      return `${years} ${yearText}, ${months} ${monthText}`;
    } else {
      return `${years} ${yearText}`;
    }
  } else {
    // Show months and days for pets under 1 year
    const parts = [];
    if (months > 0) {
      const monthText = months > 1 ? t('petList.helpers.age.months') : t('petList.helpers.age.month');
      parts.push(`${months} ${monthText}`);
    }
    if (days > 0) {
      const dayText = days > 1 ? t('petList.helpers.age.days') : t('petList.helpers.age.day');
      parts.push(`${days} ${dayText}`);
    }
    return parts.length > 0 ? parts.join(', ') : '0 days';
  }
};

export const getSpeciesEmoji = (species: Pet['species']): string => {
  switch (species) {
    case 'dog': return '🐕';
    case 'cat': return '🐱';
    case 'bird': return '🐦';
    default: return '🐾';
  }
};

export const getSizeText = (size: Pet['size']): string => {
  switch (size) {
    case 'small': return 'Pequeño';
    case 'medium': return 'Mediano';
    case 'large': return 'Grande';
    default: return 'Mediano';
  }
};

export const validatePetData = (pet: NewPet | Pet): { isValid: boolean; error?: string } => {
  if (!pet.name.trim()) {
    return { isValid: false, error: 'El nombre es requerido' };
  }
  
  if (!pet.breed.trim()) {
    return { isValid: false, error: 'La raza es requerida' };
  }
  
  if (!pet.birth_date) {
    return { isValid: false, error: 'La fecha de nacimiento es requerida' };
  }
  
  return { isValid: true };
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Por favor selecciona un archivo de imagen válido' };
  }
  
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'La imagen no puede superar los 5MB' };
  }
  
  return { isValid: true };
};