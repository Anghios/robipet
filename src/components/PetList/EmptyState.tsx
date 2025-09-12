import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface EmptyStateProps {
  onAddPet: () => void;
}

export default function EmptyState({ onAddPet }: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🐾</div>
      <h3 className="text-xl font-bold text-dark-primary mb-2">{t('petList.emptyState.title')}</h3>
      <p className="text-dark-secondary mb-6">{t('petList.emptyState.subtitle')}</p>
      <button
        onClick={onAddPet}
        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
      >
        <Icon icon="mdi:plus" className="w-5 h-5" />
        {t('petList.emptyState.addButton')}
      </button>
    </div>
  );
}