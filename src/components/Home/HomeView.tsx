import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import HealthCard from './HealthCard';
import AlertBanner from './AlertBanner';
import PendingItemsButton from './PendingItemsButton';
import PendingItemsModal from './PendingItemsModal';
import Modal from '../ui/Modal';
import { useSettings } from '../../hooks/useSettings';
import { formatDateObj } from '../../utils/petUtils';

interface HomeViewProps {
  portfolio: any;
  onNavigateToSection: (section: string, subSection?: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export default function HomeView({ portfolio, onNavigateToSection, t }: HomeViewProps) {
  const { dog_info, vaccines, medications, dewormings, medical_reviews, weight_history, documents } = portfolio || {};
  const [showPendingModal, setShowPendingModal] = useState(false);
  const { getDateFormat } = useSettings();

  // Calculate alerts
  const alerts = useMemo(() => {
    const now = new Date();
    const alertList: { type: 'urgent' | 'warning' | 'info'; title: string; description: string; action?: () => void }[] = [];

    // Overdue vaccines
    const overdueVaccines = vaccines?.filter((v: any) => {
      if (v.status === 'pending' && v.next_due_date) {
        return new Date(v.next_due_date) < now;
      }
      return false;
    }) || [];

    if (overdueVaccines.length > 0) {
      alertList.push({
        type: 'urgent',
        title: t('home.alerts.overdueVaccines'),
        description: t('home.alerts.overdueVaccinesDesc', { count: overdueVaccines.length }),
        action: () => onNavigateToSection('health', 'vaccines')
      });
    }

    // Active medications
    const activeMeds = medications?.filter((m: any) => m.status === 'pending') || [];
    if (activeMeds.length > 0) {
      alertList.push({
        type: 'info',
        title: t('home.alerts.activeMedications'),
        description: t('home.alerts.activeMedicationsDesc', { count: activeMeds.length }),
        action: () => onNavigateToSection('health', 'medications')
      });
    }

    // Upcoming appointments (next 7 days)
    const upcomingVaccines = vaccines?.filter((v: any) => {
      if (v.next_due_date) {
        const dueDate = new Date(v.next_due_date);
        const diff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return diff > 0 && diff <= 7;
      }
      return false;
    }) || [];

    if (upcomingVaccines.length > 0) {
      alertList.push({
        type: 'warning',
        title: t('home.alerts.upcomingVaccines'),
        description: t('home.alerts.upcomingVaccinesDesc', { count: upcomingVaccines.length }),
        action: () => onNavigateToSection('health', 'vaccines')
      });
    }

    return alertList;
  }, [vaccines, medications, t, onNavigateToSection]);

  // Current weight
  const currentWeight = weight_history?.length > 0
    ? weight_history.reduce((latest: any, w: any) =>
        new Date(w.measurement_date) > new Date(latest.measurement_date) ? w : latest
      )
    : null;

  // Recent activity count
  const recentActivityCount = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let count = 0;
    vaccines?.forEach((v: any) => {
      if (new Date(v.vaccine_date) > thirtyDaysAgo) count++;
    });
    medications?.forEach((m: any) => {
      if (new Date(m.start_date) > thirtyDaysAgo) count++;
    });
    medical_reviews?.forEach((r: any) => {
      if (new Date(r.visit_date) > thirtyDaysAgo) count++;
    });
    return count;
  }, [vaccines, medications, medical_reviews]);

  // Pet age calculation
  const petAge = useMemo(() => {
    if (!dog_info?.birth_date) return null;
    const birth = new Date(dog_info.birth_date);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) { years--; months += 12; }

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} ${years === 1 ? t('home.year') : t('home.years')}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? t('home.month') : t('home.months')}`);
    parts.push(`${days} ${days === 1 ? t('home.day') : t('home.days')}`);
    if (parts.length <= 1) return parts[0];
    return parts.slice(0, -1).join(', ') + ` ${t('home.and')} ` + parts[parts.length - 1];
  }, [dog_info?.birth_date, t]);

  // Pending items count
  const totalPending = useMemo(() => {
    const pVaccines = vaccines?.filter((v: any) => {
      const s = v.status || 'pending';
      return s === 'pending' || s === 'overdue';
    }).length || 0;
    const pMeds = medications?.filter((m: any) => (m.status || 'pending') === 'pending').length || 0;
    const pDeworm = dewormings?.filter((d: any) => (d.status || 'pending') === 'pending').length || 0;
    const pReviews = medical_reviews?.filter((r: any) => (r.status || 'completed') === 'pending').length || 0;
    return pVaccines + pMeds + pDeworm + pReviews;
  }, [vaccines, medications, dewormings, medical_reviews]);

  // Format date helper
  const formatDateLocal = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return formatDateObj(date, getDateFormat());
  };

  // Dog years calculation (only for dogs)
  const dogYears = useMemo(() => {
    if (!dog_info?.birth_date || dog_info?.species !== 'dog') return null;
    const birth = new Date(dog_info.birth_date);
    const now = new Date();
    const ageInYears = Math.floor(Math.abs(now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)) / 365.25;
    const totalDogYears = ageInYears >= 1 ? 15 + ((ageInYears - 1) * 4) : ageInYears * 15;
    const yrs = Math.floor(totalDogYears);
    const mos = Math.floor((totalDogYears - yrs) * 12);
    const dys = Math.floor(((totalDogYears - yrs) * 12 - mos) * 30);
    const parts: string[] = [];
    if (yrs > 0) parts.push(`${yrs} ${yrs === 1 ? t('home.year') : t('home.years')}`);
    if (mos > 0) parts.push(`${mos} ${mos === 1 ? t('home.month') : t('home.months')}`);
    parts.push(`${dys} ${dys === 1 ? t('home.day') : t('home.days')}`);
    if (parts.length <= 1) return parts[0];
    return parts.slice(0, -1).join(', ') + ` ${t('home.and')} ` + parts[parts.length - 1];
  }, [dog_info?.birth_date, dog_info?.species, t]);

  return (
    <div className="space-y-6">
      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <AlertBanner
              key={index}
              type={alert.type}
              title={alert.title}
              description={alert.description}
              onAction={alert.action}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Pet Quick Info */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/80 to-slate-800/40 rounded-2xl border border-slate-700/50">
        {dog_info?.photo_url ? (
          <img
            src={dog_info.photo_url}
            alt={dog_info.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-600"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-slate-600">
            <Icon icon="mdi:paw" className="w-8 h-8 text-white" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate">{dog_info?.name}</h2>
          <p className="text-slate-400 text-sm flex items-center gap-1.5"><Icon icon="mdi:dog" className="w-3.5 h-3.5 text-emerald-400" />{dog_info?.breed}</p>
          {petAge && <p className="text-slate-400 text-sm flex items-center gap-1.5"><Icon icon="mdi:clock" className="w-3.5 h-3.5 text-orange-400" />{petAge}</p>}
          {dogYears !== null && <p className="text-slate-400 text-sm flex items-center gap-1.5"><Icon icon="mdi:account" className="w-3.5 h-3.5 text-cyan-400" />{dogYears} ({t('home.humanYears')})</p>}
        </div>
        <div className="text-right">
          {currentWeight && (
            <p className="text-2xl font-bold text-white">{currentWeight.weight_kg} <span className="text-sm text-slate-500">kg</span></p>
          )}
          {dog_info?.birth_date && (() => {
            const now = new Date();
            const birth = new Date(dog_info.birth_date);
            const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
            if (nextBirthday < now && nextBirthday.toDateString() !== now.toDateString()) {
              nextBirthday.setFullYear(now.getFullYear() + 1);
            }
            const diffDays = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return (
              <p className="text-xs text-slate-500 mt-1 flex items-center justify-end gap-1">
                <Icon icon={diffDays === 0 ? 'mdi:party-popper' : 'mdi:cake-variant'} className={`w-3.5 h-3.5 ${diffDays === 0 ? 'text-yellow-400' : 'text-pink-400'}`} />
                {diffDays === 0 ? t('home.birthdayToday') : t('home.daysUntilBirthday', { days: diffDays })}
              </p>
            );
          })()}
        </div>
      </div>

      {/* Pending Items Button */}
      <PendingItemsButton
        totalPending={totalPending}
        onClick={() => setShowPendingModal(true)}
        t={t}
      />

      {/* Main Health Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        <HealthCard
          icon="mdi:needle"
          iconColor="text-green-400"
          bgGradient="from-green-500/20 to-green-600/10"
          borderColor="border-green-500/20"
          title={t('home.cards.vaccines')}
          value={vaccines?.length || 0}
          subtitle={t('home.cards.total')}
          onClick={() => onNavigateToSection('health', 'vaccines')}
        />

        <HealthCard
          icon="mdi:pill"
          iconColor="text-blue-400"
          bgGradient="from-blue-500/20 to-blue-600/10"
          borderColor="border-blue-500/20"
          title={t('home.cards.medications')}
          value={medications?.filter((m: any) => m.status === 'pending').length || 0}
          subtitle={t('home.cards.active')}
          onClick={() => onNavigateToSection('health', 'medications')}
        />

        <HealthCard
          icon="mdi:stethoscope"
          iconColor="text-purple-400"
          bgGradient="from-purple-500/20 to-purple-600/10"
          borderColor="border-purple-500/20"
          title={t('home.cards.reviews')}
          value={medical_reviews?.length || 0}
          subtitle={t('home.cards.visits')}
          onClick={() => onNavigateToSection('health', 'reviews')}
        />

        <HealthCard
          icon="mdi:file-document-multiple"
          iconColor="text-teal-400"
          bgGradient="from-teal-500/20 to-teal-600/10"
          borderColor="border-teal-500/20"
          title={t('home.cards.documents')}
          value={documents?.length || 0}
          subtitle={t('home.cards.files')}
          onClick={() => onNavigateToSection('documents')}
        />
      </div>

      {/* Weight Trend Card */}
      {weight_history && weight_history.length > 0 && (
        <HealthCard
          icon="mdi:chart-line"
          iconColor="text-cyan-400"
          bgGradient="from-cyan-500/20 to-cyan-600/10"
          borderColor="border-cyan-500/20"
          title={t('home.cards.weightTrend')}
          value={currentWeight?.weight_kg || 0}
          valueUnit="kg"
          subtitle={t('home.cards.currentWeight')}
          onClick={() => onNavigateToSection('health', 'weight')}
          fullWidth
          showChart
          chartData={weight_history.slice(-10).map((w: any) => ({
            date: w.measurement_date,
            value: w.weight_kg
          }))}
        />
      )}

      {/* Timeline Preview */}
      <div
        onClick={() => onNavigateToSection('health', 'timeline')}
        className="p-5 bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl border border-slate-700/50 cursor-pointer hover:border-slate-600 transition-all group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center">
              <Icon icon="mdi:timeline-clock-outline" className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{t('home.cards.recentActivity')}</h3>
              <p className="text-sm text-slate-500">
                {t('home.cards.last30Days', { count: recentActivityCount })}
              </p>
            </div>
          </div>
          <Icon
            icon="mdi:chevron-right"
            className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors"
          />
        </div>

        {/* Mini timeline preview */}
        <div className="flex items-center gap-2">
          {['green', 'blue', 'purple', 'orange', 'cyan'].map((color, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full bg-${color}-500/30`}
              style={{
                width: `${Math.random() * 50 + 20}%`
              }}
            />
          ))}
        </div>
      </div>
      {/* Pending Items Modal */}
      <Modal
        isOpen={showPendingModal}
        onClose={() => setShowPendingModal(false)}
        title={t('home.pending.title')}
        size="lg"
      >
        <PendingItemsModal
          vaccines={vaccines || []}
          medications={medications || []}
          dewormings={dewormings || []}
          medicalReviews={medical_reviews || []}
          onNavigate={onNavigateToSection}
          onClose={() => setShowPendingModal(false)}
          t={t}
          formatDate={formatDateLocal}
        />
      </Modal>
    </div>
  );
}
