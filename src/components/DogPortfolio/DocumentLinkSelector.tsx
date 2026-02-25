import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface DocumentLinkSelectorProps {
  documents: any[];
  linkedDocumentIds: number[];
  onLinkedDocsChange: (ids: number[]) => void;
}

export default function DocumentLinkSelector({
  documents,
  linkedDocumentIds,
  onLinkedDocsChange
}: DocumentLinkSelectorProps) {
  const { t } = useTranslation();
  const [showSelector, setShowSelector] = useState(false);

  const selectedDocs = documents.filter((d: any) => linkedDocumentIds.includes(d.id));

  const toggleDoc = (docId: number) => {
    if (linkedDocumentIds.includes(docId)) {
      onLinkedDocsChange(linkedDocumentIds.filter(id => id !== docId));
    } else {
      onLinkedDocsChange([...linkedDocumentIds, docId]);
    }
  };

  const removeDoc = (docId: number) => {
    onLinkedDocsChange(linkedDocumentIds.filter(id => id !== docId));
  };

  const getLinkedLabel = (doc: any) => {
    if (!doc.linked_type || !doc.linked_id) return null;
    const typeLabels: Record<string, string> = {
      vaccine: t('portfolio.documents.form.linkVaccines'),
      medication: t('portfolio.documents.form.linkMedications'),
      deworming: t('portfolio.documents.form.linkDewormings'),
      review: t('portfolio.documents.form.linkReviews')
    };
    return typeLabels[doc.linked_type] || doc.linked_type;
  };

  if (documents.length === 0) return null;

  return (
    <>
      <div className="group">
        <label className="block text-slate-300 font-medium mb-2 text-sm flex items-center gap-2">
          <Icon icon="mdi:file-document-multiple" className="w-4 h-4 text-teal-400" />
          {t('portfolio.common.linkDocuments')}
        </label>
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-left hover:border-slate-500/70 transition-all flex items-center gap-3"
        >
          <Icon icon="mdi:file-document-plus" className="w-5 h-5 text-teal-400" />
          <span className={linkedDocumentIds.length > 0 ? 'text-white' : 'text-slate-400'}>
            {linkedDocumentIds.length > 0
              ? `${linkedDocumentIds.length} ${t('portfolio.common.documentsLinked')}`
              : t('portfolio.common.noDocumentsLinked')
            }
          </span>
          <Icon icon="mdi:chevron-right" className="w-4 h-4 text-slate-500 ml-auto" />
        </button>
        {selectedDocs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedDocs.map((doc: any) => (
              <span
                key={doc.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-xs"
              >
                <Icon icon="mdi:file-document" className="w-3.5 h-3.5" />
                {doc.document_name}
                <button
                  type="button"
                  onClick={() => removeDoc(doc.id)}
                  className="ml-0.5 hover:text-red-400 transition-colors"
                >
                  <Icon icon="mdi:close" className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Document Selector Modal */}
      {showSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSelector(false)}
          />
          <div className="relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Icon icon="mdi:file-document-multiple" className="w-5 h-5 text-teal-400" />
                {t('portfolio.common.selectDocuments')}
              </h3>
              <button
                onClick={() => setShowSelector(false)}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" className="w-5 h-5" />
              </button>
            </div>

            {/* Document List */}
            <div className="overflow-y-auto flex-1 p-2">
              {documents.map((doc: any) => {
                const isSelected = linkedDocumentIds.includes(doc.id);
                const linkedTo = getLinkedLabel(doc);
                const isLinkedElsewhere = linkedTo && !isSelected;

                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => toggleDoc(doc.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      isSelected
                        ? 'bg-teal-500/15 border border-teal-500/30'
                        : 'hover:bg-slate-700/50 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-teal-500/20' : 'bg-slate-700/50'
                    }`}>
                      <Icon
                        icon={isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'}
                        className={`w-5 h-5 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isSelected ? 'text-teal-300' : 'text-white'}`}>
                        {doc.document_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{doc.document_type}</span>
                        {isLinkedElsewhere && (
                          <span className="text-xs text-amber-400/70 flex items-center gap-1">
                            <Icon icon="mdi:link-variant" className="w-3 h-3" />
                            {t('portfolio.common.linkedToOther')} {linkedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setShowSelector(false)}
                className="w-full px-4 py-2.5 bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 rounded-xl transition-colors font-medium text-sm"
              >
                {linkedDocumentIds.length > 0
                  ? `${linkedDocumentIds.length} ${t('portfolio.common.documentsLinked')}`
                  : t('portfolio.common.noDocumentsLinked')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
