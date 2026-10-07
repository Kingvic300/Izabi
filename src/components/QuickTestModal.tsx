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
import { AnswerOption } from '@/components/ui/answer-option';
import { cn } from '@/lib/utils';
import { api } from '@/lib/apiClient';
import { useLanguage } from '@/contexts/LanguageContext';

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
    const { t } = useLanguage();
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
                err.response?.data?.message || t('quiz.failed_to_start'),
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
                const pointsEarned = res.meta?.pointsEarned || 0;
                setResults({ ...res.data, pointsEarned });
                if (onComplete) {
                    onComplete(res.data.score, pointsEarned);
                }
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t('quiz.failed_to_submit'));
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg border border-border bg-card shadow-float"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 border-b border-border bg-card p-5 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h2 className="text-2xl">
                                        {testData?.title || t('quiz.default_title')}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {results
                                            ? t('quiz.test_complete')
                                            : t('quiz.answer_before_time')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                {!results && testData && (
                                    <div
                                        className={cn(
                                            'tabular flex items-center gap-2 font-display text-2xl',
                                            timeLeft < 60 && 'text-urgent',
                                        )}
                                    >
                                        <Clock size={18} />
                                        {formatTime(timeLeft)}
                                    </div>
                                )}
                                <button
                                    onClick={handleClose}
                                    className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-muted"
                                    aria-label="Close"
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
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                <p className="text-lg font-medium text-muted-foreground">
                                    {t('quiz.generating_test')}
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-3 p-6 rounded-2xl bg-destructive/10 border border-destructive/20">
                                <AlertCircle
                                    className="text-destructive"
                                    size={24}
                                />
                                <div>
                                    <p className="font-bold text-destructive">
                                        {t('quiz.error_label')}
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
                                            className="border-b border-sheet/25 pb-6 last:border-b-0"
                                        >
                                            <div className="mb-4 flex items-start gap-4">
                                                <span className="tabular w-7 shrink-0 pt-0.5 text-right font-bold text-sheet">
                                                    {index + 1}.
                                                </span>
                                                <p className="flex-1 font-display text-lg leading-snug">
                                                    {question.text}
                                                </p>
                                            </div>

                                            {question.type ===
                                                'multiple_choice' &&
                                                question.options && (
                                                    <div role="radiogroup" className="ml-11 grid gap-2">
                                                        {question.options.map((option, optIndex) => (
                                                            <AnswerOption
                                                                key={optIndex}
                                                                letter={String.fromCharCode(65 + optIndex)}
                                                                state={answers[question.id] === option ? 'selected' : 'idle'}
                                                                onClick={() => handleAnswerChange(question.id, option)}
                                                            >
                                                                {option}
                                                            </AnswerOption>
                                                        ))}
                                                    </div>
                                                )}

                                            {question.type === 'true_false' && (
                                                <div role="radiogroup" className="ml-11 grid grid-cols-2 gap-2">
                                                    {['True', 'False'].map((option) => (
                                                        <AnswerOption
                                                            key={option}
                                                            letter={option[0]}
                                                            state={answers[question.id] === option ? 'selected' : 'idle'}
                                                            onClick={() => handleAnswerChange(question.id, option)}
                                                        >
                                                            {option === 'True' ? t('quiz.true') : t('quiz.false')}
                                                        </AnswerOption>
                                                    ))}
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
                                                    placeholder={t('quiz.type_answer_ellipsis')}
                                                    className="ml-11 h-11 w-[calc(100%-2.75rem)] rounded-md border border-input bg-card px-3 text-base focus:border-foreground focus:outline-none"
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
                                    className="w-full sm:w-auto" size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2
                                                className="animate-spin mr-2"
                                                size={20}
                                            />
                                            {t('quiz.submitting')}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle
                                                className="mr-2"
                                                size={20}
                                            />
                                            {t('quiz.submit_test')}
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {results && (
                            <div className="space-y-6">
                                {/* Score Card */}
                                <div className="p-8 rounded-xl bg-primary/10 border border-primary/30 text-center">
                                    <Trophy
                                        size={64}
                                        className="mx-auto mb-4 text-primary"
                                    />
                                    <h3 className="text-4xl font-bold mb-2">
                                        {results.score}%
                                    </h3>
                                    <p className="text-lg text-muted-foreground mb-4">
                                        {results.correctCount} {t('quiz.out_of')}{' '}
                                        {results.totalQuestions} {t('quiz.correct_suffix')}
                                    </p>
                                    {results.score >= 70 && (
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-bold">
                                            <Zap size={16} />+
                                            {results.pointsEarned || 0} {t('quiz.xp_earned')}
                                        </div>
                                    )}
                                </div>

                                {/* Detailed Results */}
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold">
                                        {t('quiz.review_answers')}
                                    </h4>
                                    {results.results.map(
                                        (result: any, index: number) => (
                                            <div
                                                key={result.id}
                                                className={cn(
                                                    'border-l-2 py-1 pl-4',
                                                    result.isCorrect
                                                        ? 'border-reward'
                                                        : 'border-destructive',
                                                )}
                                            >
                                                <div className="flex items-start gap-3 mb-3">
                                                    {result.isCorrect ? (
                                                        <CheckCircle
                                                            className="text-reward flex-shrink-0"
                                                            size={24}
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            className="text-destructive flex-shrink-0"
                                                            size={24}
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="font-bold mb-2">
                                                            {result.text}
                                                        </p>
                                                        <p className="text-sm">
                                                            <span className="opacity-60">
                                                                {t('quiz.your_answer')}
                                                            </span>{' '}
                                                            <span
                                                                className={
                                                                    result.isCorrect
                                                                        ? 'text-reward'
                                                                        : 'text-destructive'
                                                                }
                                                            >
                                                                {result.userAnswer ||
                                                                    t('quiz.no_answer')}
                                                            </span>
                                                        </p>
                                                        {!result.isCorrect && (
                                                            <p className="text-sm mt-1">
                                                                <span className="opacity-60">
                                                                    {t('quiz.correct_answer_colon')}
                                                                </span>{' '}
                                                                <span className="text-reward">
                                                                    {
                                                                        result.correctAnswer
                                                                    }
                                                                </span>
                                                            </p>
                                                        )}
                                                        {result.explanation && (
                                                            <p className="text-sm mt-3 p-3 rounded-lg bg-card">
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
                                    className="w-full sm:w-auto" size="lg"
                                >
                                    {t('quiz.close')}
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
