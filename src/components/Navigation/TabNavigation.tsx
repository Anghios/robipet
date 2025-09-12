import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';
import NotificationBadge from '../Visuals/NotificationBadge';

type TabType = 'info' | 'medical_reviews' | 'vaccines' | 'weight' | 'medication' | 'deworming';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pendingVaccines: number;
  pendingMedications: number;
  pendingDewormings: number;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
  pendingVaccines,
  pendingMedications,
  pendingDewormings
}: TabNavigationProps) {
  const { t } = useTranslation();

  const getTabClass = (tabKey: TabType) => {
    const baseClass = "w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 text-left flex items-center gap-3";
    const activeClass = "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg";
    const inactiveClass = "text-slate-300 hover:text-white hover:bg-slate-700";
    
    return `${baseClass} ${activeTab === tabKey ? activeClass : inactiveClass}`;
  };

  const tabs = [
    {
      key: 'info' as TabType,
      icon: 'mdi:clipboard-text-outline',
      label: t('home.tabs.info'),
      badge: 0
    },
    {
      key: 'medical_reviews' as TabType,
      icon: 'mdi:stethoscope',
      label: 'Revisiones Médicas',
      badge: 0
    },
    {
      key: 'vaccines' as TabType,
      icon: 'mdi:needle',
      label: t('home.tabs.vaccines'),
      badge: pendingVaccines
    },
    {
      key: 'medication' as TabType,
      icon: 'mdi:pill',
      label: 'Medicación',
      badge: pendingMedications
    },
    {
      key: 'deworming' as TabType,
      icon: 'mdi:bug',
      label: 'Desparasitaciones',
      badge: pendingDewormings
    },
    {
      key: 'weight' as TabType,
      icon: 'mdi:scale-balance',
      label: t('home.tabs.weight'),
      badge: 0
    }
  ];

  return (
    <div className="space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={getTabClass(tab.key)}
          onClick={() => onTabChange(tab.key)}
        >
          <Icon icon={tab.icon} className="text-xl" />
          <span>{tab.label}</span>
          {tab.badge > 0 && <NotificationBadge count={tab.badge} />}
        </button>
      ))}
    </div>
  );
}