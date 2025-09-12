import { useRef } from 'react';
import { Icon } from '@iconify/react';
import type { Pet, NewPet } from '../../types/Pet';
import { getSpeciesEmoji } from './helpers.ts';
import { useTranslation } from '../../hooks/useTranslation';

interface PetFormProps {
  mode: 'create' | 'edit';
  pet: NewPet | Pet;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (updates: Partial<NewPet> | Partial<Pet>) => void;
  onCancel?: () => void;
  onImageUpload: (file: File) => void;
  uploadingImage: boolean;
  submitting: boolean;
  error?: string | null;
}

export default function PetForm({ 
  mode, 
  pet, 
  onSubmit, 
  onChange, 
  onCancel, 
  onImageUpload,
  uploadingImage,
  submitting,
  error 
}: PetFormProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    event.target.value = '';
  };

  const isEditMode = mode === 'edit';
  const title = isEditMode ? t('petList.form.editTitle', { name: (pet as Pet).name }) : t('petList.form.addTitle');
  const icon = isEditMode ? 'mdi:pencil' : 'mdi:plus-circle';
  const buttonText = isEditMode ? t('petList.form.saveButton') : t('petList.form.createButton');
  const buttonIcon = isEditMode ? 'mdi:content-save' : 'mdi:plus';
  const loadingText = isEditMode ? t('petList.form.savingText') : t('petList.form.creatingText');
  const gradientClass = isEditMode 
    ? 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
    : 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';

  return (
    <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-8 mb-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dark-hover">
        <Icon icon={icon} className={`w-6 h-6 ${isEditMode ? 'text-blue-400' : 'text-green-400'}`} />
        <h2 className="text-xl font-bold text-dark-primary">{title}</h2>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-600/30 rounded-xl text-red-400">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:alert-circle" className="w-5 h-5" />
            {error}
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.nameRequired')}</label>
            <input
              type="text"
              value={pet.name}
              onChange={(e) => onChange({ name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('petList.form.namePlaceholder')}
            />
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.breedRequired')}</label>
            <input
              type="text"
              value={pet.breed}
              onChange={(e) => onChange({ breed: e.target.value })}
              required
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('petList.form.breedPlaceholder')}
            />
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.birthDateRequired')}</label>
            <input
              type="date"
              value={pet.birth_date}
              onChange={(e) => onChange({ birth_date: e.target.value })}
              required
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.color')}</label>
            <input
              type="text"
              value={pet.color}
              onChange={(e) => onChange({ color: e.target.value })}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('petList.form.colorPlaceholder')}
            />
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.weight')}</label>
            <input
              type="number"
              step="0.1"
              value={isEditMode ? (pet as Pet).weight_kg : (pet as NewPet).weight_kg}
              onChange={(e) => onChange({ weight_kg: isEditMode ? parseFloat(e.target.value) || 0 : e.target.value } as any)}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('petList.form.weightPlaceholder')}
            />
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.species')}</label>
            <select
              value={pet.species}
              onChange={(e) => onChange({ species: e.target.value as Pet['species'] })}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="dog">{t('petList.form.speciesDog')}</option>
              <option value="cat">{t('petList.form.speciesCat')}</option>
              <option value="bird">{t('petList.form.speciesBird')}</option>
              <option value="other">{t('petList.form.speciesOther')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.gender')}</label>
            <select
              value={pet.gender}
              onChange={(e) => onChange({ gender: e.target.value as Pet['gender'] })}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="male">{t('petList.form.genderMale')}</option>
              <option value="female">{t('petList.form.genderFemale')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.size')}</label>
            <select
              value={pet.size}
              onChange={(e) => onChange({ size: e.target.value as Pet['size'] })}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="small">{t('petList.form.sizeSmall')}</option>
              <option value="medium">{t('petList.form.sizeMedium')}</option>
              <option value="large">{t('petList.form.sizeLarge')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.neuteredQuestion')}</label>
            <select
              value={isEditMode 
                ? ((pet as Pet).neutered === true || (pet as Pet).neutered === 1 ? 'true' : 'false')
                : pet.neutered.toString()}
              onChange={(e) => onChange({ neutered: e.target.value === 'true' })}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option value="false">{t('petList.card.no')}</option>
              <option value="true">{t('petList.card.yes')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.chip')}</label>
            <input
              type="text"
              value={pet.microchip || ''}
              onChange={(e) => onChange({ microchip: e.target.value })}
              className="w-full px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder={t('petList.form.chipPlaceholder')}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-dark-primary font-medium mb-2 text-sm">{t('petList.form.image')}</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={pet.photo_url || ''}
                onChange={(e) => onChange({ photo_url: e.target.value })}
                placeholder={t('petList.form.imageUrlPlaceholder')}
                className="flex-1 px-4 py-3 bg-dark-card border border-dark-hover rounded-xl text-dark-primary placeholder:text-dark-secondary focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageInputChange}
                className="hidden"
                disabled={uploadingImage}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title={t('petList.form.uploadImageTitle')}
              >
                {uploadingImage ? (
                  <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon icon="mdi:camera" className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button 
            type="submit" 
            disabled={submitting} 
            className={`px-6 py-3 bg-gradient-to-r ${gradientClass} text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {submitting ? (
              <>
                <Icon icon="mdi:loading" className="w-5 h-5 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                <Icon icon={buttonIcon} className="w-5 h-5" />
                {buttonText}
              </>
            )}
          </button>
          {isEditMode && onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Icon icon="mdi:close" className="w-5 h-5" />
              {t('petList.form.cancelButton')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}