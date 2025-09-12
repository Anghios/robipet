import { useState, useCallback } from 'react';
import type { Pet, NewPet } from '../types/Pet';
import { INITIAL_PET_STATE } from '../types/Pet';
import { validatePetData, validateImageFile } from '../components/PetList/helpers.ts';

const API_BASE_URL = 'http://localhost:8081';

export function usePetListData(showToast: (message: string, type: 'success' | 'error' | 'warning') => void) {
  // Estados principales
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingImageEdit, setUploadingImageEdit] = useState(false);

  // Estados de UI
  const [showNewPetForm, setShowNewPetForm] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [petToDelete, setPetToDelete] = useState<Pet | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newPet, setNewPet] = useState<NewPet>(INITIAL_PET_STATE);

  // Fetch pets
  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/pets`);
      if (!response.ok) throw new Error('Error al cargar mascotas');
      const data = await response.json();
      setPets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create pet
  const handleCreatePet = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePetData(newPet);
    if (!validation.isValid) {
      showToast(validation.error!, 'error');
      return;
    }

    try {
      setCreating(true);
      
      const petData = {
        ...newPet,
        weight_kg: parseFloat(newPet.weight_kg) || 0
      };
      
      const response = await fetch(`${API_BASE_URL}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNewPet(INITIAL_PET_STATE);
        await fetchPets();
        setShowNewPetForm(false);
        showToast('Mascota creada exitosamente', 'success');
      } else {
        showToast(result.message || 'Error al crear mascota', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al crear mascota', 'error');
    } finally {
      setCreating(false);
    }
  }, [newPet, showToast, fetchPets]);

  // Update pet
  const handleUpdatePet = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPet) return;
    
    const validation = validatePetData(editingPet);
    if (!validation.isValid) {
      showToast(validation.error!, 'error');
      return;
    }

    try {
      setUpdating(true);
      
      const petData = {
        ...editingPet,
        weight_kg: parseFloat(editingPet.weight_kg.toString()) || 0
      };
      
      const response = await fetch(`${API_BASE_URL}/api/pets/${editingPet.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(petData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEditingPet(null);
        await fetchPets();
        showToast('Mascota actualizada exitosamente', 'success');
      } else {
        showToast(result.message || 'Error al actualizar mascota', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar mascota', 'error');
    } finally {
      setUpdating(false);
    }
  }, [editingPet, showToast, fetchPets]);

  // Delete pet
  const confirmDeletePet = useCallback(async () => {
    if (!petToDelete) return;

    try {
      setDeleting(true);
      const response = await fetch(`${API_BASE_URL}/api/pets/${petToDelete.id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchPets();
        showToast(`${petToDelete.name} eliminado exitosamente`, 'success');
        
        if (editingPet && editingPet.id === petToDelete.id) {
          setEditingPet(null);
        }
      } else {
        showToast(result.message || 'Error al eliminar mascota', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar mascota', 'error');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setPetToDelete(null);
    }
  }, [petToDelete, editingPet, showToast, fetchPets]);

  // Upload image
  const handleImageUpload = useCallback(async (file: File, isEditing: boolean = false) => {
    if (!file) return;
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      showToast(validation.error!, 'error');
      return;
    }
    
    try {
      if (isEditing) {
        setUploadingImageEdit(true);
      } else {
        setUploadingImage(true);
      }
      
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }
      
      const result = await response.json();
      
      if (result.success) {
        const imageUrl = result.url || result.imageUrl;
        
        if (isEditing && editingPet) {
          setEditingPet({...editingPet, photo_url: imageUrl});
        } else {
          setNewPet({...newPet, photo_url: imageUrl});
        }
        
        showToast('Imagen subida exitosamente', 'success');
      } else {
        throw new Error(result.message || 'Error al subir la imagen');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al subir la imagen', 'error');
    } finally {
      if (isEditing) {
        setUploadingImageEdit(false);
      } else {
        setUploadingImage(false);
      }
    }
  }, [editingPet, newPet, showToast]);

  // UI Handlers
  const handleEditPet = useCallback((pet: Pet) => {
    setEditingPet(pet);
    setError(null);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingPet(null);
  }, []);

  const handleDeletePetClick = useCallback((pet: Pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  }, []);

  const handleViewPet = useCallback((petId: number) => {
    window.location.href = `/?pet=${petId}`;
  }, []);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setPetToDelete(null);
  }, []);

  return {
    // Estado de datos
    pets,
    loading,
    error,
    
    // Estados de operaciones
    creating,
    updating,
    deleting,
    uploadingImage,
    uploadingImageEdit,
    
    // Estados de UI
    showNewPetForm,
    editingPet,
    petToDelete,
    showDeleteModal,
    newPet,
    
    // Setters de estado
    setError,
    setShowNewPetForm,
    setNewPet,
    setEditingPet,
    
    // Funciones de API
    fetchPets,
    handleCreatePet,
    handleUpdatePet,
    confirmDeletePet,
    handleImageUpload,
    
    // Handlers de UI
    handleEditPet,
    handleCancelEdit,
    handleDeletePetClick,
    handleViewPet,
    handleCancelDelete
  };
}