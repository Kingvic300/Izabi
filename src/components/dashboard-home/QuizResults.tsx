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
            <div className="pt-2">
                <Button onClick={onFinalize} size="lg" className="w-full sm:w-auto">
                    {t('quiz.finalize')}
                </Button>
            </div>
        );
    }

    return (
        <div
            id="mastery-verdict"
            className="flex flex-col gap-6 rounded-lg border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
            <div>
                <h3 className="text-2xl sm:text-[1.75rem]">
                    {percentage >= 80
                        ? 'Well done.'
                        : percentage >= 50
                          ? 'Good effort.'
                          : 'Keep practising.'}
                </h3>
                <p className="mt-1 text-muted-foreground">
                    {percentage >= 80
                        ? 'You know this topic well. Try a harder set next.'
                        : 'Read the explanations above, then try the quiz again.'}
                </p>
            </div>
            <p className="flex items-baseline gap-3">
                <span className="tabular font-display text-5xl leading-none">
                    {score}
                    <span className="text-muted-foreground">/{total}</span>
                </span>
                <span className="tabular text-lg font-bold">{percentage}%</span>
            </p>
        </div>
    );
};
