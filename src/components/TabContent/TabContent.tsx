import { Icon } from '@iconify/react';
import BasicInfoCard from '../DogPortfolio/BasicInfoCard';
import PhysicalDataCard from '../DogPortfolio/PhysicalDataCard';
import MedicalReviewCard from '../DogPortfolio/MedicalReviewCard';
import MedicalReviewForm from '../DogPortfolio/MedicalReviewForm';
import VaccineCard from '../DogPortfolio/VaccineCard';
import VaccineForm from '../DogPortfolio/VaccineForm';
import MedicationCard from '../DogPortfolio/MedicationCard';
import MedicationForm from '../DogPortfolio/MedicationForm';
import DewormingCard from '../DogPortfolio/DewormingCard';
import DewormingForm from '../DogPortfolio/DewormingForm';
import WeightCard from '../DogPortfolio/WeightCard';
import WeightForm from '../DogPortfolio/WeightForm';
import DocumentsCard from '../DogPortfolio/DocumentsCard';
import DocumentsForm from '../DogPortfolio/DocumentsForm';
import NotificationBadge from '../Visuals/NotificationBadge';
import type { DogPortfolio } from '../../types/Pet';
import { formatDate, getVaccineStatusBadgeData, getSpeciesEmoji } from '../../utils/petUtils';
import { useTranslation } from '../../hooks/useTranslation';

type TabType = 'info' | 'medical_reviews' | 'vaccines' | 'weight' | 'medication' | 'deworming' | 'documents';

interface TabContentProps {
  activeTab: TabType;
  portfolio: DogPortfolio;
  
  // Form states and handlers
  showMedicalReviewForm: boolean;
  editingMedicalReview: any;
  medicalReviewForm: any;
  savingMedicalReview: boolean;
  setMedicalReviewForm: (form: any) => void;
  handleAddMedicalReview: () => void;
  handleEditMedicalReview: (review: any) => void;
  handleSaveMedicalReview: () => void;
  handleDeleteMedicalReview: (review: any) => void;
  cancelMedicalReviewForm: () => void;
  
  showVaccineForm: boolean;
  editingVaccine: any;
  vaccineForm: any;
  savingVaccine: boolean;
  setVaccineForm: (form: any) => void;
  handleAddVaccine: () => void;
  handleEditVaccine: (vaccine: any) => void;
  handleSaveVaccine: () => void;
  handleDeleteVaccine: (vaccine: any) => void;
  handleMarkVaccineCompleted: (vaccine: any) => void;
  cancelVaccineForm: () => void;
  
  showMedicationForm: boolean;
  editingMedication: any;
  medicationForm: any;
  savingMedication: boolean;
  setMedicationForm: (form: any) => void;
  handleAddMedication: () => void;
  handleEditMedication: (medication: any) => void;
  handleSaveMedication: () => void;
  handleDeleteMedication: (medication: any) => void;
  handleMarkMedicationCompleted: (medication: any) => void;
  cancelMedicationForm: () => void;
  
  showDewormingForm: boolean;
  editingDeworming: any;
  dewormingForm: any;
  savingDeworming: boolean;
  setDewormingForm: (form: any) => void;
  handleAddDeworming: (currentWeight?: number) => void;
  handleEditDeworming: (deworming: any) => void;
  handleSaveDeworming: () => void;
  handleDeleteDeworming: (deworming: any) => void;
  handleMarkDewormingCompleted: (deworming: any) => void;
  cancelDewormingForm: () => void;
  
  showWeightForm: boolean;
  editingWeight: any;
  weightForm: any;
  savingWeight: boolean;
  setWeightForm: (form: any) => void;
  handleAddWeight: () => void;
  handleEditWeight: (weight: any) => void;
  handleSaveWeight: () => void;
  handleDeleteWeight: (weight: any) => void;
  cancelWeightForm: () => void;
  
  showDocumentsForm: boolean;
  editingDocument: any;
  documentsForm: any;
  savingDocument: boolean;
  setDocumentsForm: (form: any) => void;
  handleAddDocument: () => void;
  handleEditDocument: (document: any) => void;
  handleSaveDocument: () => void;
  handleDeleteDocument: (document: any) => void;
  cancelDocumentsForm: () => void;
  
  // Utility functions
  getCurrentWeight: () => number;
  getPendingCount: (items: any[], type: string) => number;
  getVaccineStatusBadge: (status: string) => JSX.Element;
  getVaccineStatusColor: (status: string) => string;
  getSizeText: (size: string) => string;
}

export default function TabContent(props: TabContentProps) {
  const { t, locale } = useTranslation();
  const {
    activeTab,
    portfolio,
    getCurrentWeight,
    getPendingCount,
    getVaccineStatusBadge,
    getVaccineStatusColor,
    getSizeText
  } = props;
  
  const { dog_info, vaccines, weight_history } = portfolio || { dog_info: null, vaccines: [], weight_history: [] };
  const medications = portfolio?.medications || [];
  const dewormings = portfolio?.dewormings || [];
  const medicalReviews = portfolio?.medical_reviews || [];
  
  // Create localized formatDate function
  const formatDateLocalized = (dateString: string) => formatDate(dateString, locale);
  const documents = portfolio?.documents || [];
  
  const pendingVaccines = getPendingCount(vaccines, 'vaccines');
  const pendingMedications = getPendingCount(medications, 'medications');
  const pendingDewormings = getPendingCount(dewormings, 'dewormings');

  if (activeTab === 'info') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BasicInfoCard 
          dog_info={dog_info} 
          formatDate={formatDateLocalized}
        />
        <PhysicalDataCard 
          dog_info={dog_info}
          getSizeText={getSizeText}
          getCurrentWeight={getCurrentWeight}
        />
      </div>
    );
  }

  if (activeTab === 'medical_reviews') {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Icon icon="mdi:stethoscope" className="mr-4 w-8 h-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('portfolio.medicalReviews.title')}
            </span>
          </h3>
          <button 
            onClick={props.handleAddMedicalReview}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 hover:-translate-y-1 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-md"
          >
            <span className="flex items-center">
              <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
              {t('portfolio.medicalReviews.newButton')}
            </span>
          </button>
        </div>

        {props.showMedicalReviewForm && (
          <MedicalReviewForm
            formData={props.medicalReviewForm}
            isEditing={!!props.editingMedicalReview}
            isSaving={props.savingMedicalReview}
            onFormChange={props.setMedicalReviewForm}
            onSave={props.handleSaveMedicalReview}
            onCancel={props.cancelMedicalReviewForm}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {medicalReviews
            .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
            .map((review) => (
              <MedicalReviewCard
                key={review.id}
                review={review}
                formatDate={formatDateLocalized}
                onEdit={props.handleEditMedicalReview}
                onDelete={props.handleDeleteMedicalReview}
              />
            ))
          }
          
          {medicalReviews.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Icon icon="mdi:stethoscope" className="text-6xl block mb-4 mx-auto text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('portfolio.medicalReviews.noReviews')}</h3>
              <p className="text-slate-400">{t('portfolio.medicalReviews.addFirstReview')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'vaccines') {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Icon icon="mdi:medical-bag" className="mr-4 w-8 h-8 text-green-400" />
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {t('portfolio.vaccines.title')}
            </span>
            <NotificationBadge count={pendingVaccines} />
          </h3>
          <button 
            onClick={props.handleAddVaccine}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all transform hover:scale-105 hover:-translate-y-1 focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-md"
          >
            <span className="flex items-center">
              <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
              {t('portfolio.vaccines.newButton')}
            </span>
          </button>
        </div>

        {props.showVaccineForm && (
          <VaccineForm
            formData={props.vaccineForm}
            isEditing={!!props.editingVaccine}
            isSaving={props.savingVaccine}
            onFormChange={props.setVaccineForm}
            onSave={props.handleSaveVaccine}
            onCancel={props.cancelVaccineForm}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vaccines
            .sort((a, b) => new Date(b.vaccine_date).getTime() - new Date(a.vaccine_date).getTime())
            .map((vaccine) => (
              <VaccineCard
                key={vaccine.id}
                vaccine={vaccine}
                formatDate={formatDateLocalized}
                getVaccineStatusBadge={getVaccineStatusBadge}
                getVaccineStatusColor={getVaccineStatusColor}
                onEdit={props.handleEditVaccine}
                onDelete={props.handleDeleteVaccine}
                onComplete={props.handleMarkVaccineCompleted}
              />
            ))
          }
          
          {vaccines.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Icon icon="mdi:medical-bag" className="text-6xl block mb-4 mx-auto text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('portfolio.vaccines.noVaccines')}</h3>
              <p className="text-slate-400">{t('portfolio.vaccines.addFirstVaccine')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'medication') {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Icon icon="mdi:pill" className="mr-4 w-8 h-8 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('portfolio.medications.title')}
            </span>
            <NotificationBadge count={pendingMedications} />
          </h3>
          <button 
            onClick={props.handleAddMedication}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105 hover:-translate-y-1 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-md"
          >
            <span className="flex items-center">
              <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
              {t('portfolio.medications.newButton')}
            </span>
          </button>
        </div>

        {props.showMedicationForm && (
          <MedicationForm
            formData={props.medicationForm}
            isEditing={!!props.editingMedication}
            isSaving={props.savingMedication}
            onFormChange={props.setMedicationForm}
            onSave={props.handleSaveMedication}
            onCancel={props.cancelMedicationForm}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {medications
            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
            .map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                formatDate={formatDateLocalized}
                onEdit={props.handleEditMedication}
                onDelete={props.handleDeleteMedication}
                onComplete={props.handleMarkMedicationCompleted}
              />
            ))
          }
          
          {medications.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Icon icon="mdi:pill" className="text-6xl block mb-4 mx-auto text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('portfolio.medications.noMedications')}</h3>
              <p className="text-slate-400">{t('portfolio.medications.addFirstMedication')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'deworming') {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Icon icon="mdi:bug" className="mr-4 w-8 h-8 text-orange-400" />
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {t('portfolio.dewormings.title')}
            </span>
            <NotificationBadge count={pendingDewormings} />
          </h3>
          <button 
            onClick={() => props.handleAddDeworming(getCurrentWeight())}
            className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 hover:-translate-y-1 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-md"
          >
            <span className="flex items-center">
              <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
              {t('portfolio.dewormings.newButton')}
            </span>
          </button>
        </div>

        {props.showDewormingForm && (
          <DewormingForm
            formData={props.dewormingForm}
            isEditing={!!props.editingDeworming}
            isSaving={props.savingDeworming}
            onFormChange={props.setDewormingForm}
            onSave={props.handleSaveDeworming}
            onCancel={props.cancelDewormingForm}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dewormings
            .sort((a, b) => new Date(b.treatment_date).getTime() - new Date(a.treatment_date).getTime())
            .map((deworming) => (
              <DewormingCard
                key={deworming.id}
                deworming={deworming}
                formatDate={formatDateLocalized}
                onEdit={props.handleEditDeworming}
                onDelete={props.handleDeleteDeworming}
                onComplete={props.handleMarkDewormingCompleted}
              />
            ))
          }
          
          {dewormings.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Icon icon="mdi:bug" className="text-6xl block mb-4 mx-auto text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('portfolio.dewormings.noDewormings')}</h3>
              <p className="text-slate-400">{t('portfolio.dewormings.addFirstDeworming')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'weight') {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Icon icon="mdi:scale" className="mr-4 w-8 h-8 text-indigo-400" />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {t('portfolio.weight.title')}
            </span>
          </h3>
          <button 
            onClick={props.handleAddWeight}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-105 hover:-translate-y-1 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-md"
          >
            <span className="flex items-center">
              <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
              {t('portfolio.weight.newButton')}
            </span>
          </button>
        </div>

        {props.showWeightForm && (
          <WeightForm
            formData={props.weightForm}
            isEditing={!!props.editingWeight}
            isSaving={props.savingWeight}
            onFormChange={props.setWeightForm}
            onSave={props.handleSaveWeight}
            onCancel={props.cancelWeightForm}
          />
        )}

        <WeightCard
          weightHistory={weight_history}
          currentWeight={getCurrentWeight()}
          formatDate={formatDateLocalized}
          onEdit={props.handleEditWeight}
          onDelete={props.handleDeleteWeight}
          getCurrentWeight={getCurrentWeight}
        />
      </div>
    );
  }

  if (activeTab === 'documents') {
    return (
      <div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-8">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Icon icon="mdi:file-document-multiple" className="mr-4 w-8 h-8 text-teal-400" />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              {t('portfolio.documents.title')}
            </span>
          </h3>
          <button 
            onClick={props.handleAddDocument}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-all transform hover:scale-105 hover:-translate-y-1 focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-md"
          >
            <span className="flex items-center">
              <Icon icon="mdi:plus" className="mr-2 w-4 h-4" />
              {t('portfolio.documents.newButton')}
            </span>
          </button>
        </div>

        {props.showDocumentsForm && (
          <DocumentsForm
            formData={props.documentsForm}
            isEditing={!!props.editingDocument}
            isSaving={props.savingDocument}
            onFormChange={props.setDocumentsForm}
            onSave={props.handleSaveDocument}
            onCancel={props.cancelDocumentsForm}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {documents
            .sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
            .map((document) => (
              <DocumentsCard
                key={document.id}
                document={document}
                formatDate={formatDateLocalized}
                onEdit={props.handleEditDocument}
                onDelete={props.handleDeleteDocument}
              />
            ))
          }
          
          {documents.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Icon icon="mdi:file-document-multiple" className="text-6xl block mb-4 mx-auto text-slate-400" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('portfolio.documents.noDocuments')}</h3>
              <p className="text-slate-400">{t('portfolio.documents.addFirstDocument')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}