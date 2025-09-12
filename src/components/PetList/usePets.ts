import { useState, useCallback } from 'react';
import type { Pet, NewPet } from '../../types/Pet';
import type { ToastData } from '../../hooks/useToast';

export default function usePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImageEdit, setUploadingImageEdit] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'error') => {
    const id = Date.now();
    setToast({ message, type, id });
  }, []);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pets');
      if (!response.ok) throw new Error('Error al cargar mascotas');
      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPet = useCallback(async (newPet: NewPet) => {
    if (!newPet.name.trim() || !newPet.breed.trim() || !newPet.birth_date) {
      showToast('Nombre, raza y fecha de nacimiento son requeridos', 'error');
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast('Mascota creada exitosamente', 'success');
        return true;
      } else {
        showToast(result.message || 'Error al crear mascota', 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al crear mascota', 'error');
      return false;
    } finally {
      setCreating(false);
    }
  }, [fetchPets, showToast]);

  const updatePet = useCallback(async (pet: Pet) => {
    if (!pet.name.trim() || !pet.breed.trim() || !pet.birth_date) {
      showToast('Nombre, raza y fecha de nacimiento son requeridos', 'error');
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast('Mascota actualizada exitosamente', 'success');
        return true;
      } else {
        showToast(result.message || 'Error al actualizar mascota', 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar mascota', 'error');
      return false;
    } finally {
      setUpdating(false);
    }
  }, [fetchPets, showToast]);

  const deletePet = useCallback(async (pet: Pet) => {
    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast(`${pet.name} eliminado exitosamente`, 'success');
        return true;
      } else {
        showToast(result.message || 'Error al eliminar mascota', 'error');
        return false;
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar mascota', 'error');
      return false;
    }
  }, [fetchPets, showToast]);

  const uploadImage = useCallback(async (file: File, isEditing: boolean = false): Promise<string | null> => {
    if (!file) return null;
    
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido', 'error');
      return null;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no puede superar los 5MB', 'error');
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
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const result = await response.json();
      
      if (result.success) {
        const imageUrl = result.url || result.imageUrl;
        showToast('Imagen subida exitosamente', 'success');
        return imageUrl;
      } else {
        throw new Error(result.message || 'Error al subir la imagen');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al subir la imagen', 'error');
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