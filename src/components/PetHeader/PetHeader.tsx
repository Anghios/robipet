import { Icon } from '@iconify/react';
import { getSpeciesEmoji } from '../../utils/petUtils';
import { useTranslation } from '../../hooks/useTranslation';

interface Pet {
  id: number;
  name: string;
  breed: string;
  species: string;
  photo_url?: string;
}

interface DogInfo {
  name?: string;
  breed?: string;
  species?: string;
  photo_url?: string;
  age_years?: number;
  dog_years?: number;
}

interface PetHeaderProps {
  dog_info: DogInfo | null;
  availablePets: Pet[];
  getCurrentPetId: () => string;
  showPetSelector: boolean;
  setShowPetSelector: (show: boolean) => void;
  onPetChange: (petId: string) => void;
  variant: 'sidebar' | 'mobile';
}

export default function PetHeader({
  dog_info,
  availablePets,
  getCurrentPetId,
  showPetSelector,
  setShowPetSelector,
  onPetChange,
  variant
}: PetHeaderProps) {
  const { t } = useTranslation();
  const isSidebar = variant === 'sidebar';
  const isMobile = variant === 'mobile';

  const petSelectorContent = availablePets.length > 1 && (
    <div className={`${isSidebar ? 'mt-4' : 'mt-6'} relative pet-selector-container ${isSidebar ? 'max-lg:hidden' : ''}`}>
      <button
        onClick={() => setShowPetSelector(!showPetSelector)}
        className="w-full bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
      >
        <Icon icon="mdi:swap-horizontal" className="w-7 h-7 mr-2" /> {t('petHeader.changePet')}
      </button>
      
      {showPetSelector && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
          <div className="p-2">
            <div className="text-slate-300 text-xs font-medium px-3 py-2 border-b border-slate-700">
              {t('petHeader.selectPet')}
            </div>
            {availablePets.map((pet) => (
              <button
                key={pet.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPetChange(pet.id.toString());
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-slate-700 flex items-center gap-3 ${
                  pet.id.toString() === getCurrentPetId() 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  {pet.photo_url ? (
                    <img 
                      src={pet.photo_url} 
                      alt={pet.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-slate-600 flex items-center justify-center text-lg ${pet.photo_url ? 'hidden' : 'flex'}`}
                    style={{display: pet.photo_url ? 'none' : 'flex'}}
                  >
                    {getSpeciesEmoji(pet.species)}
                  </div>
                </div>
                <div>
                  <div className="font-medium">{pet.name}</div>
                  <div className="text-xs opacity-75">{pet.breed}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isSidebar) {
    return (
      <div className="mb-6 p-6 bg-gradient-dark rounded-2xl shadow-xl lg:mb-8 max-lg:order-1 max-lg:hidden">
        <div className="flex items-center gap-4 max-lg:justify-center">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full shadow-lg overflow-hidden flex-shrink-0">
            {dog_info?.photo_url ? (
              <img 
                src={dog_info.photo_url} 
                alt={dog_info.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full bg-white/20 flex items-center justify-center text-3xl lg:text-4xl ${dog_info?.photo_url ? 'hidden' : 'flex'}`}
              style={{display: dog_info?.photo_url ? 'none' : 'flex'}}
            >
              {getSpeciesEmoji(dog_info?.species)}
            </div>
          </div>
          <div className="text-white max-lg:hidden">
            <h1 className="text-2xl font-bold mb-1">{dog_info?.name || t('petHeader.loading')}</h1>
            <p className="text-sm opacity-90">{dog_info?.breed || t('petHeader.loading')}</p>
            <div className="flex flex-col gap-1 mt-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs text-center font-medium">
                {dog_info?.age_years || 0} {t('petHeader.yearsOld')}
              </span>
              {dog_info?.species === 'dog' && (
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs text-center font-medium">
                  {dog_info?.dog_years || 0} {t('petHeader.dogYears')}
                </span>
              )}
            </div>
          </div>
        </div>
        {petSelectorContent}
      </div>
    );
  }

  if (isMobile) {
    return (
      <header className="mb-8 p-8 bg-gradient-dark rounded-3xl shadow-2xl lg:hidden">
        <div className="flex items-center gap-8 max-md:flex-col max-md:text-center">
          <div className="w-32 h-32 rounded-full shadow-lg overflow-hidden">
            {dog_info?.photo_url ? (
              <img 
                src={dog_info.photo_url} 
                alt={dog_info.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-full h-full bg-white/20 flex items-center justify-center text-6xl ${dog_info?.photo_url ? 'hidden' : 'flex'}`}
              style={{display: dog_info?.photo_url ? 'none' : 'flex'}}
            >
              {getSpeciesEmoji(dog_info?.species)}
            </div>
          </div>
          <div className="flex-1 text-white">
            <h1 className="text-4xl font-bold mb-2">{dog_info?.name || t('petHeader.loading')}</h1>
            <p className="text-xl opacity-90 mb-4">{dog_info?.breed || t('petHeader.loading')}</p>
            <div className="flex gap-4 max-md:justify-center">
              <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                {dog_info?.age_years || 0} {t('petHeader.yearsOld')}
              </span>
              {dog_info?.species === 'dog' && (
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm">
                  {dog_info?.dog_years || 0} {t('petHeader.dogYears')}
                </span>
              )}
            </div>
          </div>
        </div>
        {petSelectorContent}
      </header>
    );
  }

  return null;
}