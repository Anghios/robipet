import { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import Toast from './Visuals/Toast';
import ConfirmationModal from './Visuals/ConfirmationModal';
import DogSkeleton from './Visuals/DogSkeleton';
import TabContent from './TabContent/TabContent';
import NoPetsState from './ErrorStates/NoPetsState';
import GenericErrorState from './ErrorStates/GenericErrorState';
import NotFoundState from './ErrorStates/NotFoundState';
import PetHeader from './PetHeader/PetHeader';
import TabNavigationComponent from './TabNavigation/TabNavigation';
import { useToast } from '../hooks/useToast';
import { petApi } from '../services/petApi';

type TabType = 'info' | 'medical_reviews' | 'vaccines' | 'weight' | 'medication' | 'deworming' | 'documents';
import { useConfirmationModals } from '../hooks/useConfirmationModals';
import { usePetData } from '../hooks/usePetData';
import { useVaccineForm } from '../hooks/useVaccineForm';
import { useMedicationForm } from '../hooks/useMedicationForm';
import { useDewormingForm } from '../hooks/useDewormingForm';
import { useMedicalReviewForm } from '../hooks/useMedicalReviewForm';
import { useWeightForm } from '../hooks/useWeightForm';
import { useDocumentsForm } from '../hooks/useDocumentsForm';
import { useConfirmationActions } from '../hooks/useConfirmationActions';
import { useModalHandlers } from '../hooks/useModalHandlers';
import { getModalProps } from '../utils/modalConfigs';
import { getSizeText, getVaccineStatusColor, getVaccineStatusBadgeData } from '../utils/petUtils';
import '../styles/dogPortfolio.css';


export default function DogPortfolio() {
  const { t } = useTranslation();
  
  // Hook para notificaciones toast
  const { toast, showToast, hideToast } = useToast();
  
  // Hook para modales de confirmación
  const {
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
    openDeleteDocumentModal
  } = useConfirmationModals();

  // Hook para datos de mascotas
  const {
    portfolio,
    availablePets,
    loading,
    error,
    fetchDogPortfolio,
    getCurrentPetId,
    getCurrentWeight,
    getPendingCount,
    selectPet
  } = usePetData();
  
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [showPetSelector, setShowPetSelector] = useState(false);
  
  // Hook para gestión de vacunas
  const {
    showVaccineForm,
    editingVaccine,
    vaccineForm,
    savingVaccine,
    setVaccineForm,
    handleAddVaccine,
    handleEditVaccine,
    handleSaveVaccine,
    cancelVaccineForm
  } = useVaccineForm(
    getCurrentPetId, 
    (message: string) => showToast(message, 'success'), 
    (message: string) => showToast(message, 'error'), 
    fetchDogPortfolio
  );

  // Hook para gestión de medicamentos
  const {
    showMedicationForm,
    editingMedication,
    medicationForm,
    savingMedication,
    setMedicationForm,
    handleAddMedication,
    handleEditMedication,
    handleSaveMedication,
    cancelMedicationForm
  } = useMedicationForm(
    getCurrentPetId, 
    (message: string) => showToast(message, 'success'), 
    (message: string) => showToast(message, 'error'), 
    fetchDogPortfolio
  );

  // Hook para gestión de desparasitaciones
  const {
    showDewormingForm,
    editingDeworming,
    dewormingForm,
    savingDeworming,
    setDewormingForm,
    handleAddDeworming,
    handleEditDeworming,
    handleSaveDeworming,
    cancelDewormingForm
  } = useDewormingForm(
    getCurrentPetId, 
    (message: string) => showToast(message, 'success'), 
    (message: string) => showToast(message, 'error'), 
    fetchDogPortfolio
  );

  // Hook para gestión de revisiones médicas
  const {
    showMedicalReviewForm,
    editingMedicalReview,
    medicalReviewForm,
    savingMedicalReview,
    setMedicalReviewForm,
    handleAddMedicalReview,
    handleEditMedicalReview,
    handleSaveMedicalReview,
    cancelMedicalReviewForm
  } = useMedicalReviewForm(
    getCurrentPetId, 
    (message: string) => showToast(message, 'success'), 
    (message: string) => showToast(message, 'error'), 
    fetchDogPortfolio
  );

  // Hook para gestión de peso
  const {
    showWeightForm,
    editingWeight,
    weightForm,
    savingWeight,
    setWeightForm,
    handleAddWeight,
    handleEditWeight,
    handleSaveWeight,
    cancelWeightForm
  } = useWeightForm(
    getCurrentPetId, 
    (message: string) => showToast(message, 'success'), 
    (message: string) => showToast(message, 'error'), 
    fetchDogPortfolio
  );

  // Hook para gestión de documentos
  const {
    showDocumentsForm,
    editingDocument,
    documentsForm,
    savingDocument,
    setDocumentsForm,
    handleAddDocument,
    handleEditDocument,
    handleSaveDocument,
    cancelDocumentsForm
  } = useDocumentsForm(
    getCurrentPetId, 
    (message: string) => showToast(message, 'success'), 
    (message: string) => showToast(message, 'error'), 
    fetchDogPortfolio
  );

  // Hook para acciones de confirmación
  const confirmActions = useConfirmationActions(
    getCurrentPetId,
    fetchDogPortfolio,
    showToast,
    closeModal,
    activeModal
  );

  // Hook para manejadores de modales
  const modalHandlers = useModalHandlers({
    openDeleteVaccineModal,
    openCompleteVaccineModal,
    openDeleteWeightModal,
    openDeleteMedicationModal,
    openCompleteMedicationModal,
    openDeleteDewormingModal,
    openCompleteDewormingModal,
    openDeleteMedicalReviewModal,
    openDeleteDocumentModal
  });

  
  // useEffect eliminado - usePetData maneja la carga de datos

  // Cerrar selector al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPetSelector) {
        const target = event.target as Element;
        const petSelectorContainer = target.closest('.pet-selector-container');
        
        // Solo cerrar si el clic no es dentro del selector
        if (!petSelectorContainer) {
          setShowPetSelector(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPetSelector]);



  const handlePetChange = (petId: string) => {
    console.log('CLICK DETECTADO - Cambiando a mascota ID:', petId);
    
    try {
      setShowPetSelector(false);
      selectPet(petId);
    } catch (error) {
      console.error('Error en handlePetChange:', error);
    }
  };




  const getVaccineStatusBadge = (status: string) => {
    const badgeData = getVaccineStatusBadgeData(status);
    return (
      <span className={badgeData.className}>
        {badgeData.text}
      </span>
    );
  };

  // getSizeText y getNeuteredText movidas a utils/petUtils.ts

  // Extraer manejadores de modales del hook
  const {
    handleMarkVaccineCompleted,
    handleDeleteMedicalReview,
    handleDeleteVaccine,
    handleDeleteDeworming,
    handleMarkDewormingCompleted,
    handleDeleteWeight,
    handleDeleteMedication,
    handleMarkMedicationCompleted
  } = modalHandlers;



  // Extraer datos del portfolio y configurar medications
  const { dog_info, vaccines, weight_history } = portfolio || { dog_info: null, vaccines: [], weight_history: [] };
  
  
  // Extraer datos médicos del portfolio (ahora vienen desde el servidor)
  const medications = portfolio?.medications || [];
  const dewormings = portfolio?.dewormings || [];
  const medicalReviews = portfolio?.medical_reviews || [];
  const documents = portfolio?.documents || [];

  // Los datos médicos ya vienen incluidos en el portfolio desde el servidor
  
  // Calcular conteos de elementos pendientes
  const pendingVaccines = getPendingCount(vaccines, 'vaccines');
  const pendingMedications = getPendingCount(medications, 'medications');
  const pendingDewormings = getPendingCount(dewormings, 'dewormings');
  

  // Estados de carga y error
  if (loading) return <DogSkeleton />;
  if (error === 'no_pets') return <NoPetsState />;
  if (error === 'not_found') return <NotFoundState />;
  if (error) return <GenericErrorState error={error} />;
  if (!portfolio) return <NoPetsState />;

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      
      {/* Layout principal con sidebar */}
      <div className="flex gap-8 max-lg:flex-col">
        {/* Sidebar izquierdo */}
        <aside className="lg:w-64 lg:flex-shrink-0 max-lg:flex max-lg:flex-col">
          <PetHeader
            variant="sidebar"
            dog_info={dog_info}
            availablePets={availablePets}
            getCurrentPetId={getCurrentPetId}
            showPetSelector={showPetSelector}
            setShowPetSelector={setShowPetSelector}
            onPetChange={handlePetChange}
          />

          <TabNavigationComponent
            variant="sidebar"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingVaccines={pendingVaccines}
            pendingMedications={pendingMedications}
            pendingDewormings={pendingDewormings}
            t={t}
          />
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 min-w-0">
          <PetHeader
            variant="mobile"
            dog_info={dog_info}
            availablePets={availablePets}
            getCurrentPetId={getCurrentPetId}
            showPetSelector={showPetSelector}
            setShowPetSelector={setShowPetSelector}
            onPetChange={handlePetChange}
          />

          <TabNavigationComponent
            variant="mobile"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            pendingVaccines={pendingVaccines}
            pendingMedications={pendingMedications}
            pendingDewormings={pendingDewormings}
            t={t}
          />

          {/* Contenido de las pestañas */}
          <TabContent
            activeTab={activeTab}
            portfolio={portfolio}
            getCurrentWeight={getCurrentWeight}
            getPendingCount={getPendingCount}
            getVaccineStatusBadge={getVaccineStatusBadge}
            getVaccineStatusColor={getVaccineStatusColor}
            getSizeText={getSizeText}
            showMedicalReviewForm={showMedicalReviewForm}
            editingMedicalReview={editingMedicalReview}
            medicalReviewForm={medicalReviewForm}
            savingMedicalReview={savingMedicalReview}
            setMedicalReviewForm={setMedicalReviewForm}
            handleAddMedicalReview={handleAddMedicalReview}
            handleEditMedicalReview={handleEditMedicalReview}
            handleSaveMedicalReview={handleSaveMedicalReview}
            cancelMedicalReviewForm={cancelMedicalReviewForm}
            handleDeleteMedicalReview={handleDeleteMedicalReview}
            showVaccineForm={showVaccineForm}
            editingVaccine={editingVaccine}
            vaccineForm={vaccineForm}
            savingVaccine={savingVaccine}
            setVaccineForm={setVaccineForm}
            handleAddVaccine={handleAddVaccine}
            handleEditVaccine={handleEditVaccine}
            handleSaveVaccine={handleSaveVaccine}
            cancelVaccineForm={cancelVaccineForm}
            handleMarkVaccineCompleted={handleMarkVaccineCompleted}
            handleDeleteVaccine={handleDeleteVaccine}
            showDewormingForm={showDewormingForm}
            editingDeworming={editingDeworming}
            dewormingForm={dewormingForm}
            savingDeworming={savingDeworming}
            setDewormingForm={setDewormingForm}
            handleAddDeworming={handleAddDeworming}
            handleEditDeworming={handleEditDeworming}
            handleSaveDeworming={handleSaveDeworming}
            cancelDewormingForm={cancelDewormingForm}
            handleMarkDewormingCompleted={handleMarkDewormingCompleted}
            handleDeleteDeworming={handleDeleteDeworming}
            showWeightForm={showWeightForm}
            editingWeight={editingWeight}
            weightForm={weightForm}
            savingWeight={savingWeight}
            setWeightForm={setWeightForm}
            handleAddWeight={handleAddWeight}
            handleEditWeight={handleEditWeight}
            handleSaveWeight={handleSaveWeight}
            cancelWeightForm={cancelWeightForm}
            handleDeleteWeight={handleDeleteWeight}
            showMedicationForm={showMedicationForm}
            editingMedication={editingMedication}
            medicationForm={medicationForm}
            savingMedication={savingMedication}
            setMedicationForm={setMedicationForm}
            handleAddMedication={handleAddMedication}
            handleEditMedication={handleEditMedication}
            handleSaveMedication={handleSaveMedication}
            cancelMedicationForm={cancelMedicationForm}
            handleMarkMedicationCompleted={handleMarkMedicationCompleted}
            handleDeleteMedication={handleDeleteMedication}
            showDocumentsForm={showDocumentsForm}
            editingDocument={editingDocument}
            documentsForm={documentsForm}
            savingDocument={savingDocument}
            setDocumentsForm={setDocumentsForm}
            handleAddDocument={handleAddDocument}
            handleEditDocument={handleEditDocument}
            handleSaveDocument={handleSaveDocument}
            cancelDocumentsForm={cancelDocumentsForm}
            handleDeleteDocument={modalHandlers.handleDeleteDocument}
          />

      {/* Modal de Confirmación */}
      {activeModal && (() => {
        const modalProps = getModalProps(activeModal, confirmActions, t);
        if (!modalProps) return null;
        
        return (
          <ConfirmationModal
            isOpen={activeModal.isOpen}
            onClose={closeModal}
            onConfirm={modalProps.onConfirm}
            title={modalProps.title}
            message={modalProps.message}
            confirmText={modalProps.confirmText}
            confirmColor={modalProps.confirmColor}
            icon={modalProps.icon}
          />
        );
      })()}
      
      {/* Componente Toast */}
      {toast && (
        <Toast
          toast={toast}
          onClose={hideToast}
        />
      )}
        </main>
      </div>
    </div>
  );
}