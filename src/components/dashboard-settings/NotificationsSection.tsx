import { Bell, Mail, Smartphone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { SettingsState } from './settingsTypes';
import SettingRow from './SettingRow';

type NotificationsSectionProps = {
    settings: SettingsState;
    onToggle: (key: keyof SettingsState, value?: boolean) => void;
};

export default function NotificationsSection({
    settings,
    onToggle,
}: NotificationsSectionProps) {
    return (
        <Card className="settings-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 md:px-8 md:py-6 border-b border-foreground/5">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Bell className="text-primary" />
                    Alert Signals
                </CardTitle>
                <CardDescription>
                    Manage how usage data propagates to you
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <SettingRow
                    title="Email Notifications"
                    description="Receive weekly summaries and major updates"
                    isChecked={settings.emailNotifications}
                    onToggle={(checked) =>
                        onToggle('emailNotifications', checked)
                    }
                    icon={<Mail size={20} />}
                />
                <div className="h-[1px] w-full bg-foreground/5 mx-8" />
                <SettingRow
                    title="Study Reminders"
                    description="Nudges to maintain your learning streak"
                    isChecked={settings.studyReminders}
                    onToggle={(checked) =>
                        onToggle('studyReminders', checked)
                    }
                    icon={<Smartphone size={20} />}
                />
            </CardContent>
        </Card>
    );
}
