import { Icon } from '@iconify/react';

export type SectionType = 'summary' | 'health' | 'documents' | 'settings';
export type HealthSubSection = 'timeline' | 'vaccines' | 'medications' | 'dewormings' | 'reviews' | 'weight';

interface SectionNavProps {
  activeSection: SectionType;
  setActiveSection: (section: SectionType) => void;
  activeHealthSub?: HealthSubSection;
  setActiveHealthSub?: (sub: HealthSubSection) => void;
  pendingCount: number;
  t: (key: string) => string;
}

export default function SectionNav({
  activeSection,
  setActiveSection,
  activeHealthSub = 'timeline',
  setActiveHealthSub,
  pendingCount,
  t
}: SectionNavProps) {
  const sections = [
    {
      id: 'summary' as SectionType,
      icon: 'mdi:view-dashboard-outline',
      activeIcon: 'mdi:view-dashboard',
      label: t('sections.summary'),
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    {
      id: 'health' as SectionType,
      icon: 'mdi:heart-outline',
      activeIcon: 'mdi:heart',
      label: t('sections.health'),
      badge: undefined
    },
    {
      id: 'documents' as SectionType,
      icon: 'mdi:folder-outline',
      activeIcon: 'mdi:folder',
      label: t('sections.documents'),
      badge: undefined
    },
    {
      id: 'settings' as SectionType,
      icon: 'mdi:information-outline',
      activeIcon: 'mdi:information',
      label: t('sections.settings'),
      badge: undefined
    }
  ];

  const healthSubSections = [
    { id: 'timeline' as HealthSubSection, icon: 'mdi:timeline-clock-outline', label: t('health.timeline') },
    { id: 'vaccines' as HealthSubSection, icon: 'mdi:needle', label: t('health.vaccines') },
    { id: 'medications' as HealthSubSection, icon: 'mdi:pill', label: t('health.medications') },
    { id: 'dewormings' as HealthSubSection, icon: 'mdi:bug-outline', label: t('health.dewormings') },
    { id: 'reviews' as HealthSubSection, icon: 'mdi:stethoscope', label: t('health.reviews') },
    { id: 'weight' as HealthSubSection, icon: 'mdi:scale-balance', label: t('health.weight') }
  ];

  return (
    <div className="space-y-4">
      {/* Main Section Navigation */}
      <nav className="flex justify-center">
        <div className="inline-flex bg-slate-800/50 rounded-2xl p-1.5 gap-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon
                  icon={isActive ? section.activeIcon : section.icon}
                  className="w-5 h-5"
                />
                <span className="hidden sm:inline">{section.label}</span>
                {section.badge && (
                  <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {section.badge > 9 ? '9+' : section.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Health Sub-Navigation */}
      {activeSection === 'health' && setActiveHealthSub && (
        <nav className="flex justify-center overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex gap-1 min-w-max">
            {healthSubSections.map((sub) => {
              const isActive = activeHealthSub === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveHealthSub(sub.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon icon={sub.icon} className="w-4 h-4" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
