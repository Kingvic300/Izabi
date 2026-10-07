import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CheckCircle,
    XCircle,
    Trophy,
    BookOpen,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnswerOption, type AnswerOptionState } from '@/components/ui/answer-option';
import { useLanguage } from '@/contexts/LanguageContext';

interface Question {
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
    [key: string]: any;
}

interface PracticeQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    questions: Question[];
}

const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({
    isOpen,
    onClose,
    questions,
}) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleOptionSelect = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const checkAnswer = () => {
        if (!selectedOption) return;

        setIsAnswered(true);
        if (selectedOption === currentQuestion.answer) {
            setScore((prev) => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const handleClose = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl rounded-lg border border-border bg-card shadow-float overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border p-5 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-xl">
                                    {t('quiz.practice_session')}
                                </h2>
                                <p className="tabular text-sm text-muted-foreground">
                                    {t('quiz.question_label')} {currentIndex + 1} {t('quiz.of_label')}{' '}
                                    {questions.length}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-muted"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!showResults ? (
                            <div className="space-y-6">
                                {/* Question */}
                                <div className="font-display text-xl leading-snug">
                                    {currentQuestion?.question}
                                </div>

                                {/* Options */}
                                <div role="radiogroup" className="grid gap-2">
                                    {currentQuestion?.options.map((option, idx) => {
                                        let state: AnswerOptionState = 'idle';
                                        if (isAnswered) {
                                            if (option === selectedOption)
                                                state = option === currentQuestion.answer ? 'correct' : 'wrong';
                                            else if (option === currentQuestion.answer) state = 'missed';
                                            else state = 'dimmed';
                                        } else if (selectedOption === option) {
                                            state = 'selected';
                                        }
                                        return (
                                            <AnswerOption
                                                key={idx}
                                                letter={String.fromCharCode(65 + idx)}
                                                state={state}
                                                disabled={isAnswered}
                                                onClick={() => handleOptionSelect(option)}
                                            >
                                                {option}
                                            </AnswerOption>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {isAnswered && currentQuestion?.explanation && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border-l-2 border-sheet/60 pl-4 text-[15px]"
                                    >
                                        <div className="mb-1 font-bold">
                                            {t('quiz.explanation_colon')}
                                        </div>
                                        <div className="text-muted-foreground">
                                            {currentQuestion.explanation}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Action Button */}
                                <div className="pt-4">
                                    {isAnswered ? (
                                        <Button
                                            onClick={nextQuestion}
                                            className="w-full h-12 text-lg font-bold rounded-xl gap-2"
                                        >
                                            {currentIndex < questions.length - 1
                                                ? t('quiz.next_question')
                                                : t('quiz.finish_quiz')}
                                            <ArrowRight size={18} />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={checkAnswer}
                                            disabled={!selectedOption}
                                            className="w-full h-12 text-lg font-bold rounded-xl"
                                        >
                                            {t('quiz.check_answer')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy
                                        size={48}
                                        className="text-primary"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-3xl font-bold mb-2">
                                        {t('quiz.practice_complete')}
                                    </h3>
                                    <p className="text-muted-foreground text-lg">
                                        {t('quiz.you_scored')}{' '}
                                        <span className="text-primary font-bold">
                                            {score}
                                        </span>{' '}
                                        {t('quiz.out_of')} {questions.length}
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-card border border-border">
                                    <div className="text-sm font-medium mb-2 text-muted-foreground">
                                        {t('quiz.accuracy')}
                                    </div>
                                    <div className="text-4xl font-semibold">
                                        {Math.round(
                                            (score / questions.length) * 100,
                                        )}
                                        %
                                    </div>
                                </div>

                                <Button
                                    onClick={handleClose}
                                    className="w-full h-12 text-lg font-bold rounded-xl"
                                >
                                    {t('quiz.done')}
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PracticeQuizModal;
