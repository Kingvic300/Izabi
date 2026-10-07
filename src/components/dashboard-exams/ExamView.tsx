import { Button } from '@/components/ui/button';
import { AnswerOption } from '@/components/ui/answer-option';
import { Bubble } from '@/components/ui/bubble';
import { cn } from '@/lib/utils';
import type { Exam } from '@/types/api';
import { useLanguage } from '@/contexts/LanguageContext';

type ExamViewProps = {
    activeTab: string;
    currentExam: Exam | null;
    currentQuestionIndex: number;
    answers: Record<number, string>;
    visitedQuestions: number[];
    timeLeft: number;
    onAnswer: (option: string) => void;
    onNavigate: (index: number) => void;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
};

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const letter = (i: number) => String.fromCharCode(65 + i);

export default function ExamView({
    activeTab,
    currentExam,
    currentQuestionIndex,
    answers,
    visitedQuestions,
    timeLeft,
    onAnswer,
    onNavigate,
    onPrev,
    onNext,
    onSubmit,
}: ExamViewProps) {
    const { t } = useLanguage();
    if (!currentExam) return null;

    const totalQuestions = currentExam.questions.length;
    const currentQuestion = currentExam.questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const isLast = currentQuestionIndex === totalQuestions - 1;
    const lowTime = timeLeft < 60;

    return (
        <div className="w-full pb-16">
            <div className="sticky top-14 z-30 -mx-4 mb-8 flex items-center justify-between gap-4 border-b border-border bg-background/95 px-4 py-3 supports-[backdrop-filter]:bg-background/85 supports-[backdrop-filter]:backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
                <div className="min-w-0">
                    <h2 className="truncate text-xl leading-tight sm:text-2xl">
                        {currentExam.subject}
                    </h2>
                    <p className="tabular text-sm text-muted-foreground">
                        {activeTab}, {t('quiz.question_label').toLowerCase()}{' '}
                        {currentQuestionIndex + 1} {t('quiz.of_label')}{' '}
                        {totalQuestions}
                    </p>
                </div>
                <div className="text-right" role="timer" aria-live="off">
                    <p className="text-xs text-muted-foreground">Time left</p>
                    <p
                        className={cn(
                            'tabular font-display text-2xl leading-none sm:text-3xl',
                            lowTime && 'text-urgent',
                        )}
                    >
                        {formatTime(timeLeft)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] xl:gap-12">
                <section aria-labelledby="exam-question">
                    <div className="flex gap-4">
                        <span className="tabular w-8 shrink-0 pt-1 text-right text-lg font-bold text-sheet">
                            {currentQuestionIndex + 1}.
                        </span>
                        <div className="min-w-0 flex-1">
                            <p
                                id="exam-question"
                                className="break-words font-display text-xl leading-relaxed sm:text-2xl"
                            >
                                {currentQuestion.question}
                            </p>
                            <div
                                role="radiogroup"
                                aria-labelledby="exam-question"
                                className="mt-6 grid grid-cols-1 gap-2"
                            >
                                {currentQuestion.options.map((option, idx) => (
                                    <AnswerOption
                                        key={idx}
                                        letter={letter(idx)}
                                        state={
                                            answers[currentQuestionIndex] === option
                                                ? 'selected'
                                                : 'idle'
                                        }
                                        onClick={() => onAnswer(option)}
                                        className="min-h-14 break-words py-3 text-base"
                                    >
                                        {option}
                                    </AnswerOption>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center justify-between gap-3">
                                <Button
                                    variant="outline"
                                    onClick={onPrev}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    {t('exams.previous')}
                                </Button>
                                {isLast ? (
                                    <Button onClick={onSubmit}>
                                        {t('exams.final_submission')}
                                    </Button>
                                ) : (
                                    <Button onClick={onNext}>
                                        {t('exams.next')}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <aside
                    aria-label={t('exams.question_navigator')}
                    className="lg:sticky lg:top-36 lg:self-start"
                >
                    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
                        <div className="flex items-baseline justify-between border-b border-sheet/35 px-4 py-3">
                            <p className="font-display text-lg">Answer sheet</p>
                            <p className="tabular text-sm text-muted-foreground">
                                {answeredCount}/{totalQuestions}
                            </p>
                        </div>
                        <ol className="max-h-[50vh] overflow-y-auto py-1 lg:max-h-[calc(100vh-16rem)]">
                            {currentExam.questions.map((q, index) => {
                                const isCurrent = index === currentQuestionIndex;
                                const chosen = answers[index];
                                const chosenIdx =
                                    chosen !== undefined ? q.options.indexOf(chosen) : -1;
                                const isVisited = visitedQuestions.includes(index);
                                return (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() => onNavigate(index)}
                                            aria-current={isCurrent ? 'step' : undefined}
                                            aria-label={`Question ${index + 1}${chosenIdx >= 0 ? `, answered ${letter(chosenIdx)}` : isVisited ? ', seen, not answered' : ''}`}
                                            className={cn(
                                                'flex w-full items-center gap-3 px-4 py-1.5 transition-colors hover:bg-muted/60',
                                                isCurrent && 'bg-highlight/25 hover:bg-highlight/30',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'tabular w-7 text-right text-sm font-bold',
                                                    isCurrent ? 'text-foreground' : 'text-sheet',
                                                )}
                                            >
                                                {index + 1}
                                            </span>
                                            <span className="flex gap-1.5">
                                                {q.options.map((_, oi) => (
                                                    <Bubble
                                                        key={oi}
                                                        size="xs"
                                                        label={letter(oi)}
                                                        state={oi === chosenIdx ? 'filled' : 'empty'}
                                                    />
                                                ))}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                        {t('exams.tap_to_jump')}
                    </p>
                </aside>
            </div>
        </div>
    );
}
