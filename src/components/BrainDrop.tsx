import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    // Safety check
    if (!question || !question.options || !Array.isArray(question.options)) {
        return null;
    }

    const handleAnswerClick = (answer: string) => {
        if (showResult) return;

        setSelectedAnswer(answer);
        const correct = answer === question.answer;
        setIsCorrect(correct);
        setShowResult(true);
        onAnswer(answer, correct);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-2xl"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10">
                <Zap size={180} className="stroke-primary" />
            </div>

            <div className="relative z-10 p-6 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-glow flex items-center gap-2">
                            <Zap size={12} fill="currentColor" />
                            Brain Drop
                        </div>
                        <span className="text-xs font-bold text-foreground/60 dark:text-foreground/70 uppercase tracking-widest">
                            +{question.points} XP
                        </span>
                    </div>
                    {totalAnswered > 0 && (
                        <div className="flex items-center gap-2 text-xs font-bold text-foreground/60 dark:text-foreground/70">
                            <TrendingUp size={14} />
                            {totalAnswered.toLocaleString()} answered today
                        </div>
                    )}
                </div>

                {/* Question */}
                <h3 className="text-2xl md:text-3xl font-bold mb-8 max-w-3xl leading-tight text-foreground">
                    {question.question}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mb-6">
                    {question.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectAnswer =
                            showResult && option === question.answer;
                        const isWrongAnswer =
                            showResult &&
                            isSelected &&
                            option !== question.answer;

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerClick(option)}
                                disabled={showResult}
                                className={cn(
                                    'text-left px-6 py-4 rounded-2xl border-2 transition-all font-bold text-sm md:text-base flex items-center gap-3 group/btn text-foreground',
                                    !showResult &&
                                        'bg-card/5 dark:bg-card/5 hover:bg-card/10 dark:hover:bg-card/10 border-foreground/10 dark:border-foreground/10 hover:border-primary/40 hover:scale-[1.02]',
                                    isSelected &&
                                        !showResult &&
                                        'bg-primary/20 border-primary/50',
                                    isCorrectAnswer &&
                                        'bg-green-500/20 border-green-500/50',
                                    isWrongAnswer &&
                                        'bg-red-500/20 border-red-500/50',
                                    showResult &&
                                        !isSelected &&
                                        !isCorrectAnswer &&
                                        'opacity-40',
                                )}
                            >
                                <div
                                    className={cn(
                                        'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0',
                                        !showResult &&
                                            'bg-card/10 dark:bg-card/10 text-foreground group-hover/btn:bg-primary group-hover/btn:text-primary-foreground',
                                        isSelected &&
                                            !showResult &&
                                            'bg-primary text-primary-foreground',
                                        isCorrectAnswer &&
                                            'bg-green-500 text-foreground',
                                        isWrongAnswer &&
                                            'bg-red-500 text-foreground',
                                    )}
                                >
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="flex-1">{option}</span>
                                {isCorrectAnswer && (
                                    <CheckCircle
                                        size={20}
                                        className="text-green-500 flex-shrink-0"
                                    />
                                )}
                                {isWrongAnswer && (
                                    <XCircle
                                        size={20}
                                        className="text-red-500 flex-shrink-0"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Result */}
                <AnimatePresence>
                    {showResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div
                                className={cn(
                                    'p-6 rounded-2xl border-2 mt-4',
                                    isCorrect
                                        ? 'bg-green-500/10 border-green-500/30'
                                        : 'bg-amber-500/10 border-amber-500/30',
                                )}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    {isCorrect ? (
                                        <>
                                            <CheckCircle
                                                size={24}
                                                className="text-green-500"
                                            />
                                            <span className="text-lg font-bold text-green-500">
                                                Correct! 🎉
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle
                                                size={24}
                                                className="text-amber-500"
                                            />
                                            <span className="text-lg font-bold text-amber-500">
                                                Not quite, but you learned
                                                something!
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-sm font-medium text-foreground/80 dark:text-foreground/90 leading-relaxed">
                                    {question.explanation}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default BrainDrop;
