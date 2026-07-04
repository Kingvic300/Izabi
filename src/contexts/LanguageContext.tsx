import { createContext, useContext, useState } from 'react';
import { api } from '@/lib/apiClient';
import { translations, type Language } from './translations';

export type { Language };

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language, persist?: boolean) => Promise<void>;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(
        () => (localStorage.getItem('izabi-lang') as Language) || 'en',
    );

    const setLanguage = async (lang: Language, persist = true) => {
        localStorage.setItem('izabi-lang', lang);
        setLanguageState(lang);

        if (!persist || !localStorage.getItem('authToken')) return;

        // Keeps AI generation (quiz/summary/flashcards) and voice output in
        // sync with the visible language switch, since the backend resolves
        // language from the saved user profile, not from this client state.
        await api.updateUserProfile({ preferredLanguage: lang });
    };

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
