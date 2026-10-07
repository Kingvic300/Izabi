import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import SettingsSection from './SettingsSection';
import SettingRow from './SettingRow';
import type { SettingsState } from './settingsTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type PrivacySectionProps = {
    settings: SettingsState;
    isSaving: boolean;
    onToggle: (key: keyof SettingsState, value?: boolean) => void;
    onDownloadData: () => void;
};

export default function PrivacySection({
    settings,
    isSaving,
    onToggle,
    onDownloadData,
}: PrivacySectionProps) {
    const { t } = useLanguage();
    return (
        <SettingsSection
            title={t('settings.privacy_title')}
            description={t('settings.privacy_desc')}
        >
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
                <SettingRow
                    title={t('settings.public_profile_title')}
                    description={t('settings.public_profile_desc')}
                    isChecked={settings.publicProfile}
                    onToggle={(checked) => onToggle('publicProfile', checked)}
                    badge={t('settings.beta_badge')}
                />
                <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="font-bold">{t('settings.export_title')}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {t('settings.export_desc')}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={onDownloadData}
                        disabled={isSaving}
                        className="shrink-0"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin" />
                                {t('settings.packaging')}
                            </>
                        ) : (
                            <>
                                <Download />
                                {t('settings.download')}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </SettingsSection>
    );
}
