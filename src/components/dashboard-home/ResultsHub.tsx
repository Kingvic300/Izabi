'use client';

import { useState, useEffect } from 'react';
import { FlashcardsSection } from './FlashcardsSection';
import { SummarySection } from './SummarySection';
import { QuizSection } from './QuizSection';
import { Brain, FileText, Flame, Sparkles, Terminal } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { motion } from 'framer-motion';
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
        <div id="results-hub" className="space-y-12 md:space-y-20 pt-16 md:pt-24 stagger-card">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="h-px w-8 bg-primary/40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                            {t('module.synthesis_complete')}
                        </span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none italic">
                        {t('module.knowledge_vault_top')} <span className="text-primary not-italic">{t('module.knowledge_vault_gradient')}</span>
                    </h2>
                </div>
                
                <div className="flex items-center gap-4 bg-foreground/5 p-4 rounded-2xl border border-foreground/5">
                    <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Terminal size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            {t('module.protocol_label')}
                        </div>
                        <div className="text-xs font-bold font-mono tracking-tighter">
                            A-STUDY_v2.0_STABLE
                        </div>
                    </div>
                </div>
            </div>
 
            <div className="space-y-10">
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
                        icon={Brain}
                        iconColor="text-primary"
                    />
                )}

                {studyGuide && (
                    <SummarySection
                        content={studyGuide}
                        isOpen={showStudyGuide}
                        onOpenChange={setShowStudyGuide}
                        onDownload={onDownloadGuide}
                        title={t('module.tactical_guide')}
                        icon={FileText}
                        iconColor="text-primary"
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
