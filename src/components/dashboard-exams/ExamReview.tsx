'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Sparkles, Target, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

type ExamReviewProps = {
    result: any;
    onBack: () => void;
};

export default function ExamReview({ result, onBack }: ExamReviewProps) {
    const { t } = useLanguage();
    if (!result) return null;

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mb-4 h-10 px-4 rounded-xl font-bold hover:bg-card/50 gap-2"
                    >
                        <ArrowLeft size={16} />
                        {t('exams.back_to_lobby')}
                    </Button>
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 ">
                        {t('exams.title_top')}{' '}
                        <span className="text-primary">
                            {t('exams.review_gradient')}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        {result.subject} •{' '}
                        {new Date(result.date).toLocaleDateString()}
                    </p>
                </div>

                <div className="text-center shrink-0">
                    <div
                        className={cn(
                            'w-24 h-24 sm:w-32 sm:h-32 rounded-xl sm:rounded-xl flex items-center justify-center font-semibold text-3xl sm:text-4xl shadow-sm mb-2',
                            result.score >= 70
                                ? 'bg-blue-500/10 text-blue-500 border-2 border-blue-500/20'
                                : result.score >= 45
                                  ? 'bg-blue-400/10 text-blue-400 border-2 border-blue-400/20'
                                  : 'bg-destructive/10 text-destructive border-2 border-destructive/20',
                        )}
                    >
                        {Math.round(result.score)}
                        <span className="text-lg opacity-60">%</span>
                    </div>
                    <p className="text-sm font-bold opacity-40 ">
                        {t('exams.final_score')}
                    </p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-blue-500/5 border-blue-500/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                {result.correctAnswers}
                            </p>
                            <p className="text-xs font-bold opacity-40 ">
                                {t('exams.correct_label')}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-destructive/5 border-destructive/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                {result.totalQuestions - result.correctAnswers}
                            </p>
                            <p className="text-xs font-bold opacity-40 ">
                                {t('exams.incorrect_label')}
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-primary/5 border-primary/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold">
                                {result.totalQuestions}
                            </p>
                            <p className="text-xs font-bold opacity-40 ">
                                {t('exams.total_questions_label')}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4">
                <h3 className="text-2xl font-semibold ">
                    {t('exams.question_breakdown')}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                    {t('exams.breakdown_coming_soon')}
                </p>

                <Card className="p-8 bg-card/40 border-foreground/5 rounded-2xl">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                            <Sparkles
                                size={32}
                                className="text-muted-foreground opacity-30"
                            />
                        </div>
                        <h4 className="text-lg font-semibold opacity-20 mb-2">
                            {t('exams.feature_in_dev')}
                        </h4>
                        <p className="text-sm opacity-40 max-w-md mx-auto font-medium">
                            {t('exams.feature_in_dev_desc')}
                        </p>
                    </div>
                </Card>
            </div>

            <div className="flex gap-4 justify-center pt-8">
                <Button
                    onClick={onBack}
                    className="h-14 px-8 rounded-2xl font-semibold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all active:scale-95"
                >
                    {t('exams.back_to_lobby')}
                </Button>
            </div>
        </div>
    );
}
