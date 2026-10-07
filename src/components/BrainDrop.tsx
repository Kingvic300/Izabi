import React, { useState } from 'react';
import { AnswerOption, type AnswerOptionState } from '@/components/ui/answer-option';
import { resolveCorrectOptionText } from '@/lib/quizUtils';

interface BrainDropProps {
    question: {
        id: string;
        question: string;
        options: string[];
        answer: string;
        explanation: string;
        points: number;
    };
    onAnswer: (answer: string, isCorrect: boolean) => void;
    totalAnswered?: number;
}

const BrainDrop: React.FC<BrainDropProps> = ({
    question,
    onAnswer,
    totalAnswered = 0,
}) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    if (!question || !question.options || !Array.isArray(question.options)) {
        return null;
    }

    const correctOptionText = resolveCorrectOptionText(question);

    const handleAnswerClick = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        const correct = answer === correctOptionText;
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer(answer, correct);
    };

    const stateFor = (option: string): AnswerOptionState => {
        if (!showResult) return 'idle';
        if (option === selectedAnswer) return isCorrect ? 'correct' : 'wrong';
        if (option === correctOptionText) return 'missed';
        return 'dimmed';
    };

    return (
        <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm">
                    <span className="font-bold">Brain Drop</span>
                    <span className="text-muted-foreground">
                        {' '}
                        for +{question.points} points
                    </span>
                </p>
                {totalAnswered > 0 && (
                    <p className="tabular text-sm text-muted-foreground">
                        {totalAnswered.toLocaleString()} answered today
                    </p>
                )}
            </div>

            <h3
                id={`brain-drop-${question.id}`}
                className="mt-3 text-xl leading-snug sm:text-2xl"
            >
                {question.question}
            </h3>

            <div
                role="radiogroup"
                aria-labelledby={`brain-drop-${question.id}`}
                className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2"
            >
                {question.options.map((option, idx) => (
                    <AnswerOption
                        key={idx}
                        letter={String.fromCharCode(65 + idx)}
                        state={stateFor(option)}
                        disabled={showResult}
                        onClick={() => handleAnswerClick(option)}
                    >
                        {option}
                    </AnswerOption>
                ))}
            </div>

            <div aria-live="polite">
                {showResult && (
                    <div className="mt-5 border-l-2 border-sheet/60 pl-4">
                        <p className="font-bold">
                            {isCorrect
                                ? `Correct. +${question.points} points.`
                                : `The answer is ${correctOptionText}.`}
                        </p>
                        {question.explanation && (
                            <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                                {question.explanation}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrainDrop;
