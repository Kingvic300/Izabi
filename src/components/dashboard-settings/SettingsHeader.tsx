import { useLanguage } from '@/contexts/LanguageContext';

type SettingsHeaderProps = {
    subtitle?: string;
};

export default function SettingsHeader({ subtitle }: SettingsHeaderProps) {
    const { t } = useLanguage();
    return (
        <div className="settings-header">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter leading-none mb-2">
                {t('settings.header_title_top')}{' '}
                <span className="text-gradient">
                    {t('settings.header_title_gradient')}
                </span>
            </h1>
            <p className="text-muted-foreground font-medium text-base sm:text-lg">
                {subtitle || t('settings.header_subtitle')}
            </p>
        </div>
    );
}
