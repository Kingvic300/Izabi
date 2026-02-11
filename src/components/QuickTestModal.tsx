import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Clock,
    Zap,
    CheckCircle,
    XCircle,
    Trophy,
    Loader2,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/lib/apiClient';

interface QuickTestQuestion {
    id: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    text: string;
    options?: string[];
}

interface QuickTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (score: number, pointsEarned: number) => void;
}

const QuickTestModal: React.FC<QuickTestModalProps> = ({
    isOpen,
    onClose,
    onComplete,
}) => {
    const [loading, setLoading] = useState(false);
    const [testData, setTestData] = useState<any>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Start test when modal opens
    useEffect(() => {
        if (isOpen && !testData) {
            startTest();
        }
    }, [isOpen]);

    // Timer countdown
    useEffect(() => {
        if (!testData || results || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [testData, results, timeLeft]);

    const startTest = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.startQuickTest();
            if (res.success) {
                setTestData(res.data);
                setTimeLeft(res.data.durationSeconds || 300);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    'Failed to start test. Upload study materials first!',
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting || !testData) return;

        setIsSubmitting(true);
        try {
            const res = await api.submitQuickTest(testData.quizId, answers);
            if (res.success) {
                setResults(res.data);
                if (onComplete) {
                    onComplete(res.data.score, res.meta?.pointsEarned || 0);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit test');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleClose = () => {
        setTestData(null);
        setAnswers({});
        setResults(null);
        setError(null);
        setTimeLeft(300);
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
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-[32px] shadow-2xl border border-primary/20"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-foreground/10 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                    <Zap size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {testData?.title || 'Quick Test'}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {results
                                            ? 'Test Complete'
                                            : 'Answer all questions before time runs out'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!results && testData && (
                                    <div
                                        className={cn(
                                            'flex items-center gap-2 px-4 py-2 rounded-full font-bold',
                                            timeLeft < 60
                                                ? 'bg-red-500/20 text-red-500'
                                                : 'bg-primary/20 text-primary',
                                        )}
                                    >
                                        <Clock size={18} />
                                        {formatTime(timeLeft)}
                                    </div>
                                )}
                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-full hover:bg-card/10 flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    Generating your personalized test...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-3 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                                <AlertCircle
                                    className="text-red-500"
                                    size={24}
                                />
                                <div>
                                    <p className="font-bold text-red-500">
                                        Error
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        )}

                        {testData && !results && (
                            <div className="space-y-6">
                                {testData.questions.map(
                                    (
                                        question: QuickTestQuestion,
                                        index: number,
                                    ) => (
                                        <div
                                            key={question.id}
                                            className="p-6 rounded-2xl bg-card/5 border border-foreground/10"
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                                                    {index + 1}
                                                </div>
                                                <p className="text-lg font-medium flex-1">
                                                    {question.text}
                                                </p>
                                            </div>

                                            {question.type ===
                                                'multiple_choice' &&
                                                question.options && (
                                                    <div className="space-y-2 ml-12">
                                                        {question.options.map(
                                                            (
                                                                option,
                                                                optIndex,
                                                            ) => (
                                                                <button
                                                                    key={
                                                                        optIndex
                                                                    }
                                                                    onClick={() =>
                                                                        handleAnswerChange(
                                                                            question.id,
                                                                            option,
                                                                        )
                                                                    }
                                                                    className={cn(
                                                                        'w-full text-left px-4 py-3 rounded-xl border-2 transition-all font-medium',
                                                                        answers[
                                                                            question
                                                                                .id
                                                                        ] ===
                                                                            option
                                                                            ? 'bg-primary/20 border-primary/50 text-primary'
                                                                            : 'bg-background border-foreground/10 hover:border-primary/30',
                                                                    )}
                                                                >
                                                                    <span className="mr-3 font-bold opacity-60">
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                                optIndex,
                                                                        )}
                                                                        .
                                                                    </span>
                                                                    {option}
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                )}

                                            {question.type === 'true_false' && (
                                                <div className="flex gap-3 ml-12">
                                                    {['True', 'False'].map(
                                                        (option) => (
                                                            <button
                                                                key={option}
                                                                onClick={() =>
                                                                    handleAnswerChange(
                                                                        question.id,
                                                                        option,
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex-1 px-6 py-3 rounded-xl border-2 transition-all font-bold',
                                                                    answers[
                                                                        question
                                                                            .id
                                                                    ] === option
                                                                        ? 'bg-primary/20 border-primary/50 text-primary'
                                                                        : 'bg-background border-foreground/10 hover:border-primary/30',
                                                                )}
                                                            >
                                                                {option}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            {question.type ===
                                                'short_answer' && (
                                                <input
                                                    type="text"
                                                    value={
                                                        answers[question.id] ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleAnswerChange(
                                                            question.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Type your answer..."
                                                    className="w-full ml-12 px-4 py-3 rounded-xl border-2 border-foreground/10 bg-background focus:border-primary/50 focus:outline-none transition-colors"
                                                />
                                            )}
                                        </div>
                                    ),
                                )}

                                <Button
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting ||
                                        Object.keys(answers).length <
                                            testData.questions.length
                                    }
                                    className="w-full h-14 rounded-2xl text-lg font-bold"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2
                                                className="animate-spin mr-2"
                                                size={20}
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle
                                                className="mr-2"
                                                size={20}
                                            />
                                            Submit Test
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {results && (
                            <div className="space-y-6">
                                {/* Score Card */}
                                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 text-center">
                                    <Trophy
                                        size={64}
                                        className="mx-auto mb-4 text-primary"
                                    />
                                    <h3 className="text-4xl font-bold mb-2">
                                        {results.score}%
                                    </h3>
                                    <p className="text-lg text-muted-foreground mb-4">
                                        {results.correctCount} out of{' '}
                                        {results.totalQuestions} correct
                                    </p>
                                    {results.score >= 70 && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold">
                                            <Zap size={16} />+
                                            {results.pointsEarned || 0} XP
                                            Earned
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Results */}
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold">
                                        Review Answers
                                    </h4>
                                    {results.results.map(
                                        (result: any, index: number) => (
                                            <div
                                                key={result.id}
                                                className={cn(
                                                    'p-6 rounded-2xl border-2',
                                                    result.isCorrect
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-red-500/10 border-red-500/30',
                                                )}
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    {result.isCorrect ? (
                                                        <CheckCircle
                                                            className="text-green-500 flex-shrink-0"
                                                            size={24}
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            className="text-red-500 flex-shrink-0"
                                                            size={24}
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-bold mb-2">
                                                            {result.text}
                                                        </p>
                                                        <p className="text-sm">
                                                            <span className="opacity-60">
                                                                Your answer:
                                                            </span>{' '}
                                                            <span
                                                                className={
                                                                    result.isCorrect
                                                                        ? 'text-green-500'
                                                                        : 'text-red-500'
                                                                }
                                                            >
                                                                {result.userAnswer ||
                                                                    'No answer'}
                                                            </span>
                                                        </p>
                                                        {!result.isCorrect && (
                                                            <p className="text-sm mt-1">
                                                                <span className="opacity-60">
                                                                    Correct
                                                                    answer:
                                                                </span>{' '}
                                                                <span className="text-green-500">
                                                                    {
                                                                        result.correctAnswer
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}
                                                        {result.explanation && (
                                                            <p className="text-sm mt-3 p-3 rounded-lg bg-card/5">
                                                                {
                                                                    result.explanation
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>

                                <Button
                                    onClick={handleClose}
                                    className="w-full h-14 rounded-2xl text-lg font-bold"
                                >
                                    Close
                                </Button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QuickTestModal;
