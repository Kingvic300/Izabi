import React, { useState, useEffect } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface DailyQuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

interface DailyQuestionData {
    id: string;
    title: string;
    question: string;
    options: DailyQuestionOption[];
    explanation: string;
    points: number;
}

interface DailyQuestionCardProps {
    onPointsEarned: (points: number) => void;
    // Caller (DashboardHome) can pass the already-fetched daily challenge
    // from useDashboardData() to avoid a duplicate network call.
    question?: DailyQuestionData | null;
    isCompleted?: boolean;
    onAnswered?: (optionId: string, isCorrect: boolean) => void;
}

export const DailyQuestionCard: React.FC<DailyQuestionCardProps> = ({
    onPointsEarned,
    question: providedQuestion,
    isCompleted: providedCompleted,
    onAnswered,
}) => {
    const [localQuestion, setLocalQuestion] = useState<DailyQuestionData | null>(
        providedQuestion ?? null,
    );
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(Boolean(providedCompleted));

    useEffect(() => {
        if (providedQuestion !== undefined) {
            setLocalQuestion(providedQuestion);
            return;
        }
        // Fallback: fetch directly if no question/useDashboardData wiring was provided.
        api.getDailyChallenge()
            .then((res) => {
                if (res.success && res.data?.question && Array.isArray(res.data.options)) {
                    setLocalQuestion(res.data);
                }
            })
            .catch(() => {});
    }, [providedQuestion]);

    useEffect(() => {
        setIsAnswered(Boolean(providedCompleted));
    }, [providedCompleted]);

    if (!localQuestion) return null;

    const handleSelectOption = async (optionId: string) => {
        if (isAnswered) return;
        setSelectedOptionId(optionId);
        setIsAnswered(true);

        const chosen = localQuestion.options.find((o) => o.id === optionId);
        const correct = Boolean(chosen?.isCorrect);

        if (onAnswered) {
            onAnswered(optionId, correct);
        }
        if (correct) {
            onPointsEarned(localQuestion.points);
        }
    };

    const handleReset = () => {
        setIsAnswered(false);
        setSelectedOptionId(null);
    };

    const selectedOption = localQuestion.options.find((o) => o.id === selectedOptionId);
    const isCorrect = selectedOption?.isCorrect;

    return (
        <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card transition-all duration-200 hover:border-primary/30 my-6">
            <div className="flex items-center justify-between gap-4 mb-3.5">
                <div className="flex items-center gap-2 text-xs tabular text-muted-foreground">
                    <span className="text-foreground/80 font-semibold">{localQuestion.title}</span>
                    <span>·</span>
                    <span className="tabular-nums">+{localQuestion.points} XP</span>
                </div>

                {isAnswered && !providedCompleted && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1 text-[11px] tabular text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retry</span>
                    </button>
                )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug mb-4">
                {localQuestion.question}
            </h3>

            <div className="space-y-2.5">
                {localQuestion.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isThisSelected = selectedOptionId === opt.id;

                    let optionStyle =
                        'bg-muted/40 border-border hover:border-primary/40 hover:bg-muted/60 text-foreground/80';
                    if (isAnswered) {
                        if (opt.isCorrect) {
                            optionStyle = 'bg-learning-green/10 border-learning-green/40 text-learning-green';
                        } else if (isThisSelected && !opt.isCorrect) {
                            optionStyle = 'bg-destructive/10 border-destructive/40 text-destructive';
                        } else {
                            optionStyle = 'bg-transparent border-border/50 text-muted-foreground opacity-60';
                        }
                    }

                    return (
                        <button
                            key={opt.id}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleSelectOption(opt.id)}
                            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 cursor-pointer ${optionStyle}`}
                        >
                            <div
                                className={`w-6 h-6 rounded-md border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                                    isAnswered && opt.isCorrect
                                        ? 'border-learning-green bg-learning-green/20 text-learning-green'
                                        : isThisSelected && !opt.isCorrect
                                          ? 'border-destructive bg-destructive/20 text-destructive'
                                          : 'border-border bg-muted text-muted-foreground'
                                }`}
                            >
                                {letter}
                            </div>
                            <span className="text-xs sm:text-sm leading-relaxed flex-1">{opt.text}</span>
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <div
                    className={`mt-4 p-4 rounded-xl border text-xs leading-relaxed ${
                        isCorrect
                            ? 'bg-learning-green/5 border-learning-green/25 text-learning-green'
                            : 'bg-muted/40 border-border text-foreground/80'
                    }`}
                >
                    <div className="font-semibold mb-1 flex items-center gap-1.5">
                        {isCorrect ? (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-learning-green" />
                                <span>Correct! (+{localQuestion.points} XP Awarded)</span>
                            </>
                        ) : (
                            <>
                                <HelpCircle className="w-3.5 h-3.5 text-urgent" />
                                <span>Memory Reinforcement</span>
                            </>
                        )}
                    </div>
                    <p className="text-muted-foreground">{localQuestion.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default DailyQuestionCard;
