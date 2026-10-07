'use client';

import { ListChecks } from 'lucide-react';
import { ResultPanel } from './ResultPanel';
import { QuizQuestion } from './QuizQuestion';
import { QuizProgress } from './QuizProgress';
import { QuizResults } from './QuizResults';
import { useQuizState } from '@/hooks/useQuizState';
import { Question } from '@/components/dashboard-home/types';
import { isMcqCorrect, isShortAnswerCorrect } from '@/lib/quizUtils';
import { useLanguage } from '@/contexts/LanguageContext';

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
    const { t } = useLanguage();
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
            <div className="space-y-1 rounded-lg border border-border bg-card p-5">
                <p className="font-bold">{t('quiz.no_match')}</p>
                <p className="text-sm text-muted-foreground">
                    {t('quiz.switch_mixed')}
                </p>
            </div>
        );
    }

    return (
        <ResultPanel
            id="questions-result-section"
            title={t('quiz.practice_title')}
            meta={`${displayQuestions.length} ${t('quiz.questions_suffix')}`}
            icon={ListChecks}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onDownload={onDownload}
        >
            <div className="space-y-6">
                            <QuizProgress
                                answered={answeredCount}
                                total={displayQuestions.length}
                                showResults={showResults}
                            />

                            {displayQuestions.map((q, i) => {
                                const userAnswer = selectedAnswers[i];
                                const isCorrect = userAnswer
                                    ? q.questionType?.toLowerCase() === 'short_answer'
                                        ? isShortAnswerCorrect(userAnswer, q.answer || '')
                                        : isMcqCorrect(q, userAnswer)
                                    : false;

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
        </ResultPanel>
    );
};
