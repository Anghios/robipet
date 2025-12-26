import { Icon } from '@iconify/react';
import AlertCard from './AlertCard';
import QuickStats from './QuickStats';

interface Vaccine {
  id: number;
  vaccine_name: string;
  vaccine_date: string;
  next_due_date: string | null;
  status?: string;
}

interface Medication {
  id: number;
  medication_name: string;
  start_date: string;
  end_date?: string;
  status?: string;
}

interface Deworming {
  id: number;
  product_name: string;
  treatment_date: string;
  next_treatment_date?: string;
  status?: string;
}

interface MedicalReview {
  id: number;
  visit_date: string;
  visit_type: string;
  reason?: string;
}

interface WeightRecord {
  id: number;
  weight_kg: number;
  measurement_date: string;
}

interface DashboardSummaryProps {
  vaccines: Vaccine[];
  medications: Medication[];
  dewormings: Deworming[];
  medicalReviews: MedicalReview[];
  weightHistory: WeightRecord[];
  currentWeight: number;
  petName: string;
  onNavigateToTab: (tab: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

type AlertType = 'urgent' | 'warning' | 'upcoming' | 'info';

interface Alert {
  id: string;
  type: AlertType;
  icon: string;
  title: string;
  description: string;
  date?: string;
  action?: {
    label: string;
    tab: string;
  };
}

export default function DashboardSummary({
  vaccines,
  medications,
  dewormings,
  medicalReviews,
  weightHistory,
  currentWeight,
  petName,
  onNavigateToTab,
  t
}: DashboardSummaryProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);

  // Helper functions
  const isOverdue = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date < today;
  };

  const isUpcoming = (dateStr: string | null | undefined): boolean => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date >= today && date <= in30Days;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString();
  };

  // Generate alerts
  const alerts: Alert[] = [];

  // Overdue vaccines
  vaccines
    .filter(v => v.next_due_date && isOverdue(v.next_due_date) && v.status !== 'completed')
    .forEach(v => {
      alerts.push({
        id: `vaccine-overdue-${v.id}`,
        type: 'urgent',
        icon: 'mdi:needle',
        title: t('dashboard.alerts.overdueVaccine'),
        description: v.vaccine_name,
        date: v.next_due_date!,
        action: { label: t('dashboard.alerts.viewVaccines'), tab: 'vaccines' }
      });
    });

  // Pending medications
  medications
    .filter(m => m.status === 'pending')
    .forEach(m => {
      const isActive = m.end_date ? new Date(m.end_date) >= today : true;
      if (isActive) {
        alerts.push({
          id: `medication-pending-${m.id}`,
          type: 'warning',
          icon: 'mdi:pill',
          title: t('dashboard.alerts.activeMedication'),
          description: m.medication_name,
          date: m.end_date,
          action: { label: t('dashboard.alerts.viewMedications'), tab: 'medication' }
        });
      }
    });

  // Pending dewormings
  dewormings
    .filter(d => d.status === 'pending')
    .forEach(d => {
      alerts.push({
        id: `deworming-pending-${d.id}`,
        type: 'warning',
        icon: 'mdi:bug',
        title: t('dashboard.alerts.pendingDeworming'),
        description: d.product_name,
        date: d.next_treatment_date,
        action: { label: t('dashboard.alerts.viewDewormings'), tab: 'deworming' }
      });
    });

  // Upcoming vaccines (next 30 days)
  vaccines
    .filter(v => v.next_due_date && isUpcoming(v.next_due_date) && v.status !== 'completed')
    .forEach(v => {
      alerts.push({
        id: `vaccine-upcoming-${v.id}`,
        type: 'upcoming',
        icon: 'mdi:calendar-clock',
        title: t('dashboard.alerts.upcomingVaccine'),
        description: v.vaccine_name,
        date: v.next_due_date!,
        action: { label: t('dashboard.alerts.viewVaccines'), tab: 'vaccines' }
      });
    });

  // Sort alerts by priority: urgent > warning > upcoming > info
  const priorityOrder: Record<AlertType, number> = { urgent: 0, warning: 1, upcoming: 2, info: 3 };
  alerts.sort((a, b) => priorityOrder[a.type] - priorityOrder[b.type]);

  // Calculate stats
  const totalVaccines = vaccines.length;
  const completedVaccines = vaccines.filter(v => v.status === 'completed').length;
  const lastReview = medicalReviews.length > 0
    ? [...medicalReviews].sort((a, b) =>
        new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime()
      )[0]
    : null;

  const urgentCount = alerts.filter(a => a.type === 'urgent').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Icon icon="mdi:paw" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {t('dashboard.welcome', { name: petName })}
            </h2>
            <p className="text-slate-400">
              {alerts.length === 0
                ? t('dashboard.allGood')
                : t('dashboard.alertsCount', { count: alerts.length })}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats
        totalVaccines={totalVaccines}
        completedVaccines={completedVaccines}
        currentWeight={currentWeight}
        totalWeightRecords={weightHistory.length}
        lastReviewDate={lastReview?.visit_date}
        urgentAlerts={urgentCount}
        warningAlerts={warningCount}
        t={t}
      />

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Icon icon="mdi:bell-ring" className="w-5 h-5 text-yellow-400" />
            {t('dashboard.alertsTitle')}
          </h3>
          <div className="grid gap-3">
            {alerts.slice(0, 5).map(alert => (
              <AlertCard
                key={alert.id}
                type={alert.type}
                icon={alert.icon}
                title={alert.title}
                description={alert.description}
                date={alert.date ? formatDate(alert.date) : undefined}
                action={alert.action ? {
                  label: alert.action.label,
                  onClick: () => onNavigateToTab(alert.action!.tab)
                } : undefined}
              />
            ))}
            {alerts.length > 5 && (
              <p className="text-sm text-slate-400 text-center py-2">
                {t('dashboard.moreAlerts', { count: alerts.length - 5 })}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Icon icon="mdi:lightning-bolt" className="w-5 h-5 text-blue-400" />
          {t('dashboard.quickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateToTab('vaccines')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Icon icon="mdi:needle" className="w-5 h-5 text-green-400" />
            </div>
            <span className="text-sm text-slate-300">{t('dashboard.actions.vaccines')}</span>
          </button>
          <button
            onClick={() => onNavigateToTab('medication')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Icon icon="mdi:pill" className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-300">{t('dashboard.actions.medications')}</span>
          </button>
          <button
            onClick={() => onNavigateToTab('weight')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Icon icon="mdi:scale-balance" className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-slate-300">{t('dashboard.actions.weight')}</span>
          </button>
          <button
            onClick={() => onNavigateToTab('medical_reviews')}
            className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Icon icon="mdi:stethoscope" className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-sm text-slate-300">{t('dashboard.actions.reviews')}</span>
          </button>
        </div>
      </div>

      {/* Empty state when no alerts */}
      {alerts.length === 0 && (
        <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Icon icon="mdi:check-circle" className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {t('dashboard.noAlerts.title')}
          </h3>
          <p className="text-slate-400">
            {t('dashboard.noAlerts.description', { name: petName })}
          </p>
        </div>
      )}
    </div>
  );
}
