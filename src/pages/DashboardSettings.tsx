'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDashboardSettings } from '@/components/dashboard-settings/useDashboardSettings';
import SettingsHeader from '@/components/dashboard-settings/SettingsHeader';
import AppearanceSection from '@/components/dashboard-settings/AppearanceSection';
import LanguageSection from '@/components/dashboard-settings/LanguageSection';
import NotificationsSection from '@/components/dashboard-settings/NotificationsSection';
import PrivacySection from '@/components/dashboard-settings/PrivacySection';

const DashboardSettings = () => {
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

    useGSAP(
        () => {
            const tl = gsap.timeline();
            tl.from('.settings-header', {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: 'expo.out',
            }).from(
                '.settings-card',
                {
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'expo.out',
                },
                '-=0.4',
            );
        },
        { scope: containerRef },
    );

    return (
        <div
            ref={containerRef}
            className="space-y-8 md:space-y-12 w-full min-w-0 pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12"
        >
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                        Settings
                    </span>
                </div>
                <div className="glass-card border-foreground/10 rounded-[28px] p-5 sm:p-6">
                    <SettingsHeader />
                </div>
            </div>

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

            <style>{`
                .shadow-glow {
                     box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
                }
            `}</style>
        </div>
    );
};

export default DashboardSettings;
