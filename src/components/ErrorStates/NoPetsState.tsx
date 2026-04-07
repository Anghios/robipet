import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

export default function NoPetsState() {
  const { t } = useTranslation();
  
  return (
    <div className="flex-1 bg-slate-900 p-6 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">
          🐕
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {t('no_pets.title', 'No existen animales añadidos')}
        </h2>
        <p className="text-slate-300 mb-8 text-lg">
          {t('no_pets.subtitle', 'Añade tu primera mascota para comenzar a gestionar su información médica y seguimiento.')}
        </p>
        <a
          href="/pets"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Icon icon="mdi:plus-circle" className="w-5 h-5" />
          {t('no_pets.add_button', 'Añadir ahora')}
        </a>
      </div>
    </div>
  );
}