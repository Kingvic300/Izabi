'use client';
import { useLanguage } from '@/contexts/LanguageContext';

interface WelcomeHeaderProps {
    firstName?: string;
}

export const WelcomeHeader = ({ firstName }: WelcomeHeaderProps) => {
    const { t } = useLanguage();

    return (
        <div id="dashboard-welcome" className="welcome-text space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/40 leading-tight">
                {t('dashboard.greeting') || 'Welcome back,'}{' '}
                {firstName || 'Scholar'}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                {t('dashboard.intro') ||
                    'Your study workspace is ready. Upload a document to begin.'}
            </p>
        </div>
    );
};