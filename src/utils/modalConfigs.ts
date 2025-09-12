import { formatDate } from './petUtils';

// Helper function to safely get translations with fallback
const safeTranslate = (translationFn: any, key: string, fallback: string, params?: Record<string, any>): string => {
  try {
    if (typeof translationFn === 'function') {
      const result = translationFn(key, params);
      return result || fallback;
    }
    return fallback;
  } catch (error) {
    console.warn(`Translation failed for key: ${key}`, error);
    return fallback;
  }
};

// Helper function to replace placeholders safely
const interpolate = (template: string, values: Record<string, any>): string => {
  if (!template || typeof template !== 'string') return template;
  try {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return values[key] !== undefined ? String(values[key]) : match;
    });
  } catch (error) {
    console.warn('Interpolation failed:', error);
    return template;
  }
};

export interface ModalConfig {
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  icon: string;
  onConfirm: () => void;
}

export const getModalProps = (
  activeModal: any,
  confirmActions: {
    confirmDeleteVaccine: () => void;
    confirmCompleteVaccine: () => void;
    confirmDeleteWeight: () => void;
    confirmDeleteMedication: () => void;
    confirmCompleteMedication: () => void;
    confirmDeleteDeworming: () => void;
    confirmCompleteDeworming: () => void;
    confirmDeleteMedicalReview: () => void;
    confirmDeleteDocumentFile: () => void;
    confirmDeleteSelectedFile: () => void;
    confirmDeleteDocument: () => void;
  },
  translationFn?: any
): ModalConfig | null => {
  if (!activeModal) return null;

  switch (activeModal.type) {
    case 'deleteVaccine':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteVaccine.title', 'Eliminar Vacuna'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteVaccine.message', '¿Estás seguro de que quieres eliminar la vacuna "{name}"? Esta acción no se puede deshacer.'),
          { name: activeModal.item?.vaccine_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteVaccine.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:delete',
        onConfirm: confirmActions.confirmDeleteVaccine
      };
    case 'completeVaccine':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.completeVaccine.title', 'Completar Vacuna'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.completeVaccine.message', '¿Confirmas que la vacuna "{name}" ha sido aplicada y está completada?'),
          { name: activeModal.item?.vaccine_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.completeVaccine.confirmText', 'Completar'),
        confirmColor: 'bg-green-600 hover:bg-green-500 focus:ring-green-400',
        icon: 'mdi:check',
        onConfirm: confirmActions.confirmCompleteVaccine
      };
    case 'deleteWeight':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteWeight.title', 'Eliminar Registro de Peso'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteWeight.message', '¿Estás seguro de que quieres eliminar el registro de peso de {weight} kg del {date}? Esta acción no se puede deshacer.'),
          { weight: activeModal.item?.weight_kg, date: activeModal.item ? formatDate(activeModal.item.measurement_date) : '' }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteWeight.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:scale',
        onConfirm: confirmActions.confirmDeleteWeight
      };
    case 'deleteMedication':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteMedication.title', 'Eliminar Medicamento'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteMedication.message', '¿Estás seguro de que quieres eliminar el medicamento "{name}"? Esta acción no se puede deshacer.'),
          { name: activeModal.item?.medication_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteMedication.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:pill',
        onConfirm: confirmActions.confirmDeleteMedication
      };
    case 'completeMedication':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.completeMedication.title', 'Completar Medicamento'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.completeMedication.message', '¿Confirmas que el tratamiento con "{name}" ha sido completado?'),
          { name: activeModal.item?.medication_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.completeMedication.confirmText', 'Completar'),
        confirmColor: 'bg-green-600 hover:bg-green-500 focus:ring-green-400',
        icon: 'mdi:pill',
        onConfirm: confirmActions.confirmCompleteMedication
      };
    case 'deleteDeworming':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteDeworming.title', 'Eliminar Desparasitación'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteDeworming.message', '¿Estás seguro de que quieres eliminar la desparasitación "{name}"? Esta acción no se puede deshacer.'),
          { name: activeModal.item?.product_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteDeworming.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:bug',
        onConfirm: confirmActions.confirmDeleteDeworming
      };
    case 'completeDeworming':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.completeDeworming.title', 'Aplicar Desparasitación'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.completeDeworming.message', '¿Confirmas que la desparasitación "{name}" ha sido aplicada?'),
          { name: activeModal.item?.product_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.completeDeworming.confirmText', 'Aplicar'),
        confirmColor: 'bg-green-600 hover:bg-green-500 focus:ring-green-400',
        icon: 'mdi:bug',
        onConfirm: confirmActions.confirmCompleteDeworming
      };
    case 'deleteMedicalReview':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteMedicalReview.title', 'Eliminar Revisión Médica'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteMedicalReview.message', '¿Estás seguro de que quieres eliminar la revisión médica del {date}? Esta acción no se puede deshacer.'),
          { date: activeModal.item ? formatDate(activeModal.item.visit_date) : '' }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteMedicalReview.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:delete',
        onConfirm: confirmActions.confirmDeleteMedicalReview
      };
    case 'deleteDocumentFile':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteDocumentFile.title', 'Eliminar Archivo'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteDocumentFile.message', '¿Estás seguro de que quieres eliminar el archivo "{name}"? Esta acción no se puede deshacer y el archivo se eliminará permanentemente.'),
          { name: activeModal.item?.file_name || activeModal.item?.original_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteDocumentFile.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:file-remove',
        onConfirm: confirmActions.confirmDeleteDocumentFile
      };
    case 'deleteSelectedFile':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteSelectedFile.title', 'Eliminar Archivo Seleccionado'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteSelectedFile.message', '¿Estás seguro de que quieres quitar "{name}" de la lista? Tendrás que seleccionarlo nuevamente si cambias de opinión.'),
          { name: activeModal.item?.displayName || activeModal.item?.file?.name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteSelectedFile.confirmText', 'Quitar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:file-cancel',
        onConfirm: confirmActions.confirmDeleteSelectedFile
      };
    case 'deleteDocument':
      return {
        title: safeTranslate(translationFn, 'confirmationModal.deleteDocument.title', 'Eliminar Documento'),
        message: interpolate(
          safeTranslate(translationFn, 'confirmationModal.deleteDocument.message', '¿Estás seguro de que quieres eliminar el documento "{name}"? Esta acción eliminará permanentemente el documento y todos sus archivos asociados.'),
          { name: activeModal.item?.document_name }
        ),
        confirmText: safeTranslate(translationFn, 'confirmationModal.deleteDocument.confirmText', 'Eliminar'),
        confirmColor: 'bg-red-600 hover:bg-red-500 focus:ring-red-400',
        icon: 'mdi:file-remove',
        onConfirm: confirmActions.confirmDeleteDocument
      };
    default:
      return null;
  }
};