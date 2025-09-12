import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';

export interface VaccineFormData {
  vaccine_name: string;
  vaccine_date: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'pending';
}

export function useVaccineForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => void
) {
  const [showVaccineForm, setShowVaccineForm] = useState(false);
  const [editingVaccine, setEditingVaccine] = useState<any>(null);
  const [vaccineForm, setVaccineForm] = useState<VaccineFormData>({
    vaccine_name: '',
    vaccine_date: new Date().toISOString().split('T')[0],
    veterinarian: '',
    notes: '',
    status: 'pending'
  });
  const [savingVaccine, setSavingVaccine] = useState(false);

  const handleAddVaccine = useCallback(() => {
    setVaccineForm({
      vaccine_name: '',
      vaccine_date: new Date().toISOString().split('T')[0],
      veterinarian: '',
      notes: '',
      status: 'pending'
    });
    setEditingVaccine(null);
    setShowVaccineForm(true);
  }, []);

  const handleEditVaccine = useCallback((vaccine: any) => {
    const currentStatus = vaccine.status || 'pending';
    setVaccineForm({
      vaccine_name: vaccine.vaccine_name,
      vaccine_date: vaccine.vaccine_date,
      veterinarian: vaccine.veterinarian || '',
      notes: vaccine.notes || '',
      status: currentStatus
    });
    setEditingVaccine(vaccine);
    setShowVaccineForm(true);
  }, []);

  const handleSaveVaccine = useCallback(async () => {
    if (!vaccineForm.vaccine_name || !vaccineForm.vaccine_date) {
      onError('Nombre de vacuna y fecha son requeridos');
      return;
    }

    try {
      setSavingVaccine(true);
      const petId = getCurrentPetId();
      
      const result = editingVaccine 
        ? await petApi.updateVaccine(petId, editingVaccine.id, vaccineForm)
        : await petApi.createVaccine(petId, vaccineForm);
      
      if (result.success) {
        setShowVaccineForm(false);
        setEditingVaccine(null);
        onRefresh();
        onSuccess('Vacuna guardada correctamente');
      } else {
        onError(result.message || 'Error al guardar vacuna');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar vacuna');
    } finally {
      setSavingVaccine(false);
    }
  }, [vaccineForm, editingVaccine, getCurrentPetId, onSuccess, onError, onRefresh]);

  const cancelVaccineForm = useCallback(() => {
    setShowVaccineForm(false);
    setEditingVaccine(null);
    setVaccineForm({
      vaccine_name: '',
      vaccine_date: new Date().toISOString().split('T')[0],
      veterinarian: '',
      notes: '',
      status: 'pending'
    });
  }, []);

  return {
    // States
    showVaccineForm,
    editingVaccine,
    vaccineForm,
    savingVaccine,
    
    // Actions
    setVaccineForm,
    handleAddVaccine,
    handleEditVaccine,
    handleSaveVaccine,
    cancelVaccineForm
  };
}