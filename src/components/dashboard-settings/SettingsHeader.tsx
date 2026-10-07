import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/dashboard/PageHeader';

type SettingsHeaderProps = {
    subtitle?: string;
};

export default function SettingsHeader({ subtitle }: SettingsHeaderProps) {
    const { t } = useLanguage();
    return (
        <PageHeader
            title="Settings"
            description={subtitle || t('settings.header_subtitle')}
        />
    );
}
