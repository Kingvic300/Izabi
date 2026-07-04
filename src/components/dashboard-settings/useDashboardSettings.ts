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
    const { language, setLanguage, t } = useLanguage();

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
                    // Just mirrors the already-saved profile value locally;
                    // no need to write it straight back to the backend.
                    setLanguage(preferred as Language, false);
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
            emailNotifications: t('settings.name_email_notifications'),
            studyReminders: t('settings.name_study_reminders'),
            publicProfile: t('settings.name_profile_visibility'),
        };

        const settingName = settingNames[key] || key;
        const status = resolvedValue
            ? t('settings.status_enabled')
            : t('settings.status_disabled');

        appToast.success({
            title: `${settingName} ${status}`,
            description: t('settings.toast_preference_saved_desc'),
        });

        if (key === 'studyReminders' && resolvedValue) {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'default') {
                    Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                            appToast.info({
                                title: t('settings.toast_reminders_enabled_title'),
                                description: t(
                                    'settings.toast_reminders_enabled_desc',
                                ),
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
            title: t('settings.toast_theme_updated_title'),
            description: `${t('settings.toast_theme_updated_desc_prefix')} ${value} ${t('settings.toast_theme_updated_desc_suffix')}`,
        });
    };

    const handleLanguageChange = async (value: string) => {
        if (value === language) return;
        const previous = language;
        setIsLanguageSaving(true);
        try {
            await setLanguage(value as Language);
            appToast.success({
                title: t('settings.toast_language_updated_title'),
                description: t('settings.toast_language_updated_desc'),
            });
        } catch (error) {
            setLanguage(previous, false).catch(() => {});
            appToast.apiError(error, t('settings.toast_language_update_failed'));
        } finally {
            setIsLanguageSaving(false);
        }
    };

    const handleDownloadData = async () => {
        setIsSaving(true);
        appToast.info({
            title: t('settings.toast_preparing_export_title'),
            description: t('settings.toast_preparing_export_desc'),
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
                title: t('settings.toast_download_ready_title'),
                description: t('settings.toast_download_ready_desc'),
            });
        } catch (error) {
            appToast.apiError(error, t('settings.toast_export_failed'));
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
