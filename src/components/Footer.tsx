import { Icon } from '@iconify/react';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700/50 bg-slate-800/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Top: Brand + Social */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 bg-slate-700/60 rounded-lg overflow-hidden">
              <img src="/logo.png" alt="Robipet Logo" className="w-5 h-5 object-contain" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Robipet</span>
            <span className="text-xs font-medium text-blue-400/80 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">v2.0.0</span>
          </div>

          <div className="flex items-center gap-1">
            <a href="mailto:nestor@banshee.pro" className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg" title={t('footer.contactEmail')}>
              <Icon icon="mdi:email-outline" className="w-4 h-4" />
            </a>
            <a href="https://robipet.anghios.es/" target="_blank" className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg" title={t('footer.website')}>
              <Icon icon="mdi:web" className="w-4 h-4" />
            </a>
            <a href="https://github.com/Anghios/robipet" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg" title={t('footer.viewCode')}>
              <Icon icon="mdi:github" className="w-4 h-4" />
            </a>
            <a href="https://discord.com/invite/mrBTb9pNqm" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg" title={t('footer.joinDiscord')}>
              <Icon icon="mdi:discord" className="w-4 h-4" />
            </a>
            <a href="https://robipet.anghios.es/donate" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg" title={t('footer.supportProject')}>
              <Icon icon="mdi:heart-outline" className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-xs text-center sm:text-left mb-4">
          {t('footer.description')}
        </p>

        {/* Bottom: Copyright + Links */}
        <div className="pt-3 border-t border-slate-700/30 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <span className="text-slate-600">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </span>
          <div className="flex gap-4">
            <a href="https://github.com/Anghios/robipet/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">
              {t('footer.termsOfUse')}
            </a>
            <a href="mailto:nestor@banshee.pro" className="text-slate-500 hover:text-slate-300 transition-colors">
              {t('footer.support')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
