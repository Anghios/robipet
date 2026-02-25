import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';
import { useSettings } from './useSettings';

export interface WeightFormData {
  weight_kg: string;
  measurement_date: string;
  notes: string;
}

export function useWeightForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => Promise<void>
) {
  const { settings } = useSettings();
  const isLb = settings.weightUnit === 'lb';

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
    const displayWeight = isLb
      ? (weightRecord.weight_kg * 2.20462).toFixed(1)
      : weightRecord.weight_kg.toString();
    setWeightForm({
      weight_kg: displayWeight,
      measurement_date: weightRecord.measurement_date,
      notes: weightRecord.notes || ''
    });
    setEditingWeight(weightRecord);
    setShowWeightForm(true);
  }, [isLb]);

  const handleSaveWeight = useCallback(async () => {
    if (!weightForm.weight_kg || !weightForm.measurement_date) {
      onError('Peso y fecha son requeridos');
      return;
    }

    try {
      setSavingWeight(true);
      const petId = getCurrentPetId();

      const enteredWeight = parseFloat(weightForm.weight_kg);
      const weightInKg = isLb ? enteredWeight / 2.20462 : enteredWeight;

      const weightData = {
        weight_kg: parseFloat(weightInKg.toFixed(2)),
        measurement_date: weightForm.measurement_date,
        notes: weightForm.notes || null
      };

      const result = editingWeight
        ? await petApi.updateWeight(petId, editingWeight.id, weightData)
        : await petApi.createWeight(petId, weightData);

      // Check both the HTTP response and the actual server response
      const serverResult = result.data;
      const isSuccess = result.success && serverResult?.success !== false;

      if (isSuccess) {
        await onRefresh();
        setShowWeightForm(false);
        setEditingWeight(null);
        onSuccess('Peso guardado correctamente');
      } else {
        const errorMessage = serverResult?.message || result.message || 'Error al guardar peso';
        onError(errorMessage);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar peso');
    } finally {
      setSavingWeight(false);
    }
  }, [weightForm, editingWeight, getCurrentPetId, onSuccess, onError, onRefresh, isLb]);

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