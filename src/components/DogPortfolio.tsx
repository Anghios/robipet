import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../hooks/useTranslation';
import Toast from './Visuals/Toast';
import ConfirmationModal from './Visuals/ConfirmationModal';
import Modal from './ui/Modal';
import NoPetsState from './ErrorStates/NoPetsState';
import GenericErrorState from './ErrorStates/GenericErrorState';
import NotFoundState from './ErrorStates/NotFoundState';
import SectionNav from './Navigation/SectionNav';
import type { SectionType, HealthSubSection } from './Navigation/SectionNav';
import HomeView from './Home/HomeView';
import MedicalTimeline from './Timeline/MedicalTimeline';
import { useToast } from '../hooks/useToast';
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
import { getSizeText, getVaccineStatusColor, getVaccineStatusBadgeData, formatDate } from '../utils/petUtils';
import { useSettings } from '../hooks/useSettings';

// Card & Form components
import BasicInfoCard from './DogPortfolio/BasicInfoCard';
import PhysicalDataCard from './DogPortfolio/PhysicalDataCard';
import VaccineForm from './DogPortfolio/VaccineForm';
import MedicationForm from './DogPortfolio/MedicationForm';
import DewormingForm from './DogPortfolio/DewormingForm';
import MedicalReviewForm from './DogPortfolio/MedicalReviewForm';
import WeightCard from './DogPortfolio/WeightCard';
import WeightForm from './DogPortfolio/WeightForm';
import DocumentsCard from './DogPortfolio/DocumentsCard';
import DocumentsForm from './DogPortfolio/DocumentsForm';
import NotificationBadge from './Visuals/NotificationBadge';

// Row components for lists
import VaccineRow from './Lists/VaccineRow';
import MedicationRow from './Lists/MedicationRow';
import DewormingRow from './Lists/DewormingRow';
import MedicalReviewRow from './Lists/MedicalReviewRow';

import '../styles/dogPortfolio.css';

export default function DogPortfolio() {
  const { t, locale } = useTranslation();
  const { getDateFormat } = useSettings();

  // Toast notifications
  const { toast, showToast, hideToast } = useToast();

  // Confirmation modals
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
    openCompleteMedicalReviewModal,
    openDeleteDocumentModal
  } = useConfirmationModals();

  // Pet data
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

  // Navigation state
  const [activeSection, setActiveSection] = useState<SectionType>('summary');
  const [activeHealthSub, setActiveHealthSub] = useState<HealthSubSection>('timeline');

  // Reset to summary when pet changes from SharedHeader
  useEffect(() => {
    const handlePetChanged = () => {
      setActiveSection('summary');
      setActiveHealthSub('timeline');
    };
    window.addEventListener('petChanged', handlePetChanged as EventListener);
    return () => window.removeEventListener('petChanged', handlePetChanged as EventListener);
  }, []);

  // Form hooks
  const getDocuments = () => portfolio?.documents || [];

  const {
    showVaccineForm,
    editingVaccine,
    vaccineForm,
    savingVaccine,
    linkedDocumentIds: vaccineLinkedDocIds,
    setVaccineForm,
    setLinkedDocumentIds: setVaccineLinkedDocIds,
    handleAddVaccine,
    handleEditVaccine,
    handleSaveVaccine,
    cancelVaccineForm
  } = useVaccineForm(
    getCurrentPetId,
    (message: string) => showToast(message, 'success'),
    (message: string) => showToast(message, 'error'),
    fetchDogPortfolio,
    getDocuments
  );

  const {
    showMedicationForm,
    editingMedication,
    medicationForm,
    savingMedication,
    linkedDocumentIds: medicationLinkedDocIds,
    setMedicationForm,
    setLinkedDocumentIds: setMedicationLinkedDocIds,
    handleAddMedication,
    handleEditMedication,
    handleSaveMedication,
    cancelMedicationForm
  } = useMedicationForm(
    getCurrentPetId,
    (message: string) => showToast(message, 'success'),
    (message: string) => showToast(message, 'error'),
    fetchDogPortfolio,
    getDocuments
  );

  const {
    showDewormingForm,
    editingDeworming,
    dewormingForm,
    savingDeworming,
    linkedDocumentIds: dewormingLinkedDocIds,
    setDewormingForm,
    setLinkedDocumentIds: setDewormingLinkedDocIds,
    handleAddDeworming,
    handleEditDeworming,
    handleSaveDeworming,
    cancelDewormingForm
  } = useDewormingForm(
    getCurrentPetId,
    (message: string) => showToast(message, 'success'),
    (message: string) => showToast(message, 'error'),
    fetchDogPortfolio,
    getDocuments
  );

  const {
    showMedicalReviewForm,
    editingMedicalReview,
    medicalReviewForm,
    savingMedicalReview,
    linkedDocumentIds: reviewLinkedDocIds,
    setMedicalReviewForm,
    setLinkedDocumentIds: setReviewLinkedDocIds,
    handleAddMedicalReview,
    handleEditMedicalReview,
    handleSaveMedicalReview,
    cancelMedicalReviewForm
  } = useMedicalReviewForm(
    getCurrentPetId,
    (message: string) => showToast(message, 'success'),
    (message: string) => showToast(message, 'error'),
    fetchDogPortfolio,
    getDocuments
  );

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

  // Confirmation actions
  const confirmActions = useConfirmationActions(
    getCurrentPetId,
    fetchDogPortfolio,
    showToast,
    closeModal,
    activeModal
  );

  // Modal handlers
  const modalHandlers = useModalHandlers({
    openDeleteVaccineModal,
    openCompleteVaccineModal,
    openDeleteWeightModal,
    openDeleteMedicationModal,
    openCompleteMedicationModal,
    openDeleteDewormingModal,
    openCompleteDewormingModal,
    openDeleteMedicalReviewModal,
    openCompleteMedicalReviewModal,
    openDeleteDocumentModal
  });

  const {
    handleMarkVaccineCompleted,
    handleDeleteMedicalReview,
    handleMarkMedicalReviewCompleted,
    handleDeleteVaccine,
    handleDeleteDeworming,
    handleMarkDewormingCompleted,
    handleDeleteWeight,
    handleDeleteMedication,
    handleMarkMedicationCompleted
  } = modalHandlers;

  // Pet change handler
  const handlePetChange = (petId: string) => {
    selectPet(petId);
  };

  // Navigation handler from HomeView
  const handleNavigateToSection = (section: string, subSection?: string) => {
    if (section === 'health') {
      setActiveSection('health');
      if (subSection) {
        setActiveHealthSub(subSection as HealthSubSection);
      }
    } else if (section === 'documents') {
      setActiveSection('documents');
    } else if (section === 'settings') {
      setActiveSection('settings');
    } else {
      setActiveSection('summary');
    }
  };

  // Vaccine status badge helper
  const getVaccineStatusBadge = (status: string) => {
    const badgeData = getVaccineStatusBadgeData(status);
    return (
      <span className={badgeData.className}>
        {badgeData.text}
      </span>
    );
  };

  // Localized date formatter
  const formatDateLocalized = (dateString: string) => formatDate(dateString, locale, getDateFormat());

  // Extract portfolio data
  const { dog_info, vaccines, weight_history } = portfolio || { dog_info: null, vaccines: [], weight_history: [] };
  const medications = portfolio?.medications || [];
  const dewormings = portfolio?.dewormings || [];
  const medicalReviews = portfolio?.medical_reviews || [];
  const documents = portfolio?.documents || [];

  // Calculate pending counts
  const pendingVaccines = getPendingCount(vaccines, 'vaccines');
  const pendingMedications = getPendingCount(medications, 'medications');
  const pendingDewormings = getPendingCount(dewormings, 'dewormings');
  const totalPending = pendingVaccines + pendingMedications + pendingDewormings;

  // Error states
  if (error === 'no_pets') return <NoPetsState />;
  if (error === 'not_found') return <NotFoundState />;
  if (error) return <GenericErrorState error={error} />;
  if (!portfolio && !loading) return <NoPetsState />;

  // Show minimal UI while loading
  if (loading && !portfolio) {
    return (
      <div className="flex-1 bg-slate-900">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="min-h-[60vh]" />
        </main>
      </div>
    );
  }

  // Render section header with add button
  const renderSectionHeader = (icon: string, iconColor: string, title: string, gradientColors: string, onAdd: () => void, buttonGradient: string, count?: number) => (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-6">
      <h3 className="text-xl font-bold text-white flex items-center">
        <Icon icon={icon} className={`mr-3 w-7 h-7 ${iconColor}`} />
        <span className={`bg-gradient-to-r ${gradientColors} bg-clip-text text-transparent`}>
          {title}
        </span>
        {count !== undefined && count > 0 && <NotificationBadge count={count} />}
      </h3>
      <button
        onClick={onAdd}
        className={`px-5 py-2.5 bg-gradient-to-r ${buttonGradient} text-white font-medium rounded-xl hover:shadow-lg transition-all transform hover:scale-105 shadow-md text-sm`}
      >
        <span className="flex items-center">
          <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
          {t('common.new')}
        </span>
      </button>
    </div>
  );

  // Render empty state
  const renderEmptyState = (icon: string, title: string, description: string) => (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center">
        <Icon icon={icon} className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  );

  // Render health sub-section content
  const renderHealthContent = () => {
    switch (activeHealthSub) {
      case 'timeline':
        return (
          <MedicalTimeline
            vaccines={vaccines}
            medications={medications}
            dewormings={dewormings}
            medicalReviews={medicalReviews}
            weightHistory={weight_history}
            t={t}
          />
        );

      case 'vaccines':
        return (
          <div>
            {renderSectionHeader(
              'mdi:needle', 'text-green-400',
              t('portfolio.vaccines.title'),
              'from-green-400 to-emerald-400',
              handleAddVaccine,
              'from-green-600 to-emerald-600',
              pendingVaccines
            )}
            <Modal
              isOpen={showVaccineForm}
              onClose={cancelVaccineForm}
              title={editingVaccine ? t('portfolio.vaccines.editVaccine') : t('portfolio.vaccines.newVaccine')}
              size="lg"
            >
              <VaccineForm
                formData={vaccineForm}
                isEditing={!!editingVaccine}
                isSaving={savingVaccine}
                onFormChange={setVaccineForm}
                onSave={handleSaveVaccine}
                onCancel={cancelVaccineForm}
                documents={documents}
                linkedDocumentIds={vaccineLinkedDocIds}
                onLinkedDocsChange={setVaccineLinkedDocIds}
              />
            </Modal>
            <div className="space-y-3">
              {vaccines
                .sort((a: any, b: any) => new Date(b.vaccine_date).getTime() - new Date(a.vaccine_date).getTime())
                .map((vaccine: any) => (
                  <VaccineRow
                    key={vaccine.id}
                    vaccine={vaccine}
                    formatDate={formatDateLocalized}
                    onEdit={handleEditVaccine}
                    onDelete={handleDeleteVaccine}
                    onComplete={handleMarkVaccineCompleted}
                    linkedDocuments={documents.filter((d: any) => d.linked_type === 'vaccine' && Number(d.linked_id) === vaccine.id)}
                  />
                ))}
            </div>
            {vaccines.length === 0 && renderEmptyState('mdi:needle', t('portfolio.vaccines.noVaccines'), t('portfolio.vaccines.addFirstVaccine'))}
          </div>
        );

      case 'medications':
        return (
          <div>
            {renderSectionHeader(
              'mdi:pill', 'text-blue-400',
              t('portfolio.medications.title'),
              'from-blue-400 to-purple-400',
              handleAddMedication,
              'from-blue-600 to-purple-600',
              pendingMedications
            )}
            <Modal
              isOpen={showMedicationForm}
              onClose={cancelMedicationForm}
              title={editingMedication ? t('portfolio.medications.editMedication') : t('portfolio.medications.newMedication')}
              size="lg"
            >
              <MedicationForm
                formData={medicationForm}
                isEditing={!!editingMedication}
                isSaving={savingMedication}
                onFormChange={setMedicationForm}
                onSave={handleSaveMedication}
                onCancel={cancelMedicationForm}
                documents={documents}
                linkedDocumentIds={medicationLinkedDocIds}
                onLinkedDocsChange={setMedicationLinkedDocIds}
              />
            </Modal>
            <div className="space-y-3">
              {medications
                .sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                .map((medication: any) => (
                  <MedicationRow
                    key={medication.id}
                    medication={medication}
                    formatDate={formatDateLocalized}
                    onEdit={handleEditMedication}
                    onDelete={handleDeleteMedication}
                    onComplete={handleMarkMedicationCompleted}
                    linkedDocuments={documents.filter((d: any) => d.linked_type === 'medication' && Number(d.linked_id) === medication.id)}
                  />
                ))}
            </div>
            {medications.length === 0 && renderEmptyState('mdi:pill', t('portfolio.medications.noMedications'), t('portfolio.medications.addFirstMedication'))}
          </div>
        );

      case 'dewormings':
        return (
          <div>
            {renderSectionHeader(
              'mdi:bug', 'text-orange-400',
              t('portfolio.dewormings.title'),
              'from-orange-400 to-red-400',
              () => handleAddDeworming(getCurrentWeight()),
              'from-orange-500 to-red-500',
              pendingDewormings
            )}
            <Modal
              isOpen={showDewormingForm}
              onClose={cancelDewormingForm}
              title={editingDeworming ? t('portfolio.dewormings.editDeworming') : t('portfolio.dewormings.newDeworming')}
              size="lg"
            >
              <DewormingForm
                formData={dewormingForm}
                isEditing={!!editingDeworming}
                isSaving={savingDeworming}
                onFormChange={setDewormingForm}
                onSave={handleSaveDeworming}
                onCancel={cancelDewormingForm}
                documents={documents}
                linkedDocumentIds={dewormingLinkedDocIds}
                onLinkedDocsChange={setDewormingLinkedDocIds}
              />
            </Modal>
            <div className="space-y-3">
              {dewormings
                .sort((a: any, b: any) => new Date(b.treatment_date).getTime() - new Date(a.treatment_date).getTime())
                .map((deworming: any) => (
                  <DewormingRow
                    key={deworming.id}
                    deworming={deworming}
                    formatDate={formatDateLocalized}
                    onEdit={handleEditDeworming}
                    onDelete={handleDeleteDeworming}
                    onComplete={handleMarkDewormingCompleted}
                    linkedDocuments={documents.filter((d: any) => d.linked_type === 'deworming' && Number(d.linked_id) === deworming.id)}
                  />
                ))}
            </div>
            {dewormings.length === 0 && renderEmptyState('mdi:bug', t('portfolio.dewormings.noDewormings'), t('portfolio.dewormings.addFirstDeworming'))}
          </div>
        );

      case 'reviews':
        return (
          <div>
            {renderSectionHeader(
              'mdi:stethoscope', 'text-purple-400',
              t('portfolio.medicalReviews.title'),
              'from-purple-400 to-pink-400',
              handleAddMedicalReview,
              'from-purple-600 to-pink-600'
            )}
            <Modal
              isOpen={showMedicalReviewForm}
              onClose={cancelMedicalReviewForm}
              title={editingMedicalReview ? t('portfolio.medicalReviews.editReview') : t('portfolio.medicalReviews.newReview')}
              size="lg"
            >
              <MedicalReviewForm
                formData={medicalReviewForm}
                isEditing={!!editingMedicalReview}
                isSaving={savingMedicalReview}
                onFormChange={setMedicalReviewForm}
                onSave={handleSaveMedicalReview}
                onCancel={cancelMedicalReviewForm}
                documents={documents}
                linkedDocumentIds={reviewLinkedDocIds}
                onLinkedDocsChange={setReviewLinkedDocIds}
              />
            </Modal>
            <div className="space-y-3">
              {medicalReviews
                .sort((a: any, b: any) => {
                  // Pending reviews without date come first
                  if (!a.visit_date && b.visit_date) return -1;
                  if (a.visit_date && !b.visit_date) return 1;
                  if (!a.visit_date && !b.visit_date) return 0;
                  return new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime();
                })
                .map((review: any) => (
                  <MedicalReviewRow
                    key={review.id}
                    review={review}
                    formatDate={formatDateLocalized}
                    onEdit={handleEditMedicalReview}
                    onComplete={handleMarkMedicalReviewCompleted}
                    onDelete={handleDeleteMedicalReview}
                    linkedDocuments={documents.filter((d: any) => d.linked_type === 'review' && Number(d.linked_id) === review.id)}
                  />
                ))}
            </div>
            {medicalReviews.length === 0 && renderEmptyState('mdi:stethoscope', t('portfolio.medicalReviews.noReviews'), t('portfolio.medicalReviews.addFirstReview'))}
          </div>
        );

      case 'weight':
        return (
          <div>
            {renderSectionHeader(
              'mdi:scale-balance', 'text-cyan-400',
              t('portfolio.weight.title'),
              'from-cyan-400 to-teal-400',
              handleAddWeight,
              'from-cyan-600 to-teal-600'
            )}
            <Modal
              isOpen={showWeightForm}
              onClose={cancelWeightForm}
              title={editingWeight ? t('portfolio.weight.editWeight') : t('portfolio.weight.newWeight')}
              size="md"
            >
              <WeightForm
                formData={weightForm}
                isEditing={!!editingWeight}
                isSaving={savingWeight}
                onFormChange={setWeightForm}
                onSave={handleSaveWeight}
                onCancel={cancelWeightForm}
              />
            </Modal>
            <WeightCard
              weightHistory={weight_history}
              currentWeight={getCurrentWeight()}
              formatDate={formatDateLocalized}
              onEdit={handleEditWeight}
              onDelete={handleDeleteWeight}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Render documents section
  const renderDocumentsContent = () => (
    <div>
      {renderSectionHeader(
        'mdi:file-document-multiple', 'text-teal-400',
        t('portfolio.documents.title'),
        'from-teal-400 to-cyan-400',
        handleAddDocument,
        'from-teal-600 to-cyan-600'
      )}
      <Modal
        isOpen={showDocumentsForm}
        onClose={cancelDocumentsForm}
        title={editingDocument ? t('portfolio.documents.editDocument') : t('portfolio.documents.newDocument')}
        size="lg"
      >
        <DocumentsForm
          formData={documentsForm}
          isEditing={!!editingDocument}
          isSaving={savingDocument}
          onFormChange={setDocumentsForm}
          onSave={handleSaveDocument}
          onCancel={cancelDocumentsForm}
          linkableItems={{ vaccines: vaccines || [], medications, dewormings, medicalReviews }}
        />
      </Modal>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {documents
          .sort((a: any, b: any) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
          .map((document: any) => (
            <DocumentsCard
              key={document.id}
              document={document}
              formatDate={formatDateLocalized}
              onEdit={handleEditDocument}
              onDelete={modalHandlers.handleDeleteDocument}
            />
          ))}
      </div>
      {documents.length === 0 && renderEmptyState('mdi:file-document-multiple', t('portfolio.documents.noDocuments'), t('portfolio.documents.addFirstDocument'))}
    </div>
  );

  // Render settings/info section
  const renderSettingsContent = () => {
    const InfoRow = ({ icon, color, label, value, isMono, isBadge, badgeColor }: {
      icon: string; color: string; label: string; value: string;
      isMono?: boolean; isBadge?: boolean; badgeColor?: 'green' | 'red';
    }) => (
      <div className="flex items-center justify-between py-3 px-2 -mx-2 rounded-lg hover:bg-slate-700/20 transition-colors">
        <span className="text-slate-300 font-medium flex items-center gap-3">
          <Icon icon={icon} className={`w-5 h-5 ${color}`} />
          {label}
        </span>
        {isBadge ? (
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
            badgeColor === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            <Icon icon={badgeColor === 'green' ? 'mdi:check' : 'mdi:close'} className="w-3.5 h-3.5" />
            {value}
          </span>
        ) : (
          <span className={`font-semibold text-white ${isMono ? 'font-mono text-sm bg-slate-700/50 px-3 py-1 rounded-lg' : ''}`}>
            {value}
          </span>
        )}
      </div>
    );

    const CardSection = ({ icon, color, bgColor, title, children }: {
      icon: string; color: string; bgColor: string; title: string; children: React.ReactNode;
    }) => (
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-9 h-9 rounded-xl ${bgColor} flex items-center justify-center`}>
            <Icon icon={icon} className={`w-5 h-5 ${color}`} />
          </div>
          <h3 className="text-white font-semibold text-base">{title}</h3>
        </div>
        <div className="divide-y divide-slate-700/30">
          {children}
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        {/* Identity Card */}
        <CardSection icon="mdi:paw" color="text-blue-400" bgColor="bg-blue-500/15" title={t('portfolio.info.identity')}>
          <div className="flex items-center gap-4 py-3">
            {dog_info?.photo_url ? (
              <img src={dog_info.photo_url} alt={dog_info.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-600" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-slate-600">
                <Icon icon="mdi:paw" className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <p className="text-white font-bold text-lg">{dog_info?.name || '-'}</p>
              <p className="text-slate-400 text-sm capitalize">{dog_info?.species || '-'}</p>
            </div>
          </div>
          <InfoRow icon="mdi:gender-male-female" color="text-pink-400" label={t('portfolio.physicalData.gender')} value={dog_info?.gender === 'male' ? t('portfolio.physicalData.male') : t('portfolio.physicalData.female')} />
          <InfoRow icon="mdi:calendar" color="text-blue-400" label={t('home.basicInfo.birthDate')} value={dog_info?.birth_date ? formatDateLocalized(dog_info.birth_date) : '-'} />
          <InfoRow icon="mdi:clock" color="text-orange-400" label={t('home.basicInfo.age')} value={(() => {
            if (!dog_info?.birth_date) return '-';
            const birth = new Date(dog_info.birth_date);
            const now = new Date();
            let years = now.getFullYear() - birth.getFullYear();
            let months = now.getMonth() - birth.getMonth();
            let days = now.getDate() - birth.getDate();
            if (days < 0) {
              months--;
              const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
              days += prevMonth.getDate();
            }
            if (months < 0) {
              years--;
              months += 12;
            }
            const parts: string[] = [];
            if (years > 0) parts.push(`${years} ${years === 1 ? t('home.year') : t('home.years')}`);
            if (months > 0) parts.push(`${months} ${months === 1 ? t('home.month') : t('home.months')}`);
            parts.push(`${days} ${days === 1 ? t('home.day') : t('home.days')}`);
            if (parts.length <= 1) return parts[0];
            return parts.slice(0, -1).join(', ') + ` ${t('home.and')} ` + parts[parts.length - 1];
          })()} />
          {dog_info?.species === 'dog' && dog_info?.birth_date && (
            <InfoRow icon="ph:dog-fill" color="text-cyan-400" label={t('home.basicInfo.dogAge')} value={(() => {
              const birth = new Date(dog_info.birth_date);
              const now = new Date();
              const ageInYears = Math.floor(Math.abs(now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)) / 365.25;
              const totalDogYears = ageInYears >= 1 ? 15 + ((ageInYears - 1) * 4) : ageInYears * 15;
              const dogYears = Math.floor(totalDogYears);
              const dogMonths = Math.floor((totalDogYears - dogYears) * 12);
              const dogDays = Math.floor(((totalDogYears - dogYears) * 12 - dogMonths) * 30);
              const parts: string[] = [];
              if (dogYears > 0) parts.push(`${dogYears} ${dogYears === 1 ? t('home.year') : t('home.years')}`);
              if (dogMonths > 0) parts.push(`${dogMonths} ${dogMonths === 1 ? t('home.month') : t('home.months')}`);
              parts.push(`${dogDays} ${dogDays === 1 ? t('home.day') : t('home.days')}`);
              if (parts.length <= 1) return parts[0];
              return parts.slice(0, -1).join(', ') + ` ${t('home.and')} ` + parts[parts.length - 1];
            })()} />
          )}
        </CardSection>

        {/* Appearance Card */}
        <CardSection icon="mdi:palette" color="text-rose-400" bgColor="bg-rose-500/15" title={t('portfolio.info.appearance')}>
          <InfoRow icon="mdi:dog" color="text-emerald-400" label={t('home.basicInfo.breed')} value={dog_info?.breed || '-'} />
          <InfoRow icon="mdi:palette" color="text-rose-400" label={t('home.basicInfo.color')} value={dog_info?.color || '-'} />
          <InfoRow icon="mdi:resize" color="text-amber-400" label={t('home.physicalData.size')} value={getSizeText(dog_info?.size || 'medium')} />
        </CardSection>

        {/* Health & ID Card */}
        <CardSection icon="mdi:medical-bag" color="text-emerald-400" bgColor="bg-emerald-500/15" title={t('portfolio.info.healthId')}>
          <InfoRow icon="mdi:weight" color="text-teal-400" label={t('home.physicalData.currentWeight')} value={`${getCurrentWeight()} kg`} />
          <InfoRow icon="mdi:chip" color="text-indigo-400" label={t('home.physicalData.microchip')} value={dog_info?.microchip || t('portfolio.physicalData.noMicrochip')} isMono />
          <InfoRow icon="mdi:medical-bag" color="text-purple-400" label={t('common.neutered')} value={dog_info?.neutered ? t('common.yes') : t('common.no')} isBadge badgeColor={dog_info?.neutered ? 'green' : 'red'} />
        </CardSection>
      </div>
    );
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'summary':
        return (
          <HomeView
            portfolio={portfolio}
            onNavigateToSection={handleNavigateToSection}
            t={t}
          />
        );
      case 'health':
        return renderHealthContent();
      case 'documents':
        return renderDocumentsContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-slate-900">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Section Navigation */}
        <div className="mb-6">
          <SectionNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            activeHealthSub={activeHealthSub}
            setActiveHealthSub={setActiveHealthSub}
            pendingCount={totalPending}
            t={t}
          />
        </div>

        {/* Section Content */}
        <div className="min-h-[60vh]">
          {renderSectionContent()}
        </div>
      </main>

      {/* Confirmation Modal */}
      {activeModal && (() => {
        const modalProps = getModalProps(activeModal, confirmActions, t, getDateFormat());
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

      {/* Toast */}
      {toast && (
        <Toast
          toast={toast}
          onClose={hideToast}
        />
      )}
    </div>
  );
}
