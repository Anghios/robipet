import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';
import { addWeightRecord } from '../utils/petUtils';

export interface DewormingFormData {
  product_name: string;
  treatment_date: string;
  next_treatment_date: string;
  weight_at_treatment: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'pending';
}

export function useDewormingForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => Promise<void>,
  getDocuments: () => any[]
) {
  const [showDewormingForm, setShowDewormingForm] = useState(false);
  const [editingDeworming, setEditingDeworming] = useState<any>(null);
  const [dewormingForm, setDewormingForm] = useState<DewormingFormData>({
    product_name: '',
    treatment_date: new Date().toISOString().split('T')[0],
    next_treatment_date: '',
    weight_at_treatment: '',
    veterinarian: '',
    notes: '',
    status: 'pending'
  });
  const [savingDeworming, setSavingDeworming] = useState(false);
  const [linkedDocumentIds, setLinkedDocumentIds] = useState<number[]>([]);

  const handleAddDeworming = useCallback((currentWeight?: number) => {
    setDewormingForm({
      product_name: '',
      treatment_date: new Date().toISOString().split('T')[0],
      next_treatment_date: '',
      weight_at_treatment: currentWeight?.toString() || '',
      veterinarian: '',
      notes: '',
      status: 'pending'
    });
    setEditingDeworming(null);
    setLinkedDocumentIds([]);
    setShowDewormingForm(true);
  }, []);

  const handleEditDeworming = useCallback((deworming: any) => {
    const currentStatus = deworming.status || 'pending';
    setDewormingForm({
      product_name: deworming.product_name,
      treatment_date: deworming.treatment_date,
      next_treatment_date: deworming.next_treatment_date || '',
      weight_at_treatment: deworming.weight_at_treatment?.toString() || '',
      veterinarian: deworming.veterinarian || '',
      notes: deworming.notes || '',
      status: currentStatus
    });
    setEditingDeworming(deworming);
    const docs = getDocuments();
    const linked = docs.filter((d: any) => d.links?.some((l: any) => l.linked_type === 'deworming' && Number(l.linked_id) === deworming.id));
    setLinkedDocumentIds(linked.map((d: any) => d.id));
    setShowDewormingForm(true);
  }, [getDocuments]);

  const handleSaveDeworming = useCallback(async () => {
    if (!dewormingForm.product_name || !dewormingForm.treatment_date) {
      onError('Producto y fecha de tratamiento son requeridos');
      return;
    }

    try {
      setSavingDeworming(true);
      const petId = getCurrentPetId();

      const dewormingData = {
        product_name: dewormingForm.product_name,
        treatment_date: dewormingForm.treatment_date,
        next_treatment_date: dewormingForm.next_treatment_date || null,
        weight_at_treatment: dewormingForm.weight_at_treatment ? parseFloat(dewormingForm.weight_at_treatment) : null,
        veterinarian: dewormingForm.veterinarian || null,
        notes: dewormingForm.notes || null,
        status: dewormingForm.status
      };

      const result = editingDeworming
        ? await petApi.updateDeworming(petId, editingDeworming.id, dewormingData)
        : await petApi.createDeworming(petId, dewormingData);

      if (result.success) {
        // Si se proporcionó un peso Y el status es 'completed', añadir un registro de peso
        if (dewormingForm.weight_at_treatment &&
            !isNaN(parseFloat(dewormingForm.weight_at_treatment)) &&
            dewormingForm.status === 'completed') {
          await addWeightRecord(petId, parseFloat(dewormingForm.weight_at_treatment), dewormingForm.treatment_date, `Peso registrado durante desparasitación con ${dewormingForm.product_name}`);
        }

        const entryId = editingDeworming ? editingDeworming.id : result.data?.id;
        const docs = getDocuments();
        const previouslyLinked = docs
          .filter((d: any) => d.links?.some((l: any) => l.linked_type === 'deworming' && Number(l.linked_id) === entryId))
          .map((d: any) => d.id);

        const toLink = linkedDocumentIds.filter(id => !previouslyLinked.includes(id));
        const toUnlink = previouslyLinked.filter((id: number) => !linkedDocumentIds.includes(id));

        for (const docId of toLink) {
          await petApi.addDocumentLink(petId, docId, 'deworming', entryId);
        }
        for (const docId of toUnlink) {
          await petApi.removeDocumentLink(petId, docId, 'deworming', entryId);
        }

        await onRefresh();
        setShowDewormingForm(false);
        setEditingDeworming(null);
        setLinkedDocumentIds([]);
        onSuccess('Desparasitación guardada correctamente');
      } else {
        onError(result.message || 'Error al guardar desparasitación');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar desparasitación');
    } finally {
      setSavingDeworming(false);
    }
  }, [dewormingForm, editingDeworming, getCurrentPetId, onSuccess, onError, onRefresh, linkedDocumentIds, getDocuments]);

  const cancelDewormingForm = useCallback(() => {
    setShowDewormingForm(false);
    setEditingDeworming(null);
    setLinkedDocumentIds([]);
    setDewormingForm({
      product_name: '',
      treatment_date: new Date().toISOString().split('T')[0],
      next_treatment_date: '',
      weight_at_treatment: '',
      veterinarian: '',
      notes: '',
      status: 'pending'
    });
  }, []);

  return {
    // States
    showDewormingForm,
    editingDeworming,
    dewormingForm,
    savingDeworming,
    linkedDocumentIds,

    // Actions
    setDewormingForm,
    setLinkedDocumentIds,
    handleAddDeworming,
    handleEditDeworming,
    handleSaveDeworming,
    cancelDewormingForm
  };
}
