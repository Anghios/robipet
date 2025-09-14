import { Icon } from '@iconify/react';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Brand Section */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden">
              <img src="/logo.png" alt="Robipet Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-lg font-bold text-white">Robipet v1.0.2</span>
          </div>
          <p className="text-white/70 text-sm mb-4 max-w-md mx-auto">
            {t('footer.description')}
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="mailto:nestor@banshee.pro" className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" title={t('footer.contactEmail')}>
              <Icon icon="mdi:email-outline" className="w-6 h-6" />
            </a>
            <a href="https://robipet.anghios.es/" target="_blank" className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" title={t('footer.website')}>
              <Icon icon="mdi:web" className="w-6 h-6" />
            </a>
            <a href="https://github.com/Anghios/robipet" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" title={t('footer.viewCode')}>
              <Icon icon="mdi:github" className="w-6 h-6" />
            </a>
            <a href="https://discord.com/invite/mrBTb9pNqm" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" title={t('footer.joinDiscord')}>
              <Icon icon="mdi:discord" className="w-6 h-6" />
            </a>
            <a href="https://robipet.anghios.es/donate" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" title={t('footer.supportProject')}>
              <Icon icon="mdi:heart-outline" className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            {t('footer.copyright').replace('{year}', currentYear.toString())}
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              {t('footer.privacyPolicy')}
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              {t('footer.termsOfUse')}
            </a>
            <a href="mailto:nestor@banshee.pro" className="text-white/50 hover:text-white transition-colors">
              {t('footer.support')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}