'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X, Lightbulb } from 'lucide-react';
import { AnswerOption, type AnswerOptionState } from '@/components/ui/answer-option';
import { Question } from '@/components/dashboard-home/types';
import { cn } from '@/lib/utils';
import { resolveCorrectOptionText } from '@/lib/quizUtils';
import { useLanguage } from '@/contexts/LanguageContext';


interface QuizQuestionProps {
    question: Question;
    index: number;
    userAnswer?: string;
    showResults: boolean;
    showExplanations: boolean;
    isCorrect?: boolean;
    onAnswerSelect: (option: string) => void;
    onShortAnswerChange: (value: string) => void;
}

export const QuizQuestion = ({
    question,
    index,
    userAnswer,
    showResults,
    showExplanations,
    isCorrect,
    onAnswerSelect,
    onShortAnswerChange,
}: QuizQuestionProps) => {
    const { t } = useLanguage();
    const isShort = question.questionType?.toLowerCase() === 'short_answer';
    const [showHint, setShowHint] = useState(false);

    const hintText = (() => {
        if (isShort && question.answer) {
            const firstWord = question.answer.split(/\s+/)[0];
            return `${t('quiz.starts_with')} "${firstWord}"`;
        }
        if (question.answer && question.options?.length) {
            const correctOptionText = resolveCorrectOptionText(question);
            const idx = question.options.findIndex(
                (opt) =>
                    opt.trim().toLowerCase() ===
                    correctOptionText.trim().toLowerCase(),
            );
            if (idx >= 0) return `${t('quiz.near_choice')} ${String.fromCharCode(65 + idx)}`;
        }
        return null;
    })();

    const correctOptionText = !isShort ? resolveCorrectOptionText(question) : '';

    const optionState = (opt: string): AnswerOptionState => {
        const isSelected = userAnswer === opt;
        if (!showResults) return isSelected ? 'selected' : 'idle';
        if (isSelected) return opt === correctOptionText ? 'correct' : 'wrong';
        if (opt === correctOptionText) return 'missed';
        return 'dimmed';
    };

    const labelId = `quiz-q-${index}`;

    return (
        <div className="flex gap-4 border-b border-sheet/25 pb-7 last-of-type:border-b-0">
            <span className="tabular w-7 shrink-0 pt-1 text-right font-bold text-sheet">
                {index + 1}.
            </span>
            <div className="min-w-0 flex-1 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h4
                        id={labelId}
                        className="break-words text-lg leading-snug sm:text-xl"
                    >
                        {question.question}
                    </h4>
                    {hintText && !showResults && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0 self-start text-muted-foreground"
                            onClick={() => setShowHint((v) => !v)}
                            aria-expanded={showHint}
                        >
                            <Lightbulb />
                            {showHint ? t('quiz.hide_hint') : t('quiz.hint')}
                        </Button>
                    )}
                    {showResults && (
                        <span
                            className={cn(
                                'inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-bold',
                                isCorrect ? 'text-reward' : 'text-destructive',
                            )}
                        >
                            {isCorrect ? <Check size={16} /> : <X size={16} />}
                            {isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
                        </span>
                    )}
                </div>

                {!isShort ? (
                    <div
                        role="radiogroup"
                        aria-labelledby={labelId}
                        className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2"
                    >
                        {question.options?.map((opt, idx) => (
                            <AnswerOption
                                key={idx}
                                letter={String.fromCharCode(65 + idx)}
                                state={optionState(opt)}
                                disabled={showResults}
                                onClick={() => onAnswerSelect(opt)}
                                className="break-words"
                            >
                                {opt}
                            </AnswerOption>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Input
                            value={userAnswer || ''}
                            placeholder={t('quiz.type_answer_placeholder')}
                            onChange={(e) => onShortAnswerChange(e.target.value)}
                            disabled={showResults}
                            aria-labelledby={labelId}
                            className="h-12 text-base"
                        />
                        {showResults && !isCorrect && (
                            <p className="text-[15px]">
                                <span className="font-bold">
                                    {t('quiz.correct_answer_label')}:
                                </span>{' '}
                                {question.answer}
                            </p>
                        )}
                    </div>
                )}

                {showHint && hintText && !showResults && (
                    <p className="text-[15px]">
                        <span className="mark-highlight">{hintText}</span>
                    </p>
                )}

                {showResults && showExplanations && question.explanation && (
                    <div className="border-l-2 border-sheet/60 pl-4">
                        <p className="text-sm font-bold">
                            {t('quiz.explanation_label')}
                        </p>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                            {question.explanation}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
