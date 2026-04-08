import { useCallback } from 'react';
import { addWeightRecord } from '../utils/petUtils';

// Helper para obtener headers de autenticación con JWT
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export function useConfirmationActions(
  getCurrentPetId: () => string,
  fetchDogPortfolio: () => void,
  showToast: (message: string, type: 'success' | 'error') => void,
  closeModal: () => void,
  activeModal: any,
  t?: (key: string) => string
) {
  const confirmDeleteVaccine = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteVaccine') return;
    const vaccineToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      const response = await fetch(`/api/pets/${petId}/vaccines/${vaccineToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast(t ? t('toast.vaccine.deleteSuccess') : 'Vaccine deleted successfully', 'success');
      } else {
        showToast(result.message || (t ? t('toast.vaccine.deleteError') : 'Error deleting vaccine'), 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.vaccine.deleteError') : 'Error deleting vaccine'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmCompleteVaccine = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeVaccine') return;
    const vaccineToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`/api/pets/${petId}/vaccines/${vaccineToComplete.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
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
        showToast(t ? t('toast.vaccine.completeSuccess') : 'Vaccine marked as completed', 'success');
      } else {
        showToast(result.message || (t ? t('toast.vaccine.completeError') : 'Error marking vaccine as completed'), 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.vaccine.completeError') : 'Error marking vaccine as completed'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmDeleteMedicalReview = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteMedicalReview') return;
    const medicalReviewToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();

      const response = await fetch(`/api/pets/${petId}/medical-reviews/${medicalReviewToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();

      if (result.success) {
        await fetchDogPortfolio();
        showToast(t ? t('toast.medicalReview.deleteSuccess') : 'Medical review deleted successfully', 'success');
      } else {
        showToast(result.message || (t ? t('toast.medicalReview.deleteError') : 'Error deleting medical review'), 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.medicalReview.deleteError') : 'Error deleting medical review'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmCompleteMedicalReview = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeMedicalReview') return;
    const reviewToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();

      const response = await fetch(`/api/pets/${petId}/medical-reviews/${reviewToComplete.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...reviewToComplete,
          status: 'completed',
          visit_date: reviewToComplete.visit_date || new Date().toISOString().split('T')[0]
        })
      });

      const result = await response.json();

      if (result.success) {
        showToast(t ? t('toast.medicalReview.completeSuccess') : 'Medical review marked as completed', 'success');
        fetchDogPortfolio();
      } else {
        throw new Error(result.message || (t ? t('toast.medicalReview.completeError') : 'Error updating medical review'));
      }

    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.medicalReview.completeError') : 'Error marking medical review as completed'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmDeleteDeworming = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteDeworming') return;
    const dewormingToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`/api/pets/${petId}/dewormings/${dewormingToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchDogPortfolio();
        showToast(t ? t('toast.deworming.deleteSuccess') : 'Deworming deleted successfully', 'success');
        console.log('Desparasitación eliminada:', dewormingToDelete.product_name);
      } else {
        showToast(result.message || (t ? t('toast.deworming.deleteError') : 'Error deleting deworming'), 'error');
      }

    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.deworming.deleteError') : 'Error deleting deworming'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmCompleteDeworming = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeDeworming') return;
    const dewormingToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`/api/pets/${petId}/dewormings/${dewormingToComplete.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
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
        
        showToast(t ? t('toast.deworming.completeSuccess') : 'Deworming marked as applied', 'success');
        fetchDogPortfolio();
      } else {
        throw new Error(result.message || (t ? t('toast.deworming.completeError') : 'Error updating deworming'));
      }

    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.deworming.completeError') : 'Error marking deworming as applied'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmDeleteWeight = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteWeight') return;
    const weightToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      const response = await fetch(`/api/pets/${petId}/weight/${weightToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast(t ? t('toast.weight.deleteSuccess') : 'Weight deleted successfully', 'success');
      } else {
        showToast(result.message || (t ? t('toast.weight.deleteError') : 'Error deleting weight'), 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.weight.deleteError') : 'Error deleting weight'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmDeleteMedication = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteMedication') return;
    const medicationToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`/api/pets/${petId}/medications/${medicationToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchDogPortfolio();
        showToast(t ? t('toast.medication.deleteSuccess') : 'Medication deleted successfully', 'success');
        console.log('Medicamento eliminado:', medicationToDelete.medication_name);
      } else {
        showToast(result.message || (t ? t('toast.medication.deleteError') : 'Error deleting medication'), 'error');
      }

    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.medication.deleteError') : 'Error deleting medication'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmCompleteMedication = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'completeMedication') return;
    const medicationToComplete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      
      const response = await fetch(`/api/pets/${petId}/medications/${medicationToComplete.id}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });

      const result = await response.json();
      
      if (result.success) {
        showToast(t ? t('toast.medication.completeSuccess') : 'Medication marked as completed', 'success');
        fetchDogPortfolio();
      } else {
        throw new Error(result.message || (t ? t('toast.medication.completeError') : 'Error updating medication'));
      }

    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.medication.completeError') : 'Error marking medication as completed'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

  const confirmDeleteDocument = useCallback(async () => {
    if (!activeModal || activeModal.type !== 'deleteDocument') return;
    const documentToDelete = activeModal.item;

    try {
      const petId = getCurrentPetId();
      const response = await fetch(`/api/pets/${petId}/documents/${documentToDelete.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const result = await response.json();
      
      if (result.success) {
        fetchDogPortfolio();
        showToast(t ? t('toast.document.deleteSuccess') : 'Document deleted successfully', 'success');
      } else {
        showToast(result.message || (t ? t('toast.document.deleteError') : 'Error deleting document'), 'error');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : (t ? t('toast.document.deleteError') : 'Error deleting document'), 'error');
    } finally {
      closeModal();
    }
  }, [activeModal, getCurrentPetId, fetchDogPortfolio, showToast, closeModal, t]);

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
    confirmCompleteMedicalReview,
    confirmDeleteDocument,
    confirmDeleteDocumentFile,
    confirmDeleteSelectedFile
  };
}