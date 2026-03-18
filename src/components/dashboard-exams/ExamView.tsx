'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Exam } from '@/types/api';

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
    if (!currentExam) return null;

    const totalQuestions = currentExam.questions.length;
    const currentQuestion = currentExam.questions[currentQuestionIndex];

    return (
        <div className="w-full min-h-screen flex flex-col pb-16 sm:pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8 sticky top-2 sm:top-4 z-50 bg-background/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-foreground/10 shadow-xl">
                <div className="min-w-0">
                    <h2 className="text-base sm:text-xl font-bold truncate max-w-[140px] sm:max-w-[200px] md:max-w-md">
                        {currentExam.subject}
                    </h2>
                    <p className="text-xs font-bold uppercase opacity-60 tracking-widest">
                        {activeTab} • Question {currentQuestionIndex + 1} of{' '}
                        {totalQuestions}
                    </p>
                </div>
                <div
                    className={`px-3 sm:px-4 py-2 rounded-xl font-mono font-black text-lg sm:text-2xl ${timeLeft < 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-blue-500/10 text-blue-500'}`}
                >
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* CBT Question Navigator */}
            <div className="sticky top-[78px] sm:top-[96px] z-40 mb-4 sm:mb-6 rounded-2xl border border-foreground/10 bg-card/80 backdrop-blur-md p-3 sm:p-4 shadow-lg">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-80">
                        Question Navigator
                    </p>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold">
                        <span className="rounded-md bg-foreground/5 px-2 py-1">
                            Total: {totalQuestions}
                        </span>
                        <span className="rounded-md bg-green-500/15 px-2 py-1 text-green-500">
                            Answered: {Object.keys(answers).length}
                        </span>
                        <span className="rounded-md bg-foreground/5 px-2 py-1">
                            Left: {totalQuestions - Object.keys(answers).length}
                        </span>
                    </div>
                </div>
                <div className="mb-2 text-[10px] sm:text-xs font-bold opacity-50">
                    Tap any number to jump
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                    {currentExam.questions.map((_, index) => {
                        const isCurrent = index === currentQuestionIndex;
                        const isAnswered = answers[index] !== undefined;
                        const isVisited = visitedQuestions.includes(index);

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onNavigate(index)}
                                aria-label={`Go to question ${index + 1}`}
                                className={cn(
                                    'h-9 sm:h-10 rounded-lg border text-xs sm:text-sm font-black transition-all',
                                    isAnswered
                                        ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/20'
                                        : isCurrent
                                          ? 'border-foreground/50 ring-2 ring-foreground/20 bg-background text-foreground'
                                          : isVisited
                                            ? 'border-foreground/20 bg-background text-foreground hover:bg-card/80'
                                            : 'border-foreground/10 bg-background/60 text-foreground hover:bg-card/80',
                                )}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
            >
                <Card className="glass border-foreground/10 shadow-2xl p-6 md:p-10 rounded-[32px]">
                    <div className="mb-8">
                        <p className="text-lg md:text-2xl font-medium leading-relaxed">
                            {currentQuestion.question}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => onAnswer(option)}
                                className={`text-left p-6 rounded-2xl transition-all border-2 flex items-start gap-4 group whitespace-normal ${
                                    answers[currentQuestionIndex] === option
                                        ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                                        : 'border-foreground/5 bg-card/5 hover:bg-card/10 hover:border-foreground/10'
                                }`}
                            >
                                <div
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                                        answers[currentQuestionIndex] === option
                                            ? 'border-blue-500 bg-blue-500 text-white'
                                            : 'border-foreground/20'
                                    }`}
                                >
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-sm sm:text-base font-medium leading-snug break-words">
                                    {option}
                                </span>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Footer Navigation */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pb-12 w-full max-w-md mx-auto">
                    <Button
                        variant="ghost"
                        onClick={onPrev}
                        disabled={currentQuestionIndex === 0}
                        className="w-full sm:w-32 h-12 rounded-xl font-bold border border-foreground/5 hover:bg-card"
                    >
                        Previous
                    </Button>

                    {currentQuestionIndex === totalQuestions - 1 ? (
                        <Button
                            onClick={onSubmit}
                            className="w-full sm:w-48 h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
                        >
                            Final Submission
                        </Button>
                    ) : (
                        <Button
                            onClick={onNext}
                            className="w-full sm:w-32 h-12 rounded-[14px] font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
