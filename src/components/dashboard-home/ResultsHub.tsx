'use client';

import { useState, useEffect } from 'react';
import { FlashcardsSection } from './FlashcardsSection';
import { SummarySection } from './SummarySection';
import { QuizSection } from './QuizSection';
import { Brain, FileText, Flame } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';

interface ResultsHubProps {
    onDownloadSummary: () => void;
    onDownloadGuide: () => void;
    onDownloadQuiz: () => void;
    onSubmitQuiz: (score: number, total: number, percentage: number) => void;
}

export const ResultsHub = ({
    onDownloadSummary,
    onDownloadGuide,
    onDownloadQuiz,
    onSubmitQuiz,
}: ResultsHubProps) => {
    const { session } = useStudy();
    const [showSummary, setShowSummary] = useState(false);
    const [showStudyGuide, setShowStudyGuide] = useState(false);
    const [showQuestions, setShowQuestions] = useState(false);
    const [showFlashcards, setShowFlashcards] = useState(false);

    const { summary, studyGuide, questions, flashcards } = session;

    // Sync visibility with session data
    useEffect(() => {
        if (summary) setShowSummary(true);
        if (studyGuide) setShowStudyGuide(true);
        if (questions?.length > 0) setShowQuestions(true);
        if (flashcards?.length > 0) setShowFlashcards(true);
    }, [summary, studyGuide, questions, flashcards]);

    const hasContent = summary || studyGuide || questions.length > 0 || flashcards.length > 0;
    if (!hasContent) return null;

    return (
        <div id="results-hub" className="space-y-6 sm:space-y-8 pt-8 sm:pt-10 md:pt-12 stagger-card px-4 md:px-0">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl sm:text-4xl font-bold flex items-center gap-3 sm:gap-4 tracking-tighter">
                    <div className="w-2 h-10 bg-primary rounded-3xl" />
                    <span>Study Results</span>
                </h2>
            </div>

            {flashcards.length > 0 && (
                <FlashcardsSection
                    flashcards={flashcards}
                    isOpen={showFlashcards}
                    onOpenChange={setShowFlashcards}
                />
            )}

            {summary && (
                <SummarySection
                    content={summary}
                    isOpen={showSummary}
                    onOpenChange={setShowSummary}
                    onDownload={onDownloadSummary}
                    title="Smart Summary"
                    icon={Brain}
                    iconColor="text-blue-400"
                />
            )}

            {studyGuide && (
                <SummarySection
                    content={studyGuide}
                    isOpen={showStudyGuide}
                    onOpenChange={setShowStudyGuide}
                    onDownload={onDownloadGuide}
                    title="Study Guide"
                    icon={FileText}
                    iconColor="text-emerald-400"
                    audioLabel="Listen to Guide"
                />
            )}

            {questions.length > 0 && (
                <QuizSection
                    questions={questions}
                    isOpen={showQuestions}
                    onOpenChange={setShowQuestions}
                    onDownload={onDownloadQuiz}
                    quizStyle={session.quizStyle}
                    shuffleEnabled={session.shuffleQuestions}
                    showExplanations={session.showExplanations}
                    onSubmitQuiz={onSubmitQuiz}
                />
            )}
        </div>
    );
};