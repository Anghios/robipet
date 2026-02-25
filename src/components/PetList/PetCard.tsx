import { Icon } from '@iconify/react';
import type { Pet } from '../../types/Pet';
import { calculateAgeWithTranslation, getSpeciesEmoji, getSizeText, calculateDogYears } from './helpers.ts';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
  onView: (petId: number) => void;
}

export default function PetCard({ pet, onEdit, onDelete, onView }: PetCardProps) {
  const { t } = useTranslation();
  const { getWeightUnitLabel, formatWeight } = useSettings();
  const dogYears = pet.species === 'dog' ? calculateDogYears(pet.birth_date) : null;

  return (
    <div
      onClick={() => onView(pet.id)}
      className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-200 cursor-pointer group"
    >
      {/* Layout horizontal principal */}
      <div className="flex items-start gap-4">
        {/* Foto */}
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all">
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
            className={`flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl ${pet.photo_url ? 'hidden' : 'flex'}`}
          >
            {getSpeciesEmoji(pet.species)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Nombre y badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
              {pet.name}
            </h3>
            <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
              pet.gender === 'male'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-pink-500/20 text-pink-400'
            }`}>
              {pet.gender === 'male' ? t('petList.card.male') : t('petList.card.female')}
            </span>
            {pet.neutered ? (
              <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/20 text-green-400">
                {t('petList.card.neutered')}
              </span>
            ) : null}
          </div>

          {/* Raza */}
          <p className="text-slate-400 text-sm mb-2">{pet.breed}</p>

          {/* Grid de información */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:calendar" className="w-3.5 h-3.5 text-orange-400" />
              {calculateAgeWithTranslation(pet.birth_date, t)}
            </span>
            {pet.species === 'dog' && dogYears !== null && (
              <span className="flex items-center gap-1">
                <Icon icon="ph:dog-fill" className="w-3.5 h-3.5 text-cyan-400" />
                {dogYears} {t('petList.card.humanYears')}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Icon icon="mdi:weight" className="w-3.5 h-3.5 text-teal-400" />
              {formatWeight(pet.weight_kg)} {getWeightUnitLabel()}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon="mdi:ruler" className="w-3.5 h-3.5 text-purple-400" />
              {getSizeText(pet.size, t)}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon="mdi:palette" className="w-3.5 h-3.5 text-pink-400" />
              {pet.color}
            </span>
            {pet.microchip && (
              <span className="flex items-center gap-1">
                <Icon icon="mdi:chip" className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[10px] text-slate-500">{pet.microchip}</span>
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(pet);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
            title={t('petList.card.editTitle')}
          >
            <Icon icon="mdi:pencil" className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(pet);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title={t('petList.card.deleteTitle')}
          >
            <Icon icon="mdi:delete" className="w-5 h-5" />
          </button>
          <Icon icon="mdi:chevron-right" className="w-5 h-5 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}
