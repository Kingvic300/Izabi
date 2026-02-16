'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { Share2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WelcomeHeader } from '@/components/dashboard-home/WelcomeHeader';
import { GamificationStrip } from '@/components/dashboard-home/GamificationStrip';
import { BrainDropSection } from '@/components/dashboard-home/BrainDropSection';
import IntentCards from '@/components/IntentCards';
import ContextCard from '@/components/ContextCard';
import { DocumentInfo } from '@/components/dashboard-home/DocumentInfo';
import {
    UploadPrompt,
    UploadSidebar,
} from '@/components/dashboard-home/UploadPrompt';
import { StudyControls } from '@/components/dashboard-home/StudyControls';
import { ResultsHub } from '@/components/dashboard-home/ResultsHub';
import { ShareProfileDialog } from '@/components/dashboard-home/ShareProfileDialog';
import QuickTestModal from '@/components/QuickTestModal';
import StudyTricksModal from '@/components/StudyTricksModal';
import PracticeQuizModal from '@/components/PracticeQuizModal';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useJobPolling } from '@/hooks/useJobPolling';
import { usePDFExtraction } from '@/hooks/usePDFExtraction';
import { useApiError } from '@/hooks/useApiError';
import { useStudy } from '@/contexts/StudyContext';
import { useProfileShare } from '@/hooks/useProfileShare';
import { api } from '@/lib/apiClient';
import { buildPracticeQuestionSet, shuffleArray } from '@/lib/quizUtils';
import {
    DEFAULT_PRACTICE_QUESTION_COUNT,
    ENDPOINT_TO_MODULE_ID,
    INITIAL_MODULE_STATUSES,
} from '@/components/dashboard-home/dashboard';

gsap.registerPlugin(ScrollToPlugin);

type PendingScroll = {
    endpoint: string;
};

export default function DashboardHome() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pendingScrollRef = useRef<PendingScroll | null>(null);
    const { session, updateSession, addJob } = useStudy();
    const { addError, clearError } = useApiError();
    const {
        userStats,
        brainDropQuestion,
        isBrainDropCompleted,
        handleBrainDropAnswer,
        fetchStats,
        userId,
    } = useDashboardData();
    const {
        isProcessing,
        setIsProcessing,
        moduleStatuses,
        setModuleStatuses,
        pollJobStatus,
    } = useJobPolling();
    const { extractTextFromPDF } = usePDFExtraction();

    const [showQuickTestModal, setShowQuickTestModal] = useState(false);
    const [showStudyTricksModal, setShowStudyTricksModal] = useState(false);
    const [showPracticeQuiz, setShowPracticeQuiz] = useState(false);
    const [showContextCard, setShowContextCard] = useState(false);
    const [practiceQuestions, setPracticeQuestions] = useState<any[]>([]);
    const [userExamType, setUserExamType] = useState<string | null>(null);
    const {
        isSharing,
        isShareModalOpen,
        setIsShareModalOpen,
        shareProfile,
        profileData,
        shareUrl,
        shareText,
    } = useProfileShare();

    useGSAP(
        () => {
            const tl = gsap.timeline();
            tl.from('.welcome-text', {
                opacity: 0,
                y: -20,
                duration: 0.8,
                ease: 'expo.out',
            }).from(
                '.stagger-card',
                {
                    opacity: 0,
                    y: 30,
                    stagger: 0.1,
                    duration: 1,
                    ease: 'expo.out',
                },
                '-=0.4',
            );
        },
        { scope: containerRef },
    );

    useEffect(() => {
        const savedExamType = localStorage.getItem('user_exam_type');
        if (savedExamType) {
            setUserExamType(savedExamType);
        }
    }, []);

    const scrollToSection = (sectionId: string, delay = 120) => {
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: section, offsetY: 20 },
                    ease: 'expo.out',
                });
            }
        }, delay);
    };

    const handleSelectionComplete = ({ selection, file }: any) => {
        updateSession({
            pdfSelection: selection,
            pdfFile: file,
            fileName: file.name,
            summary: '',
            studyGuide: '',
            questions: [],
            flashcards: [],
        });
        setModuleStatuses(INITIAL_MODULE_STATUSES);
        setIsProcessing(false);
        scrollToSection('study-modes-grid', 220);
    };

    const handleUploadDocument = () => {
        updateSession({
            pdfSelection: null,
            pdfFile: null,
            fileName: '',
            summary: '',
            studyGuide: '',
            questions: [],
            flashcards: [],
        });
        setModuleStatuses(INITIAL_MODULE_STATUSES);
        setIsProcessing(false);
        scrollToSection('upload-section');
    };

    const handleReadyToLearn = () => {
        scrollToSection('upload-section');
        const uploadInput = document.getElementById(
            'file-upload-redesign',
        ) as HTMLInputElement | null;

        if (uploadInput) {
            uploadInput.click();
            return;
        }

        handleUploadDocument();
    };

    const handleModuleRequest = async (
        endpoint: string,
        includeQuestions = false,
    ) => {
        if (!session.pdfFile || !session.pdfSelection) {
            addError({
                message: 'Please upload a document first.',
                type: 'validation',
            });
            return;
        }

        const moduleId = ENDPOINT_TO_MODULE_ID[endpoint];
        setIsProcessing(true);
        if (moduleId) {
            setModuleStatuses((prev) => ({
                ...prev,
                [moduleId]: 'processing',
            }));
        }
        clearError();

        try {
            const typeMap: Record<string, string> = {
                summarize: 'summary',
                'generate-questions': 'quiz',
                flashcards: 'flashcards',
                'generate-study-material': 'study-guide',
            };

            const type = typeMap[endpoint] || endpoint;
            const options = includeQuestions
                ? { count: session.numberOfQuestions }
                : {};

            if (endpoint === 'generate-questions') {
                Object.assign(options, {
                    difficulty: session.quizDifficulty,
                    questionStyle: session.quizStyle,
                    shuffle: session.shuffleQuestions,
                });
            }

            if (session.pdfFile.size > 10 * 1024 * 1024) {
                try {
                    const localText = await extractTextFromPDF(session.pdfFile);
                    if (localText.trim().length < 30) {
                        throw new Error(
                            'Local extraction produced insufficient text.',
                        );
                    }

                    const ingestRes = await api.ingestText({
                        text: localText,
                        fileName: session.pdfFile.name,
                        type,
                        options,
                    });

                    addJob(ingestRes.jobId, session.pdfFile.name, type);
                    pendingScrollRef.current = { endpoint };
                    pollJobStatus(ingestRes.jobId, endpoint);
                    return;
                } catch (localError) {
                    console.warn(
                        'Local extraction failed, using direct ingestion.',
                        localError,
                    );
                }
            }

            const ingestRes = await api.ingestDirect(
                session.pdfFile,
                type,
                options,
            );
            addJob(ingestRes.jobId, session.pdfFile.name, type);
            pendingScrollRef.current = { endpoint };
            pollJobStatus(ingestRes.jobId, endpoint);
        } catch (err: any) {
            console.error('Request failed:', err);
            addError({
                message:
                    err.response?.data?.message ||
                    err.message ||
                    'Failed to start processing.',
                type: 'api',
            });
            setIsProcessing(false);
            if (moduleId) {
                setModuleStatuses((prev) => ({
                    ...prev,
                    [moduleId]: 'failed',
                }));
            }
        }
    };

    useEffect(() => {
        if (!pendingScrollRef.current) return;
        const { endpoint } = pendingScrollRef.current;
        const moduleId = ENDPOINT_TO_MODULE_ID[endpoint];
        if (!moduleId) return;

        if (moduleStatuses[moduleId] === 'completed') {
            pendingScrollRef.current = null;
            const sectionMap: Record<string, string> = {
                summarize: 'summary-result-section',
                guide: 'study-guide-result-section',
                quiz: 'questions-result-section',
                cards: 'flashcards-result-section',
            };
            const target = sectionMap[moduleId];
            if (target) {
                scrollToSection(target, 220);
            }
        } else if (moduleStatuses[moduleId] === 'failed') {
            pendingScrollRef.current = null;
        }
    }, [moduleStatuses]);

    const handlePracticeSkills = async () => {
        const questionCount = DEFAULT_PRACTICE_QUESTION_COUNT;

        try {
            const res = await api.getPracticeQuestions(questionCount);
            const apiQuestions = Array.isArray(res?.data) ? res.data : [];
            const questions = buildPracticeQuestionSet(
                apiQuestions,
                questionCount,
            );

            if (questions.length === 0) {
                throw new Error('No practice questions available.');
            }

            setPracticeQuestions(questions);
            setShowPracticeQuiz(true);
            updateSession({
                questions,
                summary: '',
                studyGuide: '',
                flashcards: [],
            });
            scrollToSection('questions-result-section', 220);
        } catch (err) {
            const fallbackQuestions = buildPracticeQuestionSet(
                [],
                questionCount,
            );

            if (fallbackQuestions.length > 0) {
                setPracticeQuestions(fallbackQuestions);
                setShowPracticeQuiz(true);
                updateSession({
                    questions: fallbackQuestions,
                    summary: '',
                    studyGuide: '',
                    flashcards: [],
                });
                scrollToSection('questions-result-section', 220);
                return;
            }

            addError({
                message: 'Failed to load practice questions.',
                type: 'validation',
            });
        }
    };

    const handleQuickTest = () => {
        if (!session.pdfFile) {
            addError({
                message:
                    'Please upload a PDF document first to perform a Quick Test.',
                type: 'validation',
            });
            scrollToSection('upload-section');
            return;
        }
        setShowQuickTestModal(true);
    };

    const handleLearnTricks = () => {
        setShowStudyTricksModal(true);
    };

    const handleQuickTestComplete = (score: number, pointsEarned: number) => {
        fetchStats();
        if (score >= 70) {
            addError({
                message: `Great job! You earned ${pointsEarned} XP!`,
                type: 'validation',
            });
        }
    };

    const handleContextSelect = (examType: string) => {
        setUserExamType(examType);
        setShowContextCard(false);
        localStorage.setItem('context_card_seen', 'true');
        localStorage.setItem('user_exam_type', examType);
    };

    const handleContextDismiss = () => {
        setShowContextCard(false);
        localStorage.setItem('context_card_seen', 'true');
    };

    const handleBrainDropSubmission = async (
        answer: string,
        isCorrect: boolean,
    ) => {
        const ok = await handleBrainDropAnswer(answer, isCorrect);
        if (ok) {
            const hasSeenContext = localStorage.getItem('context_card_seen');
            if (!hasSeenContext && userExamType === null) {
                setTimeout(() => setShowContextCard(true), 2000);
            }
        }
    };

    const handleShareProfile = () => {
        if (!userId) {
            addError({
                message: 'Unable to share profile right now.',
                type: 'validation',
            });
            return;
        }

        void shareProfile(userId);
    };

    const handleQuizSubmit = async (
        score: number,
        total: number,
        percentage: number,
    ) => {
        if (total === 0) return;

        try {
            await api.submitQuizResult({
                score: percentage,
                totalQuestions: total,
                correctAnswers: score,
                subject: session.pdfFile?.name.split('.')[0] || 'General',
                date: new Date().toISOString(),
            });
            fetchStats();
            gsap.to(window, {
                duration: 1,
                scrollTo: '#mastery-verdict',
                ease: 'expo.out',
            });
        } catch (err) {
            console.error('Failed to submit quiz result:', err);
        }
    };

    const handleDownload = (content: string, filename: string) => {
        const header = `----------------------------------------\nIZABI STUDY ASSISTANT: STUDY MATERIAL\nTIMESTAMP: ${new Date().toLocaleString()}\nPROTOCOL: STANDARD_V2\n----------------------------------------\n\n`;
        const blob = new Blob([header + content], {
            type: 'text/markdown',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const downloadSummary = () => {
        if (!session.summary) return;
        handleDownload(
            session.summary,
            `Izabi_Summary_${session.pdfFile?.name.split('.')[0] || 'Note'}`,
        );
    };

    const downloadStudyGuide = () => {
        if (!session.studyGuide) return;
        handleDownload(
            session.studyGuide,
            `Izabi_Study_Guide_${session.pdfFile?.name.split('.')[0] || 'Note'}`,
        );
    };

    const getDownloadQuestions = () => {
        const questions = session.questions || [];
        const filtered = session.quizStyle === 'mcq'
            ? questions.filter(
                  (q: any) => q.questionType?.toLowerCase() !== 'short_answer',
              )
            : session.quizStyle === 'short'
              ? questions.filter(
                    (q: any) => q.questionType?.toLowerCase() === 'short_answer',
                )
              : questions;
        return session.shuffleQuestions ? shuffleArray(filtered) : filtered;
    };

    const downloadQuiz = () => {
        const questions = getDownloadQuestions();
        if (questions.length === 0) return;
        let content = `# Quiz: ${session.pdfFile?.name.split('.')[0] || 'Document'}\n\n`;
        questions.forEach((q: any, i: number) => {
            content += `## Question ${i + 1}\n${q.question}\n\n`;
            if (q.options && q.options.length > 0) {
                content += `Options:\n`;
                q.options.forEach((opt: string, idx: number) => {
                    content += `${String.fromCharCode(65 + idx)}) ${opt}\n`;
                });
                content += `\n`;
            }
            content += `**Correct Answer:** ${q.answer}\n`;
            if (q.explanation) content += `**Explanation:** ${q.explanation}\n`;
            content += `\n---\n\n`;
        });
        handleDownload(
            content,
            `Izabi_Quiz_${session.pdfFile?.name.split('.')[0] || 'Assessment'}`,
        );
    };

    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                className="space-y-6 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-10"
            >
                <WelcomeHeader firstName={userStats?.data?.firstName} />

                {userStats?.data && (
                    <div className="space-y-3">
                        <GamificationStrip
                            streak={
                                userStats.data.streakData?.academicStreak ??
                                userStats.data.studyStreak ??
                                0
                            }
                            xp={userStats.data.totalPoints || 0}
                        />
                        {userId && (
                            <div className="flex justify-end">
                                <Button
                                    variant="outline"
                                    className="h-11 rounded-2xl border-primary/30 text-primary hover:bg-primary/10 gap-2"
                                    onClick={handleShareProfile}
                                    disabled={isSharing}
                                >
                                    <Share2 size={16} />
                                    {isSharing ? 'Preparing...' : 'Share Profile'}
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <BrainDropSection
                    isCompleted={isBrainDropCompleted}
                    question={brainDropQuestion}
                    onAnswer={handleBrainDropSubmission}
                    onUploadClick={handleReadyToLearn}
                />

                <div className="stagger-card">
                    <IntentCards
                        onPracticeSkills={handlePracticeSkills}
                        onQuickTest={handleQuickTest}
                        onLearnTricks={handleLearnTricks}
                        onUploadDocument={handleUploadDocument}
                    />
                </div>

                <AnimatePresence>
                    {showContextCard && (
                        <div className="stagger-card">
                            <ContextCard
                                onSelect={handleContextSelect}
                                onDismiss={handleContextDismiss}
                            />
                        </div>
                    )}
                </AnimatePresence>

                <div className="workspace-area">
                    {session.pdfSelection ? (
                        <div className="grid grid-cols-1 2xl:grid-cols-12 gap-8 stagger-card">
                            <div className="2xl:col-span-4 space-y-6">
                                <DocumentInfo
                                    fileName={
                                        session.pdfSelection?.metadata
                                            ?.fileName || session.fileName
                                    }
                                    userStats={userStats}
                                    onReset={handleUploadDocument}
                                />
                            </div>
                            <div className="2xl:col-span-8 space-y-6">
                                <StudyControls
                                    moduleStatuses={moduleStatuses}
                                    isProcessing={isProcessing}
                                    numberOfQuestions={session.numberOfQuestions}
                                    quizDifficulty={session.quizDifficulty}
                                    quizStyle={session.quizStyle}
                                    shuffleQuestions={session.shuffleQuestions}
                                    showExplanations={session.showExplanations}
                                    onModuleClick={handleModuleRequest}
                                    onQuestionsChange={(value) =>
                                        updateSession({
                                            numberOfQuestions: value,
                                        })
                                    }
                                    onDifficultyChange={(value) =>
                                        updateSession({ quizDifficulty: value })
                                    }
                                    onStyleChange={(value) =>
                                        updateSession({ quizStyle: value })
                                    }
                                    onShuffleChange={(checked) =>
                                        updateSession({
                                            shuffleQuestions: checked,
                                        })
                                    }
                                    onExplanationsChange={(checked) =>
                                        updateSession({
                                            showExplanations: checked,
                                        })
                                    }
                                />

                                <ResultsHub
                                    onDownloadSummary={downloadSummary}
                                    onDownloadGuide={downloadStudyGuide}
                                    onDownloadQuiz={downloadQuiz}
                                    onSubmitQuiz={handleQuizSubmit}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 stagger-card">
                            <div className="lg:col-span-7">
                                <UploadPrompt
                                    onSelectionComplete={handleSelectionComplete}
                                    onReadyToLearn={handleReadyToLearn}
                                />
                            </div>
                            <div className="lg:col-span-5">
                                <UploadSidebar onReadyToLearn={handleReadyToLearn} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <QuickTestModal
                isOpen={showQuickTestModal}
                onClose={() => setShowQuickTestModal(false)}
                onComplete={handleQuickTestComplete}
            />
            <StudyTricksModal
                isOpen={showStudyTricksModal}
                onClose={() => setShowStudyTricksModal(false)}
            />
            <PracticeQuizModal
                isOpen={showPracticeQuiz}
                onClose={() => setShowPracticeQuiz(false)}
                questions={practiceQuestions}
            />
            {profileData && (
                <ShareProfileDialog
                    open={isShareModalOpen}
                    onOpenChange={setIsShareModalOpen}
                    profileData={profileData}
                    shareUrl={shareUrl}
                    shareText={shareText}
                />
            )}
        </ErrorBoundary>
    );
}
