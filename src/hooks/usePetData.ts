import { useState, useEffect, useCallback } from 'react';
import { petApi } from '../services/petApi';
import type { DogPortfolio } from '../types/Pet';

export function usePetData() {
  const [portfolio, setPortfolio] = useState<DogPortfolio | null>(null);
  const [availablePets, setAvailablePets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get current pet ID from URL or localStorage
  const getCurrentPetId = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('pet');
    return petId || localStorage.getItem('selectedPetId') || '1';
  }, []);

  // Fetch available pets
  const fetchAvailablePets = useCallback(async () => {
    try {
      const result = await petApi.getAllPets();
      if (result.success && result.data) {
        setAvailablePets(result.data);
      }
    } catch (error) {
      console.error('Error fetching available pets:', error);
    }
  }, []);

  // Fetch dog portfolio data
  const fetchDogPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let petId = getCurrentPetId();

      // First, check if there are any pets available
      const petsResult = await petApi.getAllPets();
      
      if (!petsResult.success || !petsResult.data || petsResult.data.length === 0) {
        // No pets available at all
        console.log('No pets found in database');
        setError('no_pets');
        setLoading(false);
        return;
      }

      // We have pets, now determine which one to show
      if (petId && petId !== '1') {
        // Check if the requested pet exists
        const petExists = petsResult.data.find((pet: any) => pet.id.toString() === petId);
        if (!petExists) {
          // Requested pet doesn't exist, use the oldest one
          const sortedPets = petsResult.data.sort((a: any, b: any) => 
            new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
          );
          petId = sortedPets[0].id.toString();
          localStorage.setItem('selectedPetId', petId);
        } else {
          localStorage.setItem('selectedPetId', petId);
        }
      } else {
        // No specific pet ID, use the oldest pet
        const sortedPets = petsResult.data.sort((a: any, b: any) => 
          new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        );
        petId = sortedPets[0].id.toString();
        localStorage.setItem('selectedPetId', petId);
      }

      // Fetch pet data
      const result = await petApi.getPetComplete(petId);
      
      if (result.success && result.data) {
        setPortfolio(result.data);
      } else {
        // Pet exists in list but couldn't fetch details
        setError('not_found');
      }
    } catch (err) {
      console.error('Error in fetchDogPortfolio:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [getCurrentPetId]);

  // Handle pet selection
  const selectPet = useCallback((petId: string) => {
    localStorage.setItem('selectedPetId', petId);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('pet', petId);
    window.history.pushState({}, '', newUrl);
    fetchDogPortfolio();
  }, [fetchDogPortfolio]);

  // Get current weight helper
  const getCurrentWeight = useCallback(() => {
    if (portfolio?.weight_history && portfolio.weight_history.length > 0) {
      const sortedWeights = [...portfolio.weight_history].sort((a, b) => 
        new Date(b.measurement_date).getTime() - new Date(a.measurement_date).getTime()
      );
      return sortedWeights[0].weight_kg;
    }
    return portfolio?.dog_info?.weight_kg || 0;
  }, [portfolio]);

  // Get pending counts for notifications
  const getPendingCount = useCallback((items: any[], type: 'vaccines' | 'medications' | 'dewormings') => {
    if (type === 'vaccines') {
      return items.filter(item => {
        const status = item.status || 'pending';
        return status === 'pending';
      }).length;
    }
    
    if (type === 'medications' || type === 'dewormings') {
      return items.filter(item => {
        const status = item.status || 'pending';
        return status === 'pending';
      }).length;
    }
    
    return 0;
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchDogPortfolio();
    fetchAvailablePets();
  }, [fetchDogPortfolio, fetchAvailablePets]);

  return {
    // Data
    portfolio,
    availablePets,
    
    // States
    loading,
    error,
    
    // Functions
    fetchDogPortfolio,
    fetchAvailablePets,
    selectPet,
    getCurrentPetId,
    getCurrentWeight,
    getPendingCount
  };
}