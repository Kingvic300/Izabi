import SettingsSection from './SettingsSection';
import type { SettingsState } from './settingsTypes';
import SettingRow from './SettingRow';
import { useLanguage } from '@/contexts/LanguageContext';

type NotificationsSectionProps = {
    settings: SettingsState;
    onToggle: (key: keyof SettingsState, value?: boolean) => void;
};

export default function NotificationsSection({
    settings,
    onToggle,
}: NotificationsSectionProps) {
    const { t } = useLanguage();
    return (
        <SettingsSection
            title={t('settings.notifications_title')}
            description={t('settings.notifications_desc')}
        >
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
                <SettingRow
                    title={t('settings.email_notif_title')}
                    description={t('settings.email_notif_desc')}
                    isChecked={settings.emailNotifications}
                    onToggle={(checked) =>
                        onToggle('emailNotifications', checked)
                    }
                />
                <SettingRow
                    title={t('settings.study_reminders_title')}
                    description={t('settings.study_reminders_desc')}
                    isChecked={settings.studyReminders}
                    onToggle={(checked) =>
                        onToggle('studyReminders', checked)
                    }
                />
            </div>
        </SettingsSection>
    );
}
