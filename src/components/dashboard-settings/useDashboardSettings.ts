import { useEffect, useState } from 'react';
import { useAppToast } from '@/hooks/useAppToast';
import { useTheme } from '@/components/theme-provider';
import { api } from '@/lib/apiClient';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { languageOptions } from './settingsConstants';
import type { SettingsState } from './settingsTypes';

const initialSettings = (theme: SettingsState['theme']): SettingsState => ({
    emailNotifications: true,
    studyReminders: true,
    theme,
    publicProfile: false,
});

export const useDashboardSettings = () => {
    const appToast = useAppToast();
    const { theme, setTheme: setGlobalTheme } = useTheme();
    const { language, setLanguage } = useLanguage();

    const [settings, setSettings] = useState<SettingsState>(() =>
        initialSettings(theme as SettingsState['theme']),
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isLanguageSaving, setIsLanguageSaving] = useState(false);

    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings((prev) => ({
                    ...prev,
                    ...parsed,
                    theme: theme as SettingsState['theme'],
                }));
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        }
    }, [theme]);

    useEffect(() => {
        const hydrateLanguageFromProfile = async () => {
            try {
                const profile = await api.getUserProfile();
                const preferred = String(
                    profile?.data?.preferredLanguage || '',
                )
                    .trim()
                    .toLowerCase();
                if (
                    preferred &&
                    languageOptions.some((opt) => opt.value === preferred) &&
                    preferred !== language
                ) {
                    setLanguage(preferred as Language);
                }
            } catch (error) {
                console.error('Error loading preferred language:', error);
            }
        };

        hydrateLanguageFromProfile();
    }, [setLanguage]);

    const handleToggle = (
        key: keyof SettingsState,
        nextValue?: boolean | string,
    ) => {
        const currentValue = settings[key];
        const resolvedValue =
            typeof nextValue !== 'undefined'
                ? nextValue
                : typeof currentValue === 'boolean'
                  ? !currentValue
                  : currentValue;
        const updatedSettings = { ...settings, [key]: resolvedValue };
        setSettings(updatedSettings);
        localStorage.setItem('userSettings', JSON.stringify(updatedSettings));

        const settingNames: Record<string, string> = {
            emailNotifications: 'Email notifications',
            studyReminders: 'Study reminders',
            publicProfile: 'Profile visibility',
        };

        const settingName = settingNames[key] || key;
        const status = resolvedValue ? 'enabled' : 'disabled';

        appToast.success({
            title: `${settingName} ${status}`,
            description: 'Your preference has been saved successfully.',
        });

        if (key === 'studyReminders' && resolvedValue) {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                            appToast.info({
                                title: 'Reminders Enabled',
                                description:
                                    'Browser reminders are now allowed on this device.',
                            });
                        }
                    });
                }
            }
        }
    };

    const handleThemeChange = (value: string) => {
        const themeValue = (value === 'auto' ? 'system' : value) as SettingsState['theme'];
        setGlobalTheme(themeValue);

        setSettings((prev) => ({
            ...prev,
            theme: themeValue,
        }));

        appToast.success({
            title: 'Theme updated',
            description: `Your theme has been changed to ${value} mode.`,
        });
    };

    const handleLanguageChange = async (value: string) => {
        if (value === language) return;
        const previous = language;
        setLanguage(value as Language);
        setIsLanguageSaving(true);
        try {
            await api.updateUserProfile({ preferredLanguage: value });
            appToast.success({
                title: 'Language updated',
                description:
                    'Izabi will generate and speak content in your selected language.',
            });
        } catch (error) {
            setLanguage(previous);
            appToast.apiError(error, 'Language Update Failed');
        } finally {
            setIsLanguageSaving(false);
        }
    };

    const handleDownloadData = async () => {
        setIsSaving(true);
        appToast.info({
            title: 'Preparing Data Export',
            description: 'Collecting your profile, notes, and study history...',
        });

        try {
            const [profileResult, notesResult, historyResult, quizResult] =
                await Promise.allSettled([
                    api.getUserProfile(),
                    api.getNotes(),
                    api.getStudyHistory(),
                    api.getQuizResults(),
                ]);

            const exportPayload = {
                generatedAt: new Date().toISOString(),
                profile:
                    profileResult.status === 'fulfilled'
                        ? profileResult.value?.data ?? profileResult.value
                        : null,
                notes:
                    notesResult.status === 'fulfilled'
                        ? notesResult.value?.data ?? notesResult.value
                        : [],
                studyHistory:
                    historyResult.status === 'fulfilled'
                        ? historyResult.value?.data ?? historyResult.value
                        : [],
                quizResults:
                    quizResult.status === 'fulfilled'
                        ? quizResult.value?.data ?? quizResult.value
                        : [],
            };

            const allFailed =
                profileResult.status === 'rejected' &&
                notesResult.status === 'rejected' &&
                historyResult.status === 'rejected' &&
                quizResult.status === 'rejected';

            if (allFailed) {
                throw new Error(
                    'Could not fetch your account data. Please try again.',
                );
            }

            const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.href = url;
            link.download = `izabi-data-export-${stamp}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            appToast.success({
                title: 'Download Ready',
                description: 'Your data export was downloaded successfully.',
            });
        } catch (error) {
            appToast.apiError(error, 'Export Failed');
        } finally {
            setIsSaving(false);
        }
    };

    return {
        settings,
        isSaving,
        isLanguageSaving,
        language,
        handleToggle,
        handleThemeChange,
        handleLanguageChange,
        handleDownloadData,
    };
};
