import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Pet } from '../../types/Pet';
import { calculateAgeWithTranslation, getSpeciesEmoji } from './helpers.ts';
import { useTranslation } from '../../hooks/useTranslation';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
  onView: (petId: number) => void;
}

export default function PetCard({ pet, onEdit, onDelete, onView }: PetCardProps) {
  const { t } = useTranslation();
  // Add shake animation CSS once
  useEffect(() => {
    if (!document.getElementById('shake-animation')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'shake-animation';
      styleElement.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) rotate(-1deg); }
          20%, 40%, 60%, 80% { transform: translateX(2px) rotate(1deg); }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  return (
    <div className="bg-dark-secondary border border-dark-hover rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 group">
      {/* Header con foto y nombre */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
          {pet.photo_url ? (
            <img 
              src={pet.photo_url} 
              alt={pet.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.removeAttribute('style');
              }}
            />
          ) : null}
          <div 
            className={`flex items-center justify-center w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 text-2xl ${pet.photo_url ? 'hidden' : 'flex'}`}
          >
            {getSpeciesEmoji(pet.species)}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-dark-primary group-hover:text-blue-400 transition-colors">
            {pet.name}
          </h3>
          <p className="text-dark-secondary text-sm">{pet.breed}</p>
        </div>
      </div>
      
      {/* Información */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary text-sm flex items-center gap-2">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-orange-400" />
            {t('petList.card.age')}
          </span>
          <span className="text-dark-primary font-medium text-sm">{calculateAgeWithTranslation(pet.birth_date, t)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary text-sm flex items-center gap-2">
            <Icon icon="mdi:palette" className="w-4 h-4 text-pink-400" />
            {t('petList.card.color')}
          </span>
          <span className="text-dark-primary font-medium text-sm">{pet.color}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary text-sm flex items-center gap-2">
            <Icon icon="mdi:weight" className="w-4 h-4 text-teal-400" />
            {t('petList.card.weight')}
          </span>
          <span className="text-dark-primary font-medium text-sm">{pet.weight_kg} kg</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary text-sm flex items-center gap-2">
            <Icon icon="mdi:gender-male-female" className="w-4 h-4 text-indigo-400" />
            {t('petList.card.gender')}
          </span>
          <span className="text-dark-primary font-medium text-sm">
            {pet.gender === 'male' ? t('petList.card.male') : t('petList.card.female')}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-dark-secondary text-sm flex items-center gap-2">
            <Icon icon="mdi:medical-bag" className="w-4 h-4 text-purple-400" />
            {t('petList.card.neutered')}
          </span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            pet.neutered 
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            <Icon 
              icon={pet.neutered ? 'mdi:check' : 'mdi:close'} 
              className="w-3 h-3" 
            />
            {pet.neutered ? t('petList.card.yes') : t('petList.card.no')}
          </div>
        </div>
        
        {pet.microchip && (
          <div className="flex items-center justify-between">
            <span className="text-dark-secondary text-sm flex items-center gap-2">
              <Icon icon="mdi:chip" className="w-4 h-4 text-cyan-400" />
              {t('petList.card.chip')}
            </span>
            <span className="text-dark-primary font-mono text-xs bg-dark-card px-2 py-1 rounded border border-dark-hover">
              {pet.microchip}
            </span>
          </div>
        )}
      </div>
      
      {/* Botones */}
      <div className="flex gap-2">
        <button 
          onClick={() => onView(pet.id)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-3 sm:px-4 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
          title={t('petList.card.viewTitle')}
        >
          <Icon icon="mdi:eye" className="w-4 h-4" />
          <span className="hidden sm:inline">{t('petList.card.viewButton')}</span>
        </button>
        <button 
          onClick={() => onEdit(pet)}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 px-3 sm:px-4 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
          title={t('petList.card.editTitle')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4" />
          <span className="hidden sm:inline">{t('petList.card.editButton')}</span>
        </button>
        <button 
          onClick={() => onDelete(pet)}
          className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-2 px-3 sm:px-4 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1"
          title={t('petList.card.deleteTitle')}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = 'shake 0.5s ease-in-out infinite';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animation = 'none';
          }}
        >
          <Icon icon="mdi:delete" className="w-4 h-4" />
          <span className="hidden sm:inline">{t('petList.card.deleteButton')}</span>
        </button>
      </div>
    </div>
  );
}