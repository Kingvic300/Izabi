"use client"

import { useState, useRef } from "react"
import apiClient, { api } from "@/lib/apiClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BASE_URL } from "@/constants"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Brain, Zap, ChevronDown, ChevronUp, Sparkles, CheckCircle2, XCircle, BarChart3, Clock, LayoutGrid, Terminal, Layers, RotateCcw, Activity, Cpu, Download, Loader2, Flame, Trophy, TrendingUp, Upload } from "lucide-react"
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
import { useEffect, useState as react_useState, useMemo } from "react"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SummaryViewer = ({ content, t }: { content: string; t: any }) => {
    const [isExpanded, setIsExpanded] = react_useState(false);
    const isLong = content.length > 800;
    
    return (
        <div className="space-y-8">
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
    const containerRef = useRef<HTMLDivElement>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [summary, setSummary] = useState<string>("")
    const [questions, setQuestions] = useState<StudyQuestionResponse[]>([])
    const [showSummary, setShowSummary] = useState(false)
    const [showQuestions, setShowQuestions] = useState(false)
    const [pdfSelection, setPdfSelection] = useState<PDFSelection | null>(null)
    const [pdfFile, setPdfFile] = useState<File | null>(null)
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(5)
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
    const [showResults, setShowResults] = useState(false)
    const [userStats, setUserStats] = useState<any>(null)
    const [flashcards, setFlashcards] = useState<{ front: string; back: string }[]>([])
    const [showFlashcards, setShowFlashcards] = useState(false)
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)

    // Brain Drop State
    const [brainDropQuestion, setBrainDropQuestion] = useState<any>(null)
    const [isBrainDropCompleted, setIsBrainDropCompleted] = useState(false)
    
    // Practice Questions State
    const [practiceQuestions, setPracticeQuestions] = useState<StudyQuestionResponse[]>([])
    const [showPracticeQuiz, setShowPracticeQuiz] = useState(false)
    
    // Context Card State
    const [showContextCard, setShowContextCard] = useState(false)
    const [userExamType, setUserExamType] = useState<string | null>(null)

    const { errors, addError, clearError } = useApiError()
    const userId = localStorage.getItem("userId")

    const handleFeedPet = async () => {
        if (!userId) return;
        try {
            const res = await api.feedPet(userId);
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
        if (!userId) return;
        
        try {
            // Award points
            await api.submitQuizResult({
                userId,
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
                setQuestions(res.data);
                setShowQuestions(true);
                setSummary("");
                setFlashcards([]);
            }
        } catch (err) {
            addError({ message: "Failed to load practice questions", type: "validation" });
        }
    };
    
    const handleQuickTest = async () => {
        // TODO: Implement timed test feature
        addError({ message: "Quick Test coming soon!", type: "validation" });
    };
    
    const handleLearnTricks = () => {
        // TODO: Implement study tricks feature
        addError({ message: "Study Tricks coming soon!", type: "validation" });
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
                if (res.success) {
                    setBrainDropQuestion(res.data);
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
        if (!userId) return
        try {
            // Daily Check-in to update streak
            await apiClient.post('/api/user/check-in', { userId })
            
            const [statsRes, profileRes] = await Promise.all([
                apiClient.get(`/api/user/stats?userId=${userId}`),
                apiClient.get(`/api/user/profile/${userId}`)
            ])

            setUserStats(statsRes.data)
            
            if (profileRes.data?.data?.pet) {
                setUserStats((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev?.data,
                        pet: profileRes.data.data.pet
                    }
                }))
            }
        } catch (err) {
            console.error("Failed to fetch user stats:", err)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [userId])

    const handleSelectionComplete = ({ selection, file }: { selection: PDFSelection; file: File }) => {
        setPdfSelection(selection)
        setPdfFile(file)
    }

    /*
     * How: Uploads the selected PDF file and parameters to the specified backend endpoint to generate study materials (summary, questions, etc.).
     * Why: Core functionality allowing users to transform their documents into interactive learning content.
     */
    const handleRequest = async (endpoint: string, includeQuestions = false) => {
        if (!pdfFile || !userId || !pdfSelection) {
            addError({ message: "Upload required: Please initialize a document node first.", type: "validation" })
            return
        }

        setIsProcessing(true)
        clearError()
        setSelectedAnswers({})
        setShowResults(false)

        try {
            const formData = new FormData()
            formData.append("file", pdfFile)
            formData.append("userId", userId)

            if (pdfSelection.selectedPages?.length) {
                formData.append("selectedPages", JSON.stringify(pdfSelection.selectedPages))
            }
            if (includeQuestions) {
                formData.append("numberOfQuestions", String(numberOfQuestions))
            }

            const { data } = await apiClient.post(`/api/study/${endpoint}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })

            const responseYield = data.yield;
            
            if (endpoint === 'summarize') {
                setSummary(responseYield || "")
                setShowSummary(true)
                setQuestions([])
                setFlashcards([])
            } else if (endpoint === 'generate-questions') {
                const questionsData: StudyQuestionResponse[] = Array.isArray(responseYield) ? responseYield : []
                setQuestions(questionsData)
                setShowQuestions(questionsData.length > 0)
                setSummary("")
                setFlashcards([])
            } else if (endpoint === 'flashcards') {
                setFlashcards(Array.isArray(responseYield) ? responseYield : [])
                setShowFlashcards(true)
                setSummary("")
                setQuestions([])
            } else if (endpoint === 'generate-study-material') {
                setSummary(responseYield || "")
                setShowSummary(true)
                setQuestions([])
                setFlashcards([])
            }

            // You could also store telemetry in state if you want to display it
            console.log("[SmartStudy] Telemetry Received:", data.telemetry);

        } catch (err) {
            addError(err)
            setSummary("")
            setQuestions([])
            setFlashcards([])
        } finally {
            setIsProcessing(false)
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
                userId,
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
                <ErrorList errors={errors} onDismiss={clearError} />

                {/* Gamification Strip - Always Visible */}
                {userStats?.data && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
                    >
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Flame size={20} className="text-orange-500" fill="currentColor" />
                                <span className="text-sm font-bold text-foreground">{userStats.data.studyStreak || 0} day streak</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy size={20} className="text-yellow-500" />
                                <span className="text-sm font-bold text-foreground">{userStats.data.totalPoints || 0} XP</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={20} className="text-green-500" />
                                <span className="text-sm font-bold text-foreground/60 dark:text-foreground/70">Top 12% today</span>
                            </div>
                        </div>
                        {userStats?.data && (
                            <div className="hidden md:block">
                                <StreakPet 
                                    streak={userStats.data.studyStreak || 0} 
                                    petData={userStats.data.pet} 
                                    userPoints={userStats.data.totalPoints || 0}
                                    onFeed={handleFeedPet}
                                />
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Brain Drop - Instant Engagement (Priority #1) */}
                {!isBrainDropCompleted && (
                    <div className="stagger-card">
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
                                className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 p-8 md:p-12 text-center"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Brain size={180} className="stroke-primary" />
                                </div>
                                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                            <Sparkles size={32} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Personalize your <span className="text-gradient">Daily Brain Drop</span>
                                    </h3>
                                    <p className="text-lg text-muted-foreground font-medium">
                                        Upload your class notes or a textbook PDF, and we'll generate daily personalized questions to help you mastery your specific subjects.
                                    </p>
                                    <button 
                                        onClick={() => setPdfSelection(null)} // Or whatever scrolls them to upload
                                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-glow hover:scale-105"
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
                        onUploadDocument={() => setPdfSelection(null)}
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
                                        <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-foreground/5">
                                            <div className="flex items-center gap-3">
                                                <Layers size={18} className="text-primary/60" />
                                                <span className="text-xs font-bold opacity-60">Status</span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase">Active</div>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            onClick={() => setPdfSelection(null)}
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
                                <Card className="glass border-foreground/5 rounded-[40px] shadow-2xl overflow-hidden relative border border-white/5">
                                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/5">
                                        {[
                                            { id: 'summarize', icon: Brain, label: t("dashboard.mod_summary"), desc: t("dashboard.mod_summary_desc"), color: "text-blue-400" },
                                            { id: 'quiz', icon: Zap, label: t("dashboard.mod_quiz"), desc: t("dashboard.mod_quiz_desc"), color: "text-yellow-400" },
                                            { id: 'guide', icon: FileText, label: t("dashboard.mod_guide"), desc: t("dashboard.mod_guide_desc"), color: "text-emerald-400" },
                                            { id: 'cards', icon: Layers, label: t("dashboard.mod_flashcards"), desc: t("dashboard.mod_flashcards_desc"), color: "text-purple-400" }
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
                                                className="flex-1 p-8 hover:bg-white/[0.03] active:bg-white/[0.05] transition-all group flex flex-col items-center text-center gap-4"
                                            >
                                                <div className={cn("p-4 rounded-3xl bg-foreground/5 transition-all group-hover:scale-110 group-hover:shadow-glow", module.color)}>
                                                    <module.icon size={28} />
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold mb-1">{module.label}</div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-30">{module.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 px-4">Session Settings</div>
                                            <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/5">
                                                <Select
                                                    value={String(numberOfQuestions)}
                                                    onValueChange={(val) => setNumberOfQuestions(Number(val))}
                                                    disabled={isProcessing}
                                                >
                                                    <SelectTrigger className="w-[80px] h-8 rounded-xl bg-transparent border-0 focus:ring-0 font-bold text-xs uppercase">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="glass border-white/10">
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
                                <Card className="h-full glass shadow-2xl rounded-[48px] overflow-hidden group relative border-0">
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
                                     <div className="w-24 h-24 rounded-[32px] bg-foreground/5 flex items-center justify-center border border-foreground/5 shadow-2xl rotate-3 group-hover:rotate-0 transition-all mt-4">
                                         <Cpu size={48} className="text-primary animate-float" />
                                     </div>
                                     <div className="space-y-4 pt-4">
                                         <h3 className="text-3xl font-bold tracking-tight font-sans uppercase">{t("dashboard.init_node") || "Let's Get Started"}</h3>
                                         <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                                            {t("dashboard.init_desc") || "Upload a document to unlock your personalized study tools."}
                                         </p>
                                     </div>
                                     <div className="flex-1 flex items-end pb-4">
                                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-foreground/5 border border-foreground/5">
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
                                                <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-foreground/5 transition-all">
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
                                                        <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-8 rounded-3xl glass bg-foreground/[0.02] border-2 border-primary/20 shadow-xl overflow-hidden">
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
                                                        className="h-12 w-12 rounded-3xl glass hover:bg-foreground/10"
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
                                                        className="h-12 w-12 rounded-3xl glass hover:bg-foreground/10"
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
                                                    <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-foreground/5 transition-all">
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
                                                    <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-foreground/5 transition-all">
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
                                                        <Card key={i} className="bg-foreground/[0.02] border-foreground/5 rounded-2xl md:rounded-3xl p-4 md:p-8 space-y-4 md:space-y-6 relative overflow-hidden group">
                                                            
                                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                                                                <div className="space-y-2 md:space-y-3">
                                                                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Question {i+1}</div>
                                                                    <h4 className="text-base md:text-xl font-bold leading-tight text-foreground break-words">{q.question}</h4>
                                                                </div>
                                                                {showResults && (
                                                                    <div className={`w-fit px-4 py-1.5 md:px-5 md:py-2 rounded-3xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-2xl transition-all
                                                                        ${correct ? "bg-primary text-white shadow-primary/20" : "bg-destructive text-white shadow-destructive/20"}`}>
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
                                                                                    ${isSelected ? "bg-primary text-primary-foreground shadow-glow" : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"}
                                                                                    ${isCorrect ? "bg-primary/20 border-primary/50 text-primary !bg-opacity-20" : ""}
                                                                                    ${isWrong ? "bg-destructive/20 border-destructive/50 text-destructive-foreground !bg-opacity-20" : ""}
                                                                                `}
                                                                            >
                                                                                <div className="flex items-start gap-3 md:gap-4 w-full">
                                                                                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-2xl md:rounded-3xl flex items-center justify-center font-bold text-xs transition-opacity flex-shrink-0
                                                                                        ${isSelected ? "bg-black/10" : "bg-foreground/10 opacity-30"}`}>
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
                                                                        className="rounded-2xl md:rounded-3xl h-14 md:h-16 bg-foreground/5 border-foreground/5 focus:bg-foreground/10 transition-all font-bold px-4 md:px-8 text-sm md:text-base text-foreground w-full"
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
                                                                <div className="absolute inset-0 bg-black/10 transition-colors" />
                                                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                                                                    <div className="space-y-2 text-center md:text-left">
                                                                        <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tighter">{t("dashboard.mastery_confirmed")}</h3>
                                                                        <p className="text-foreground/70 font-bold text-base md:text-lg">{t("dashboard.mastery_desc")}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 md:gap-8 glass p-4 md:p-8 rounded-2xl md:rounded-3xl border-foreground/20 bg-black/20">
                                                                        <div className="text-center">
                                                                            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">{t("dashboard.resultant_yield")}</div>
                                                                            <div className="text-2xl md:text-4xl font-bold text-white">{scoreQuiz()} / {questions.length}</div>
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
                <style>{`
                .shadow-glow {
                    box-shadow: 0 0 30px rgba(59, 130, 246, 0.2);
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
            </div>
        </ErrorBoundary>
    )
}

export default DashboardHome
