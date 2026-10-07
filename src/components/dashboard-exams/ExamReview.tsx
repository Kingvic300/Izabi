import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatStrip } from '@/components/dashboard/StatStrip';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';

type ExamReviewProps = {
    result: any;
    onBack: () => void;
};

export default function ExamReview({ result, onBack }: ExamReviewProps) {
    const { t } = useLanguage();
    if (!result) return null;

    return (
        <div className="w-full space-y-10 pb-16">
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-3">
                <ArrowLeft />
                {t('exams.back_to_lobby')}
            </Button>

            <PageHeader
                title={result.subject}
                description={`Taken on ${new Date(result.date).toLocaleDateString()}`}
                actions={
                    <p className="text-right">
                        <span className="block text-sm text-muted-foreground">
                            {t('exams.final_score')}
                        </span>
                        <span className="tabular font-display text-5xl leading-none">
                            {Math.round(result.score)}%
                        </span>
                    </p>
                }
            />

            <StatStrip
                items={[
                    { label: t('exams.correct_label'), value: result.correctAnswers },
                    {
                        label: t('exams.incorrect_label'),
                        value: result.totalQuestions - result.correctAnswers,
                    },
                    {
                        label: t('exams.total_questions_label'),
                        value: result.totalQuestions,
                    },
                ]}
            />

            <section>
                <h3 className="text-2xl">{t('exams.question_breakdown')}</h3>
                <p className="mt-1 max-w-xl text-muted-foreground">
                    {t('exams.feature_in_dev_desc')}
                </p>
            </section>
        </div>
    );
}
