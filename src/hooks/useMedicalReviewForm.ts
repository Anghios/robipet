import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';

export interface MedicalReviewFormData {
  visit_date: string;
  visit_type: 'routine' | 'illness' | 'emergency' | 'follow_up';
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
  onRefresh: () => void
) {
  const [showMedicalReviewForm, setShowMedicalReviewForm] = useState(false);
  const [editingMedicalReview, setEditingMedicalReview] = useState<any>(null);
  const [medicalReviewForm, setMedicalReviewForm] = useState<MedicalReviewFormData>({
    visit_date: new Date().toISOString().split('T')[0],
    visit_type: 'routine',
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

  const handleAddMedicalReview = useCallback(() => {
    setMedicalReviewForm({
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: 'routine',
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
    setShowMedicalReviewForm(true);
  }, []);

  const handleEditMedicalReview = useCallback((review: any) => {
    setMedicalReviewForm({
      visit_date: review.visit_date,
      visit_type: review.visit_type,
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
    setShowMedicalReviewForm(true);
  }, []);

  const handleSaveMedicalReview = useCallback(async () => {
    if (!medicalReviewForm.visit_date) {
      onError('Fecha de visita es requerida');
      return;
    }

    try {
      setSavingMedicalReview(true);
      const petId = getCurrentPetId();
      
      const reviewData = {
        visit_date: medicalReviewForm.visit_date,
        visit_type: medicalReviewForm.visit_type,
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
        setShowMedicalReviewForm(false);
        setEditingMedicalReview(null);
        onRefresh();
        onSuccess('Revisión médica guardada correctamente');
      } else {
        onError(result.message || 'Error al guardar revisión médica');
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Error al guardar revisión médica');
    } finally {
      setSavingMedicalReview(false);
    }
  }, [medicalReviewForm, editingMedicalReview, getCurrentPetId, onSuccess, onError, onRefresh]);

  const cancelMedicalReviewForm = useCallback(() => {
    setShowMedicalReviewForm(false);
    setEditingMedicalReview(null);
    setMedicalReviewForm({
      visit_date: new Date().toISOString().split('T')[0],
      visit_type: 'routine',
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
    
    // Actions
    setMedicalReviewForm,
    handleAddMedicalReview,
    handleEditMedicalReview,
    handleSaveMedicalReview,
    cancelMedicalReviewForm
  };
}