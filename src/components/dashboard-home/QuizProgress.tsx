'use client';

interface QuizProgressProps {
    answered: number;
    total: number;
    showResults: boolean;
}

export const QuizProgress = ({ answered, total, showResults }: QuizProgressProps) => {
    const percentage = total ? Math.round((answered / total) * 100) : 0;

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl bg-card/5 border border-foreground/5 px-4 py-3">
            <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                    Progress
                </div>
                <div className="text-sm font-bold">
                    {answered} / {total} answered
                </div>
            </div>
            <div className="w-full sm:w-40 h-2 rounded-full bg-card/10 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
                {showResults ? 'Results locked' : 'Select answers'}
            </div>
        </div>
    );
};