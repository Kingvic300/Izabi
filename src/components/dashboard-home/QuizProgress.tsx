'use client';

import { useLanguage } from '@/contexts/LanguageContext';

interface QuizProgressProps {
    answered: number;
    total: number;
    showResults: boolean;
}

export const QuizProgress = ({ answered, total, showResults }: QuizProgressProps) => {
    const { t } = useLanguage();
    const percentage = total ? Math.round((answered / total) * 100) : 0;

    return (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="tabular text-sm">
                <span className="font-bold">
                    {answered} / {total}
                </span>{' '}
                <span className="text-muted-foreground">
                    {t('quiz.answered_suffix')}
                </span>
            </p>
            <div
                className="h-1.5 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t('quiz.progress_label')}
            >
                <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-sm text-muted-foreground">
                {showResults ? t('quiz.results_locked') : t('quiz.select_answers')}
            </p>
        </div>
    );
};
