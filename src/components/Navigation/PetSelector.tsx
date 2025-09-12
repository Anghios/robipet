import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { getSpeciesEmoji } from '../../utils/petUtils';

interface PetSelectorProps {
  currentPetId: string;
  currentPetName: string;
  availablePets: any[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelectPet: (petId: string) => void;
}

export default function PetSelector({
  currentPetId,
  currentPetName,
  availablePets,
  isOpen,
  onToggle,
  onClose,
  onSelectPet
}: PetSelectorProps) {
  const selectorRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={selectorRef} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all border border-slate-600"
      >
        <Icon icon="mdi:paw" className="text-blue-400" />
        <span className="font-medium">{currentPetName}</span>
        <Icon 
          icon="mdi:chevron-down" 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
          <div className="p-2">
            <div className="text-slate-300 text-xs font-medium px-3 py-2 border-b border-slate-700">
              Seleccionar mascota:
            </div>
            {availablePets.map((pet) => (
              <button
                key={pet.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('Botón clickeado para mascota:', pet.name, pet.id);
                  onSelectPet(pet.id.toString());
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-slate-700 flex items-center gap-3 ${
                  pet.id.toString() === currentPetId 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300'
                }`}
              >
                <span className="text-lg">
                  {getSpeciesEmoji(pet.species)}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{pet.name}</div>
                  <div className="text-xs opacity-75">
                    {pet.breed} • {pet.age || 'Edad no especificada'}
                  </div>
                </div>
                {pet.id.toString() === currentPetId && (
                  <Icon icon="mdi:check" className="w-4 h-4 text-blue-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}