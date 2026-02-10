"use client"

import * as pdfjsLib from 'pdfjs-dist';
// Set worker path locally to bypass CORS and MIME issues from CDNs
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

import { useState, useRef, useEffect, useMemo } from "react"
import axios from "axios"
import axiosRetry from "axios-retry"
import apiClient, { api } from "@/lib/apiClient"

// Configure retry for external calls (Cloudinary)
axiosRetry(axios, { 
    retries: 2, 
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error)
});

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BASE_URL } from "@/constants"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Brain, Zap, ChevronDown, ChevronUp, Sparkles, CheckCircle2, XCircle, BarChart3, Clock, LayoutGrid, Terminal, Layers, RotateCcw, Activity, Cpu, Download, Loader2, Flame, Trophy, TrendingUp, Upload, Volume2, Pause } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import PDFUploadSection from "@/components/pdf/PDFUploadSection"
import type { PDFSelection, StudyQuestionResponse } from "@/types/pdf"
import { ErrorList } from "@/components/ui/error-display"
import { useApiError } from "@/hooks/useApiError"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import stringSimilarity from "string-similarity"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

import { useLanguage } from "@/contexts/LanguageContext"
import StreakPet from "@/components/StreakPet"
import BrainDrop from "@/components/BrainDrop"
import IntentCards from "@/components/IntentCards"
import ContextCard from "@/components/ContextCard"
import QuickTestModal from "@/components/QuickTestModal"
import StudyTricksModal from "@/components/StudyTricksModal"
import PracticeQuizModal from "@/components/PracticeQuizModal"
import { useStudy } from "@/contexts/StudyContext"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SummaryViewer = ({ content, t }: { content: string; t: any }) => {
    const { language } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isLong = content.length > 800;
    
    const handlePlaySummary = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (audioRef.current && audioRef.current.src) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        setIsLoadingAudio(true);
        try {
            // Map our UI languages to Google TTS codes
            const langMap: Record<string, string> = {
                en: 'en',
                pidgin: 'en', // Google doesn't have pidgin, we use English voice
                igbo: 'ig',
                yoruba: 'yo',
                hausa: 'ha'
            };

            const isPidgin = language === 'pidgin';
            const res = await api.generateVoice(
                content.substring(0, 1000), 
                langMap[language] || 'en',
                isPidgin
            );

            if (res.success && res.voiceUrl) {
                const audio = new Audio(res.voiceUrl);
                audioRef.current = audio;
                
                audio.onended = () => setIsPlaying(false);
                audio.onpause = () => setIsPlaying(false);
                
                await audio.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error("Voice generation failed", err);
            // Optionally trigger a toast here if passed down
        } finally {
            setIsLoadingAudio(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlaySummary}
                    disabled={isLoadingAudio}
                    className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 gap-2 font-bold text-xs"
                >
                    {isLoadingAudio ? <Loader2 className="animate-spin h-3 w-3" /> : (isPlaying ? <Pause className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />)}
                    {isPlaying ? "Pause Audio" : "Listen to Summary"}
                </Button>
            </div>
            
            <div className={cn(
                "prose prose-sm md:prose-base dark:prose-invert max-w-none leading-relaxed text-muted-foreground/90 font-medium selection:bg-primary/30 transition-all duration-700 ease-in-out",
                !isExpanded && isLong && "max-h-[400px] overflow-hidden relative"
            )}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
                {!isExpanded && isLong && (
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                )}
            </div>
            {isLong && (
                <Button 
                    variant="outline" 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full h-12 rounded-2xl glass hover:bg-primary/10 text-primary border-primary/20 font-bold tracking-widest uppercase text-[10px] gap-3 shadow-sm"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={14} />
                            {t("dashboard.collapse_summary")}
                        </>
                    ) : (
                        <>
                            <ChevronDown size={14} />
                            {t("dashboard.view_full_summary")}
                        </>
                    )}
                </Button>
            )}
        </div>
    )
}



const DashboardHome = () => {
    const { t } = useLanguage()
    const { addJob, session, updateSession } = useStudy()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    
    // UI visibility states (local for transitions, but initialized from session)
    const [showSummary, setShowSummary] = useState(false)
    const [showQuestions, setShowQuestions] = useState(false)
    const [showFlashcards, setShowFlashcards] = useState(false)
    
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
    const [showResults, setShowResults] = useState(false)
    const [userStats, setUserStats] = useState<any>(null)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    const { summary, questions, flashcards, pdfFile, pdfSelection, numberOfQuestions } = session;

    // Sync visibility with session data on mount
    useEffect(() => {
        if (summary) setShowSummary(true);
        if (questions?.length > 0) setShowQuestions(true);
        if (flashcards?.length > 0) setShowFlashcards(true);
    }, []);



    // Brain Drop State
    const [brainDropQuestion, setBrainDropQuestion] = useState<any>(null)
    const [isBrainDropCompleted, setIsBrainDropCompleted] = useState(false)
    
    // Practice Questions State
    const [practiceQuestions, setPracticeQuestions] = useState<StudyQuestionResponse[]>([])
    const [showPracticeQuiz, setShowPracticeQuiz] = useState(false)
    
    // Context Card State
    const [showContextCard, setShowContextCard] = useState(false)
    const [userExamType, setUserExamType] = useState<string | null>(null)

    // Modal State
    const [showQuickTestModal, setShowQuickTestModal] = useState(false)
    const [showStudyTricksModal, setShowStudyTricksModal] = useState(false)

    const { errors, addError, clearError } = useApiError()
    const userId = localStorage.getItem("userId")

    const handleUploadDocument = () => {
        updateSession({ 
            pdfSelection: null, 
            pdfFile: null, 
            fileName: '', 
            summary: null, 
            questions: [], 
            flashcards: [] 
        });
        
        setTimeout(() => {
            const element = document.getElementById("upload-section");
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
    };

    const handleFeedPet = async () => {
        try {
            const res = await api.feedPet();
            if (res.success) {
                // Optimistic update
                setUserStats((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        totalPoints: res.data.points,
                        pet: res.data.pet
                    }
                }));
                const audio = new Audio('/sounds/eat.mp3'); // Optional: would need file
                // audio.play().catch(() => {}); 
            }
        } catch (err: any) {
            addError({ message: err.message || "Failed to feed pet", type: "validation" });
        }
    };
    
    const handleBrainDropAnswer = async (answer: string, isCorrect: boolean) => {
        try {
            // Award points
            await api.submitQuizResult({
                score: isCorrect ? 100 : 0,
                totalQuestions: 1,
                correctAnswers: isCorrect ? 1 : 0,
                subject: "Brain Drop",
                date: new Date().toISOString()
            });
            
            setIsBrainDropCompleted(true);
            localStorage.setItem(`braindrop_complete_${new Date().toDateString()}`, 'true');
            
            // Show context card after they've engaged
            const hasSeenContext = localStorage.getItem('context_card_seen');
            if (!hasSeenContext && userExamType === null) {
                setTimeout(() => setShowContextCard(true), 2000);
            }
            
            fetchStats();
        } catch (err) {
            console.error("Failed to submit Brain Drop", err);
        }
    };
    
    const handlePracticeSkills = async () => {
        try {
            const res = await api.getPracticeQuestions(5);
            if (res.success) {
                setPracticeQuestions(res.data);
                setShowPracticeQuiz(true);
                updateSession({ 
                    questions: res.data,
                    summary: "",
                    flashcards: []
                });
                setShowQuestions(true);
            }
        } catch (err) {
            addError({ message: "Failed to load practice questions", type: "validation" });
        }
    };
    
    const handleQuickTest = () => {
        if (!pdfFile) {
            addError({ message: "Please upload a PDF document first to perform a Quick Test.", type: "validation" });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setShowQuickTestModal(true);
    };
    
    const handleLearnTricks = () => {
        setShowStudyTricksModal(true);
    };

    const handleQuickTestComplete = (score: number, pointsEarned: number) => {
        // Refresh stats to show new points
        fetchStats();
        // Optionally show a success toast
        if (score >= 70) {
            addError({ message: `Great job! You earned ${pointsEarned} XP!`, type: "validation" });
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
    
    useEffect(() => {
        const loadBrainDrop = async () => {
            try {
                const lastCompleted = localStorage.getItem(`braindrop_complete_${new Date().toDateString()}`);
                if (lastCompleted) {
                    setIsBrainDropCompleted(true);
                }

                const res = await api.getDailyChallenge();
                if (res.success && res.data) {
                    // Validate that we have a proper question structure
                    if (res.data.question && res.data.options && Array.isArray(res.data.options) && res.data.options.length > 0) {
                        setBrainDropQuestion(res.data);
                    } else {
                        console.warn("Brain Drop: Invalid question structure", res.data);
                    }
                } else {
                    // User has no notes yet - this is expected for new users
                    console.log("Brain Drop:", res.message || "No content available yet");
                }
                
                // Check if user has set exam type
                const savedExamType = localStorage.getItem('user_exam_type');
                if (savedExamType) {
                    setUserExamType(savedExamType);
                }
            } catch (err) {
                console.error("Failed to load Brain Drop", err);
            }
        };
        loadBrainDrop();
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline()
        tl.from(".welcome-text", { opacity: 0, y: -20, duration: 0.8, ease: "expo.out" })
          .from(".stagger-card", { 
              opacity: 0, 
              y: 30, 
              stagger: 0.1, 
              duration: 1, 
              ease: "expo.out" 
          }, "-=0.4")
    }, { scope: containerRef })

    const fetchStats = async () => {
        try {
            // Daily Check-in to update streak
            await apiClient.post('/api/user/check-in')
            
            const [statsRes, profileRes] = await Promise.all([
                api.getUserStats(),
                api.getUserProfile()
            ])

            setUserStats(statsRes)
            
            if (profileRes.data?.pet) {
                setUserStats((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev?.data,
                        pet: profileRes.data.pet
                    }
                }))
            }
        } catch (err) {
            console.error("Failed to fetch user stats:", err)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const handleSelectionComplete = ({ selection, file }: { selection: PDFSelection; file: File }) => {
        updateSession({ 
            pdfSelection: selection, 
            pdfFile: file, 
            fileName: file.name,
            summary: "",
            questions: [],
            flashcards: []
        });
        // Reset visibility states for the new document
        setShowSummary(false);
        setShowQuestions(false);
        setShowFlashcards(false);
        setSelectedAnswers({});
        setShowResults(false);
    }

    const extractTextFromPDF = async (file: File) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = "";
            const maxPages = Math.min(pdf.numPages, 300); // Support up to 300 pages for textbooks
            
            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items
                    .map((item: any) => item.str)
                    .join(" ");
                text += pageText + "\n\n";
            }
            return text;
        } catch (error) {
            console.error("[Dashboard] PDF Extraction Error:", error);
            throw new Error("Failed to extract text from PDF locally.");
        }
    };

    const pollJobStatus = async (jobId: string, endpoint: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.getJobStatus(jobId);
                // The backend returns { success: true, data: { status, result, ... } }
                const job = response.data;
                
                console.log("[SmartStudy] Job Status Update:", job?.status);

                if (job?.status === 'COMPLETED') {
                    setIsProcessing(false);
                    clearInterval(interval);
                    
                    const result = job.result;
                    if (endpoint === 'summarize' || endpoint === 'generate-study-material') {
                        updateSession({ 
                            summary: result?.summary || "", 
                            questions: [], 
                            flashcards: [] 
                        });
                        setShowSummary(true);
                    } else if (endpoint === 'generate-questions') {
                        updateSession({ 
                            summary: "", 
                            questions: result?.questions || [], 
                            flashcards: [] 
                        });
                        setShowQuestions(true);
                    } else if (endpoint === 'flashcards') {
                        updateSession({ 
                            summary: "", 
                            questions: [], 
                            flashcards: result?.flashcards || [] 
                        });
                        setShowFlashcards(true);
                    }
                } else if (job?.status === 'FAILED') {
                    setIsProcessing(false);
                    clearInterval(interval);
                    addError({ message: job?.error || "Neural Protocol failure.", type: "api" });
                }
            } catch (error) {
                console.error("[Dashboard] Polling Error:", error);
            }
        }, 1500);
    };

    /*
     * How: Uploads the selected PDF file directly to Cloudinary (signed) and then notifies the backend to process it asynchronously.
     * Why: This architecture prevents Render memory crashes by bypassing the backend for large files and avoids timeouts via background polling.
     */
    /*
     * How: Multi-stage upload process to bypass platform timeouts.
     * 1. Fetches a secure signature from the backend.
     * 2. Uploads the file directly to Cloudinary (External CDN) to bypass Render 30s limits.
     * 3. Sends the resulting URL to the backend for asynchronous AI processing.
     * Why: Fixes "No Reaction" and "30000ms Timeout" issues on poor network conditions or large files.
     */
    /*
     * How: Uploads the selected PDF file directly to the backend processing queue.
     * Why: Simplifies the pipeline by removing external Cloudinary dependency for initial upload.
     *      Large files are handled via local extraction if needed, or streamed to backend.
     */
    const handleRequest = async (endpoint: string, includeQuestions = false) => {
        if (!pdfFile || !pdfSelection) {
            addError({ message: "Upload required: Please initialize a document node first.", type: "validation" })
            return
        }

        setIsProcessing(true)
        clearError()
        setSelectedAnswers({})
        setShowResults(false)

        try {
            const typeMap: any = {
                'summarize': 'summary',
                'generate-questions': 'quiz',
                'flashcards': 'flashcards',
                'generate-study-material': 'study-guide'
            };

            const type = typeMap[endpoint] || endpoint;
            const options = includeQuestions ? { count: numberOfQuestions } : {};

            // --- LARGE FILE BYPASS (Neural Client Extraction) ---
            // If file exceeds 10MB limit, we extract text LOCALLY to avoid timeout/payload issues.
            if (pdfFile && pdfFile.size > 10 * 1024 * 1024 && pdfFile.type === 'application/pdf') {
                console.log("[SmartStudy] Large document detected (10MB+). Initializing Local Neural Extraction...");
                
                const localText = await extractTextFromPDF(pdfFile);
                console.log(`[SmartStudy] Local extraction finished (${localText.length} chars). bypassing cloud synchronizer...`);

                const ingestRes = await api.ingestText({
                    text: localText,
                    fileName: pdfFile.name,
                    type,
                    options
                });

                console.log("[SmartStudy] Job Started (Local Sync). ID:", ingestRes.jobId);
                addJob(ingestRes.jobId, pdfFile.name, type);
                pollJobStatus(ingestRes.jobId, endpoint);
                return;
            }

            // STANDARD UPLOAD: Direct to Backend
            console.log("[SmartStudy] Securely syncing document to neural core...");
            
            const ingestRes = await api.ingestDirect(pdfFile, type, options);

            console.log("[SmartStudy] Job Started. ID:", ingestRes.jobId);
            addJob(ingestRes.jobId, pdfFile.name, type);

            // Background Polling
            pollJobStatus(ingestRes.jobId, endpoint);

        } catch (err: any) {
            console.error("[SmartStudy] Protocol Failure:", err);
            
            const errorMsg = err.response?.data?.message || err.message || "Failed to initiate document mapping.";
            addError({ message: `Flow Error: ${errorMsg}`, type: "api" });
            
            setIsProcessing(false);
            updateSession({ summary: "", questions: [], flashcards: [] });
        }
    }


    const handleAnswerSelect = (qIndex: number, option: string) => {
        if (!showResults) setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }))
    }

    const handleShortAnswerChange = (qIndex: number, value: string) => {
        if (!showResults) setSelectedAnswers((prev) => ({ ...prev, [qIndex]: value }))
    }

    const isShortAnswerCorrect = (input: string, correctAnswer: string) =>
        stringSimilarity.compareTwoStrings(input.trim().toLowerCase(), correctAnswer.trim().toLowerCase()) > 0.7

    /*
     * How: Compares user answers against the correct answers, accounting for both multiple choice and fuzzy matching for short answers.
     * Why: To calculate the final score and verify mastery of the material.
     */
    const scoreQuiz = () =>
        questions.reduce((acc, q, i) => {
            const userAnswer = selectedAnswers[i]
            if (!userAnswer) return acc
            if (q.questionType?.toLowerCase() === "short_answer") {
                return acc + (isShortAnswerCorrect(userAnswer, q.answer || "") ? 1 : 0)
            }
            return acc + (userAnswer === q.answer ? 1 : 0)
        }, 0)

    const handleFinalizeQuiz = async () => {
        const score = scoreQuiz()
        const total = questions.length
        const percentage = Math.round((score / total) * 100)
        
        setShowResults(true)
        gsap.to(window, { duration: 1, scrollTo: "#mastery-verdict", ease: "expo.out" })

        try {
            await api.submitQuizResult({
                score: percentage,
                totalQuestions: total,
                correctAnswers: score,
                subject: pdfFile?.name.split('.')[0] || "General",
                date: new Date().toISOString()
            })
            // Refresh stats to show new points/progress
            fetchStats()
        } catch (err) {
            console.error("Failed to submit quiz result:", err)
        }
    }

    const handleDownload = (content: string, filename: string) => {
        const header = `----------------------------------------\nIZABI STUDY ASSISTANT: STUDY MATERIAL\nTIMESTAMP: ${new Date().toLocaleString()}\nPROTOCOL: STANDARD_V2\n----------------------------------------\n\n`;
        const blob = new Blob([header + content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    const downloadSummary = () => {
        if (!summary) return;
        handleDownload(summary, `Izabi_Summary_${pdfFile?.name.split('.')[0] || 'Note'}`);
    }

    const downloadQuiz = () => {
        if (questions.length === 0) return;
        let content = `# Quiz: ${pdfFile?.name.split('.')[0] || 'Document'}\n\n`;
        questions.forEach((q, i) => {
            content += `## Question ${i + 1}\n${q.question}\n\n`;
            if (q.options && q.options.length > 0) {
                content += `Options:\n`;
                q.options.forEach((opt, idx) => {
                    content += `${String.fromCharCode(65 + idx)}) ${opt}\n`;
                });
                content += `\n`;
            }
            content += `**Correct Answer:** ${q.answer}\n`;
            if (q.explanation) content += `**Explanation:** ${q.explanation}\n`;
            content += `\n---\n\n`;
        });
        handleDownload(content, `Izabi_Quiz_${pdfFile?.name.split('.')[0] || 'Assessment'}`);
    }

    return (
        <ErrorBoundary>
            <div ref={containerRef} className="space-y-6 md:space-y-12 w-full pb-20 px-4 md:px-8 lg:px-12 pt-6 md:pt-12">
                {/* Error handling through useApiError toasts */}

                {/* Welcome Section - GSAP Target */}
                <div id="dashboard-welcome" className="welcome-text space-y-2">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/40 leading-tight">
                        {t("dashboard.greeting") || "Welcome back,"} {userStats?.data?.firstName || "Scholar"}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed">
                        {t("dashboard.intro") || "Your neural workspace is synchronized and ready for deep learning."}
                    </p>
                </div>

                {/* Gamification Strip - Always Visible */}
                {userStats?.data && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-blue-400/5 to-transparent border border-blue-500/20"
                    >
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Flame size={20} className="text-blue-500" fill="currentColor" />
                                <span className="text-sm font-bold text-foreground">{(userStats.data.streakData?.academicStreak ?? userStats.data.studyStreak) || 0} day streak</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy size={20} className="text-blue-400" />
                                <span className="text-sm font-bold text-foreground">{userStats.data.totalPoints || 0} XP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-blue-600" />
                                <span className="text-sm font-bold text-foreground/60 dark:text-foreground/70">Top 12% today</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Brain Drop - Instant Engagement (Priority #1) */}
                {!isBrainDropCompleted && (
                    <div id="brain-drop-section" className="stagger-card">
                        {brainDropQuestion ? (
                            <BrainDrop 
                                question={brainDropQuestion}
                                onAnswer={handleBrainDropAnswer}
                                totalAnswered={847}
                            />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-600/10 via-blue-400/5 to-transparent border border-blue-500/20 p-8 md:p-14 text-center group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Brain size={180} className="stroke-blue-500" />
                                </div>
                                <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 rounded-[28px] bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-xl shadow-blue-500/10">
                                            <Sparkles size={40} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter italic">
                                            Personalize your <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Brain Drop</span>
                                        </h3>
                                        <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed opacity-80">
                                            Upload class notes or a textbook PDF. We'll generate daily personalized challenges to sync with your learning goals.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => updateSession({ pdfSelection: null, pdfFile: null, fileName: '' })}
                                        className="inline-flex items-center gap-3 px-10 py-5 rounded-[20px] bg-blue-600 text-white font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95"
                                    >
                                        <Upload size={20} />
                                        Upload Your First Note
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* Intent Cards - Action First (Priority #2) */}
                <div className="stagger-card">
                    <IntentCards 
                        onPracticeSkills={handlePracticeSkills}
                        onQuickTest={handleQuickTest}
                        onLearnTricks={handleLearnTricks}
                        onUploadDocument={handleUploadDocument}
                    />
                </div>

                {/* Context Card - Non-blocking Onboarding (Priority #3) */}
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
                    {pdfSelection ? (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 stagger-card">
                            {/* Document Info & Quick Stats */}
                            <div className="xl:col-span-4 space-y-6">
                                <Card className="glass border-primary/20 rounded-[32px] overflow-hidden shadow-2xl relative">
                                    <div className="absolute top-0 right-0 p-6 opacity-5"><FileText size={100} /></div>
                                    <CardHeader className="p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-xl bg-primary/20 text-primary"><FileText size={16} /></div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Current Topic</span>
                                        </div>
                                        <CardTitle className="text-2xl font-bold truncate leading-tight">{pdfSelection.metadata.fileName}</CardTitle>
                                        <CardDescription className="flex items-center gap-2 font-bold text-primary">
                                            <Sparkles size={14} />
                                            Ready for deep dive
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-8 pb-8 space-y-6">
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-card/5 border border-foreground/5">
                                            <div className="flex items-center gap-3">
                                                <Layers size={18} className="text-primary/60" />
                                                <span className="text-xs font-bold opacity-60">Status</span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">Active</div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => updateSession({ pdfSelection: null, pdfFile: null, fileName: '' })}
                                            className="w-full h-12 rounded-2xl border border-foreground/5 hover:bg-destructive/10 hover:text-destructive font-bold text-xs gap-2 transition-all"
                                        >
                                            <RotateCcw size={14} />
                                            Change document
                                        </Button>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-2 gap-4">
                                     <Card className="glass border-foreground/5 p-6 rounded-[28px] group hover:bg-primary/5 transition-all">
                                         <BarChart3 size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                                         <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{t("dashboard.stats_eff")}</div>
                                         <div className="text-2xl font-bold text-foreground">+{userStats?.data?.dailyPoints || 0}</div>
                                     </Card>
                                     <Card className="glass border-foreground/5 p-6 rounded-[28px] group hover:bg-primary/5 transition-all">
                                         <Clock size={20} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
                                         <div className="text-[9px] font-bold opacity-40 uppercase tracking-widest">{t("dashboard.stats_time")}</div>
                                         <div className="text-2xl font-bold text-foreground">{(userStats?.data?.totalStudyMinutes || 0)}m</div>
                                     </Card>
                                </div>
                            </div>

                            {/* Main Hub Controls */}
                            <div className="xl:col-span-8 flex flex-col gap-6">
                                <Card className="glass border-foreground/5 rounded-[40px] shadow-2xl overflow-hidden relative border border-foreground/5">
                                    <div id="study-modes-grid" className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-foreground/5">
                                        {[
                                            { id: 'summarize', icon: Brain, label: t("dashboard.mod_summary"), desc: t("dashboard.mod_summary_desc"), color: "text-blue-400" },
                                            { id: 'quiz', icon: Zap, label: t("dashboard.mod_quiz"), desc: t("dashboard.mod_quiz_desc"), color: "text-yellow-400" },
                                            { id: 'guide', icon: FileText, label: t("dashboard.mod_guide"), desc: t("dashboard.mod_guide_desc"), color: "text-emerald-400" },
                                            { id: 'cards', icon: Layers, label: t("dashboard.mod_flashcards"), desc: t("dashboard.mod_flashcards_desc"), color: "text-blue-400" }
                                        ].map((module) => (
                                            <button
                                                key={module.id}
                                                onClick={() => {
                                                    if (module.id === 'summarize') handleRequest("summarize")
                                                    if (module.id === 'quiz') handleRequest("generate-questions", true)
                                                    if (module.id === 'guide') handleRequest("generate-study-material", true)
                                                    if (module.id === 'cards') handleRequest("flashcards")
                                                }}
                                                disabled={isProcessing}
                                                className="flex-1 p-8 hover:bg-card/[0.03] active:bg-card/[0.05] transition-all group flex flex-col items-center text-center gap-4"
                                            >
                                                <div className={cn("p-4 rounded-3xl bg-card/5 transition-all group-hover:scale-110 group-hover:shadow-glow", module.color)}>
                                                    <module.icon size={28} />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold mb-1">{module.label}</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-30">{module.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="p-6 bg-card/[0.02] border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 px-4">Session Settings</div>
                                            <div className="flex items-center gap-2 bg-background/20 p-1.5 rounded-2xl border border-foreground/5">
                                                <Select
                                                    value={String(numberOfQuestions)}
                                                    onValueChange={(val) => updateSession({ numberOfQuestions: Number(val) })}
                                                    disabled={isProcessing}
                                                >
                                                    <SelectTrigger className="w-[80px] h-8 rounded-xl bg-transparent border-0 focus:ring-0 font-bold text-xs uppercase">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="glass border-foreground/10">
                                                        {[3, 5, 8, 10, 15].map((num) => (
                                                            <SelectItem key={num} value={String(num)} className="font-bold text-xs">{num} items</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {isProcessing && (
                                            <div className="flex items-center gap-4 text-primary animate-pulse">
                                                <Loader2 className="animate-spin" size={16} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Creating your study plan...</span>
                                            </div>
                                        )}
                                    </div>
                                </Card>

                                {/* Results View nested if preferred or kept outside. Let's keep it below for space. */}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 stagger-card">
                             <div className="xl:col-span-8">
                                <Card id="upload-section" className="h-full glass shadow-2xl rounded-[48px] overflow-hidden group relative border-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
                                    <CardHeader className="p-10 md:p-14 text-center md:text-left text-foreground">
                                        <CardTitle className="text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-6 relative uppercase">
                                            {t("dashboard.upload_title") || "Document Upload"}
                                            <span className="absolute -top-1 -right-8 w-2 h-2 bg-primary rounded-full animate-ping" />
                                        </CardTitle>
                                        <CardDescription className="text-lg font-medium opacity-60 max-w-xl mx-auto md:mx-0 leading-relaxed font-mono">
                                            {t("dashboard.upload_desc") || "Upload notes or textbooks to start studying."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="px-6 md:px-14 pb-14">
                                        <PDFUploadSection onSelectionComplete={handleSelectionComplete} className="md:mt-0" />
                                    </CardContent>
                                </Card>
                             </div>
                             <div className="xl:col-span-4 space-y-6">
                                 <Card className="glass shadow-2xl p-10 md:p-14 rounded-[48px] flex flex-col items-center text-center space-y-8 h-full min-h-[400px] border-0">
                                     <div className="w-24 h-24 rounded-[32px] bg-card/5 flex items-center justify-center border border-foreground/5 shadow-2xl rotate-3 group-hover:rotate-0 transition-all mt-4">
                                         <Cpu size={48} className="text-primary animate-float" />
                                     </div>
                                     <div className="space-y-4 pt-4">
                                         <h3 className="text-3xl font-bold tracking-tight font-sans uppercase">{t("dashboard.init_node") || "Let's Get Started"}</h3>
                                         <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                                            {t("dashboard.init_desc") || "Upload a document to unlock your personalized study tools."}
                                         </p>
                                     </div>
                                     <div className="flex-1 flex items-end pb-4">
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-card/5 border border-foreground/5">
                                            <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Ready to learn</span>
                                        </div>
                                     </div>
                                 </Card>
                             </div>
                        </div>
                    )}

                    {/* Results Hub */}
                    {(summary || questions.length > 0 || flashcards.length > 0) && (
                        <div className="space-y-8 pt-12 stagger-card px-4 md:px-0">
                            <div className="flex items-center justify-between">
                                <h2 className="text-4xl font-bold flex items-center gap-4 tracking-tighter">
                                    <div className="w-2 h-10 bg-gradient-hero rounded-3xl" />
                                    <span>{t("dashboard.results_title")}</span>
                                </h2>
                            </div>

                            {flashcards.length > 0 && (
                                <Collapsible open={showFlashcards} onOpenChange={setShowFlashcards}>
                                    <Card className="glass border-foreground/5 rounded-none md:rounded-3xl border-x-0 md:border overflow-hidden shadow-2xl">
                                        <CollapsibleTrigger asChild>
                                            <button className="w-full text-left p-6 md:p-10 flex items-center justify-between group">
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Layers className="h-5 w-5 md:h-6 md:w-6" /></div>
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-bold leading-tight">{t("dashboard.res_flashcards")}</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{flashcards.length} {t("dashboard.res_flashcards_desc")}</p>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-card/5 transition-all">
                                                    {showFlashcards ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="p-10 flex flex-col items-center space-y-8">
                                                <div 
                                                    className="relative w-full max-w-md h-64 cursor-pointer perspective-1000"
                                                    onClick={() => setIsFlipped(!isFlipped)}
                                                >
                                                    <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                                        {/* Front */}
                                                        <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-8 rounded-3xl glass bg-card/[0.02] border-2 border-primary/20 shadow-xl overflow-hidden">
                                                            <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-30">Front</div>
                                                            <p className="text-2xl font-bold text-center text-foreground">{flashcards[currentCardIndex]?.front}</p>
                                                        </div>
                                                        {/* Back */}
                                                        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-8 rounded-3xl glass bg-primary/10 border-2 border-primary/40 shadow-xl overflow-hidden">
                                                            <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-30 text-primary">Back</div>
                                                            <p className="text-xl font-bold text-center text-foreground/90 leading-relaxed">{flashcards[currentCardIndex]?.back}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-12 w-12 rounded-3xl glass hover:bg-card/10"
                                                        onClick={() => {
                                                            setIsFlipped(false)
                                                            setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
                                                        }}
                                                    >
                                                        <ChevronDown className="rotate-90" />
                                                    </Button>
                                                    <span className="text-lg font-bold tracking-tighter">
                                                        {currentCardIndex + 1} / {flashcards.length}
                                                    </span>
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        className="h-12 w-12 rounded-3xl glass hover:bg-card/10"
                                                        onClick={() => {
                                                            setIsFlipped(false)
                                                            setCurrentCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0))
                                                        }}
                                                    >
                                                        <ChevronDown className="-rotate-90" />
                                                    </Button>
                                                </div>

                                                <Button 
                                                    variant="ghost" 
                                                    className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity gap-2"
                                                    onClick={() => {
                                                        setCurrentCardIndex(0)
                                                        setIsFlipped(false)
                                                    }}
                                                >
                                                    <RotateCcw size={14} />
                                                    Reset Quiz
                                                </Button>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            )}

                            {summary && (
                                <Collapsible open={showSummary} onOpenChange={setShowSummary}>
                                    <Card className="glass border-foreground/5 rounded-none md:rounded-3xl border-x-0 md:border overflow-hidden shadow-2xl">
                                        <CollapsibleTrigger asChild>
                                            <button className="w-full text-left p-6 md:p-10 flex items-center justify-between group">
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Brain className="h-5 w-5 md:h-6 md:w-6" /></div>
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-bold leading-tight">{t("dashboard.res_summary")}</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{t("dashboard.res_summary_desc")}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-10 w-10 rounded-3xl glass hover:bg-primary/20 text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            downloadSummary();
                                                        }}
                                                    >
                                                        <Download size={18} />
                                                    </Button>
                                                    <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-card/5 transition-all">
                                                        {showSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>
                                            </button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="px-6 md:px-16 pb-10 md:pb-16 pt-2">
                                                <SummaryViewer content={summary} t={t} />
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            )}

                            {questions.length > 0 && (
                                <Collapsible open={showQuestions} onOpenChange={setShowQuestions}>
                                    <Card className="glass border-foreground/5 rounded-none md:rounded-3xl border-x-0 md:border overflow-hidden shadow-2xl">
                                        <CollapsibleTrigger asChild>
                                            <button className="w-full text-left p-6 md:p-10 flex items-center justify-between group">
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform"><Zap className="h-5 w-5 md:h-6 md:w-6" /></div>
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-bold leading-tight">{t("dashboard.res_quiz")}</h3>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{questions.length} {t("dashboard.res_quiz_desc")}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-10 w-10 rounded-3xl glass hover:bg-primary/20 text-primary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            downloadQuiz();
                                                        }}
                                                    >
                                                        <Download size={18} />
                                                    </Button>
                                                    <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-card/5 transition-all">
                                                        {showQuestions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>
                                            </button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="p-4 md:p-10 space-y-6 md:space-y-8">
                                                {questions.map((q, i) => {
                                                    const userAnswer = selectedAnswers[i]
                                                    const isShort = q.questionType?.toLowerCase() === "short_answer"
                                                    const correct = isShort && userAnswer ? isShortAnswerCorrect(userAnswer, q.answer || "") : userAnswer === q.answer

                                                    return (
                                                        <Card key={i} className="bg-card/[0.02] border-foreground/5 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden group">
                                                            
                                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                                                                <div className="space-y-2 md:space-y-3">
                                                                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Question {i+1}</div>
                                                                    <h4 className="text-base md:text-xl font-bold leading-tight text-foreground break-words">{q.question}</h4>
                                                                </div>
                                                                 {showResults && (
                                                                    <div className={`w-fit px-4 py-1.5 md:px-5 md:py-2 rounded-3xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-2xl transition-all
                                                                        ${correct ? "bg-primary text-foreground shadow-primary/20" : "bg-destructive text-primary-foreground shadow-destructive/20"}`}>
                                                                        {correct ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                                        {correct ? "Correct" : "Incorrect"}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {!isShort ? (
                                                                <div className="grid grid-cols-1 gap-3 md:gap-4">
                                                                    {q.options?.map((opt, idx) => {
                                                                        const isSelected = userAnswer === opt
                                                                        const isCorrect = showResults && opt === q.answer
                                                                        const isWrong = showResults && isSelected && opt !== q.answer

                                                                        return (
                                                                            <Button
                                                                                key={idx}
                                                                                onClick={() => handleAnswerSelect(i, opt)}
                                                                                disabled={showResults}
                                                                                className={`h-auto py-4 md:py-6 px-4 md:px-8 justify-start text-left rounded-2xl md:rounded-3xl transition-all duration-300 font-bold border border-foreground/5 w-full
                                                                                    ${isSelected ? "bg-primary text-primary-foreground shadow-glow" : "bg-card/5 hover:bg-card/10 text-primary-foreground/70"}
                                                                                    ${isCorrect ? "bg-primary/20 border-primary/50 text-primary !bg-opacity-20" : ""}
                                                                                    ${isWrong ? "bg-destructive/20 border-destructive/50 text-destructive-foreground !bg-opacity-20" : ""}
                                                                                `}
                                                                            >
                                                                                <div className="flex items-start gap-3 md:gap-4 w-full">
                                                                                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-2xl md:rounded-3xl flex items-center justify-center font-bold text-xs transition-opacity flex-shrink-0
                                                                                        ${isSelected ? "bg-background/10" : "bg-card/10 opacity-30"}`}>
                                                                                        {String.fromCharCode(65 + idx)}
                                                                                    </div>
                                                                                    <span className="text-sm md:text-base break-words flex-1">{opt}</span>
                                                                                </div>
                                                                            </Button>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <Input
                                                                        value={userAnswer || ""}
                                                                        placeholder="Type your answer here..."
                                                                        onChange={(e) => handleShortAnswerChange(i, e.target.value)}
                                                                        disabled={showResults}
                                                                        className="rounded-2xl md:rounded-3xl h-14 md:h-16 bg-card/5 border-foreground/5 focus:bg-card/10 transition-all font-bold px-4 md:px-8 text-sm md:text-base text-foreground w-full"
                                                                    />
                                                                    {showResults && !correct && (
                                                                        <div className="p-6 rounded-3xl glass border-primary/20 bg-primary/5">
                                                                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Correct Answer</div>
                                                                            <p className="text-sm font-bold opacity-80">{q.answer}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {showResults && q.explanation && (
                                                                <div className="p-6 rounded-3xl glass border-primary/20 bg-primary/5 mt-4">
                                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Explanation</div>
                                                                    <p className="text-sm font-bold opacity-80 italic">"{q.explanation}"</p>
                                                                </div>
                                                            )}
                                                        </Card>
                                                    )
                                                })}

                                                {questions.length > 0 && (
                                                    <div className="pt-8">
                                                        {!showResults ? (
                                                            <Button 
                                                                onClick={handleFinalizeQuiz} 
                                                                className="w-full h-16 md:h-20 rounded-2xl md:rounded-3xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg md:text-2xl shadow-glow group"
                                                            >
                                                                <span>{t("dashboard.finalize")}</span>
                                                            </Button>
                                                        ) : (
                                                            <div id="mastery-verdict" className="p-4 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-hero relative overflow-hidden group shadow-glow">
                                                                <div className="absolute inset-0 bg-background/10 transition-colors" />
                                                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                                                                    <div className="space-y-2 text-center md:text-left">
                                                                        <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-tighter">{t("dashboard.mastery_confirmed")}</h3>
                                                                        <p className="text-foreground/70 font-bold text-base md:text-lg">{t("dashboard.mastery_desc")}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 md:gap-8 glass p-4 md:p-8 rounded-2xl md:rounded-3xl border-foreground/20 bg-background/20">
                                                                        <div className="text-center">
                                                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-2">{t("dashboard.resultant_yield")}</div>
                                                                            <div className="text-2xl md:text-4xl font-bold text-foreground">{scoreQuiz()} / {questions.length}</div>
                                                                        </div>
                                                                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-primary text-primary-foreground flex items-center justify-center text-lg md:text-2xl font-bold shadow-glow">
                                                                            {Math.round((scoreQuiz()/questions.length)*100)}%
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
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
        </ErrorBoundary>
    )
}

export default DashboardHome
