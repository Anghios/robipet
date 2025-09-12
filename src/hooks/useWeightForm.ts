import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';

export interface WeightFormData {
  weight_kg: string;
  measurement_date: string;
  notes: string;
}

export function useWeightForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => void
) {
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [editingWeight, setEditingWeight] = useState<any>(null);
  const [weightForm, setWeightForm] = useState<WeightFormData>({
    weight_kg: '',
    measurement_date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [savingWeight, setSavingWeight] = useState(false);

  const handleAddWeight = useCallback(() => {
    setWeightForm({
      weight_kg: '',
      measurement_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingWeight(null);
    setShowWeightForm(true);
  }, []);

  const handleEditWeight = useCallback((weightRecord: any) => {
    setWeightForm({
      weight_kg: weightRecord.weight_kg.toString(),
      measurement_date: weightRecord.measurement_date,
      notes: weightRecord.notes || ''
    });
    setEditingWeight(weightRecord);
    setShowWeightForm(true);
  }, []);

  const handleSaveWeight = useCallback(async () => {
    if (!weightForm.weight_kg || !weightForm.measurement_date) {
      onError('Peso y fecha son requeridos');
      return;
    }

    try {
      setSavingWeight(true);
      const petId = getCurrentPetId();
      
      const weightData = {
        weight_kg: parseFloat(weightForm.weight_kg),
        measurement_date: weightForm.measurement_date,
        notes: weightForm.notes || null
      };
      
      const result = editingWeight 
        ? await petApi.updateWeight(petId, editingWeight.id, weightData)
        : await petApi.createWeight(petId, weightData);
      
      if (result.success) {
        setShowWeightForm(false);
        setEditingWeight(null);
        onRefresh();
        onSuccess('Peso guardado correctamente');
      } else {
        onError(result.message || 'Error al guardar peso');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar peso');
    } finally {
      setSavingWeight(false);
    }
  }, [weightForm, editingWeight, getCurrentPetId, onSuccess, onError, onRefresh]);

  const cancelWeightForm = useCallback(() => {
    setShowWeightForm(false);
    setEditingWeight(null);
    setWeightForm({
      weight_kg: '',
      measurement_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  }, []);

  return {
    // States
    showWeightForm,
    editingWeight,
    weightForm,
    savingWeight,
    
    // Actions
    setWeightForm,
    handleAddWeight,
    handleEditWeight,
    handleSaveWeight,
    cancelWeightForm
  };
}