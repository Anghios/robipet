import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import PetCard from './PetList/PetCard.tsx';
import PetForm from './PetList/PetForm.tsx';
import DeleteModal from './PetList/DeleteModal.tsx';
import Toast from './Visuals/Toast.tsx';
import PetsSkeleton from './PetList/PetsSkeleton.tsx';
import PetsHeader from './PetList/PetsHeader.tsx';
import EmptyState from './PetList/EmptyState.tsx';
import { useToast } from '../hooks/useToast.ts';
import { usePetListData } from '../hooks/usePetListData.ts';
import { useTranslation } from '../hooks/useTranslation.ts';
import type { Pet, NewPet } from '../types/Pet';

export default function PetsList() {
  const { t } = useTranslation();
  const { toast, showToast, hideToast } = useToast();
  
  const {
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
  } = usePetListData(showToast);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  if (loading) return <PetsSkeleton />;

  return (
    <div className="min-h-screen p-6">
      <PetsHeader />

      {/* Botón para mostrar/ocultar formulario */}
      <div className="mb-8">
        <button
          onClick={() => setShowNewPetForm(!showNewPetForm)}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
            showNewPetForm
              ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
          }`}
        >
          <Icon 
            icon={showNewPetForm ? 'mdi:close' : 'mdi:plus'} 
            className="w-5 h-5" 
          />
          {showNewPetForm ? t('petList.main.cancelButton') : t('petList.main.newPetButton')}
        </button>
      </div>

      {/* Formulario de nueva mascota */}
      {showNewPetForm && (
        <PetForm
          mode="create"
          pet={newPet}
          onSubmit={handleCreatePet}
          onChange={(updates) => setNewPet({...newPet, ...updates} as NewPet)}
          onImageUpload={(file) => handleImageUpload(file, false)}
          uploadingImage={uploadingImage}
          submitting={creating}
          error={error}
        />
      )}

      {/* Formulario de edición */}
      {editingPet && (
        <PetForm
          mode="edit"
          pet={editingPet}
          onSubmit={handleUpdatePet}
          onChange={(updates) => setEditingPet({...editingPet!, ...updates} as Pet)}
          onCancel={handleCancelEdit}
          onImageUpload={(file) => handleImageUpload(file, true)}
          uploadingImage={uploadingImageEdit}
          submitting={updating}
        />
      )}

      {/* Lista de mascotas */}
      <div className="bg-gradient-card rounded-2xl shadow-xl border border-dark-hover p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Icon icon="mdi:heart" className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-dark-primary">
              {t('petList.main.title', { count: pets.length })}
            </h2>
          </div>
        </div>
        
        {pets.length === 0 ? (
          <EmptyState onAddPet={() => setShowNewPetForm(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={handleEditPet}
                onDelete={handleDeletePetClick}
                onView={handleViewPet}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && petToDelete && (
        <DeleteModal
          pet={petToDelete}
          onConfirm={confirmDeletePet}
          onCancel={handleCancelDelete}
          isDeleting={deleting}
        />
      )}

      {/* Toast de notificaciones */}
      {toast && (
        <Toast
          toast={toast}
          onClose={hideToast}
        />
      )}
    </div>
  );
}