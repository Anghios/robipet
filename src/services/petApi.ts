// API service for pet-related operations
import type { FileWithName } from '../hooks/useDocumentsForm';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class PetApiService {
  private baseUrl = '';

  private async fetchWithErrorHandler<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Error: ${response.status}`
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Get pet complete data
  async getPetComplete(petId: string) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/complete`);
  }

  // Get all pets
  async getAllPets() {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets`);
  }

  // Get current user
  private getCurrentUser(): string {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || user.username || 'Usuario';
      }
    } catch (e) {
      console.log('Error parsing user data:', e);
    }
    return 'Usuario';
  }

  // Vaccine operations
  async updateVaccine(petId: string, vaccineId: number, vaccineData: any) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/vaccines/${vaccineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccineData)
    });
  }

  async deleteVaccine(petId: string, vaccineId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/vaccines/${vaccineId}`, {
      method: 'DELETE'
    });
  }

  async createVaccine(petId: string, vaccineData: any) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/vaccines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vaccineData)
    });
  }

  // Weight operations
  async createWeight(petId: string, weightData: any) {
    const currentUser = this.getCurrentUser();
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/weight`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...weightData,
        added_by_user: currentUser
      })
    });
  }

  async updateWeight(petId: string, weightId: number, weightData: any) {
    const currentUser = this.getCurrentUser();
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/weight/${weightId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...weightData,
        added_by_user: currentUser
      })
    });
  }

  async deleteWeight(petId: string, weightId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/weight/${weightId}`, {
      method: 'DELETE'
    });
  }

  // Medical review operations
  async createMedicalReview(petId: string, reviewData: any) {
    const currentUser = this.getCurrentUser();
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medical-reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reviewData,
        created_by_user: currentUser
      })
    });
  }

  async updateMedicalReview(petId: string, reviewId: number, reviewData: any) {
    const currentUser = this.getCurrentUser();
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medical-reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reviewData,
        updated_by_user: currentUser
      })
    });
  }

  async deleteMedicalReview(petId: string, reviewId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medical-reviews/${reviewId}`, {
      method: 'DELETE'
    });
  }

  // Medication operations
  async createMedication(petId: string, medicationData: any) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicationData)
    });
  }

  async updateMedication(petId: string, medicationId: number, medicationData: any) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medications/${medicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicationData)
    });
  }

  async deleteMedication(petId: string, medicationId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medications/${medicationId}`, {
      method: 'DELETE'
    });
  }

  async completeMedication(petId: string, medicationId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/medications/${medicationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
  }

  // Deworming operations
  async createDeworming(petId: string, dewormingData: any) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/dewormings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dewormingData)
    });
  }

  async updateDeworming(petId: string, dewormingId: number, dewormingData: any) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/dewormings/${dewormingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dewormingData)
    });
  }

  async deleteDeworming(petId: string, dewormingId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/dewormings/${dewormingId}`, {
      method: 'DELETE'
    });
  }

  async completeDeworming(petId: string, dewormingId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/dewormings/${dewormingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    });
  }

  // Document operations
  async addDocument(documentData: any) {
    const petId = documentData.pet_id;
    
    // Si hay archivos con nombres (nuevo sistema)
    if (documentData.filesWithNames && documentData.filesWithNames.length > 0) {
      const formData = new FormData();
      const totalFiles = documentData.filesWithNames.length;
      
      // Añadir todos los archivos al FormData
      documentData.filesWithNames.forEach((fileWithName: any, index: number) => {
        formData.append('files[]', fileWithName.file);
        formData.append('file_names[]', fileWithName.displayName);
      });
      
      // Añadir campos del documento
      Object.keys(documentData).forEach(key => {
        if (key !== 'filesWithNames' && key !== 'pet_id' && key !== 'file') {
          formData.append(key, documentData[key]);
        }
      });
      
      // Indicar que es un documento con múltiples archivos
      formData.append('multiple_files', 'true');
      formData.append('total_files', totalFiles.toString());
      
      return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents`, {
        method: 'POST',
        body: formData
      });
    }
    // Si hay un archivo único (sistema legacy)
    else if (documentData.file) {
      const formData = new FormData();
      formData.append('file', documentData.file);
      
      // Añadir otros campos del formulario
      Object.keys(documentData).forEach(key => {
        if (key !== 'file' && key !== 'pet_id') {
          formData.append(key, documentData[key]);
        }
      });
      
      return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents`, {
        method: 'POST',
        body: formData
      });
    } else {
      // Sin archivo, enviar como JSON
      const { pet_id, ...data } = documentData;
      return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
  }

  async updateDocument(documentId: number, documentData: any) {
    const petId = documentData.pet_id;
    const { pet_id, ...data } = documentData;
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents/${documentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  async deleteDocument(petId: string, documentId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents/${documentId}`, {
      method: 'DELETE'
    });
  }

  // Renombrar archivo específico
  async renameDocumentFile(petId: string, documentId: number, fileId: number, newName: string) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents/${documentId}/files/${fileId}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName: newName })
    });
  }

  // Eliminar archivo específico
  async deleteDocumentFile(petId: string, documentId: number, fileId: number) {
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents/${documentId}/files/${fileId}`, {
      method: 'DELETE'
    });
  }

  // Añadir archivos nuevos a documento existente
  async addFilesToDocument(petId: string, documentId: number, filesWithNames: FileWithName[]) {
    const formData = new FormData();
    
    filesWithNames.forEach((fileWithName, index) => {
      formData.append('files[]', fileWithName.file);
      formData.append('fileNames[]', fileWithName.displayName);
    });
    
    return this.fetchWithErrorHandler(`${this.baseUrl}/api/pets/${petId}/documents/${documentId}/files`, {
      method: 'POST',
      body: formData
    });
  }
}

export const petApi = new PetApiService();