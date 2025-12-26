import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../hooks/useTranslation';
import Toast from './Visuals/Toast';
import ConfirmationModal from './Visuals/ConfirmationModal';
import DogSkeleton from './Visuals/DogSkeleton';
import NoPetsState from './ErrorStates/NoPetsState';
import GenericErrorState from './ErrorStates/GenericErrorState';
import NotFoundState from './ErrorStates/NotFoundState';
import CompactHeader from './Navigation/CompactHeader';
import SectionNav from './Navigation/SectionNav';
import type { SectionType, HealthSubSection } from './Navigation/SectionNav';
import HomeView from './Home/HomeView';
import GlobalSearch from './Search/GlobalSearch';
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
  const [showSearch, setShowSearch] = useState(false);

  // Form hooks
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

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  const formatDateLocalized = (dateString: string) => formatDate(dateString, locale);

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

  // Loading and error states
  if (loading) return <DogSkeleton />;
  if (error === 'no_pets') return <NoPetsState />;
  if (error === 'not_found') return <NotFoundState />;
  if (error) return <GenericErrorState error={error} />;
  if (!portfolio) return <NoPetsState />;

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
          {t('portfolio.common.save')}
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
            {showVaccineForm && (
              <VaccineForm
                formData={vaccineForm}
                isEditing={!!editingVaccine}
                isSaving={savingVaccine}
                onFormChange={setVaccineForm}
                onSave={handleSaveVaccine}
                onCancel={cancelVaccineForm}
              />
            )}
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
            {showMedicationForm && (
              <MedicationForm
                formData={medicationForm}
                isEditing={!!editingMedication}
                isSaving={savingMedication}
                onFormChange={setMedicationForm}
                onSave={handleSaveMedication}
                onCancel={cancelMedicationForm}
              />
            )}
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
            {showDewormingForm && (
              <DewormingForm
                formData={dewormingForm}
                isEditing={!!editingDeworming}
                isSaving={savingDeworming}
                onFormChange={setDewormingForm}
                onSave={handleSaveDeworming}
                onCancel={cancelDewormingForm}
              />
            )}
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
            {showMedicalReviewForm && (
              <MedicalReviewForm
                formData={medicalReviewForm}
                isEditing={!!editingMedicalReview}
                isSaving={savingMedicalReview}
                onFormChange={setMedicalReviewForm}
                onSave={handleSaveMedicalReview}
                onCancel={cancelMedicalReviewForm}
              />
            )}
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
            {showWeightForm && (
              <WeightForm
                formData={weightForm}
                isEditing={!!editingWeight}
                isSaving={savingWeight}
                onFormChange={setWeightForm}
                onSave={handleSaveWeight}
                onCancel={cancelWeightForm}
              />
            )}
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
      {showDocumentsForm && (
        <DocumentsForm
          formData={documentsForm}
          isEditing={!!editingDocument}
          isSaving={savingDocument}
          onFormChange={setDocumentsForm}
          onSave={handleSaveDocument}
          onCancel={cancelDocumentsForm}
        />
      )}
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
    const infoItems = [
      { icon: 'mdi:calendar', color: 'text-blue-400', label: t('home.basicInfo.birthDate'), value: dog_info?.birth_date ? formatDateLocalized(dog_info.birth_date) : '-' },
      { icon: 'mdi:clock', color: 'text-orange-400', label: t('home.basicInfo.age'), value: `${dog_info?.age_years || 0} ${t('common.years')}, ${dog_info?.age_months || 0} ${t('common.months')}` },
      ...(dog_info?.species === 'dog' ? [{ icon: 'ph:dog-fill', color: 'text-cyan-400', label: t('home.basicInfo.dogAge'), value: `${dog_info?.dog_years || 0} ${t('common.years')}` }] : []),
      { icon: 'mdi:dog', color: 'text-emerald-400', label: t('home.basicInfo.breed'), value: dog_info?.breed || '-' },
      { icon: 'mdi:palette', color: 'text-rose-400', label: t('home.basicInfo.color'), value: dog_info?.color || '-' },
      { icon: 'mdi:resize', color: 'text-amber-400', label: t('home.physicalData.size'), value: getSizeText(dog_info?.size || 'medium') },
      { icon: 'mdi:weight', color: 'text-teal-400', label: t('home.physicalData.currentWeight'), value: `${getCurrentWeight()} kg` },
      { icon: 'mdi:chip', color: 'text-indigo-400', label: t('home.physicalData.microchip'), value: dog_info?.microchip || t('portfolio.physicalData.noMicrochip'), isMono: true },
      { icon: 'mdi:medical-bag', color: 'text-purple-400', label: t('common.neutered'), value: dog_info?.neutered ? t('common.yes') : t('common.no'), isBadge: true, badgeColor: dog_info?.neutered ? 'green' : 'red' },
    ];

    return (
      <div className="space-y-2">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-colors"
          >
            <span className="text-slate-300 font-medium flex items-center gap-3">
              <Icon icon={item.icon} className={`w-5 h-5 ${item.color}`} />
              {item.label}
            </span>
            {item.isBadge ? (
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                item.badgeColor === 'green'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                <Icon icon={item.badgeColor === 'green' ? 'mdi:check' : 'mdi:close'} className="w-3.5 h-3.5" />
                {item.value}
              </span>
            ) : (
              <span className={`font-semibold text-white ${item.isMono ? 'font-mono text-sm bg-slate-700/50 px-3 py-1 rounded-lg' : ''}`}>
                {item.value}
              </span>
            )}
          </div>
        ))}
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
    <div className="min-h-screen bg-slate-900">
      {/* Compact Header */}
      <CompactHeader
        currentPet={dog_info}
        availablePets={availablePets}
        onPetChange={handlePetChange}
        onSearchOpen={() => setShowSearch(true)}
      />

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

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />

      {/* Confirmation Modal */}
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
