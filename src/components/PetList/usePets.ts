import { useState, useCallback } from 'react';
import type { Pet, NewPet } from '../../types/Pet';
import type { ToastData } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';

// Helper para obtener headers de autenticación con JWT (fuera del hook)
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export default function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImageEdit, setUploadingImageEdit] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const { t } = useTranslation();

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    const id = Date.now();
    setToast({ message, type, id });
  }, []);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pets', {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error(t('toast.pet.loadError'));
      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('toast.pet.unknownError'));
    } finally {
      setLoading(false);
    }
  }, []);

  const createPet = useCallback(async (newPet: NewPet) => {
    if (!newPet.name.trim() || !newPet.birth_date) {
      showToast(t('petList.helpers.validation.nameRequired'), 'error');
      return false;
    }

    try {
      setCreating(true);
      
      const petData = {
        ...newPet,
        weight_kg: parseFloat(newPet.weight_kg) || 0
      };
      
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast(t('petList.helpers.validation.petCreatedSuccess'), 'success');
        return true;
      } else {
        showToast(result.message || t('petList.helpers.validation.petCreatedError'), 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('petList.helpers.validation.petCreatedError'), 'error');
      return false;
    } finally {
      setCreating(false);
    }
  }, [fetchPets, showToast]);

  const updatePet = useCallback(async (pet: Pet) => {
    if (!pet.name.trim() || !pet.birth_date) {
      showToast(t('petList.helpers.validation.nameRequired'), 'error');
      return false;
    }

    try {
      setUpdating(true);
      
      const petData = {
        ...pet,
        weight_kg: parseFloat(pet.weight_kg.toString()) || 0
      };
      
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast(t('petList.helpers.validation.petUpdatedSuccess'), 'success');
        return true;
      } else {
        showToast(result.message || t('petList.helpers.validation.petUpdatedError'), 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('petList.helpers.validation.petUpdatedError'), 'error');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [fetchPets, showToast]);

  const deletePet = useCallback(async (pet: Pet) => {
    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast(t('petList.helpers.validation.petDeletedSuccess').replace('{name}', pet.name), 'success');
        return true;
      } else {
        showToast(result.message || t('petList.helpers.validation.petDeletedError'), 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('petList.helpers.validation.petDeletedError'), 'error');
      return false;
    }
  }, [fetchPets, showToast]);

  const uploadImage = useCallback(async (file: File, isEditing: boolean = false): Promise<string | null> => {
    if (!file) return null;
    
    if (!file.type.startsWith('image/')) {
      showToast(t('petList.helpers.validation.invalidImageFile'), 'error');
      return null;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast(t('petList.helpers.validation.imageTooLarge'), 'error');
      return null;
    }
    
    try {
      if (isEditing) {
        setUploadingImageEdit(true);
      } else {
        setUploadingImage(true);
      }
      
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(t('petList.helpers.validation.imageUploadError'));
      }
      
      const result = await response.json();
      
      if (result.success) {
        const imageUrl = result.url || result.imageUrl;
        showToast(t('petList.helpers.validation.imageUploadSuccess'), 'success');
        return imageUrl;
      } else {
        throw new Error(result.message || t('petList.helpers.validation.imageUploadError'));
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : t('petList.helpers.validation.imageUploadError'), 'error');
      return null;
    } finally {
      if (isEditing) {
        setUploadingImageEdit(false);
      } else {
        setUploadingImage(false);
      }
    }
  }, [showToast]);

  return {
    pets,
    loading,
    error,
    creating,
    updating,
    uploadingImage,
    uploadingImageEdit,
    toast,
    setToast,
    setError,
    fetchPets,
    createPet,
    updatePet,
    deletePet,
    uploadImage,
    showToast
  };
}