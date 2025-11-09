import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface PhysicalDataCardProps {
  dog_info: {
    breed?: string;
    color?: string;
    size?: string;
    microchip?: string;
  } | null;
  getSizeText: (size: string) => string;
  getCurrentWeight: () => number;
}

export default function PhysicalDataCard({ dog_info, getSizeText, getCurrentWeight }: PhysicalDataCardProps) {
  const { t } = useTranslation();

  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/50 p-6 hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-400/30 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50 group-hover:border-purple-400/30 transition-colors duration-300">
        <Icon icon="fluent:data-usage-16-regular" className="w-6 h-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
        <h3 className="text-xl font-bold text-white group-hover:text-purple-50 transition-colors duration-300">
          {t('home.physicalData.title')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:dog" className="w-4 h-4 text-emerald-400 group-hover/item:text-emerald-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.basicInfo.breed')}
          </span>
          <span className={`font-semibold transition-colors duration-200 ${
            dog_info?.breed
              ? 'text-white group-hover/item:text-emerald-100'
              : 'text-slate-400 group-hover/item:text-slate-300 italic'
          }`}>
            {dog_info?.breed || '-'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:palette" className="w-4 h-4 text-rose-400 group-hover/item:text-rose-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.basicInfo.color')}
          </span>
          <span className={`font-semibold transition-colors duration-200 ${
            dog_info?.color
              ? 'text-white group-hover/item:text-rose-100'
              : 'text-slate-400 group-hover/item:text-slate-300 italic'
          }`}>
            {dog_info?.color || '-'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:resize" className="w-4 h-4 text-amber-400 group-hover/item:text-amber-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.physicalData.size')}
          </span>
          <span className="text-white font-semibold group-hover/item:text-amber-100 transition-colors duration-200">
            {getSizeText(dog_info?.size || 'medium', t)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:weight" className="w-4 h-4 text-teal-400 group-hover/item:text-teal-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.physicalData.currentWeight')}
          </span>
          <span className="text-white font-semibold group-hover/item:text-teal-100 transition-colors duration-200">
            {getCurrentWeight()} kg
          </span>
        </div>

        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:chip" className="w-4 h-4 text-indigo-400 group-hover/item:text-indigo-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.physicalData.microchip')}
          </span>
          <span className={`font-mono text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
            dog_info?.microchip && dog_info.microchip !== t('portfolio.physicalData.noMicrochip')
              ? 'bg-indigo-500/20 text-indigo-300 group-hover/item:bg-indigo-500/30 group-hover/item:text-indigo-200'
              : 'bg-slate-500/20 text-slate-400 group-hover/item:bg-slate-500/30 group-hover/item:text-slate-300'
          }`}>
            {dog_info?.microchip || t('portfolio.physicalData.noMicrochip')}
          </span>
        </div>
      </div>
    </div>
  );
}