import { Button } from '@/components/ui/button';
import { StatStrip } from '@/components/dashboard/StatStrip';
import { useLanguage } from '@/contexts/LanguageContext';

type ExamResultProps = {
    score: number;
    totalQuestions: number;
    onReturn: () => void;
};

export default function ExamResult({
    score,
    totalQuestions,
    onReturn,
}: ExamResultProps) {
    const { t } = useLanguage();
    const correctCount = Math.round((score / 100) * totalQuestions);

    return (
        <div className="w-full max-w-3xl space-y-10 pb-16 pt-4">
            <div>
                <p className="text-muted-foreground">Your score</p>
                <p className="tabular mt-1 font-display text-7xl leading-none sm:text-8xl">
                    {Math.round(score)}%
                </p>
                <h2 className="mt-6 text-[2rem] leading-tight">
                    {score >= 70
                        ? t('exams.result_excellent')
                        : score >= 50
                          ? t('exams.result_good')
                          : t('exams.result_keep_practicing')}
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                    {t('exams.you_answered')} {correctCount} {t('quiz.out_of')}{' '}
                    {totalQuestions} {t('exams.questions_correctly')}
                </p>
            </div>

            <StatStrip
                items={[
                    { label: t('exams.correct_responses'), value: correctCount },
                    {
                        label: t('exams.incorrect_responses'),
                        value: totalQuestions - correctCount,
                    },
                ]}
            />

            <Button onClick={onReturn} size="lg">
                {t('exams.return_to_lobby')}
            </Button>
        </div>
    );
}
