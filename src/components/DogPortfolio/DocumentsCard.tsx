import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface DocumentFile {
  id?: number;
  file_name: string;
  file_path: string;
  original_name?: string;
}

interface Document {
  id: number;
  document_name: string;
  document_type: 'certificate' | 'medical' | 'insurance' | 'identification' | 'other';
  upload_date: string;
  file_path?: string; // Para compatibilidad con documentos existentes
  files?: DocumentFile[]; // Para múltiples archivos
  description?: string;
  expiry_date?: string;
  veterinarian?: string;
  notes?: string;
}

interface DocumentsCardProps {
  document: Document;
  formatDate: (date: string) => string;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
}

export default function DocumentsCard({
  document: documentData,
  formatDate,
  onEdit,
  onDelete
}: DocumentsCardProps) {
  const { t } = useTranslation();
  // Add shake animation CSS once
  useEffect(() => {
    try {
      if (!document.getElementById('shake-animation')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'shake-animation';
        styleElement.textContent = `
          @keyframes shake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) rotate(-1deg); }
            20%, 40%, 60%, 80% { transform: translateX(2px) rotate(1deg); }
          }
        `;
        document.head.appendChild(styleElement);
      }
    } catch (error) {
      console.error('Error adding shake animation:', error);
    }
  }, []);

  const getDocumentTypeInfo = () => {
    switch (documentData.document_type) {
      case 'certificate':
        return { icon: 'mdi:certificate', label: t('portfolio.documents.card.certificateType'), color: 'bg-blue-500/20 text-blue-400' };
      case 'medical':
        return { icon: 'mdi:file-medical', label: t('portfolio.documents.card.medicalType'), color: 'bg-red-500/20 text-red-400' };
      case 'insurance':
        return { icon: 'mdi:shield-check', label: t('portfolio.documents.card.insuranceType'), color: 'bg-green-500/20 text-green-400' };
      case 'identification':
        return { icon: 'mdi:card-account-details', label: t('portfolio.documents.card.identificationType'), color: 'bg-yellow-500/20 text-yellow-400' };
      case 'other':
        return { icon: 'mdi:file-document', label: t('portfolio.documents.card.otherType'), color: 'bg-slate-500/20 text-slate-400' };
      default:
        return { icon: 'mdi:file-document', label: t('portfolio.documents.card.documentType'), color: 'bg-slate-500/20 text-slate-400' };
    }
  };

  const typeInfo = getDocumentTypeInfo();
  const isExpired = documentData.expiry_date && new Date(documentData.expiry_date) < new Date();

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400/30 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold text-white group-hover:text-emerald-50 transition-colors duration-300 mb-2">{documentData.document_name}</h4>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center transition-all duration-300 ${typeInfo.color} group-hover:scale-105`}>
            <Icon icon={typeInfo.icon} className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
            {typeInfo.label}
          </span>
          {isExpired && (
            <span className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
              <Icon icon="mdi:alert-circle" className="w-3 h-3 mr-1" />
              {t('portfolio.documents.card.expiredStatus')}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
            <Icon icon="tabler:upload" className="w-4 h-4 text-teal-400 group-hover/item:text-teal-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('portfolio.documents.card.uploadedLabel')}
          </span>
          <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{formatDate(documentData.upload_date)}</span>
        </div>
        
        {documentData.expiry_date && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-yellow-400 group-hover/item:text-yellow-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.documents.card.expiresLabel')}
            </span>
            <span className={`font-medium transition-colors duration-200 ${isExpired ? 'text-red-400' : 'text-white group-hover/item:text-emerald-100'}`}>
              {formatDate(documentData.expiry_date)}
            </span>
          </div>
        )}
        
        {documentData.veterinarian && (
          <div className="flex justify-between py-2 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover/item:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:doctor" className="w-4 h-4 text-teal-400 group-hover/item:text-teal-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('portfolio.documents.card.veterinarianLabel')}
            </span>
            <span className="text-white font-medium group-hover/item:text-emerald-100 transition-colors duration-200">{documentData.veterinarian}</span>
          </div>
        )}
        
        {/* Archivos múltiples */}
        {documentData.files && documentData.files.length > 0 && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/files">
            <span className="text-slate-300 text-sm font-medium block mb-3 group-hover/files:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:file-multiple" className="w-4 h-4 text-purple-400 group-hover/files:text-purple-300 group-hover/files:scale-110 transition-all duration-200" />
              {t('portfolio.documents.card.filesLabel')} ({documentData.files.length}):
            </span>
            <div className="space-y-2">
              {documentData.files.map((file, index) => (
                <div key={`${file.file_path}-${index}`} className="flex items-center justify-between p-3 bg-slate-600/40 rounded-lg hover:bg-slate-600/60 transition-colors group/file">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon icon="mdi:file" className="w-4 h-4 text-purple-400 group-hover/file:text-purple-300 transition-colors flex-shrink-0" />
                    <span className="text-white text-sm font-medium truncate group-hover/file:text-purple-100 transition-colors">
                      {file.file_name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const fileUrl = `http://localhost:8081/api/${file.file_path}`;
                      window.open(fileUrl, '_blank');
                    }}
                    className="ml-2 p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
                    title={t('portfolio.documents.card.viewFileTitle', { fileName: file.file_name })}
                  >
                    <Icon icon="mdi:eye" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {documentData.description && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/desc">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/desc:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:text-box" className="w-4 h-4 text-amber-400 group-hover/desc:text-amber-300 group-hover/desc:scale-110 transition-all duration-200" />
              {t('portfolio.documents.card.descriptionLabel')}
            </span>
            <span className="text-white text-sm group-hover/desc:text-slate-100 transition-colors duration-200">{documentData.description}</span>
          </div>
        )}
        
        {documentData.notes && (
          <div className="bg-slate-700/30 p-4 rounded-xl border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 transition-all duration-300 group/notes">
            <span className="text-slate-300 text-sm font-medium block mb-2 group-hover/notes:text-slate-200 transition-colors duration-200 flex items-center gap-2">
              <Icon icon="mdi:note-text" className="w-4 h-4 text-amber-400 group-hover/notes:text-amber-300 group-hover/notes:scale-110 transition-all duration-200" />
              {t('portfolio.documents.card.notesLabel')}
            </span>
            <span className="text-white text-sm italic group-hover/notes:text-slate-100 transition-colors duration-200">{documentData.notes}</span>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-700/50 group-hover:border-emerald-400/30 transition-colors duration-300">
        <button
          onClick={() => onEdit(documentData)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-blue-500/25 hover:scale-105 hover:-translate-y-0.5 group/edit"
          title={t('portfolio.documents.card.editTitle')}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4 mr-2 group-hover/edit:scale-110 transition-transform duration-200" /> 
          <span className="group-hover/edit:tracking-wide transition-all duration-200">{t('portfolio.documents.card.editButton')}</span>
        </button>
        <button
          onClick={() => onDelete(documentData)}
          className="px-4 py-2.5 bg-gradient-to-r from-red-500/80 to-rose-600/80 hover:from-red-500 hover:to-rose-600 text-white rounded-xl transition-all duration-300 text-sm font-medium inline-flex items-center justify-center shadow-lg hover:shadow-red-500/25 hover:scale-105 hover:-translate-y-0.5 group/delete animate-none hover:animate-pulse"
          title={t('portfolio.documents.card.deleteTitle')}
          onMouseEnter={(e) => {
            e.currentTarget.style.animation = 'shake 0.5s ease-in-out infinite';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animation = 'none';
          }}
        >
          <Icon icon="mdi:delete" className="w-4 h-4 group-hover/delete:scale-125 group-hover/delete:rotate-12 transition-all duration-200" />
        </button>
      </div>
    </div>
  );
}