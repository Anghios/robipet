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
  onRefresh: () => void
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
    setShowMedicationForm(true);
  }, []);

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
        setShowMedicationForm(false);
        setEditingMedication(null);
        onRefresh();
        onSuccess('Medicamento guardado correctamente');
      } else {
        onError(result.message || 'Error al guardar medicamento');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar medicamento');
    } finally {
      setSavingMedication(false);
    }
  }, [medicationForm, editingMedication, getCurrentPetId, onSuccess, onError, onRefresh]);

  const cancelMedicationForm = useCallback(() => {
    setShowMedicationForm(false);
    setEditingMedication(null);
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
    
    // Actions
    setMedicationForm,
    handleAddMedication,
    handleEditMedication,
    handleSaveMedication,
    cancelMedicationForm
  };
}