'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface WelcomeHeaderProps {
    firstName?: string;
}

export const WelcomeHeader = ({ firstName }: WelcomeHeaderProps) => {
    const { t } = useLanguage();
    
    const today = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });

    return (
        <div id="dashboard-welcome" className="welcome-text space-y-4">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
            >
                <div className="h-px w-8 bg-primary/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                    {today}
                </span>
            </motion.div>
            
            <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none">
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-foreground/40">
                        {t('dashboard.greeting') || 'Greetings,'}
                    </span>
                    <br />
                    <span className="text-primary italic">
                        {firstName || 'Scholar'}
                    </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed opacity-70">
                    {t('dashboard.intro') ||
                        'Your cognitive workspace is ready. What shall we master today?'}
                </p>
            </div>
        </div>
    );
};