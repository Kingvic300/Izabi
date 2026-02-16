'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, XCircle } from 'lucide-react';
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

    return (
        <Card className="bg-card/[0.02] border-foreground/5 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                <div className="space-y-2 md:space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                        Question {index + 1}
                    </div>
                    <h4 className="text-base md:text-xl font-bold leading-tight text-foreground break-words">
                        {question.question}
                    </h4>
                </div>
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
                <div className="grid grid-cols-1 gap-3 md:gap-4">
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
                                    "h-auto py-4 md:py-6 px-4 md:px-8 justify-start text-left rounded-2xl md:rounded-3xl transition-all duration-300 font-bold border border-foreground/5 w-full touch-manipulation",
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
                                    <span className="text-[15px] sm:text-base break-words flex-1">
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