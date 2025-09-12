import { Icon } from '@iconify/react';
import NotificationBadge from '../Visuals/NotificationBadge';

type TabType = 'info' | 'medical_reviews' | 'vaccines' | 'weight' | 'medication' | 'deworming' | 'documents';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingVaccines: number;
  pendingMedications: number;
  pendingDewormings: number;
  variant: 'sidebar' | 'mobile';
  t: (key: string) => string;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  pendingVaccines,
  pendingMedications,
  pendingDewormings,
  variant,
  t
}: TabNavigationProps) {
  const isSidebar = variant === 'sidebar';
  const isMobile = variant === 'mobile';

  const baseNavClasses = "bg-slate-800 rounded-2xl border border-slate-700 p-2";
  const navClasses = isSidebar 
    ? `${baseNavClasses} max-lg:order-2 max-lg:hidden`
    : `${baseNavClasses} mb-8 lg:hidden`;

  const tabs = [
    {
      id: 'info' as TabType,
      icon: 'mdi:clipboard-text-outline',
      label: t('home.tabs.info'),
      count: 0
    },
    {
      id: 'medical_reviews' as TabType,
      icon: 'mdi:stethoscope',
      label: t('home.tabs.medicalReviews'),
      count: 0
    },
    {
      id: 'vaccines' as TabType,
      icon: 'mdi:needle',
      label: t('home.tabs.vaccines'),
      count: pendingVaccines
    },
    {
      id: 'medication' as TabType,
      icon: 'mdi:pill',
      label: t('home.tabs.medication'),
      count: pendingMedications
    },
    {
      id: 'deworming' as TabType,
      icon: 'mdi:bug',
      label: t('home.tabs.deworming'),
      count: pendingDewormings
    },
    {
      id: 'weight' as TabType,
      icon: 'mdi:scale-balance',
      label: t('home.tabs.weight'),
      count: 0
    },
    {
      id: 'documents' as TabType,
      icon: 'mdi:file-document-multiple',
      label: t('home.tabs.documents'),
      count: 0
    }
  ];

  return (
    <nav className={navClasses}>
      <div className="space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 text-left flex items-center gap-3 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <Icon icon={tab.icon} className="text-xl" />
            </div>
            <span className="flex-1 min-w-0">{tab.label}</span>
            {tab.count > 0 && <NotificationBadge count={tab.count} />}
          </button>
        ))}
      </div>
    </nav>
  );
}