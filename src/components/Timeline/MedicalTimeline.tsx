import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import TimelineEntry from './TimelineEntry';
import type { TimelineType } from './TimelineEntry';

interface Vaccine {
  id: number;
  vaccine_name: string;
  vaccine_date: string;
  next_due_date?: string;
  veterinarian?: string;
  notes?: string;
  status?: string;
}

interface Medication {
  id: number;
  medication_name: string;
  start_date: string;
  end_date?: string;
  dosage?: string;
  frequency_hours?: number;
  veterinarian?: string;
  notes?: string;
  status?: string;
}

interface Deworming {
  id: number;
  product_name: string;
  treatment_date: string;
  next_treatment_date?: string;
  weight_at_treatment?: number;
  veterinarian?: string;
  notes?: string;
  status?: string;
}

interface MedicalReview {
  id: number;
  visit_date: string;
  visit_type: string;
  reason?: string;
  diagnosis?: string;
  treatment?: string;
  veterinarian?: string;
  clinic_name?: string;
  cost?: number;
  notes?: string;
}

interface WeightRecord {
  id: number;
  weight_kg: number;
  measurement_date: string;
  notes?: string;
}

interface MedicalTimelineProps {
  vaccines: Vaccine[];
  medications: Medication[];
  dewormings: Deworming[];
  medicalReviews: MedicalReview[];
  weightHistory: WeightRecord[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

interface TimelineItem {
  id: string;
  type: TimelineType;
  date: string;
  title: string;
  subtitle?: string;
  details: Record<string, string>;
  status?: 'pending' | 'completed' | 'expired';
}

type FilterType = 'all' | TimelineType;

export default function MedicalTimeline({
  vaccines,
  medications,
  dewormings,
  medicalReviews,
  weightHistory,
  t
}: MedicalTimelineProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [showCount, setShowCount] = useState(10);

  const timelineItems = useMemo((): TimelineItem[] => {
    const items: TimelineItem[] = [];

    // Add vaccines
    vaccines.forEach(v => {
      items.push({
        id: `vaccine-${v.id}`,
        type: 'vaccine',
        date: v.vaccine_date,
        title: v.vaccine_name,
        subtitle: v.veterinarian,
        details: {
          [t('timeline.details.nextDate')]: v.next_due_date || '-',
          [t('timeline.details.veterinarian')]: v.veterinarian || '-',
          [t('timeline.details.notes')]: v.notes || '-'
        },
        status: v.status as 'pending' | 'completed' | 'expired' | undefined
      });
    });

    // Add medications
    medications.forEach(m => {
      items.push({
        id: `medication-${m.id}`,
        type: 'medication',
        date: m.start_date,
        title: m.medication_name,
        subtitle: m.dosage ? `${m.dosage}` : undefined,
        details: {
          [t('timeline.details.dosage')]: m.dosage || '-',
          [t('timeline.details.frequency')]: m.frequency_hours ? `${t('timeline.details.every')} ${m.frequency_hours}h` : '-',
          [t('timeline.details.endDate')]: m.end_date || '-',
          [t('timeline.details.veterinarian')]: m.veterinarian || '-'
        },
        status: m.status as 'pending' | 'completed' | undefined
      });
    });

    // Add dewormings
    dewormings.forEach(d => {
      items.push({
        id: `deworming-${d.id}`,
        type: 'deworming',
        date: d.treatment_date,
        title: d.product_name,
        subtitle: d.weight_at_treatment ? `${d.weight_at_treatment} kg` : undefined,
        details: {
          [t('timeline.details.weight')]: d.weight_at_treatment ? `${d.weight_at_treatment} kg` : '-',
          [t('timeline.details.nextDate')]: d.next_treatment_date || '-',
          [t('timeline.details.veterinarian')]: d.veterinarian || '-'
        },
        status: d.status as 'pending' | 'completed' | undefined
      });
    });

    // Add medical reviews
    medicalReviews.forEach(r => {
      const visitTypeLabels: Record<string, string> = {
        routine: t('timeline.visitType.routine'),
        illness: t('timeline.visitType.illness'),
        emergency: t('timeline.visitType.emergency'),
        follow_up: t('timeline.visitType.followUp')
      };

      items.push({
        id: `review-${r.id}`,
        type: 'medical_review',
        date: r.visit_date,
        title: r.reason || visitTypeLabels[r.visit_type] || r.visit_type,
        subtitle: r.clinic_name || r.veterinarian,
        details: {
          [t('timeline.details.type')]: visitTypeLabels[r.visit_type] || r.visit_type,
          [t('timeline.details.diagnosis')]: r.diagnosis || '-',
          [t('timeline.details.treatment')]: r.treatment || '-',
          [t('timeline.details.cost')]: r.cost ? `${r.cost}` : '-',
          [t('timeline.details.veterinarian')]: r.veterinarian || '-'
        }
      });
    });

    // Add weight records
    weightHistory.forEach(w => {
      items.push({
        id: `weight-${w.id}`,
        type: 'weight',
        date: w.measurement_date,
        title: `${w.weight_kg} kg`,
        subtitle: w.notes,
        details: {
          [t('timeline.details.notes')]: w.notes || '-'
        }
      });
    });

    // Sort by date descending
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return items;
  }, [vaccines, medications, dewormings, medicalReviews, weightHistory, t]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return timelineItems;
    return timelineItems.filter(item => item.type === filter);
  }, [timelineItems, filter]);

  const visibleItems = filteredItems.slice(0, showCount);
  const hasMore = filteredItems.length > showCount;

  const filterButtons: { value: FilterType; icon: string; label: string; color: string }[] = [
    { value: 'all', icon: 'mdi:timeline', label: t('timeline.filters.all'), color: 'text-white' },
    { value: 'vaccine', icon: 'mdi:needle', label: t('timeline.filters.vaccines'), color: 'text-green-400' },
    { value: 'medication', icon: 'mdi:pill', label: t('timeline.filters.medications'), color: 'text-blue-400' },
    { value: 'deworming', icon: 'mdi:bug', label: t('timeline.filters.dewormings'), color: 'text-orange-400' },
    { value: 'medical_review', icon: 'mdi:stethoscope', label: t('timeline.filters.reviews'), color: 'text-purple-400' },
    { value: 'weight', icon: 'mdi:scale-balance', label: t('timeline.filters.weight'), color: 'text-cyan-400' }
  ];

  if (timelineItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
          <Icon icon="mdi:timeline-clock-outline" className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">{t('timeline.empty.title')}</h3>
        <p className="text-slate-400">{t('timeline.empty.description')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(btn => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
              filter === btn.value
                ? 'bg-slate-700 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
            }`}
          >
            <Icon icon={btn.icon} className={`w-4 h-4 ${filter === btn.value ? btn.color : ''}`} />
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-slate-600 via-slate-700 to-transparent" />

        {/* Timeline Items */}
        <div className="space-y-6 relative">
          {visibleItems.map((item, index) => (
            <TimelineEntry
              key={item.id}
              type={item.type}
              date={item.date}
              title={item.title}
              subtitle={item.subtitle}
              details={item.details}
              status={item.status}
              isLeft={index % 2 === 0}
              t={t}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowCount(prev => prev + 10)}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              {t('timeline.loadMore', { count: filteredItems.length - showCount })}
            </button>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-700/50 text-sm text-slate-500">
        <span>{t('timeline.stats.total', { count: timelineItems.length })}</span>
        <span>{t('timeline.stats.vaccines', { count: vaccines.length })}</span>
        <span>{t('timeline.stats.reviews', { count: medicalReviews.length })}</span>
      </div>
    </div>
  );
}
