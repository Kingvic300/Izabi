import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Moon, Palette, Sun } from 'lucide-react';
import ThemeOption from './ThemeOption';
import type { SettingsState } from './settingsTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type AppearanceSectionProps = {
    currentTheme: SettingsState['theme'];
    onThemeChange: (value: string) => void;
};

export default function AppearanceSection({
    currentTheme,
    onThemeChange,
}: AppearanceSectionProps) {
    const { t } = useLanguage();
    return (
        <Card className="settings-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
            <CardHeader className="px-6 py-4 md:px-8 md:py-6 border-b border-foreground/5">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Palette className="text-primary" />
                    {t('settings.appearance_title')}
                </CardTitle>
                <CardDescription>{t('settings.appearance_desc')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ThemeOption
                        value="light"
                        current={currentTheme}
                        onClick={() => onThemeChange('light')}
                        icon={<Sun size={24} />}
                        title={t('settings.theme_light')}
                    />
                    <ThemeOption
                        value="dark"
                        current={currentTheme}
                        onClick={() => onThemeChange('dark')}
                        icon={<Moon size={24} />}
                        title={t('settings.theme_dark')}
                    />
                    <ThemeOption
                        value="system"
                        current={currentTheme === 'system' ? 'system' : 'auto'}
                        onClick={() => onThemeChange('auto')}
                        icon={<Monitor size={24} />}
                        title={t('settings.theme_system')}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
