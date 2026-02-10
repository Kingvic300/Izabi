import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, XCircle, Trophy, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

const PracticeQuizModal: React.FC<PracticeQuizModalProps> = ({ isOpen, onClose, questions }) => {
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
            setScore(prev => prev + 1);
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-background rounded-[32px] shadow-2xl border border-primary/20 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-background/95 backdrop-blur-xl border-b border-foreground/10 p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <BookOpen size={20} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Practice Session</h2>
                                <p className="text-xs text-muted-foreground">
                                    Question {currentIndex + 1} of {questions.length}
                                </p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 hover:bg-card/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {!showResults ? (
                            <div className="space-y-6">
                                {/* Question */}
                                <div className="text-lg font-medium leading-relaxed">
                                    {currentQuestion?.question}
                                </div>

                                {/* Options */}
                                <div className="space-y-3">
                                    {currentQuestion?.options.map((option, idx) => {
                                        let stateStyles = "border-foreground/10 hover:border-primary/30 bg-background";
                                        
                                        if (isAnswered) {
                                            if (option === currentQuestion.answer) {
                                                stateStyles = "border-green-500 bg-green-500/10 text-green-500";
                                            } else if (option === selectedOption) {
                                                stateStyles = "border-red-500 bg-red-500/10 text-red-500";
                                            } else {
                                                stateStyles = "opacity-50 border-foreground/10";
                                            }
                                        } else if (selectedOption === option) {
                                            stateStyles = "border-primary bg-primary/10 text-primary";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionSelect(option)}
                                                disabled={isAnswered}
                                                className={cn(
                                                    "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex items-center justify-between",
                                                    stateStyles
                                                )}
                                            >
                                                <span>{option}</span>
                                                {isAnswered && option === currentQuestion.answer && (
                                                    <CheckCircle size={18} className="text-green-500" />
                                                )}
                                                {isAnswered && option === selectedOption && option !== currentQuestion.answer && (
                                                    <XCircle size={18} className="text-red-500" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {isAnswered && currentQuestion?.explanation && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm"
                                    >
                                        <div className="font-bold text-blue-500 mb-1">Explanation:</div>
                                        <div className="text-foreground/80">{currentQuestion.explanation}</div>
                                    </motion.div>
                                )}

                                {/* Action Button */}
                                <div className="pt-4">
                                    {isAnswered ? (
                                        <Button onClick={nextQuestion} className="w-full h-12 text-lg font-bold rounded-xl gap-2">
                                            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                            <ArrowRight size={18} />
                                        </Button>
                                    ) : (
                                        <Button 
                                            onClick={checkAnswer} 
                                            disabled={!selectedOption}
                                            className="w-full h-12 text-lg font-bold rounded-xl"
                                        >
                                            Check Answer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 space-y-6">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy size={48} className="text-primary" />
                                </div>
                                
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">Practice Complete!</h3>
                                    <p className="text-muted-foreground text-lg">
                                        You scored <span className="text-primary font-bold">{score}</span> out of {questions.length}
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-card/5 border border-foreground/10">
                                    <div className="text-sm font-medium opacity-60 uppercase tracking-widest mb-2">Accuracy</div>
                                    <div className="text-4xl font-black">{Math.round((score / questions.length) * 100)}%</div>
                                </div>

                                <Button onClick={handleClose} className="w-full h-12 text-lg font-bold rounded-xl">
                                    Done
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
