interface ModalHandlers {
  openDeleteVaccineModal: (vaccine: any) => void;
  openCompleteVaccineModal: (vaccine: any) => void;
  openDeleteWeightModal: (weightRecord: any) => void;
  openDeleteMedicationModal: (medication: any) => void;
  openCompleteMedicationModal: (medication: any) => void;
  openDeleteDewormingModal: (deworming: any) => void;
  openCompleteDewormingModal: (deworming: any) => void;
  openDeleteMedicalReviewModal: (review: any) => void;
  openDeleteDocumentModal: (document: any) => void;
}

export function useModalHandlers(modals: ModalHandlers) {
  const handleMarkVaccineCompleted = async (vaccine: any) => {
    modals.openCompleteVaccineModal(vaccine);
  };

  const handleDeleteMedicalReview = async (review: any) => {
    modals.openDeleteMedicalReviewModal(review);
  };

  const handleDeleteVaccine = async (vaccine: any) => {
    modals.openDeleteVaccineModal(vaccine);
  };

  const handleDeleteDeworming = async (deworming: any) => {
    modals.openDeleteDewormingModal(deworming);
  };

  const handleMarkDewormingCompleted = async (deworming: any) => {
    modals.openCompleteDewormingModal(deworming);
  };

  const handleDeleteWeight = async (weightRecord: any) => {
    modals.openDeleteWeightModal(weightRecord);
  };

  const handleDeleteMedication = async (medication: any) => {
    modals.openDeleteMedicationModal(medication);
  };

  const handleMarkMedicationCompleted = async (medication: any) => {
    modals.openCompleteMedicationModal(medication);
  };

  const handleDeleteDocument = async (document: any) => {
    modals.openDeleteDocumentModal(document);
  };

  return {
    handleMarkVaccineCompleted,
    handleDeleteMedicalReview,
    handleDeleteVaccine,
    handleDeleteDeworming,
    handleMarkDewormingCompleted,
    handleDeleteWeight,
    handleDeleteMedication,
    handleMarkMedicationCompleted,
    handleDeleteDocument
  };
}