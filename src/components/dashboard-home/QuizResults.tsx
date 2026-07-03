'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuizResultsProps {
    score: number;
    total: number;
    onFinalize?: () => void;
    isResultsView?: boolean;
}

export const QuizResults = ({ score, total, onFinalize, isResultsView }: QuizResultsProps) => {
    const { t } = useLanguage();
    const percentage = Math.round((score / total) * 100);

    if (!isResultsView) {
        return (
            <div className="pt-8">
                <Button
                    onClick={onFinalize}
                    className="w-full h-16 md:h-20 rounded-2xl md:rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg md:text-2xl shadow-glow group"
                >
                    <span>{t('quiz.finalize')}</span>
                </Button>
            </div>
        );
    }

    return (
        <div
            id="mastery-verdict"
            className="p-4 md:p-10 rounded-2xl md:rounded-3xl bg-primary relative overflow-hidden group shadow-glow"
        >
            <div className="absolute inset-0 bg-background/10 transition-colors" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tighter">
                        {t('quiz.mastery_confirmed_title')}
                    </h3>
                    <p className="text-foreground/70 font-bold text-base md:text-lg">
                        {t('quiz.mastery_confirmed_desc')}
                    </p>
                </div>
                <div className="flex items-center gap-4 md:gap-8 glass p-4 md:p-8 rounded-2xl md:rounded-3xl border-foreground/20 bg-background/20">
                    <div className="text-center">
                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-2">
                            {t('quiz.score_label')}
                        </div>
                        <div className="text-2xl md:text-4xl font-bold text-foreground">
                            {score} / {total}
                        </div>
                    </div>
                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-primary text-primary-foreground flex items-center justify-center text-lg md:text-2xl font-bold shadow-glow">
                        {percentage}%
                    </div>
                </div>
            </div>
        </div>
    );
};