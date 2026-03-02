'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import { Sparkles, FileStack, CheckCircle2, ChevronRight, X, Share2, BrainCircuit, Eye, FileText } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { WelcomeHeader } from '@/components/dashboard-home/WelcomeHeader';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import PDFPreview from '@/components/pdf/PDFPreview';
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
    const navigate = useNavigate();
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
    const [showAIUpdate, setShowAIUpdate] = useState(false);
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    useEffect(() => {
        const dismissed = localStorage.getItem('ai_update_dismissed');
        if (!dismissed) setShowAIUpdate(true);
    }, []);

    const dismissAIUpdate = () => {
        setShowAIUpdate(false);
        localStorage.setItem('ai_update_dismissed', 'true');
    };

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

    const handleSelectionComplete = ({ selections, files }: any) => {
        updateSession({
            pdfSelections: selections,
            pdfFiles: files,
            fileNames: files.map((f: any) => f.name),
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
            pdfSelections: [],
            pdfFiles: [],
            fileNames: [],
            summary: '',
            studyGuide: '',
            questions: [],
            flashcards: [],
        });
        setModuleStatuses(INITIAL_MODULE_STATUSES);
        setIsProcessing(false);
        scrollToSection('upload-section');
    };

    const handleAddMore = () => {
        updateSession({
            pdfSelections: [],
        });
        // Scroll and then automatically trigger the file picker
        setTimeout(() => {
            scrollToSection('upload-section');
            // Give it another tiny moment to ensure the component is mounted and animations are in progress
            setTimeout(() => {
                const uploadInput = document.getElementById('file-upload-redesign') as HTMLInputElement | null;
                if (uploadInput) uploadInput.click();
            }, 300);
        }, 100);
    };

    const handlePreviewFile = (index: number) => {
        const file = session.pdfFiles[index];
        if (file) setPreviewFile(file);
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
        if (session.pdfFiles.length === 0) {
            addError({
                message: 'Please upload at least one document first.',
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

            if (session.pdfFiles.length === 1 && session.pdfFiles[0].size > 10 * 1024 * 1024) {
                const file = session.pdfFiles[0];
                try {
                    const localText = await extractTextFromPDF(file);
                    if (localText.trim().length < 30) {
                        throw new Error(
                            'Local extraction produced insufficient text.',
                        );
                    }

                    const ingestRes = await api.ingestText({
                        text: localText,
                        fileName: file.name,
                        type,
                        options,
                    });

                    addJob(ingestRes.jobId, [file.name], type);
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

            const ingestRes = await api.ingestMultiDirect(
                session.pdfFiles,
                type,
                options,
            );
            addJob(ingestRes.jobId, session.pdfFiles.map(f => f.name), type);
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
        if (session.pdfFiles.length === 0) {
            addError({
                message:
                    'Please upload a document first to perform a Quick Test.',
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
                subject: session.fileNames[0]?.split('.')[0] || 'General',
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
        const baseName = session.fileNames.length > 1 
            ? 'Combined_Set' 
            : (session.fileNames[0]?.split('.')[0] || 'Note');
        
        handleDownload(
            session.summary,
            `Izabi_Summary_${baseName}`,
        );
    };

    const downloadStudyGuide = () => {
        if (!session.studyGuide) return;
        const baseName = session.fileNames.length > 1 
            ? 'Combined_Set' 
            : (session.fileNames[0]?.split('.')[0] || 'Note');

        handleDownload(
            session.studyGuide,
            `Izabi_Study_Guide_${baseName}`,
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
        
        const baseName = session.fileNames.length > 1 
            ? 'Combined_Set' 
            : (session.fileNames[0]?.split('.')[0] || 'Assessment');

        let content = `# Quiz: ${baseName}\n\n`;
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
            `Izabi_Quiz_${baseName}`,
        );
    };

    return (
        <ErrorBoundary>
            <div
                ref={containerRef}
                className="space-y-6 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-10 pt-4 md:pt-10 max-w-[1800px] mx-auto"
            >
                <WelcomeHeader firstName={userStats?.data?.firstName} />

                <AnimatePresence>
                    {showAIUpdate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="stagger-card overflow-hidden"
                        >
                            <Alert className="relative border-primary/20 bg-primary/5 p-4 sm:p-6 rounded-3xl overflow-hidden group">
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
                                
                                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex gap-4 sm:gap-6">
                                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                            <BrainCircuit className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                                        </div>
                                        <div className="space-y-1 sm:space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-primary/20 text-primary border-none text-[10px] sm:text-xs font-black uppercase tracking-widest px-2 py-0.5">
                                                    New v2.0
                                                </Badge>
                                                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                            </div>
                                            <AlertTitle className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                                                Advanced Academic AI
                                            </AlertTitle>
                                            <AlertDescription className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                                                Experience the next-gen Izabi AI. Now featuring <span className="text-foreground font-bold">Multi-Document Chat</span> (up to 5 files), 100% Academic Grounding, and support for <span className="text-foreground font-bold">PDF, Images, Word & Excel</span>.
                                            </AlertDescription>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <Button 
                                            onClick={() => navigate('/dashboard/ai-assistant')}
                                            className="h-11 sm:h-13 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 group/btn transition-all hover:scale-105 active:scale-95"
                                        >
                                            Try Now
                                            <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={dismissAIUpdate}
                                            className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl border-foreground/10 hover:bg-foreground/5 shadow-sm"
                                        >
                                            <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Multi-File Chat', icon: FileStack },
                                        { label: 'OCR Image Support', icon: Sparkles },
                                        { label: 'Deep Synthesis', icon: BrainCircuit },
                                        { label: 'Source Grounded', icon: CheckCircle2 },
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                            <feat.icon className="h-3 w-3 text-primary/50" />
                                            {feat.label}
                                        </div>
                                    ))}
                                </div>
                            </Alert>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                    {session.pdfSelections.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-10 stagger-card">
                                <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                                    <DocumentInfo
                                        fileNames={session.fileNames}
                                        userStats={userStats}
                                        onReset={handleUploadDocument}
                                        onAddMore={handleAddMore}
                                        onPreview={handlePreviewFile}
                                    />
                                </div>
                                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
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
                                </div>
                            </div>

                            <ResultsHub
                                onDownloadSummary={downloadSummary}
                                onDownloadGuide={downloadStudyGuide}
                                onDownloadQuiz={downloadQuiz}
                                onSubmitQuiz={handleQuizSubmit}
                            />
                        </>
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

            {/* Document Preview Dialog */}
            <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 glass border-foreground/10 rounded-2xl">
                    <DialogHeader className="p-6 border-b border-foreground/5 shrink-0 bg-card/60 backdrop-blur-xl">
                        <DialogTitle className="flex items-center gap-3">
                            <FileText className="text-primary" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold truncate max-w-[300px] sm:max-w-md uppercase tracking-tight">
                                    {previewFile?.name}
                                </span>
                                <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                    Review Document
                                </span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-background/40">
                        {previewFile && (
                            <div className="w-full flex justify-center">
                                {previewFile.type.startsWith('image/') ? (
                                    <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-foreground/5">
                                        <img 
                                            src={URL.createObjectURL(previewFile)} 
                                            alt={previewFile.name}
                                            className="max-w-full h-auto object-contain rounded-xl"
                                        />
                                    </div>
                                ) : previewFile.type === 'application/pdf' ? (
                                    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-foreground/5">
                                        <PDFPreview 
                                            file={previewFile}
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full p-8 rounded-2xl border border-dashed border-foreground/10 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                            <FileText size={40} className="text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-lg">Document Analysis</h4>
                                            <p className="text-sm text-muted-foreground max-w-xs">
                                                Direct preview is unavailable for this specialized format, but your academic AI has fully ingested the content.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </ErrorBoundary>
    );
}
