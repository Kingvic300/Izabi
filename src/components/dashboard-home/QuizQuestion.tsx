'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { Question } from '@/components/dashboard-home/types';
import { cn } from '@/lib/utils';


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
    const isShort = question.questionType?.toLowerCase() === 'short_answer';
    const [showHint, setShowHint] = useState(false);

    const hintText = (() => {
        if (isShort && question.answer) {
            const firstWord = question.answer.split(/\s+/)[0];
            return `Starts with "${firstWord}"`;
        }
        if (question.answer && question.options?.length) {
            const idx = question.options.findIndex(
                (opt) =>
                    opt.trim().toLowerCase() ===
                    question.answer!.trim().toLowerCase(),
            );
            if (idx >= 0) return `Correct option is near choice ${String.fromCharCode(65 + idx)}`;
        }
        return null;
    })();

    return (
        <Card className="bg-card/[0.02] border-foreground/5 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                        Question {index + 1}
                    </div>
                    <h4 className="text-base md:text-xl font-bold leading-tight text-foreground break-words">
                        {question.question}
                    </h4>
                </div>
                {hintText && !showResults && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-full gap-2 text-xs font-bold"
                        onClick={() => setShowHint((v) => !v)}
                    >
                        <Lightbulb size={14} />
                        {showHint ? 'Hide Hint' : 'Hint'}
                    </Button>
                )}
                {showResults && (
                    <div
                        className={cn(
                            "w-fit px-4 py-1.5 md:px-5 md:py-2 rounded-3xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-2xl transition-all",
                            isCorrect
                                ? 'bg-primary text-foreground shadow-primary/20'
                                : 'bg-destructive text-primary-foreground shadow-destructive/20'
                        )}
                    >
                        {isCorrect ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                )}
            </div>

            {!isShort ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
                    {question.options?.map((opt, idx) => {
                        const isSelected = userAnswer === opt;
                        const isCorrect = showResults && opt === question.answer;
                        const isWrong = showResults && isSelected && opt !== question.answer;

                        return (
                            <Button
                                key={idx}
                                onClick={() => onAnswerSelect(opt)}
                                disabled={showResults}
                                className={cn(
                                    "h-auto min-h-[72px] py-4 md:py-6 px-4 md:px-6 justify-start text-left rounded-2xl md:rounded-3xl transition-all duration-300 font-bold border border-foreground/5 w-full touch-manipulation",
                                    "whitespace-normal break-words",
                                    isSelected && 'bg-primary text-primary-foreground shadow-glow',
                                    !isSelected && 'bg-card/5 hover:bg-card/10 text-primary-foreground/70',
                                    isCorrect && 'bg-primary/20 border-primary/50 text-primary !bg-opacity-20',
                                    isWrong && 'bg-destructive/20 border-destructive/50 text-destructive-foreground !bg-opacity-20'
                                )}
                            >
                                <div className="flex items-start gap-3 md:gap-4 w-full">
                                    <div className={cn(
                                        "w-7 h-7 md:w-8 md:h-8 rounded-2xl md:rounded-3xl flex items-center justify-center font-bold text-xs transition-opacity flex-shrink-0",
                                        isSelected ? 'bg-background/10' : 'bg-card/10 opacity-30'
                                    )}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-[15px] sm:text-base leading-snug break-words flex-1">
                                        {opt}
                                    </span>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-4">
                    <Input
                        value={userAnswer || ''}
                        placeholder="Type your answer here..."
                        onChange={(e) => onShortAnswerChange(e.target.value)}
                        disabled={showResults}
                        className="rounded-2xl md:rounded-3xl h-14 md:h-16 bg-card/5 border-foreground/5 focus:bg-card/10 transition-all font-bold px-4 md:px-8 text-[15px] sm:text-base text-foreground w-full"
                    />
                    {showHint && hintText && !showResults && (
                        <div className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3">
                            {hintText}
                        </div>
                    )}
                    {showResults && !isCorrect && (
                        <div className="p-6 rounded-3xl glass border-primary/20 bg-primary/5">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                                Correct Answer
                            </div>
                            <p className="text-sm font-bold opacity-80">
                                {question.answer}
                            </p>
                        </div>
                    )}
                </div>
            )}
            {!isShort && showHint && hintText && !showResults && (
                <div className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3">
                    {hintText}
                </div>
            )}
            
            {showResults && showExplanations && question.explanation && (
                <div className="p-6 rounded-3xl glass border-primary/20 bg-primary/5 mt-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                        Explanation
                    </div>
                    <p className="text-sm font-bold opacity-80 italic">
                        "{question.explanation}"
                    </p>
                </div>
            )}
        </Card>
    );
};
