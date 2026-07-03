import { useCallback, useState } from 'react';
import { api } from '@/lib/apiClient';
import { useAppToast } from '@/hooks/useAppToast';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useStudy } from '@/contexts/StudyContext';

/**
 * Centralizes what "changing the study language" means across the app:
 * 1. Update the local toggle immediately (optimistic).
 * 2. Persist it as the user's preferredLanguage (this is also what the
 *    backend falls back to when generating brand-new material).
 * 3. Re-fetch/translate any flashcards, quiz questions, or summary that
 *    are already loaded in the current session, via the on-demand
 *    translation endpoints, so existing content updates instantly instead
 *    of only affecting the next thing generated.
 *
 * Used by the full settings page language picker and by the compact
 * in-place switcher on the results view.
 */
export function useContentLanguage() {
    const appToast = useAppToast();
    const { language, setLanguage } = useLanguage();
    const { refreshMaterialsForLanguage } = useStudy();
    const [isChanging, setIsChanging] = useState(false);

    const changeLanguage = useCallback(
        async (value: string, options?: { silent?: boolean }) => {
            if (value === language) return;
            const previous = language;
            setLanguage(value as Language);
            setIsChanging(true);
            try {
                await api.updateUserProfile({ preferredLanguage: value });
                await refreshMaterialsForLanguage(value);
                if (!options?.silent) {
                    appToast.success({
                        title: 'Language updated',
                        description:
                            'Your study materials have been switched to the new language.',
                    });
                }
            } catch (error) {
                setLanguage(previous);
                if (!options?.silent) {
                    appToast.apiError(error, 'Language Update Failed');
                }
                throw error;
            } finally {
                setIsChanging(false);
            }
        },
        [language, setLanguage, refreshMaterialsForLanguage, appToast],
    );

    return { language, isChanging, changeLanguage };
}
