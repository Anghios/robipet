import { useState, useCallback } from 'react';

export type ModalType = 
  | 'deleteVaccine'
  | 'completeVaccine'
  | 'deleteWeight'
  | 'deleteMedication'
  | 'completeMedication'
  | 'deleteDeworming'
  | 'completeDeworming'
  | 'deleteMedicalReview'
  | 'deleteDocumentFile'
  | 'deleteSelectedFile'
  | 'deleteDocument';

export interface ConfirmationModalData {
  type: ModalType;
  item: any;
  isOpen: boolean;
}

export function useConfirmationModals() {
  const [activeModal, setActiveModal] = useState<ConfirmationModalData | null>(null);

  const openModal = useCallback((type: ModalType, item: any) => {
    setActiveModal({
      type,
      item,
      isOpen: true
    });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Funciones específicas para cada tipo de modal
  const openDeleteVaccineModal = useCallback((vaccine: any) => {
    openModal('deleteVaccine', vaccine);
  }, [openModal]);

  const openCompleteVaccineModal = useCallback((vaccine: any) => {
    openModal('completeVaccine', vaccine);
  }, [openModal]);

  const openDeleteWeightModal = useCallback((weight: any) => {
    openModal('deleteWeight', weight);
  }, [openModal]);

  const openDeleteMedicationModal = useCallback((medication: any) => {
    openModal('deleteMedication', medication);
  }, [openModal]);

  const openCompleteMedicationModal = useCallback((medication: any) => {
    openModal('completeMedication', medication);
  }, [openModal]);

  const openDeleteDewormingModal = useCallback((deworming: any) => {
    openModal('deleteDeworming', deworming);
  }, [openModal]);

  const openCompleteDewormingModal = useCallback((deworming: any) => {
    openModal('completeDeworming', deworming);
  }, [openModal]);

  const openDeleteMedicalReviewModal = useCallback((medicalReview: any) => {
    openModal('deleteMedicalReview', medicalReview);
  }, [openModal]);

  const openDeleteDocumentFileModal = useCallback((file: any) => {
    openModal('deleteDocumentFile', file);
  }, [openModal]);

  const openDeleteSelectedFileModal = useCallback((file: any) => {
    openModal('deleteSelectedFile', file);
  }, [openModal]);

  const openDeleteDocumentModal = useCallback((document: any) => {
    openModal('deleteDocument', document);
  }, [openModal]);

  return {
    activeModal,
    closeModal,
    openDeleteVaccineModal,
    openCompleteVaccineModal,
    openDeleteWeightModal,
    openDeleteMedicationModal,
    openCompleteMedicationModal,
    openDeleteDewormingModal,
    openCompleteDewormingModal,
    openDeleteMedicalReviewModal,
    openDeleteDocumentFileModal,
    openDeleteSelectedFileModal,
    openDeleteDocumentModal
  };
}