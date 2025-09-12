import { useState, useCallback } from 'react';
import { petApi } from '../services/petApi';

export interface FileWithName {
  file: File;
  displayName: string;
}

export interface ExistingFileData {
  id: number;
  document_id: number;
  file_name: string;
  file_path: string;
  original_name: string;
  created_at: string;
}

export interface DocumentsFormData {
  document_name: string;
  document_type: 'certificate' | 'medical' | 'insurance' | 'identification' | 'other';
  upload_date: string;
  file_path: string;
  description: string;
  veterinarian: string;
  notes: string;
  file?: File;
  files?: File[];
  filesWithNames?: FileWithName[];
  existingFiles?: ExistingFileData[];
  filesToDelete?: number[]; // IDs de archivos a eliminar
  filesUpdated?: ExistingFileData[]; // Archivos con nombres actualizados
}

export function useDocumentsForm(
  getCurrentPetId: () => string,
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  onRefresh: () => void
) {
  const [showDocumentsForm, setShowDocumentsForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState<any>(null);
  const [documentsForm, setDocumentsForm] = useState<DocumentsFormData>({
    document_name: '',
    document_type: 'certificate',
    upload_date: new Date().toISOString().split('T')[0],
    file_path: '',
    description: '',
    veterinarian: '',
    notes: '',
    files: [],
    filesWithNames: [],
    existingFiles: [],
    filesToDelete: [],
    filesUpdated: []
  });
  const [savingDocument, setSavingDocument] = useState(false);

  const handleAddDocument = useCallback(() => {
    setDocumentsForm({
      document_name: '',
      document_type: 'certificate',
      upload_date: new Date().toISOString().split('T')[0],
      file_path: '',
      description: '',
      veterinarian: '',
      notes: '',
      files: [],
      filesWithNames: [],
      existingFiles: [],
      filesToDelete: [],
      filesUpdated: []
    });
    setEditingDocument(null);
    setShowDocumentsForm(true);
  }, []);

  const handleEditDocument = useCallback((document: any) => {
    // Obtener archivos existentes desde document.files (array de archivos completos)
    const existingFiles = document.files && Array.isArray(document.files) 
      ? document.files
      : document.file_path 
        ? [{
            id: 0,
            document_id: document.id,
            file_name: document.document_name || 'Archivo',
            file_path: document.file_path,
            original_name: document.file_path.split('/').pop(),
            created_at: document.created_at || ''
          }] 
        : [];

    setDocumentsForm({
      document_name: document.document_name || '',
      document_type: document.document_type || 'certificate',
      upload_date: document.upload_date || new Date().toISOString().split('T')[0],
      file_path: document.file_path || '',
      description: document.description || '',
      veterinarian: document.veterinarian || '',
      notes: document.notes || '',
      files: [],
      filesWithNames: [],
      existingFiles: existingFiles,
      filesToDelete: [],
      filesUpdated: []
    });
    setEditingDocument(document);
    setShowDocumentsForm(true);
  }, []);

  const handleSaveDocument = useCallback(async () => {
    // Validaciones básicas
    if (!documentsForm.upload_date) {
      onError('Fecha de subida es requerida');
      return;
    }

    // Verificar que hay archivos para procesar
    const hasNewFiles = documentsForm.filesWithNames && documentsForm.filesWithNames.length > 0;
    const hasExistingFiles = documentsForm.existingFiles && documentsForm.existingFiles.length > 0;
    
    // Permitir crear documentos sin archivos adjuntos
    // Pero si se están subiendo archivos, validar que tengan nombres apropiados

    // Si no hay archivos, solo validar que el documento tenga nombre
    if (!hasNewFiles && !hasExistingFiles && !editingDocument) {
      if (!documentsForm.document_name.trim()) {
        onError('Debe especificar un nombre para el documento');
        return;
      }
    }

    // Para nuevos archivos, validar según el número de archivos
    if (hasNewFiles) {
      const totalFiles = documentsForm.filesWithNames!.length;
      
      if (totalFiles === 1) {
        // Un solo archivo: validar que tenga nombre personalizado O que el document_name esté lleno
        const file = documentsForm.filesWithNames![0];
        if (!file.displayName.trim() && !documentsForm.document_name.trim()) {
          onError('El archivo debe tener un nombre o debe especificar un nombre de documento');
          return;
        }
      } else if (totalFiles > 1) {
        // Múltiples archivos: validar que el documento tenga nombre base
        if (!documentsForm.document_name.trim()) {
          onError('Debe especificar un nombre para el documento que contendrá los archivos');
          return;
        }
        
        // Validar que todos los archivos tengan nombre
        const filesWithoutNames = documentsForm.filesWithNames!.filter(f => !f.displayName.trim());
        if (filesWithoutNames.length > 0) {
          onError('Todos los archivos deben tener un nombre');
          return;
        }
      }
    }

    // Validar que document_type esté seleccionado
    if (!documentsForm.document_type) {
      onError('Debe seleccionar un tipo de documento');
      return;
    }

    setSavingDocument(true);
    try {
      const petId = getCurrentPetId();
      if (!petId) {
        throw new Error('No se pudo obtener el ID de la mascota');
      }

      if (editingDocument) {
        // 1. Actualizar datos básicos del documento
        const documentData = {
          document_name: documentsForm.document_name,
          document_type: documentsForm.document_type,
          upload_date: documentsForm.upload_date,
          description: documentsForm.description,
          veterinarian: documentsForm.veterinarian,
          notes: documentsForm.notes,
          pet_id: petId
        };

        const updateResult = await petApi.updateDocument(editingDocument.id, documentData);
        if (!updateResult.success) {
          throw new Error(updateResult.message || 'Error al actualizar el documento');
        }

        // 2. Procesar archivos a eliminar
        if (documentsForm.filesToDelete && documentsForm.filesToDelete.length > 0) {
          for (const fileId of documentsForm.filesToDelete) {
            const deleteResult = await petApi.deleteDocumentFile(petId, editingDocument.id, fileId);
            if (!deleteResult.success) {
              console.error('Error al eliminar archivo:', deleteResult.message);
            }
          }
        }

        // 3. Procesar archivos con nombres actualizados
        if (documentsForm.filesUpdated && documentsForm.filesUpdated.length > 0) {
          for (const fileData of documentsForm.filesUpdated) {
            if (fileData.id && fileData.file_name) {
              const renameResult = await petApi.renameDocumentFile(petId, editingDocument.id, fileData.id, fileData.file_name);
              if (!renameResult.success) {
                console.error('Error al renombrar archivo:', renameResult.message);
              }
            }
          }
        }

        // 4. Procesar archivos nuevos
        if (hasNewFiles && documentsForm.filesWithNames) {
          const addFilesResult = await petApi.addFilesToDocument(petId, editingDocument.id, documentsForm.filesWithNames);
          if (!addFilesResult.success) {
            console.error('Error al añadir archivos:', addFilesResult.message);
            onError('Error al añadir archivos: ' + addFilesResult.message);
            return;
          }
        }

        onSuccess('Documento actualizado correctamente');
      } else {
        // Para creación, crear un documento único (con o sin archivos)
        const totalFiles = documentsForm.filesWithNames?.length || 0;
        
        // Determinar el nombre del documento
        let documentName: string;
        if (totalFiles === 0) {
          // Sin archivos: usar el nombre del documento
          documentName = documentsForm.document_name || 'Documento sin adjuntos';
        } else if (totalFiles === 1) {
          // Un archivo: usar su nombre personalizado si lo tiene, sino el nombre del documento
          documentName = documentsForm.filesWithNames![0].displayName.trim() || documentsForm.document_name || 'Documento';
        } else {
          // Múltiples archivos: usar el nombre del documento base
          documentName = documentsForm.document_name || 'Documento múltiple';
        }

        const documentData = {
          ...documentsForm,
          document_name: documentName,
          pet_id: petId,
          filesWithNames: documentsForm.filesWithNames || [] // Puede ser array vacío
        };

        const result = await petApi.addDocument(documentData);
        if (result.success) {
          const message = totalFiles === 0 
            ? 'Documento creado correctamente'
            : `Documento con ${totalFiles} archivo${totalFiles > 1 ? 's' : ''} añadido correctamente`;
          onSuccess(message);
        } else {
          throw new Error(result.message || 'Error al añadir el documento');
        }
      }

      setShowDocumentsForm(false);
      setEditingDocument(null);
      onRefresh();
    } catch (error) {
      console.error('Error al guardar documento:', error);
      onError(error instanceof Error ? error.message : (editingDocument ? 'Error al actualizar el documento' : 'Error al añadir el documento'));
    } finally {
      setSavingDocument(false);
    }
  }, [documentsForm, editingDocument, getCurrentPetId, onSuccess, onError, onRefresh]);

  const cancelDocumentsForm = useCallback(() => {
    setShowDocumentsForm(false);
    setEditingDocument(null);
    setDocumentsForm({
      document_name: '',
      document_type: 'certificate',
      upload_date: new Date().toISOString().split('T')[0],
      file_path: '',
      description: '',
      veterinarian: '',
      notes: '',
      files: [],
      filesWithNames: [],
      existingFiles: [],
      filesToDelete: [],
      filesUpdated: []
    });
  }, []);

  return {
    showDocumentsForm,
    editingDocument,
    documentsForm,
    savingDocument,
    setDocumentsForm,
    handleAddDocument,
    handleEditDocument,
    handleSaveDocument,
    cancelDocumentsForm
  };
}