import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';

export interface MedicalReviewFormData {
  visit_date: string;
  visit_type: 'routine' | 'illness' | 'emergency' | 'follow_up';
  status: 'pending' | 'completed';
  veterinarian: string;
  clinic_name: string;
  reason: string;
  diagnosis: string;
  treatment: string;
  next_visit: string;
  cost: string;
  notes: string;
  documents: File[];
}

export function useMedicalReviewForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => Promise<void>,
  getDocuments: () => any[]
) {
  const [showMedicalReviewForm, setShowMedicalReviewForm] = useState(false);
  const [editingMedicalReview, setEditingMedicalReview] = useState<any>(null);
  const [medicalReviewForm, setMedicalReviewForm] = useState<MedicalReviewFormData>({
    visit_date: '',
    visit_type: 'routine',
    status: 'pending',
    veterinarian: '',
    clinic_name: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    next_visit: '',
    cost: '',
    notes: '',
    documents: []
  });
  const [savingMedicalReview, setSavingMedicalReview] = useState(false);
  const [linkedDocumentIds, setLinkedDocumentIds] = useState<number[]>([]);

  const handleAddMedicalReview = useCallback(() => {
    setMedicalReviewForm({
      visit_date: '',
      visit_type: 'routine',
      status: 'pending',
      veterinarian: '',
      clinic_name: '',
      reason: '',
      diagnosis: '',
      treatment: '',
      next_visit: '',
      cost: '',
      notes: '',
      documents: []
    });
    setEditingMedicalReview(null);
    setLinkedDocumentIds([]);
    setShowMedicalReviewForm(true);
  }, []);

  const handleEditMedicalReview = useCallback((review: any) => {
    setMedicalReviewForm({
      visit_date: review.visit_date || '',
      visit_type: review.visit_type,
      status: review.status || 'completed',
      veterinarian: review.veterinarian || '',
      clinic_name: review.clinic_name || '',
      reason: review.reason || '',
      diagnosis: review.diagnosis || '',
      treatment: review.treatment || '',
      next_visit: review.next_visit || '',
      cost: review.cost ? review.cost.toString() : '',
      notes: review.notes || '',
      documents: []
    });
    setEditingMedicalReview(review);
    const docs = getDocuments();
    const linked = docs.filter((d: any) => d.links?.some((l: any) => l.linked_type === 'review' && Number(l.linked_id) === review.id));
    setLinkedDocumentIds(linked.map((d: any) => d.id));
    setShowMedicalReviewForm(true);
  }, [getDocuments]);

  const handleSaveMedicalReview = useCallback(async () => {
    // Only require visit_date if status is 'completed'
    if (medicalReviewForm.status === 'completed' && !medicalReviewForm.visit_date) {
      onError('Fecha de visita es requerida para revisiones completadas');
      return;
    }

    try {
      setSavingMedicalReview(true);
      const petId = getCurrentPetId();

      const reviewData = {
        visit_date: medicalReviewForm.visit_date || null,
        visit_type: medicalReviewForm.visit_type,
        status: medicalReviewForm.status,
        veterinarian: medicalReviewForm.veterinarian,
        clinic_name: medicalReviewForm.clinic_name,
        reason: medicalReviewForm.reason,
        cost: medicalReviewForm.cost ? parseFloat(medicalReviewForm.cost) : null,
        diagnosis: medicalReviewForm.diagnosis,
        treatment: medicalReviewForm.treatment,
        next_visit: medicalReviewForm.next_visit,
        notes: medicalReviewForm.notes
      };

      const result = editingMedicalReview
        ? await petApi.updateMedicalReview(petId, editingMedicalReview.id, reviewData)
        : await petApi.createMedicalReview(petId, reviewData);

      if (result.success) {
        const entryId = editingMedicalReview ? editingMedicalReview.id : result.data?.id;
        const docs = getDocuments();
        const previouslyLinked = docs
          .filter((d: any) => d.links?.some((l: any) => l.linked_type === 'review' && Number(l.linked_id) === entryId))
          .map((d: any) => d.id);

        const toLink = linkedDocumentIds.filter(id => !previouslyLinked.includes(id));
        const toUnlink = previouslyLinked.filter((id: number) => !linkedDocumentIds.includes(id));

        for (const docId of toLink) {
          await petApi.addDocumentLink(petId, docId, 'review', entryId);
        }
        for (const docId of toUnlink) {
          await petApi.removeDocumentLink(petId, docId, 'review', entryId);
        }

        await onRefresh();
        setShowMedicalReviewForm(false);
        setEditingMedicalReview(null);
        setLinkedDocumentIds([]);
        onSuccess('Revisión médica guardada correctamente');
      } else {
        onError(result.message || 'Error al guardar revisión médica');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar revisión médica');
    } finally {
      setSavingMedicalReview(false);
    }
  }, [medicalReviewForm, editingMedicalReview, getCurrentPetId, onSuccess, onError, onRefresh, linkedDocumentIds, getDocuments]);

  const cancelMedicalReviewForm = useCallback(() => {
    setShowMedicalReviewForm(false);
    setEditingMedicalReview(null);
    setLinkedDocumentIds([]);
    setMedicalReviewForm({
      visit_date: '',
      visit_type: 'routine',
      status: 'pending',
      veterinarian: '',
      clinic_name: '',
      reason: '',
      diagnosis: '',
      treatment: '',
      next_visit: '',
      cost: '',
      notes: '',
      documents: []
    });
  }, []);

  return {
    // States
    showMedicalReviewForm,
    editingMedicalReview,
    medicalReviewForm,
    savingMedicalReview,
    linkedDocumentIds,

    // Actions
    setMedicalReviewForm,
    setLinkedDocumentIds,
    handleAddMedicalReview,
    handleEditMedicalReview,
    handleSaveMedicalReview,
    cancelMedicalReviewForm
  };
}
