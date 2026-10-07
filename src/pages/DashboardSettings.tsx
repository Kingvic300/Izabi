'use client';

import { useRef } from 'react';
import { useDashboardSettings } from '@/components/dashboard-settings/useDashboardSettings';
import SettingsHeader from '@/components/dashboard-settings/SettingsHeader';
import AppearanceSection from '@/components/dashboard-settings/AppearanceSection';
import LanguageSection from '@/components/dashboard-settings/LanguageSection';
import NotificationsSection from '@/components/dashboard-settings/NotificationsSection';
import PrivacySection from '@/components/dashboard-settings/PrivacySection';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardSettings = () => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        settings,
        isSaving,
        isLanguageSaving,
        language,
        handleToggle,
        handleThemeChange,
        handleLanguageChange,
        handleDownloadData,
    } = useDashboardSettings();


    return (
        <div
            ref={containerRef}
            className="w-full min-w-0 space-y-8 pb-16"
        >
            <SettingsHeader />

            <AppearanceSection
                currentTheme={settings.theme}
                onThemeChange={handleThemeChange}
            />

            <LanguageSection
                language={language}
                isLanguageSaving={isLanguageSaving}
                onLanguageChange={handleLanguageChange}
            />

            <NotificationsSection
                settings={settings}
                onToggle={handleToggle}
            />

            <PrivacySection
                settings={settings}
                isSaving={isSaving}
                onToggle={handleToggle}
                onDownloadData={handleDownloadData}
            />
        </div>
    );
};

export default DashboardSettings;
