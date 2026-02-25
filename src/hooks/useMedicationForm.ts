import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';

export interface MedicationFormData {
  medication_name: string;
  dosage: string;
  frequency_hours: string;
  start_date: string;
  end_date: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'pending';
}

export function useMedicationForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => Promise<void>,
  getDocuments: () => any[]
) {
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [medicationForm, setMedicationForm] = useState<MedicationFormData>({
    medication_name: '',
    dosage: '',
    frequency_hours: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    veterinarian: '',
    notes: '',
    status: 'pending'
  });
  const [savingMedication, setSavingMedication] = useState(false);
  const [linkedDocumentIds, setLinkedDocumentIds] = useState<number[]>([]);

  const handleAddMedication = useCallback(() => {
    setMedicationForm({
      medication_name: '',
      dosage: '',
      frequency_hours: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      veterinarian: '',
      notes: '',
      status: 'pending'
    });
    setEditingMedication(null);
    setLinkedDocumentIds([]);
    setShowMedicationForm(true);
  }, []);

  const handleEditMedication = useCallback((medication: any) => {
    const currentStatus = medication.status || 'pending';
    setMedicationForm({
      medication_name: medication.medication_name,
      dosage: medication.dosage,
      frequency_hours: medication.frequency_hours?.toString() || '',
      start_date: medication.start_date,
      end_date: medication.end_date || '',
      veterinarian: medication.veterinarian || '',
      notes: medication.notes || '',
      status: currentStatus
    });
    setEditingMedication(medication);
    const docs = getDocuments();
    const linked = docs.filter((d: any) => d.linked_type === 'medication' && Number(d.linked_id) === medication.id);
    setLinkedDocumentIds(linked.map((d: any) => d.id));
    setShowMedicationForm(true);
  }, [getDocuments]);

  const handleSaveMedication = useCallback(async () => {
    if (!medicationForm.medication_name || !medicationForm.dosage || !medicationForm.frequency_hours || !medicationForm.start_date) {
      onError('Nombre del medicamento, dosis, frecuencia y fecha de inicio son requeridos');
      return;
    }

    try {
      setSavingMedication(true);
      const petId = getCurrentPetId();

      const medicationData = {
        medication_name: medicationForm.medication_name,
        dosage: medicationForm.dosage,
        frequency_hours: parseInt(medicationForm.frequency_hours),
        start_date: medicationForm.start_date,
        end_date: medicationForm.end_date || null,
        veterinarian: medicationForm.veterinarian || null,
        notes: medicationForm.notes || null,
        status: medicationForm.status
      };

      const result = editingMedication
        ? await petApi.updateMedication(petId, editingMedication.id, medicationData)
        : await petApi.createMedication(petId, medicationData);

      if (result.success) {
        const entryId = editingMedication ? editingMedication.id : result.id;
        const docs = getDocuments();
        const previouslyLinked = docs
          .filter((d: any) => d.linked_type === 'medication' && Number(d.linked_id) === entryId)
          .map((d: any) => d.id);

        const toLink = linkedDocumentIds.filter(id => !previouslyLinked.includes(id));
        const toUnlink = previouslyLinked.filter((id: number) => !linkedDocumentIds.includes(id));

        for (const docId of toLink) {
          await petApi.updateDocument(docId, { linked_type: 'medication', linked_id: entryId, pet_id: petId });
        }
        for (const docId of toUnlink) {
          await petApi.updateDocument(docId, { linked_type: null, linked_id: null, pet_id: petId });
        }

        await onRefresh();
        setShowMedicationForm(false);
        setEditingMedication(null);
        setLinkedDocumentIds([]);
        onSuccess('Medicamento guardado correctamente');
      } else {
        onError(result.message || 'Error al guardar medicamento');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar medicamento');
    } finally {
      setSavingMedication(false);
    }
  }, [medicationForm, editingMedication, getCurrentPetId, onSuccess, onError, onRefresh, linkedDocumentIds, getDocuments]);

  const cancelMedicationForm = useCallback(() => {
    setShowMedicationForm(false);
    setEditingMedication(null);
    setLinkedDocumentIds([]);
    setMedicationForm({
      medication_name: '',
      dosage: '',
      frequency_hours: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      veterinarian: '',
      notes: '',
      status: 'pending'
    });
  }, []);

  return {
    // States
    showMedicationForm,
    editingMedication,
    medicationForm,
    savingMedication,
    linkedDocumentIds,

    // Actions
    setMedicationForm,
    setLinkedDocumentIds,
    handleAddMedication,
    handleEditMedication,
    handleSaveMedication,
    cancelMedicationForm
  };
}
