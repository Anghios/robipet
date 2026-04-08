import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import PetCard from './PetList/PetCard.tsx';
import PetForm from './PetList/PetForm.tsx';
import DeleteModal from './PetList/DeleteModal.tsx';
import Toast from './Visuals/Toast.tsx';
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
  } = usePetListData(showToast, t);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <div className="flex-1 bg-slate-900">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Botón para mostrar/ocultar formulario */}
        <div className="mb-6">
          <button
            onClick={() => setShowNewPetForm(!showNewPetForm)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ${
              showNewPetForm
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
            }`}
          >
            <Icon
              icon={showNewPetForm ? 'mdi:close' : 'mdi:plus'}
              className="w-4 h-4"
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
        <div className="min-h-[60vh]">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Icon icon="mdi:paw" className="mr-3 w-7 h-7 text-emerald-400" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {t('petList.main.title', { count: pets.length })}
              </span>
            </h2>
          </div>

          {pets.length === 0 ? (
            <EmptyState onAddPet={() => setShowNewPetForm(true)} />
          ) : (
            <div className="space-y-3">
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
      </main>

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