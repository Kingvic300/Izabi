'use client';

import { useState, useEffect } from 'react';
import { FlashcardsSection } from './FlashcardsSection';
import { SummarySection } from './SummarySection';
import { QuizSection } from './QuizSection';
import { AlignLeft, BookOpen } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { useLanguage } from '@/contexts/LanguageContext';

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
    const { t } = useLanguage();
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
        <div id="results-hub" className="space-y-4 pt-4">
            <div>
                <h3 className="text-2xl">
                    {t('module.knowledge_vault_top')}
                </h3>
                <p className="mt-0.5 text-muted-foreground">
                    {t('module.synthesis_complete')}
                </p>
            </div>

            <div className="space-y-3">
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
                        title={t('module.core_synthesis')}
                        icon={AlignLeft}
                    />
                )}

                {studyGuide && (
                    <SummarySection
                        content={studyGuide}
                        isOpen={showStudyGuide}
                        onOpenChange={setShowStudyGuide}
                        onDownload={onDownloadGuide}
                        title={t('module.tactical_guide')}
                        icon={BookOpen}
                        audioLabel={t('module.vocalize_guide')}
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
        </div>
    );
};
