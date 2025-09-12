import { Icon } from '@iconify/react';

// Date formatting utility
export const formatDate = (dateString: string, locale: string = 'en') => {
  if (!dateString || dateString.trim() === '') {
    return locale === 'en' ? 'Date not specified' : 'Fecha no especificada';
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return locale === 'en' ? 'Invalid date' : 'Fecha inválida';
  }
  
  const localeCode = locale === 'en' ? 'en-US' : 'es-ES';
  return date.toLocaleDateString(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Size text conversion
export const getSizeText = (size: string, t?: (key: string) => string) => {
  if (!t) {
    // Fallback for backwards compatibility
    switch (size) {
      case 'small': return 'Pequeño';
      case 'medium': return 'Mediano';
      case 'large': return 'Grande';
      case 'extra_large': return 'Extra Grande';
      default: return size;
    }
  }
  
  switch (size) {
    case 'small': return t('pets.small');
    case 'medium': return t('pets.medium');
    case 'large': return t('pets.large');
    case 'extra_large': return t('pets.large'); // Using 'large' as fallback for extra_large
    default: return size;
  }
};

// Vaccine status colors
export const getVaccineStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'border-yellow-500/50 bg-yellow-900/10';
    case 'overdue':
      return 'border-red-500/50 bg-red-900/10';
    case 'completed':
    default:
      return 'border-green-500/50 bg-green-900/10';
  }
};

// Vaccine status badge data (JSX will be created in component)
export const getVaccineStatusBadgeData = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        text: '⏳ Pendiente',
        className: 'px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/30'
      };
    case 'overdue':
      return {
        text: '⚠️ Vencida',
        className: 'px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30'
      };
    case 'completed':
    default:
      return {
        text: '✅ Aplicada',
        className: 'px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30'
      };
  }
};

// Species emoji helper
export const getSpeciesEmoji = (species?: string) => {
  switch (species) {
    case 'dog': return '🐕';
    case 'cat': return '🐱';
    case 'bird': return '🦅';
    case 'rabbit': return '🐰';
    case 'hamster': return '🐹';
    case 'fish': return '🐠';
    default: return '🐕'; // fallback por defecto
  }
};

// Gender text helper
export const getGenderText = (gender: string) => {
  return gender === 'male' ? 'Macho' : 'Hembra';
};

// Neutered text helper
export const getNeuteredText = (neutered: boolean) => {
  return neutered ? 'Sí' : 'No';
};

// Current user helper
export const getCurrentUser = (): string => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.name || user.username || 'Usuario';
    }
  } catch (e) {
    console.log('Error parsing user data:', e);
  }
  return 'Usuario';
};

// Weight record helper for deworming/medication
export const addWeightRecord = async (petId: string, weight: number, date: string, notes: string) => {
  try {
    const currentUser = getCurrentUser();

    const weightResponse = await fetch(`/api/pets/${petId}/weight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        weight_kg: weight,
        measurement_date: date,
        notes: notes,
        added_by_user: currentUser
      })
    });

    if (!weightResponse.ok) {
      console.log('Warning: No se pudo guardar el registro de peso');
    }
  } catch (weightError) {
    console.log('Error al guardar registro de peso:', weightError);
  }
};