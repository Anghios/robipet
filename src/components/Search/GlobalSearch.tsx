import { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../hooks/useSettings';
import { formatDateObj } from '../../utils/petUtils';
import { petApi } from '../../services/petApi';

interface SearchResult {
  id: string;
  type: 'vaccine' | 'medication' | 'deworming' | 'medical_review' | 'document' | 'pet';
  title: string;
  subtitle?: string;
  petName?: string;
  petId?: number;
  date?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
  vaccine: { icon: 'mdi:needle', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  medication: { icon: 'mdi:pill', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  deworming: { icon: 'mdi:bug', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  medical_review: { icon: 'mdi:stethoscope', color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
  document: { icon: 'mdi:file-document', color: 'text-teal-400', bgColor: 'bg-teal-500/20' },
  pet: { icon: 'mdi:paw', color: 'text-pink-400', bgColor: 'bg-pink-500/20' }
};

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const { t } = useTranslation();
  const { getDateFormat } = useSettings();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all pets data on mount
  useEffect(() => {
    if (isOpen) {
      fetchAllData();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const petsResponse = await petApi.getAllPets();
      if (petsResponse.success && petsResponse.data) {
        const allPetsData = [];
        for (const pet of petsResponse.data) {
          const completeResponse = await petApi.getPetComplete(pet.id);
          if (completeResponse.success && completeResponse.data) {
            allPetsData.push({
              pet,
              portfolio: completeResponse.data
            });
          }
        }
        setAllData(allPetsData);
      }
    } catch (error) {
      console.error('Error fetching search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchResults = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    allData.forEach(({ pet, portfolio }) => {
      // Search pets
      if (pet.name.toLowerCase().includes(q) || pet.breed?.toLowerCase().includes(q)) {
        results.push({
          id: `pet-${pet.id}`,
          type: 'pet',
          title: pet.name,
          subtitle: pet.breed,
          petId: pet.id
        });
      }

      // Search vaccines
      portfolio.vaccines?.forEach((v: any) => {
        if (v.vaccine_name?.toLowerCase().includes(q) || v.veterinarian?.toLowerCase().includes(q)) {
          results.push({
            id: `vaccine-${v.id}`,
            type: 'vaccine',
            title: v.vaccine_name,
            subtitle: v.veterinarian,
            petName: pet.name,
            petId: pet.id,
            date: v.vaccine_date
          });
        }
      });

      // Search medications
      portfolio.medications?.forEach((m: any) => {
        if (m.medication_name?.toLowerCase().includes(q) || m.dosage?.toLowerCase().includes(q)) {
          results.push({
            id: `medication-${m.id}`,
            type: 'medication',
            title: m.medication_name,
            subtitle: m.dosage,
            petName: pet.name,
            petId: pet.id,
            date: m.start_date
          });
        }
      });

      // Search dewormings
      portfolio.dewormings?.forEach((d: any) => {
        if (d.product_name?.toLowerCase().includes(q)) {
          results.push({
            id: `deworming-${d.id}`,
            type: 'deworming',
            title: d.product_name,
            petName: pet.name,
            petId: pet.id,
            date: d.treatment_date
          });
        }
      });

      // Search medical reviews
      portfolio.medical_reviews?.forEach((r: any) => {
        if (r.reason?.toLowerCase().includes(q) || r.diagnosis?.toLowerCase().includes(q) || r.veterinarian?.toLowerCase().includes(q)) {
          results.push({
            id: `review-${r.id}`,
            type: 'medical_review',
            title: r.reason || r.visit_type,
            subtitle: r.veterinarian,
            petName: pet.name,
            petId: pet.id,
            date: r.visit_date
          });
        }
      });

      // Search documents
      portfolio.documents?.forEach((doc: any) => {
        if (doc.document_name?.toLowerCase().includes(q) || doc.description?.toLowerCase().includes(q)) {
          results.push({
            id: `document-${doc.id}`,
            type: 'document',
            title: doc.document_name,
            subtitle: doc.document_type,
            petName: pet.name,
            petId: pet.id,
            date: doc.upload_date
          });
        }
      });
    });

    return results.slice(0, 20); // Limit to 20 results
  }, [query, allData]);

  const handleResultClick = (result: SearchResult) => {
    // Store the selected pet and navigate
    if (result.petId) {
      localStorage.setItem('selectedPetId', result.petId.toString());
    }

    // Map type to tab
    const tabMap: Record<string, string> = {
      vaccine: 'vaccines',
      medication: 'medication',
      deworming: 'deworming',
      medical_review: 'medical_reviews',
      document: 'documents',
      pet: 'info'
    };

    const tab = tabMap[result.type] || 'info';

    // Navigate to home with the correct tab
    if (window.location.pathname === '/') {
      // Dispatch event to change tab
      window.dispatchEvent(new CustomEvent('navigateToTab', { detail: { tab, petId: result.petId } }));
    } else {
      // Navigate to home
      window.location.href = `/?tab=${tab}`;
    }

    onClose();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return formatDateObj(d, getDateFormat());
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Search Modal */}
      <div
        className="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-700">
          <Icon icon="mdi:magnify" className="w-6 h-6 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-white text-lg placeholder-slate-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Icon icon="mdi:close" className="w-5 h-5 text-slate-400" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-slate-500 bg-slate-700/50 rounded border border-slate-600">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Icon icon="mdi:loading" className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          ) : query.length < 2 ? (
            <div className="py-12 text-center text-slate-500">
              <Icon icon="mdi:magnify" className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('search.typeToSearch')}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Icon icon="mdi:file-search-outline" className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('search.noResults')}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {searchResults.map((result) => {
                const config = typeConfig[result.type];
                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-700/50 transition-colors text-left"
                  >
                    <div className={`${config.bgColor} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon icon={config.icon} className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">{result.title}</span>
                        {result.petName && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                            {result.petName}
                          </span>
                        )}
                      </div>
                      {result.subtitle && (
                        <p className="text-sm text-slate-400 truncate">{result.subtitle}</p>
                      )}
                    </div>
                    {result.date && (
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {formatDate(result.date)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Icon icon="mdi:keyboard-return" className="w-4 h-4" />
              {t('search.toSelect')}
            </span>
            <span className="flex items-center gap-1">
              <Icon icon="mdi:keyboard-esc" className="w-4 h-4" />
              {t('search.toClose')}
            </span>
          </div>
          {searchResults.length > 0 && (
            <span>{t('search.resultsCount', { count: searchResults.length })}</span>
          )}
        </div>
      </div>
    </div>
  );
}
