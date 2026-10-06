import React, { useState } from 'react';
import {
    FileText,
    Sparkles,
    BookOpen,
    HelpCircle,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Copy,
    Check,
    Award,
    Download,
} from 'lucide-react';
import { SummaryContent } from '@/lib/summaryUtils';

export type StudyOutputType = 'summary' | 'quiz' | 'flashcards';

interface QuizQuestionItem {
    question: string;
    options?: string[];
    answer?: string;
    questionType?: string;
}

interface FlashcardItem {
    front: string;
    back: string;
}

interface StudyGenerationHubProps {
    documentName: string;
    selectedPages?: number[];
    summary: SummaryContent;
    questions: QuizQuestionItem[];
    flashcards: FlashcardItem[];
    onEarnPoints: (xp: number) => void;
}

/**
 * Ported from izabi-new's StudyGenerationHub. The original ~1600-line
 * component simulated AI generation with hardcoded Cellular Respiration
 * content and included VN (voice note) and Video storyboard modes that have
 * no equivalent in Izabi's apiClient. This port keeps the Summary / Quiz /
 * Flashcards modes and wires them to the REAL generated content already
 * produced by DashboardHome's pipeline (StudyContext.session.summary /
 * .questions / .flashcards via api.ingestText + pollJobStatus), instead of
 * fabricated biochemistry text.
 * TODO: VN (audio recap) and Video storyboard modes are dropped — no
 * api.generateVoice-based recap UI or video-storyboard endpoint exists yet
 * for this flow (api.generateVoice exists for TTS of summaries elsewhere).
 */
export const StudyGenerationHub: React.FC<StudyGenerationHubProps> = ({
    documentName,
    selectedPages = [],
    summary,
    questions,
    flashcards,
    onEarnPoints,
}) => {
    const [activeMode, setActiveMode] = useState<StudyOutputType>('summary');
    const [copiedText, setCopiedText] = useState(false);

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});

    const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
    const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [quizDone, setQuizDone] = useState(false);

    const summaryText =
        typeof summary === 'string' ? summary : (summary as any)?.text || JSON.stringify(summary ?? '');

    const handleCopySummary = () => {
        setCopiedText(true);
        navigator.clipboard?.writeText(summaryText);
        setTimeout(() => setCopiedText(false), 2000);
    };

    const handleFlashcardRating = (quality: 'again' | 'hard' | 'good' | 'easy') => {
        if (quality === 'good' || quality === 'easy') {
            setMasteredCards((prev) => ({ ...prev, [currentCardIndex]: true }));
            onEarnPoints(5);
        }
        setIsCardFlipped(false);
        setCurrentCardIndex((prev) => (flashcards.length ? (prev + 1) % flashcards.length : 0));
    };

    const handleSelectQuizAnswer = (optionIdx: number, optionText: string) => {
        if (selectedQuizOption !== null) return;
        setSelectedQuizOption(optionIdx);

        const current = questions[currentQuizIdx];
        const isCorrect = current?.answer === optionText;
        if (isCorrect) setQuizScore((s) => s + 1);

        setTimeout(() => {
            if (currentQuizIdx + 1 < questions.length) {
                setCurrentQuizIdx((idx) => idx + 1);
                setSelectedQuizOption(null);
            } else {
                setQuizDone(true);
                onEarnPoints((quizScore + (isCorrect ? 1 : 0)) * 10);
            }
        }, 800);
    };

    const modeTabs: { id: StudyOutputType; label: string; icon: React.ElementType; count?: number }[] = [
        { id: 'summary', label: 'Summary', icon: BookOpen },
        { id: 'quiz', label: 'Quiz', icon: HelpCircle, count: questions.length },
        { id: 'flashcards', label: 'Flashcards', icon: CreditCard, count: flashcards.length },
    ];

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border overflow-x-auto no-scrollbar">
                {modeTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeMode === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveMode(tab.id)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{tab.label}</span>
                            {typeof tab.count === 'number' && (
                                <span className="text-[10px] font-mono opacity-80">({tab.count})</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {activeMode === 'summary' && (
                <div className="rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-card space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                            <span className="text-xs font-mono uppercase text-primary tracking-wide">
                                Document Synthesis
                            </span>
                            <h3 className="text-lg font-bold text-foreground mt-0.5 truncate max-w-sm">
                                {documentName}
                            </h3>
                        </div>
                        <button
                            type="button"
                            onClick={handleCopySummary}
                            disabled={!summaryText}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 border border-border text-xs font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {copiedText ? <Check className="w-3.5 h-3.5 text-learning-green" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedText ? 'Copied' : 'Copy Text'}</span>
                        </button>
                    </div>

                    {summaryText ? (
                        <div className="bg-muted/30 p-4.5 rounded-xl border border-border text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground font-mono mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span>
                                    Executive Summary
                                    {selectedPages.length > 0 ? ` (Pages ${selectedPages.join(', ')})` : ''}
                                </span>
                            </h4>
                            {summaryText}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            No summary generated yet. Use "Summarize" from the Study Controls to generate one.
                        </div>
                    )}
                </div>
            )}

            {activeMode === 'quiz' && (
                <div className="rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-card">
                    {questions.length === 0 ? (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            No quiz questions generated yet.
                        </div>
                    ) : !quizDone ? (
                        <div>
                            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                                <span className="text-xs font-mono text-primary">
                                    Question {currentQuizIdx + 1} of {questions.length}
                                </span>
                            </div>

                            <div className="bg-muted/30 p-4 sm:p-5 rounded-xl border border-border mb-5">
                                <h4 className="text-sm font-semibold text-foreground leading-relaxed">
                                    {questions[currentQuizIdx]?.question}
                                </h4>
                            </div>

                            <div className="space-y-2.5">
                                {(questions[currentQuizIdx]?.options || []).map((opt, idx) => {
                                    const isSelected = selectedQuizOption === idx;
                                    const isCorrect = opt === questions[currentQuizIdx]?.answer;
                                    const showResult = selectedQuizOption !== null;

                                    let style = 'bg-muted/30 border-border hover:border-primary/30 text-foreground/90';
                                    if (showResult) {
                                        if (isCorrect) style = 'bg-learning-green/10 border-learning-green/50 text-learning-green';
                                        else if (isSelected && !isCorrect) style = 'bg-destructive/10 border-destructive/50 text-destructive';
                                        else style = 'bg-muted/10 border-border/50 text-muted-foreground';
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={selectedQuizOption !== null}
                                            onClick={() => handleSelectQuizAnswer(idx, opt)}
                                            className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${style}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-5 h-5 rounded-md bg-card border border-border flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                <span>{opt}</span>
                                            </div>
                                            {showResult && isCorrect && (
                                                <CheckCircle2 className="w-4 h-4 text-learning-green shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-14 h-14 rounded-2xl bg-learning-green/10 border border-learning-green/30 text-learning-green flex items-center justify-center mx-auto mb-3">
                                <Award className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-foreground mb-1">Quiz Completed!</h4>
                            <p className="text-xs text-muted-foreground mb-4">
                                You correctly answered {quizScore} out of {questions.length} questions.
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 font-mono text-xs mb-6">
                                <span>+{quizScore * 10} XP Awarded</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentQuizIdx(0);
                                    setSelectedQuizOption(null);
                                    setQuizScore(0);
                                    setQuizDone(false);
                                }}
                                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/70 border border-border text-foreground/80 text-xs font-semibold cursor-pointer transition-colors"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeMode === 'flashcards' && (
                <div className="rounded-2xl bg-card border border-border p-6 sm:p-7 shadow-card space-y-5">
                    {flashcards.length === 0 ? (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            No flashcards generated yet.
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between pb-3 border-b border-border text-xs">
                                <span className="font-mono text-primary">
                                    Card {currentCardIndex + 1} of {flashcards.length}
                                </span>
                                <span className="font-mono text-muted-foreground">
                                    Mastered: {Object.keys(masteredCards).length} of {flashcards.length}
                                </span>
                            </div>

                            <div
                                onClick={() => setIsCardFlipped(!isCardFlipped)}
                                className="min-h-[220px] sm:min-h-[240px] rounded-2xl bg-muted/30 border border-border hover:border-primary/30 p-6 flex flex-col justify-between cursor-pointer transition-all duration-200"
                            >
                                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                                    <span className="text-primary">
                                        {isCardFlipped ? 'Answer · Back' : 'Question · Front'}
                                    </span>
                                </div>

                                <div className="my-auto py-4 text-center">
                                    <p className="text-base sm:text-lg font-semibold text-foreground leading-relaxed max-w-md mx-auto">
                                        {isCardFlipped
                                            ? flashcards[currentCardIndex]?.back
                                            : flashcards[currentCardIndex]?.front}
                                    </p>
                                </div>

                                <div className="text-[11px] text-muted-foreground text-center">
                                    {isCardFlipped ? 'Spaced Recall Verified' : 'Tap to reveal answer'}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 pt-2">
                                {[
                                    { id: 'again', label: 'Again', color: 'hover:bg-destructive/15 text-destructive' },
                                    { id: 'hard', label: 'Hard', color: 'hover:bg-amber-500/15 text-amber-600' },
                                    { id: 'good', label: 'Good', color: 'hover:bg-primary/15 text-primary' },
                                    { id: 'easy', label: 'Easy', color: 'hover:bg-learning-green/15 text-learning-green' },
                                ].map((btn) => (
                                    <button
                                        key={btn.id}
                                        type="button"
                                        onClick={() => handleFlashcardRating(btn.id as any)}
                                        className={`p-2.5 rounded-xl bg-muted/30 border border-border text-center transition-colors cursor-pointer ${btn.color}`}
                                    >
                                        <div className="text-xs font-bold">{btn.label}</div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudyGenerationHub;
