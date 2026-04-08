'use client';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useGSAP } from '@gsap/react';
import {
    Sparkles,
    FileStack,
    CheckCircle2,
    ChevronRight,
    X,
    Share2,
    BrainCircuit,
    FileText,
    CalendarClock,
    BarChart3,
    MessageCircle,
    Upload,
} from 'lucide-react';
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
import { UploadPrompt } from '@/components/dashboard-home/UploadPrompt';
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
import { formatSummaryForDownload } from '@/lib/summaryUtils';
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
    const streakValue =
        userStats?.data?.streakData?.academicStreak ??
        userStats?.data?.studyStreak ??
        0;
    const totalPoints = userStats?.data?.totalPoints ?? 0;
    const dailyPoints = userStats?.data?.dailyPoints ?? 0;
    const totalStudyMinutes = userStats?.data?.totalStudyMinutes ?? 0;
    const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10;
    const progressPercent = Math.min(
        100,
        Math.round((totalStudyMinutes / 300) * 100),
    );
    const recentFiles = session.fileNames?.slice(0, 3) ?? [];
    const hasRecentFiles = recentFiles.length > 0;

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
            formatSummaryForDownload(session.summary),
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
                className="full-bleed w-full max-w-[1780px] mx-auto px-0 sm:px-6 md:px-10 lg:px-16 pt-6 md:pt-16 pb-32 space-y-12 md:space-y-20 rounded-none sm:rounded-[32px] lg:rounded-[48px] border-0 sm:border border-foreground/10 bg-card/20 backdrop-blur-xl"
            >
                {/* Header Section */}
                <header className="space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                                    Dashboard
                                </span>
                            </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                            Here’s your study cockpit for today
                        </h1>
                            <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
                                Stay on track with your streaks, progress, and AI study tools in one focused workspace.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {userStats?.data && userId && (
                                <Button
                                    variant="outline"
                                    className="h-10 rounded-xl border-foreground/10 text-primary hover:bg-primary/10 gap-2 text-[10px] uppercase tracking-[0.2em] font-bold"
                                    onClick={handleShareProfile}
                                    disabled={isSharing}
                                >
                                    <Share2 size={14} />
                                    {isSharing ? 'Preparing...' : 'Share Profile'}
                                </Button>
                            )}
                            <Button
                                onClick={() => navigate('/dashboard/ai-assistant')}
                                className="h-10 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2 shadow-lg shadow-primary/20"
                            >
                                <MessageCircle size={14} />
                                AI Assistant
                            </Button>
                        </div>
                    </div>

                    <div className="glass p-6 md:p-8 rounded-[28px] sm:rounded-[36px] border border-foreground/10 shadow-2xl">
                        <WelcomeHeader firstName={userStats?.data?.firstName} />
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <Badge className="bg-primary/15 text-primary border-none text-[10px] font-black uppercase tracking-[0.2em]">
                                Today
                            </Badge>
                            <span className="text-xs font-semibold text-muted-foreground">
                                Upload a file to unlock your study tools.
                            </span>
                        </div>
                    </div>

                    <div className="glass p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-foreground/10 shadow-xl">
                        <GamificationStrip streak={streakValue} xp={totalPoints} />
                    </div>
                </header>


                <AnimatePresence>
                    {showAIUpdate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                            className="stagger-card overflow-hidden"
                        >
                            <Alert className="relative border-foreground/10 bg-card/50 p-4 sm:p-6 rounded-3xl overflow-hidden group">
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

                <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                    <div className="glass-card p-5 sm:p-6 border border-foreground/10 rounded-[24px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <BarChart3 size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Progress
                            </span>
                        </div>
                        <div className="text-2xl font-black tracking-tight">
                            {totalStudyHours}h
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            Total study time
                        </p>
                        <div className="mt-4">
                            <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                                <div
                                    className="h-full bg-primary"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                {progressPercent}% of weekly goal
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-5 sm:p-6 border border-foreground/10 rounded-[24px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <FileText size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Recent Notes
                            </span>
                        </div>
                        <div className="space-y-2">
                            {hasRecentFiles ? (
                                recentFiles.map((file) => (
                                    <div
                                        key={file}
                                        className="flex items-center gap-2 text-xs font-semibold text-foreground/80"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        <span className="truncate">{file}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground font-medium">
                                    No uploads yet. Add a document to start.
                                </p>
                            )}
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleUploadDocument}
                            className="mt-4 h-9 rounded-xl border-foreground/10 text-primary hover:bg-primary/10 gap-2 text-[10px] uppercase tracking-[0.2em] font-bold"
                        >
                            <Upload size={12} />
                            Upload Notes
                        </Button>
                    </div>

                    <div className="glass-card p-5 sm:p-6 border border-foreground/10 rounded-[24px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <CalendarClock size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Upcoming Exam
                            </span>
                        </div>
                        <div className="text-lg font-bold text-foreground">
                            {userExamType ? `${userExamType} Prep` : 'No exam selected'}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            {userExamType
                                ? 'Set milestones and practice daily.'
                                : 'Choose your exam type to get tailored prep.'}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/dashboard/profile')}
                            className="mt-4 h-9 rounded-xl border-foreground/10 text-primary hover:bg-primary/10 gap-2 text-[10px] uppercase tracking-[0.2em] font-bold"
                        >
                            Update Profile
                        </Button>
                    </div>

                    <div className="glass-card p-5 sm:p-6 border border-foreground/10 rounded-[24px]">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <BrainCircuit size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Daily XP
                            </span>
                        </div>
                        <div className="text-2xl font-black tracking-tight">
                            {dailyPoints.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            Points earned today
                        </p>
                        <Button
                            onClick={() => navigate('/dashboard/ai-assistant')}
                            className="mt-4 h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-2"
                        >
                            <MessageCircle size={12} />
                            Ask AI
                        </Button>
                    </div>
                </section>

                    <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 items-stretch">
                        <div className="flex flex-col h-full">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                    Daily Pulse
                                </span>
                            </div>
                            <div className="flex-1 glass p-4 sm:p-6 rounded-[28px] sm:rounded-[36px] border border-foreground/10 shadow-2xl">
                                <BrainDropSection
                                    isCompleted={isBrainDropCompleted}
                                    question={brainDropQuestion}
                                    onAnswer={handleBrainDropSubmission}
                                    onUploadClick={handleReadyToLearn}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col h-full">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10 mb-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                    Quick Actions
                                </span>
                            </div>
                            <div className="flex-1 glass p-2 rounded-[28px] sm:rounded-[36px] border border-foreground/10 shadow-2xl group">
                                <IntentCards
                                    onPracticeSkills={handlePracticeSkills}
                                    onQuickTest={handleQuickTest}
                                    onLearnTricks={handleLearnTricks}
                                    onUploadDocument={handleUploadDocument}
                                />
                            </div>
                        </div>
                    </section>


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

                <section className="workspace-area space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                Study Workspace
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground/70">
                            Upload documents, then choose what to generate.
                        </span>
                    </div>
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
                        <div className="stagger-card">
                            <UploadPrompt
                                onSelectionComplete={handleSelectionComplete}
                                onReadyToLearn={handleReadyToLearn}
                            />
                        </div>
                    )}
                </section>
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
