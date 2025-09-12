import { useCallback } from 'react';
import { addWeightRecord } from '../utils/petUtils';

export function useConfirmationActions(
  getCurrentPetId: () => string,
  fetchDogPortfolio: () => void,
  showToast: (message: string, type: 'success' | 'error') => void,
  closeModal: () => void,
  activeModal: any
) {
  const confirmDeleteVaccine = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteVaccine') return;
    const vaccineToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/vaccines/${vaccineToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast('Vacuna eliminada correctamente', 'success');
      } else {
        showToast(result.message || 'Error al eliminar vacuna', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar vacuna', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmCompleteVaccine = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeVaccine') return;
    const vaccineToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/vaccines/${vaccineToComplete.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vaccine_name: vaccineToComplete.vaccine_name,
          vaccine_date: vaccineToComplete.vaccine_date,
          next_due_date: null,
          veterinarian: vaccineToComplete.veterinarian,
          notes: vaccineToComplete.notes,
          status: 'completed'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast('Vacuna marcada como completada', 'success');
      } else {
        showToast(result.message || 'Error al marcar vacuna como completada', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al marcar vacuna como completada', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmDeleteMedicalReview = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteMedicalReview') return;
    const medicalReviewToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/medical-reviews/${medicalReviewToDelete.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchDogPortfolio();
        showToast('Revisión médica eliminada correctamente', 'success');
      } else {
        showToast(result.message || 'Error al eliminar revisión médica', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar revisión médica', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmDeleteDeworming = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteDeworming') return;
    const dewormingToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/dewormings/${dewormingToDelete.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchDogPortfolio();
        showToast('Desparasitación eliminada correctamente', 'success');
        console.log('Desparasitación eliminada:', dewormingToDelete.product_name);
      } else {
        showToast(result.message || 'Error al eliminar desparasitación', 'error');
      }
      
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar desparasitación', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmCompleteDeworming = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeDeworming') return;
    const dewormingToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/dewormings/${dewormingToComplete.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      const result = await response.json();
      
      if (result.success) {
        // Si hay peso registrado para esta desparasitación, añadir registro de peso
        if (dewormingToComplete.weight_at_treatment && !isNaN(parseFloat(dewormingToComplete.weight_at_treatment))) {
          await addWeightRecord(
            petId, 
            parseFloat(dewormingToComplete.weight_at_treatment), 
            dewormingToComplete.treatment_date, 
            `Peso registrado al completar desparasitación con ${dewormingToComplete.product_name}`
          );
        }
        
        showToast('Desparasitación marcada como aplicada', 'success');
        fetchDogPortfolio();
      } else {
        throw new Error(result.message || 'Error al actualizar desparasitación');
      }
      
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al marcar desparasitación como aplicada', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmDeleteWeight = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteWeight') return;
    const weightToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/weight/${weightToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast('Peso eliminado correctamente', 'success');
      } else {
        showToast(result.message || 'Error al eliminar peso', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar peso', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmDeleteMedication = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteMedication') return;
    const medicationToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/medications/${medicationToDelete.id}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchDogPortfolio();
        showToast('Medicamento eliminado correctamente', 'success');
        console.log('Medicamento eliminado:', medicationToDelete.medication_name);
      } else {
        showToast(result.message || 'Error al eliminar medicamento', 'error');
      }
      
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar medicamento', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmCompleteMedication = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeMedication') return;
    const medicationToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/medications/${medicationToComplete.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      const result = await response.json();
      
      if (result.success) {
        showToast('Medicamento marcado como completado', 'success');
        fetchDogPortfolio();
      } else {
        throw new Error(result.message || 'Error al actualizar medicamento');
      }
      
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al marcar medicamento como completado', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmDeleteDocument = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteDocument') return;
    const documentToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      const response = await fetch(`http://localhost:8081/api/pets/${petId}/documents/${documentToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast('Documento eliminado correctamente', 'success');
      } else {
        showToast(result.message || 'Error al eliminar documento', 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar documento', 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal]);

  const confirmDeleteDocumentFile = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteDocumentFile') return;
    // Esta función se maneja desde DocumentsForm
    closeModal();
  }, [activeModal, closeModal]);

  const confirmDeleteSelectedFile = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteSelectedFile') return;
    // Esta función se maneja desde DocumentsForm
    closeModal();
  }, [activeModal, closeModal]);

  return {
    confirmDeleteVaccine,
    confirmCompleteVaccine,
    confirmDeleteWeight,
    confirmDeleteMedication,
    confirmCompleteMedication,
    confirmDeleteDeworming,
    confirmCompleteDeworming,
    confirmDeleteMedicalReview,
    confirmDeleteDocument,
    confirmDeleteDocumentFile,
    confirmDeleteSelectedFile
  };
}