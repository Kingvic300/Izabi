'use client';

import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Zap, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';
import { QuizResults } from './QuizResults';
import { useQuizState } from '@/hooks/useQuizState';
import { Question } from '@/components/dashboard-home/types';

interface QuizSectionProps {
    questions: Question[];
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload: () => void;
    quizStyle: string;
    shuffleEnabled: boolean;
    showExplanations: boolean;
    onSubmitQuiz: (score: number, total: number, percentage: number) => void;
}

export const QuizSection = ({
    questions,
    isOpen,
    onOpenChange,
    onDownload,
    quizStyle,
    shuffleEnabled,
    showExplanations,
    onSubmitQuiz,
}: QuizSectionProps) => {
    const {
        selectedAnswers,
        showResults,
        setShowResults,
        displayQuestions,
        answeredCount,
        scoreQuiz,
        handleAnswerSelect,
        handleShortAnswerChange,
    } = useQuizState(questions, shuffleEnabled, quizStyle);

    const handleFinalizeQuiz = async () => {
        const score = scoreQuiz();
        const total = displayQuestions.length;
        if (total === 0) return;
        const percentage = Math.round((score / total) * 100);

        setShowResults(true);
        await onSubmitQuiz(score, total, percentage);
    };

    if (displayQuestions.length === 0) {
        return (
            <div className="p-5 rounded-2xl border border-foreground/10 bg-card/5 text-center space-y-3">
                <div className="text-sm font-bold">No questions match this mode.</div>
                <p className="text-xs text-muted-foreground">
                    Switch to Mixed or generate more questions.
                </p>
            </div>
        );
    }

    return (
        <div id="questions-result-section">
            <Collapsible open={isOpen} onOpenChange={onOpenChange}>
                <Card className="relative glass border-foreground/5 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-br from-card/70 via-card/40 to-background/90">
                    <CollapsibleTrigger asChild>
                        <button className="w-full text-left p-4 sm:p-6 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-xl md:text-2xl font-bold leading-tight">
                                            Practice Quiz
                                        </h3>
                                        <div className="px-2.5 py-1 rounded-full bg-foreground/5 text-[9px] font-black uppercase tracking-[0.18em] opacity-60">
                                            {displayQuestions.length} questions
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-40">
                                        Test your understanding
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-3xl glass hover:bg-primary/20 text-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDownload();
                                    }}
                                >
                                    <Download size={18} />
                                </Button>
                                <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-card/5 transition-all">
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8">
                            <QuizProgress
                                answered={answeredCount}
                                total={displayQuestions.length}
                                showResults={showResults}
                            />

                            {displayQuestions.map((q, i) => {
                                const userAnswer = selectedAnswers[i];
                                const isCorrect = userAnswer === q.answer;

                                return (
                                    <QuizQuestion
                                        key={i}
                                        question={q}
                                        index={i}
                                        userAnswer={userAnswer}
                                        showResults={showResults}
                                        showExplanations={showExplanations}
                                        isCorrect={isCorrect}
                                        onAnswerSelect={(opt) => handleAnswerSelect(i, opt)}
                                        onShortAnswerChange={(val) => handleShortAnswerChange(i, val)}
                                    />
                                );
                            })}

                            <QuizResults
                                score={scoreQuiz()}
                                total={displayQuestions.length}
                                onFinalize={handleFinalizeQuiz}
                                isResultsView={showResults}
                            />
                        </div>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        </div>
    );
};