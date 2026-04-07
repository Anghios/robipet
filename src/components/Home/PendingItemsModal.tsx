import { Icon } from '@iconify/react';

interface PendingItemsModalProps {
  vaccines: any[];
  medications: any[];
  dewormings: any[];
  medicalReviews: any[];
  onNavigate: (section: string, subSection?: string) => void;
  onClose: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: string) => string;
}

interface PendingSection {
  key: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  section: string;
  subSection: string;
  items: PendingItem[];
}

interface PendingItem {
  id: number;
  name: string;
  date: string | null;
  dateLabel: string;
}

export default function PendingItemsModal({
  vaccines,
  medications,
  dewormings,
  medicalReviews,
  onNavigate,
  onClose,
  t,
  formatDate
}: PendingItemsModalProps) {
  const pendingVaccines = vaccines.filter((v: any) => {
    const status = v.status || 'pending';
    return status === 'pending' || status === 'overdue';
  });

  const pendingMedications = medications.filter((m: any) => {
    const status = m.status || 'pending';
    return status === 'pending';
  });

  const pendingDewormings = dewormings.filter((d: any) => {
    const status = d.status || 'pending';
    return status === 'pending';
  });

  const pendingReviews = medicalReviews.filter((r: any) => {
    const status = r.status || 'completed';
    return status === 'pending';
  });

  const sections: PendingSection[] = [
    {
      key: 'vaccines',
      icon: 'mdi:needle',
      iconColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      title: t('home.pending.vaccines'),
      section: 'health',
      subSection: 'vaccines',
      items: pendingVaccines.map((v: any) => {
        const date = v.next_due_date || v.vaccine_date;
        return {
          id: v.id,
          name: v.vaccine_name,
          date,
          dateLabel: date
            ? t('home.pending.dueDateLabel', { date: formatDate(date) })
            : t('home.pending.noDate')
        };
      })
    },
    {
      key: 'medications',
      icon: 'mdi:pill',
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      title: t('home.pending.medications'),
      section: 'health',
      subSection: 'medications',
      items: pendingMedications.map((m: any) => {
        const date = m.end_date || m.start_date;
        return {
          id: m.id,
          name: m.medication_name,
          date,
          dateLabel: date
            ? t('home.pending.sinceLabel', { date: formatDate(date) })
            : t('home.pending.noDate')
        };
      })
    },
    {
      key: 'dewormings',
      icon: 'mdi:bug',
      iconColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      title: t('home.pending.dewormings'),
      section: 'health',
      subSection: 'dewormings',
      items: pendingDewormings.map((d: any) => {
        const date = d.next_treatment_date || d.treatment_date;
        return {
          id: d.id,
          name: d.product_name,
          date,
          dateLabel: date
            ? t('home.pending.scheduledLabel', { date: formatDate(date) })
            : t('home.pending.noDate')
        };
      })
    },
    {
      key: 'reviews',
      icon: 'mdi:stethoscope',
      iconColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      title: t('home.pending.reviews'),
      section: 'health',
      subSection: 'reviews',
      items: pendingReviews.map((r: any) => ({
        id: r.id,
        name: r.reason || r.visit_type || t('home.pending.reviews'),
        date: r.visit_date,
        dateLabel: r.visit_date
          ? t('home.pending.scheduledLabel', { date: formatDate(r.visit_date) })
          : t('home.pending.noDate')
      }))
    }
  ].filter(s => s.items.length > 0);

  const handleItemClick = (section: string, subSection: string) => {
    onClose();
    onNavigate(section, subSection);
  };

  if (sections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-500/20 flex items-center justify-center">
          <Icon icon="mdi:check-circle" className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{t('home.pending.allClear')}</h3>
        <p className="text-slate-400 text-sm">{t('home.pending.allClearDesc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.key}>
          {/* Section header */}
          <div className="flex items-center gap-2 mb-3">
            <Icon icon={section.icon} className={`w-5 h-5 ${section.iconColor}`} />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
              {section.title}
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
              {section.items.length}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {section.items.map((item) => (
              <button
                key={`${section.key}-${item.id}`}
                onClick={() => handleItemClick(section.section, section.subSection)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl ${section.bgColor} border border-slate-700/50 hover:border-slate-500 transition-all text-left group`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                  <Icon icon="mdi:clock-outline" className={`w-4 h-4 ${section.iconColor}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.dateLabel}</p>
                </div>

                <Icon
                  icon="mdi:chevron-right"
                  className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
