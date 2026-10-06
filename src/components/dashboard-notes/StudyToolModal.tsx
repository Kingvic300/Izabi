import React, { useState, useEffect, useCallback } from 'react';
import { X, Clock, Award, CheckCircle2, ChevronRight, Brain, Lightbulb, Zap, Sparkles, Loader2 } from 'lucide-react';
import type { StudyToolId } from './StudyToolsGrid';
import { api } from '@/lib/apiClient';

interface StudyToolModalProps {
    toolId: StudyToolId | null;
    onClose: () => void;
    onEarnPoints: (xp: number) => void;
    currentTopic?: string;
}

interface PracticeQuestion {
    id: string;
    question: string;
    options?: string[];
    answer?: string;
    explanation?: string;
    questionType?: string;
}

interface QuickTestQuestion {
    id: string;
    text: string;
    options?: string[];
    type?: string;
}

/**
 * Ported from izabi-new's StudyToolModal. "Practice" and "Quick Test" are now
 * wired to real backend endpoints (api.getPracticeQuestions and
 * api.startQuickTest/submitQuickTest) instead of hardcoded sample content.
 * "Study Tricks" has no backend endpoint — the tips shown are generic,
 * static study-technique reference content (not user data or simulated
 * stats), so it is kept as-is rather than removed.
 */
export const StudyToolModal: React.FC<StudyToolModalProps> = ({
    toolId,
    onClose,
    onEarnPoints,
    currentTopic = 'your recent material',
}) => {
    // Practice mode state
    const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
    const [practiceLoading, setPracticeLoading] = useState(false);
    const [practiceError, setPracticeError] = useState<string | null>(null);
    const [cardIndex, setCardIndex] = useState(0);
    const [cardFlipped, setCardFlipped] = useState(false);

    // Quick test mode state
    const [quizId, setQuizId] = useState<string | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<QuickTestQuestion[]>([]);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(300);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizFinished, setQuizFinished] = useState(false);
    const [quizSubmitting, setQuizSubmitting] = useState(false);
    const [quizResult, setQuizResult] = useState<{
        score: number;
        correctCount: number;
        totalQuestions: number;
        pointsEarned: number;
    } | null>(null);

    const loadPracticeQuestions = useCallback(() => {
        setPracticeLoading(true);
        setPracticeError(null);
        api.getPracticeQuestions(5)
            .then((res) => {
                const data = Array.isArray(res?.data) ? res.data : [];
                setPracticeQuestions(data);
                setCardIndex(0);
                setCardFlipped(false);
            })
            .catch(() => setPracticeError('Could not load practice questions. Please try again.'))
            .finally(() => setPracticeLoading(false));
    }, []);

    const loadQuickTest = useCallback(() => {
        setQuizLoading(true);
        setQuizError(null);
        setQuizFinished(false);
        setQuizResult(null);
        api.startQuickTest()
            .then((res) => {
                const data = res?.data ?? res;
                const questions = Array.isArray(data?.questions) ? data.questions : [];
                setQuizId(data?.quizId || null);
                setQuizQuestions(questions);
                setCurrentQuizIndex(0);
                setAnswers({});
                setSelectedAnswer(null);
                setTimeLeft(data?.durationSeconds ?? 300);
            })
            .catch((err) => {
                setQuizError(
                    err?.response?.data?.message ||
                        'Could not start a Quick Test right now. Please try again.',
                );
            })
            .finally(() => setQuizLoading(false));
    }, []);

    useEffect(() => {
        if (toolId === 'practice') {
            loadPracticeQuestions();
        } else if (toolId === 'quick-test') {
            loadQuickTest();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toolId]);

    const handleSubmitQuickTest = useCallback(
        (finalAnswers: Record<string, string>) => {
            if (!quizId || quizSubmitting) return;
            setQuizSubmitting(true);
            api.submitQuickTest(quizId, finalAnswers)
                .then((res) => {
                    const data = res?.data ?? res;
                    const pointsEarned = res?.meta?.pointsEarned ?? 0;
                    setQuizResult({
                        score: data?.score ?? 0,
                        correctCount: data?.correctCount ?? 0,
                        totalQuestions: data?.totalQuestions ?? quizQuestions.length,
                        pointsEarned,
                    });
                    if (pointsEarned) onEarnPoints(pointsEarned);
                    setQuizFinished(true);
                })
                .catch(() => {
                    setQuizError('Could not submit your answers. Please try again.');
                })
                .finally(() => setQuizSubmitting(false));
        },
        [quizId, quizSubmitting, quizQuestions.length, onEarnPoints],
    );

    useEffect(() => {
        if (toolId !== 'quick-test' || quizFinished || quizLoading || !quizId) return;
        if (timeLeft <= 0) {
            handleSubmitQuickTest(answers);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, [toolId, quizFinished, quizLoading, quizId, timeLeft, answers, handleSubmitQuickTest]);

    if (!toolId || toolId === 'upload-notes') return null;

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const studyTricks = [
        {
            title: 'The Feynman Technique',
            summary: `Explain ${currentTopic} as if teaching a complete beginner. Gaps in your explanation reveal gaps in your understanding.`,
        },
        {
            title: 'Chunking & Mnemonics',
            summary: 'Group related facts into short phrases or acronyms — it is easier to recall 4 chunks than 12 individual facts.',
        },
        {
            title: '3-Pass Note Review',
            summary: 'Pass 1: scan headings. Pass 2: recall key points from memory. Pass 3: fill gaps from the source material.',
        },
    ];

    const handleQuizAnswer = (optionText: string) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(optionText);

        const current = quizQuestions[currentQuizIndex];
        const nextAnswers = { ...answers, [current.id]: optionText };
        setAnswers(nextAnswers);

        setTimeout(() => {
            if (currentQuizIndex + 1 < quizQuestions.length) {
                setCurrentQuizIndex((idx) => idx + 1);
                setSelectedAnswer(null);
            } else {
                handleSubmitQuickTest(nextAnswers);
            }
        }, 450);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl max-w-xl w-full p-6 shadow-float relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                            {toolId === 'quick-test' ? (
                                <Zap className="w-5 h-5" />
                            ) : toolId === 'practice' ? (
                                <Brain className="w-5 h-5" />
                            ) : (
                                <Lightbulb className="w-5 h-5" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-foreground capitalize">
                                {toolId === 'quick-test'
                                    ? 'Quick Test (Timed 5-Min)'
                                    : toolId === 'practice'
                                      ? 'Practice Skills: Deep Recall'
                                      : 'Study Tricks & Memory Mnemonics'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono">Topic: {currentTopic}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {toolId === 'quick-test' && (
                    <div>
                        {quizLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <p className="text-xs">Generating your Quick Test...</p>
                            </div>
                        ) : quizError ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-destructive mb-4">{quizError}</p>
                                <button
                                    type="button"
                                    onClick={loadQuickTest}
                                    className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : !quizFinished && quizQuestions.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="tabular-nums font-bold">{formatTimer(timeLeft)}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">
                                        Question {currentQuizIndex + 1} of {quizQuestions.length}
                                    </span>
                                </div>

                                <div className="bg-muted/30 p-4 rounded-xl border border-border mb-4">
                                    <h4 className="text-sm font-semibold text-foreground">
                                        {quizQuestions[currentQuizIndex]?.text}
                                    </h4>
                                </div>

                                <div className="space-y-2">
                                    {(quizQuestions[currentQuizIndex]?.options || []).map((opt, idx) => {
                                        const isSelected = selectedAnswer === opt;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                disabled={selectedAnswer !== null}
                                                onClick={() => handleQuizAnswer(opt)}
                                                className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                                                    isSelected
                                                        ? 'bg-primary border-primary text-primary-foreground shadow-md'
                                                        : 'bg-muted/30 border-border hover:border-primary/40 text-foreground/90'
                                                }`}
                                            >
                                                <span>{opt}</span>
                                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : quizFinished && quizResult ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 rounded-2xl bg-learning-green/10 border border-learning-green/30 text-learning-green flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h4 className="text-lg font-bold text-foreground mb-1">Challenge Completed!</h4>
                                <p className="text-xs text-muted-foreground mb-4">
                                    You scored {quizResult.correctCount} / {quizResult.totalQuestions} correct ({quizResult.score}%)!
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 font-mono text-sm mb-6">
                                    <Award className="w-4 h-4" />
                                    <span>+{quizResult.pointsEarned} Total XP Awarded</span>
                                </div>
                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={loadQuickTest}
                                        className="px-4 py-2 rounded-xl bg-muted text-foreground/80 text-xs font-semibold cursor-pointer"
                                    >
                                        Retake Test
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                                {quizSubmitting ? 'Submitting your answers...' : 'No questions available.'}
                            </div>
                        )}
                    </div>
                )}

                {toolId === 'practice' && (
                    <div>
                        {practiceLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                <p className="text-xs">Loading practice questions...</p>
                            </div>
                        ) : practiceError ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-destructive mb-4">{practiceError}</p>
                                <button
                                    type="button"
                                    onClick={loadPracticeQuestions}
                                    className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : practiceQuestions.length === 0 ? (
                            <div className="text-center py-10 text-sm text-muted-foreground">
                                No practice questions available right now.
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                                    <span>Card {cardIndex + 1} of {practiceQuestions.length}</span>
                                    <span className="font-mono text-primary">Critical Thinking Drill</span>
                                </div>

                                <div
                                    onClick={() => setCardFlipped(!cardFlipped)}
                                    className="min-h-[160px] bg-muted/30 border border-border hover:border-primary/40 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all mb-4"
                                >
                                    <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase">
                                        <span>{cardFlipped ? 'Answer / Solution' : 'Prompt / Question'}</span>
                                        <span className="text-primary">Tap to flip</span>
                                    </div>

                                    <div className="my-3">
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            {cardFlipped
                                                ? practiceQuestions[cardIndex]?.answer ||
                                                  practiceQuestions[cardIndex]?.explanation ||
                                                  'No answer provided.'
                                                : practiceQuestions[cardIndex]?.question}
                                        </p>
                                        {cardFlipped && practiceQuestions[cardIndex]?.explanation && (
                                            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                                                {practiceQuestions[cardIndex].explanation}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCardFlipped(false);
                                            setCardIndex((i) => (i > 0 ? i - 1 : practiceQuestions.length - 1));
                                        }}
                                        className="px-3.5 py-1.5 rounded-lg bg-muted border border-border text-xs font-medium text-foreground/80 hover:text-foreground cursor-pointer"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            onEarnPoints(10);
                                            setCardFlipped(false);
                                            setCardIndex((i) => (i + 1) % practiceQuestions.length);
                                        }}
                                        className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground cursor-pointer flex items-center gap-1.5"
                                    >
                                        <span>Mastered (+10 XP)</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {toolId === 'study-tricks' && (
                    <div className="space-y-3">
                        {studyTricks.map((trick, idx) => (
                            <div key={idx} className="bg-muted/30 border border-border p-4 rounded-xl text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <h4 className="text-xs sm:text-sm font-bold text-foreground">{trick.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{trick.summary}</p>
                            </div>
                        ))}

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    onEarnPoints(5);
                                    onClose();
                                }}
                                className="px-4 py-2 rounded-xl bg-primary text-xs font-semibold text-primary-foreground cursor-pointer"
                            >
                                Save Tricks to Notes (+5 XP)
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyToolModal;
