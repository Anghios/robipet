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

export const getSizeText = (size: Pet['size'], t: any): string => {
  switch (size) {
    case 'small': return t('petList.helpers.size.small');
    case 'medium': return t('petList.helpers.size.medium');
    case 'large': return t('petList.helpers.size.large');
    default: return t('petList.helpers.size.medium');
  }
};

export const calculateDogYears = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const ageInYears = totalDays / 365.25;

  let dogYears = 0;
  if (ageInYears >= 1) {
    // More than 1 year: first year = 15 dog years, then 4 per year
    const yearsAfterFirst = ageInYears - 1;
    dogYears = 15 + (yearsAfterFirst * 4);
  } else {
    // Less than 1 year: proportional to first year
    dogYears = ageInYears * 15;
  }

  return Math.round(dogYears * 10) / 10;
};

export const calculateCatYears = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const ageInYears = totalDays / 365.25;

  let catYears = 0;
  if (ageInYears >= 2) {
    // More than 2 years: first year = 15, second year = +9, then 4 per year
    catYears = 24 + (ageInYears - 2) * 4;
  } else if (ageInYears >= 1) {
    // Between 1 and 2 years: first year = 15, second year proportional to 9
    catYears = 15 + (ageInYears - 1) * 9;
  } else {
    // Less than 1 year: proportional to first year
    catYears = ageInYears * 15;
  }

  return Math.round(catYears * 10) / 10;
};

export const calculateHumanYears = (birthDate: string, species: string): number | null => {
  if (species === 'dog') return calculateDogYears(birthDate);
  if (species === 'cat') return calculateCatYears(birthDate);
  return null;
};

export const validatePetData = (pet: NewPet | Pet, t?: (key: string) => string): { isValid: boolean; error?: string } => {
  if (!pet.name.trim()) {
    return { isValid: false, error: t ? t('petList.helpers.validation.nameRequired') : 'Name is required' };
  }

  if (!pet.birth_date) {
    return { isValid: false, error: t ? t('petList.helpers.validation.birthDateRequired') : 'Birth date is required' };
  }

  return { isValid: true };
};

export const validateImageFile = (file: File, t?: (key: string) => string): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: t ? t('petList.helpers.validation.invalidImageFile') : 'Please select a valid image file' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: t ? t('petList.helpers.validation.imageTooLarge') : 'Image cannot exceed 5MB' };
  }

  return { isValid: true };
};