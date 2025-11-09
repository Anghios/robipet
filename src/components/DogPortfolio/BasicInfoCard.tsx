import { Icon } from '@iconify/react';
import { useTranslation } from '../../hooks/useTranslation';

interface BasicInfoCardProps {
  dog_info: {
    birth_date?: string;
    neutered?: boolean;
    age_years?: number;
    age_months?: number;
    species?: string;
    dog_years?: number;
  } | null;
  formatDate: (date: string) => string;
}

export default function BasicInfoCard({ dog_info, formatDate }: BasicInfoCardProps) {
  const { t } = useTranslation();

  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-700/50 p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50 group-hover:border-blue-400/30 transition-colors duration-300">
        <Icon icon="ph:dog-fill" className="w-6 h-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all duration-300" />
        <h3 className="text-xl font-bold text-white group-hover:text-blue-50 transition-colors duration-300">
          {t('home.basicInfo.title')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:calendar" className="w-4 h-4 text-blue-400 group-hover/item:text-blue-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.basicInfo.birthDate')}
          </span>
          <span className={`font-semibold transition-colors duration-200 ${
            dog_info?.birth_date
              ? 'text-white group-hover/item:text-blue-100'
              : 'text-slate-400 group-hover/item:text-slate-300 italic'
          }`}>
            {dog_info?.birth_date ? formatDate(dog_info.birth_date) : '-'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:medical-bag" className="w-4 h-4 text-purple-400 group-hover/item:text-purple-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('common.neutered')}
          </span>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            dog_info?.neutered 
              ? 'bg-green-500/20 text-green-300 group-hover/item:bg-green-500/30 group-hover/item:text-green-200'
              : 'bg-red-500/20 text-red-300 group-hover/item:bg-red-500/30 group-hover/item:text-red-200'
          }`}>
            <Icon 
              icon={dog_info?.neutered ? 'mdi:check' : 'mdi:close'} 
              className="w-3 h-3 group-hover/item:scale-110 transition-transform duration-200" 
            />
            {dog_info?.neutered ? t('common.yes') : t('common.no')}
          </div>
        </div>

        <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
          <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
            <Icon icon="mdi:clock" className="w-4 h-4 text-orange-400 group-hover/item:text-orange-300 group-hover/item:scale-110 transition-all duration-200" />
            {t('home.basicInfo.age')}
          </span>
          <span className="text-white font-semibold group-hover/item:text-orange-100 transition-colors duration-200">
            {dog_info?.age_years || 0} {t('common.years')}, {dog_info?.age_months || 0} {t('common.months')}
          </span>
        </div>

        {dog_info?.species === 'dog' && (
          <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200 group/item">
            <span className="text-slate-300 group-hover:text-slate-200 font-medium flex items-center gap-2 transition-colors duration-200">
              <Icon icon="ph:dog-fill" className="w-4 h-4 text-cyan-400 group-hover/item:text-cyan-300 group-hover/item:scale-110 transition-all duration-200" />
              {t('home.basicInfo.dogAge')}
            </span>
            <span className="text-white font-semibold group-hover/item:text-cyan-100 transition-colors duration-200">
              {dog_info?.dog_years || 0} {t('common.years')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}