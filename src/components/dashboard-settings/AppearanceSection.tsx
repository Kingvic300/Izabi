import { Monitor, Moon, Sun } from 'lucide-react';
import SettingsSection from './SettingsSection';
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
        <SettingsSection
            title={t('settings.appearance_title')}
            description={t('settings.appearance_desc')}
        >
                <div role="radiogroup" aria-label={t('settings.appearance_title')} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <ThemeOption
                        value="light"
                        current={currentTheme}
                        onClick={() => onThemeChange('light')}
                        icon={<Sun size={18} />}
                        title={t('settings.theme_light')}
                    />
                    <ThemeOption
                        value="dark"
                        current={currentTheme}
                        onClick={() => onThemeChange('dark')}
                        icon={<Moon size={18} />}
                        title={t('settings.theme_dark')}
                    />
                    <ThemeOption
                        value="system"
                        current={currentTheme === 'system' ? 'system' : 'auto'}
                        onClick={() => onThemeChange('auto')}
                        icon={<Monitor size={18} />}
                        title={t('settings.theme_system')}
                    />
                </div>
        </SettingsSection>
    );
}
