import { AnswerOption } from '@/components/ui/answer-option';
import { Button } from '@/components/ui/button';
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div role="dialog" aria-modal="true" aria-labelledby="study-tool-title" className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-float">
                <div className="mb-5 flex items-start justify-between gap-4 border-b border-border pb-4">
                    <div>
                        <h3 id="study-tool-title" className="text-xl">
                            {toolId === 'quick-test'
                                ? 'Quick test'
                                : toolId === 'practice'
                                  ? 'Practice skills'
                                  : 'Study tricks'}
                        </h3>
                        <p className="text-sm text-muted-foreground">Topic: {currentTopic}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {toolId === 'quick-test' && (
                    <div>
                        {quizLoading ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3 text-muted-foreground">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-sm">Writing your quick test…</p>
                            </div>
                        ) : quizError ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-destructive mb-4">{quizError}</p>
                                <Button onClick={loadQuickTest}>Try again</Button>
                            </div>
                        ) : !quizFinished && quizQuestions.length > 0 ? (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="tabular font-display text-2xl">{formatTimer(timeLeft)}</span>
                                    <span className="tabular text-sm text-muted-foreground">
                                        Question {currentQuizIndex + 1} of {quizQuestions.length}
                                    </span>
                                </div>

                                <h4 className="mb-4 font-display text-lg leading-snug">
                                    {quizQuestions[currentQuizIndex]?.text}
                                </h4>

                                <div role="radiogroup" className="grid gap-2">
                                    {(quizQuestions[currentQuizIndex]?.options || []).map((opt, idx) => (
                                        <AnswerOption
                                            key={idx}
                                            letter={String.fromCharCode(65 + idx)}
                                            state={selectedAnswer === opt ? 'selected' : selectedAnswer !== null ? 'dimmed' : 'idle'}
                                            disabled={selectedAnswer !== null}
                                            onClick={() => handleQuizAnswer(opt)}
                                        >
                                            {opt}
                                        </AnswerOption>
                                    ))}
                                </div>
                            </div>
                        ) : quizFinished && quizResult ? (
                            <div className="py-4">
                                <p className="tabular font-display text-5xl leading-none">
                                    {quizResult.correctCount}
                                    <span className="text-muted-foreground">/{quizResult.totalQuestions}</span>
                                </p>
                                <p className="mt-3 text-muted-foreground">
                                    {quizResult.score}% correct. You earned {quizResult.pointsEarned} points.
                                </p>
                                <div className="mt-6 flex gap-2">
                                    <Button variant="outline" onClick={loadQuickTest}>
                                        Try again
                                    </Button>
                                    <Button onClick={onClose}>Done</Button>
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
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-sm">Loading practice questions…</p>
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
                                <p className="tabular mb-3 text-sm text-muted-foreground">
                                    Card {cardIndex + 1} of {practiceQuestions.length}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setCardFlipped(!cardFlipped)}
                                    className="mb-4 flex min-h-[180px] w-full flex-col justify-between rounded-lg border border-border bg-card text-left transition-colors hover:border-foreground/40"
                                >
                                    <div className="flex w-full items-center justify-between border-b border-sheet/40 px-4 py-2 text-sm text-muted-foreground">
                                        <span>{cardFlipped ? 'Answer' : 'Question'}</span>
                                        <span>Tap to flip</span>
                                    </div>

                                    <div className="px-4 py-4">
                                        <p className="font-display text-lg leading-snug">
                                            {cardFlipped
                                                ? practiceQuestions[cardIndex]?.answer ||
                                                  practiceQuestions[cardIndex]?.explanation ||
                                                  'No answer provided.'
                                                : practiceQuestions[cardIndex]?.question}
                                        </p>
                                        {cardFlipped && practiceQuestions[cardIndex]?.explanation && (
                                            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                                                {practiceQuestions[cardIndex].explanation}
                                            </p>
                                        )}
                                    </div>
                                </button>

                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCardFlipped(false);
                                            setCardIndex((i) => (i > 0 ? i - 1 : practiceQuestions.length - 1));
                                        }}
                                        className="inline-flex h-10 items-center rounded-md border border-input bg-card px-4 text-sm font-bold hover:border-foreground/40"
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
                                        className="inline-flex h-10 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/85"
                                    >
                                        I know this one
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {toolId === 'study-tricks' && (
                    <div className="space-y-5">
                        {studyTricks.map((trick, idx) => (
                            <div key={idx} className="border-l-2 border-sheet/50 pl-4">
                                <h4 className="font-bold">{trick.title}</h4>
                                <p className="mt-0.5 text-[15px] leading-relaxed text-muted-foreground">{trick.summary}</p>
                            </div>
                        ))}

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    onEarnPoints(5);
                                    onClose();
                                }}
                                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary/85"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudyToolModal;
