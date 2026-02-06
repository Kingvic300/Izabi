"use client"

import { useState, useRef } from "react"
import apiClient from "@/lib/apiClient"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BASE_URL } from "@/constants"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Brain, Zap, ChevronDown, ChevronUp, Sparkles, CheckCircle2, XCircle, BarChart3, Clock, LayoutGrid, Terminal, Layers, RotateCcw, Activity, Cpu } from "lucide-react"
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

import { useLanguage } from "@/contexts/LanguageContext"
import StreakPet from "@/components/StreakPet"
import { useEffect } from "react"

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

    const { errors, addError, clearError } = useApiError()
    const userId = localStorage.getItem("userId")

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

    useEffect(() => {
        /*
         * How: Fetches user statistics and pet data from the backend to display on the dashboard.
         * Why: Provides users with immediate feedback on their learning progress and engagement.
         */
        const fetchStats = async () => {
            if (!userId) return
            try {
                const response = await apiClient.get(`/api/user/stats?userId=${userId}`)
                // response.data is { success: boolean, data: { ...Stats } }
                setUserStats(response.data)
                
                // Also get pet details if available from profile
                const profileRes = await apiClient.get(`/api/user/profile/${userId}`)
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
            console.log("[NeuralNode] Telemetry Received:", data.telemetry);

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

    return (
        <ErrorBoundary>
            <div ref={containerRef} className="space-y-6 md:space-y-12 w-full pb-20 px-0 md:px-8 lg:px-12 pt-6 md:pt-12">
                <ErrorList errors={errors} onDismiss={clearError} />

                {/* Header Section */}
                <div className="welcome-text space-y-8 pb-6 border-b border-foreground/5 px-4 md:px-0">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Terminal size={16} className="text-primary" />
                                </div>
                                <span className="text-[10px] lowercase font-black tracking-[0.3em] opacity-40">User Profile: Active</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                                {t("dashboard.greeting").split(',')[0]}
                                {t("dashboard.greeting").includes(',') && (
                                    <>
                                        , <br className="md:hidden" />
                                        <span className="text-gradient">{t("dashboard.greeting").split(',')[1]}</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-muted-foreground font-medium text-lg max-w-xl">
                                {t("dashboard.intro")}
                            </p>
                        </div>

                        {userStats?.data && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="stagger-card"
                            >
                                <StreakPet streak={userStats.data.studyStreak || 0} petData={userStats.data.pet} />
                            </motion.div>
                        )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary animate-pulse">
                               <LayoutGrid size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Knowledge Points</span>
                                <div className="text-2xl font-black text-foreground">{userStats?.data?.totalPoints || 0} KP</div>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40 text-emerald-500">System Status</span>
                            <span className="text-sm font-black text-foreground">Optimized for Growth</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                    {/* Left Column: Data Ingestion */}
                    <div className="lg:col-span-12 xl:col-span-4 space-y-8 stagger-card">
                        <Card className="glass shadow-2xl border-foreground/5 rounded-none md:rounded-[32px] border-x-0 md:border overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all pointer-events-none" />
                           <CardHeader className="p-6 md:p-8">
                               <CardTitle className="flex items-center gap-3 text-2xl font-black">
                                   <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                                        <FileText size={20} />
                                   </div>
                                   <span>{t("dashboard.upload_title")}</span>
                               </CardTitle>
                               <CardDescription className="font-medium opacity-60">{t("dashboard.upload_desc")}</CardDescription>
                           </CardHeader>
                           <CardContent className="p-0 md:px-8 pb-8 md:pb-10">
                               <PDFUploadSection onSelectionComplete={handleSelectionComplete} className="md:mt-0" />
                           </CardContent>
                        </Card>

                        {/* Telemetry Stats */}
                        <div className="grid grid-cols-2 gap-4 px-4 md:px-0">
                            <Card className="glass border-foreground/5 p-6 rounded-[24px] space-y-4">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 w-fit shadow-xl"><BarChart3 size={20} /></div>
                                <div>
                                    <div className="text-sm font-black opacity-40 uppercase tracking-widest">{t("dashboard.stats_eff")}</div>
                                    <div className="text-2xl font-black text-foreground">+24%</div>
                                </div>
                            </Card>
                            <Card className="glass border-foreground/5 p-6 rounded-[24px] space-y-4">
                                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit shadow-xl"><Clock size={20} /></div>
                                <div>
                                    <div className="text-sm font-black opacity-40 uppercase tracking-widest">{t("dashboard.stats_time")}</div>
                                    <div className="text-2xl font-black text-foreground">12.5h</div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: AI Modules */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-8">
                        {pdfSelection ? (
                            <Card className="glass border-foreground/5 rounded-none md:rounded-[40px] border-x-0 md:border p-2 relative overflow-hidden stagger-card shadow-2xl">
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
                                <CardHeader className="p-10 pb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="flex items-center gap-3 text-3xl font-black">
                                            <Sparkles className="text-primary" />
                                            <span>{t("dashboard.modules_title")}</span>
                                        </CardTitle>
                                        <div className="px-4 py-1.5 glass rounded-full border border-foreground/5 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t("dashboard.modules_ready")}</div>
                                    </div>
                                    <CardDescription className="text-lg font-medium">{t("dashboard.modules_desc")}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 pt-0 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Button
                                            onClick={() => handleRequest("summarize")}
                                            disabled={isProcessing}
                                            className="h-44 flex flex-col items-center justify-center gap-4 rounded-[32px] glass bg-foreground/[0.02] hover:bg-foreground/[0.05] border-foreground/5 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-blue-500/30 transition-all">
                                                <Brain size={32} />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-black text-foreground">{t("dashboard.mod_summary")}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{t("dashboard.mod_summary_desc")}</div>
                                            </div>
                                        </Button>
                                        <Button
                                            onClick={() => handleRequest("generate-questions", true)}
                                            disabled={isProcessing}
                                            className="h-44 flex flex-col items-center justify-center gap-4 rounded-[32px] glass bg-foreground/[0.02] hover:bg-foreground/[0.05] border-foreground/5 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
                                                <Zap size={32} />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-black text-foreground">{t("dashboard.mod_quiz")}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{t("dashboard.mod_quiz_desc")}</div>
                                            </div>
                                        </Button>
                                        <Button
                                            onClick={() => handleRequest("generate-study-material", true)}
                                            disabled={isProcessing}
                                            className="h-44 flex flex-col items-center justify-center gap-4 rounded-[32px] glass bg-foreground/[0.02] hover:bg-foreground/[0.05] border-foreground/5 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all">
                                                <FileText size={32} />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-black text-foreground">{t("dashboard.mod_guide")}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{t("dashboard.mod_guide_desc")}</div>
                                            </div>
                                        </Button>
                                        <Button
                                            onClick={() => handleRequest("flashcards")}
                                            disabled={isProcessing}
                                            className="h-44 flex flex-col items-center justify-center gap-4 rounded-[32px] glass bg-foreground/[0.02] hover:bg-foreground/[0.05] border-foreground/5 group relative overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-orange-500/30 transition-all">
                                                <Layers size={32} />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-black text-foreground">{t("dashboard.mod_flashcards")}</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{t("dashboard.mod_flashcards_desc")}</div>
                                            </div>
                                        </Button>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-6 p-8 rounded-[32px] glass border-foreground/5">
                                        <div className="flex-1 space-y-2">
                                            <div className="text-sm font-black uppercase tracking-widest text-primary">{t("dashboard.config_title")}</div>
                                            <p className="text-sm text-balance font-medium opacity-60">{t("dashboard.config_desc")}</p>
                                        </div>
                                        <div className="flex items-center gap-4 bg-foreground/5 p-1 rounded-2xl border border-foreground/5">
                                            <div className="px-4 text-[10px] font-black uppercase tracking-widest opacity-40">{t("dashboard.questions_label")}</div>
                                            <Select
                                                value={String(numberOfQuestions)}
                                                onValueChange={(val) => setNumberOfQuestions(Number(val))}
                                                disabled={isProcessing}
                                            >
                                                <SelectTrigger className="w-[80px] h-10 rounded-xl bg-transparent border-0 focus:ring-0 font-black">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="glass border-foreground/10">
                                                    {[3, 5, 8, 10, 15].map((num) => (
                                                        <SelectItem key={num} value={String(num)} className="font-bold">
                                                            {num} 
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {isProcessing && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center z-50 space-y-6">
                                            <div className="relative">
                                                <div className="animate-spin h-20 w-20 border-b-4 border-primary rounded-full" />
                                                <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-2xl font-black tracking-tight">{t("dashboard.processing")}</p>
                                                <p className="text-sm font-bold opacity-40 uppercase tracking-widest">{t("dashboard.processing_desc")}</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 glass border border-white/5 rounded-[64px] relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent)] pointer-events-none" />
                                <div className="w-32 h-32 rounded-[40px] bg-black/40 flex items-center justify-center mb-10 shadow-2xl border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <Cpu size={56} className="text-primary animate-pulse" />
                                </div>
                                <div className="text-center space-y-4 relative z-10">
                                    <h3 className="text-4xl font-black tracking-tighter">{t("dashboard.init_node")}</h3>
                                    <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">{t("dashboard.init_desc")}</p>
                                    <div className="pt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                                        <Activity size={12} />
                                        <span>System Idle: Awaiting Ingestion</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                            </motion.div>
                        )}

                        {/* Results Hub */}
                        {(summary || questions.length > 0 || flashcards.length > 0) && (
                            <div className="space-y-8 pt-8 stagger-card px-4 md:px-0">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter">
                                        <div className="w-2 h-10 bg-gradient-hero rounded-full" />
                                        <span>{t("dashboard.results_title")}</span>
                                    </h2>
                                </div>

                                {flashcards.length > 0 && (
                                    <Collapsible open={showFlashcards} onOpenChange={setShowFlashcards}>
                                        <Card className="glass border-foreground/5 rounded-none md:rounded-[32px] border-x-0 md:border overflow-hidden shadow-2xl">
                                            <CollapsibleTrigger asChild>
                                                <button className="w-full text-left p-10 flex items-center justify-between group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Layers size={24} /></div>
                                                        <div>
                                                            <h3 className="text-2xl font-black leading-tight">{t("dashboard.res_flashcards")}</h3>
                                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{flashcards.length} {t("dashboard.res_flashcards_desc")}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-foreground/5 transition-all">
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
                                                            <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-8 rounded-[32px] glass bg-foreground/[0.02] border-2 border-primary/20 shadow-xl overflow-hidden">
                                                                <div className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest opacity-30">Front</div>
                                                                <p className="text-2xl font-black text-center text-foreground">{flashcards[currentCardIndex]?.front}</p>
                                                            </div>
                                                            {/* Back */}
                                                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-8 rounded-[32px] glass bg-primary/10 border-2 border-primary/40 shadow-xl overflow-hidden">
                                                                <div className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest opacity-30 text-primary">Back</div>
                                                                <p className="text-xl font-bold text-center text-foreground/90 leading-relaxed">{flashcards[currentCardIndex]?.back}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-12 w-12 rounded-2xl glass hover:bg-foreground/10"
                                                            onClick={() => {
                                                                setIsFlipped(false)
                                                                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
                                                            }}
                                                        >
                                                            <ChevronDown className="rotate-90" />
                                                        </Button>
                                                        <span className="text-lg font-black tracking-tighter">
                                                            {currentCardIndex + 1} / {flashcards.length}
                                                        </span>
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            className="h-12 w-12 rounded-2xl glass hover:bg-foreground/10"
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
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity gap-2"
                                                        onClick={() => {
                                                            setCurrentCardIndex(0)
                                                            setIsFlipped(false)
                                                        }}
                                                    >
                                                        <RotateCcw size={14} />
                                                        Reset Terminal
                                                    </Button>
                                                </CardContent>
                                            </CollapsibleContent>
                                        </Card>
                                    </Collapsible>
                                )}

                                {summary && (
                                    <Collapsible open={showSummary} onOpenChange={setShowSummary}>
                                        <Card className="glass border-foreground/5 rounded-none md:rounded-[32px] border-x-0 md:border overflow-hidden shadow-2xl">
                                            <CollapsibleTrigger asChild>
                                                <button className="w-full text-left p-10 flex items-center justify-between group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Brain size={24} /></div>
                                                        <div>
                                                            <h3 className="text-2xl font-black leading-tight">{t("dashboard.res_summary")}</h3>
                                                            <p className="text--[10px] font-black uppercase tracking-widest opacity-40">{t("dashboard.res_summary_desc")}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-foreground/5 transition-all">
                                                        {showSummary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <CardContent className="px-24 pb-16">
                                                    <div className="prose prose-lg dark:prose-invert max-w-none leading-loose text-muted-foreground/90 font-medium whitespace-pre-wrap selection:bg-primary/30">
                                                        {summary}
                                                    </div>
                                                </CardContent>
                                            </CollapsibleContent>
                                        </Card>
                                    </Collapsible>
                                )}

                                {questions.length > 0 && (
                                    <Collapsible open={showQuestions} onOpenChange={setShowQuestions}>
                                        <Card className="glass border-foreground/5 rounded-none md:rounded-[32px] border-x-0 md:border overflow-hidden shadow-2xl">
                                            <CollapsibleTrigger asChild>
                                                <button className="w-full text-left p-10 flex items-center justify-between group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                                                        <div>
                                                            <h3 className="text-2xl font-black leading-tight">{t("dashboard.res_quiz")}</h3>
                                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{questions.length} {t("dashboard.res_quiz_desc")}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-foreground/5 transition-all">
                                                        {showQuestions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <CardContent className="p-10 space-y-8">
                                                    {questions.map((q, i) => {
                                                        const userAnswer = selectedAnswers[i]
                                                        const isShort = q.questionType?.toLowerCase() === "short_answer"
                                                        const correct = isShort && userAnswer ? isShortAnswerCorrect(userAnswer, q.answer || "") : userAnswer === q.answer

                                                        return (
                                                            <Card key={i} className="bg-foreground/[0.02] border-foreground/5 rounded-[32px] p-8 space-y-6 relative overflow-hidden group">
                                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                
                                                                <div className="flex justify-between items-start gap-6">
                                                                    <div className="space-y-3">
                                                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Node {i+1}</div>
                                                                        <h4 className="text-xl font-black leading-tight text-foreground">{q.question}</h4>
                                                                    </div>
                                                                    {showResults && (
                                                                        <div className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2 shadow-2xl transition-all
                                                                            ${correct ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-destructive text-white shadow-destructive/20"}`}>
                                                                            {correct ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                                            {correct ? "Acquisition" : "Anomaly"}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {!isShort ? (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {q.options?.map((opt, idx) => {
                                                                            const isSelected = userAnswer === opt
                                                                            const isCorrect = showResults && opt === q.answer
                                                                            const isWrong = showResults && isSelected && opt !== q.answer

                                                                            return (
                                                                                <Button
                                                                                    key={idx}
                                                                                    onClick={() => handleAnswerSelect(i, opt)}
                                                                                    disabled={showResults}
                                                                                    className={`h-auto py-6 px-8 justify-start text-left rounded-2xl transition-all duration-300 font-bold border border-foreground/5
                                                                                        ${isSelected ? "bg-white text-black shadow-glow" : "bg-foreground/5 hover:bg-foreground/10 text-foreground/70"}
                                                                                        ${isCorrect ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 !bg-opacity-20" : ""}
                                                                                        ${isWrong ? "bg-destructive/20 border-destructive/50 text-destructive-foreground !bg-opacity-20" : ""}
                                                                                    `}
                                                                                >
                                                                                    <div className="flex items-center gap-4">
                                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-opacity
                                                                                            ${isSelected ? "bg-black/10" : "bg-foreground/10 opacity-30"}`}>
                                                                                            {String.fromCharCode(65 + idx)}
                                                                                        </div>
                                                                                        <span className="text-sm">{opt}</span>
                                                                                    </div>
                                                                                </Button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-4">
                                                                        <Input
                                                                            value={userAnswer || ""}
                                                                            placeholder="Input response terminal..."
                                                                            onChange={(e) => handleShortAnswerChange(i, e.target.value)}
                                                                            disabled={showResults}
                                                                            className="rounded-2xl h-16 bg-foreground/5 border-foreground/5 focus:bg-foreground/10 transition-all font-bold px-8 text-foreground"
                                                                        />
                                                                        {showResults && !correct && (
                                                                            <div className="p-6 rounded-2xl glass border-primary/20 bg-primary/5">
                                                                                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Expected Pattern</div>
                                                                                <p className="text-sm font-bold opacity-80">{q.answer}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </Card>
                                                        )
                                                    })}

                                                    {questions.length > 0 && (
                                                        <div className="pt-8">
                                                            {!showResults ? (
                                                                <Button 
                                                                    onClick={() => {
                                                                        setShowResults(true)
                                                                        gsap.to(window, { duration: 1, scrollTo: "#mastery-verdict", ease: "expo.out" })
                                                                    }} 
                                                                    className="w-full h-20 rounded-[32px] bg-primary text-primary-foreground hover:bg-primary/90 font-black text-2xl shadow-glow group"
                                                                >
                                                                    <span>{t("dashboard.finalize")}</span>
                                                                    {/* <ArrowLeft className="rotate-180 ml-4 group-hover:translate-x-2 transition-transform" /> */}
                                                                </Button>
                                                            ) : (
                                                                <div id="mastery-verdict" className="p-10 rounded-[48px] bg-gradient-hero relative overflow-hidden group shadow-glow">
                                                                    <div className="absolute inset-0 bg-black/10 transition-colors" />
                                                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                                                        <div className="space-y-2 text-center md:text-left">
                                            <h3 className="text-4xl font-black text-white tracking-tighter">{t("dashboard.mastery_confirmed")}</h3>
                                            <p className="text-foreground/70 font-bold text-lg">{t("dashboard.mastery_desc")}</p>
                                        </div>
                                        <div className="flex items-center gap-8 glass p-8 rounded-[32px] border-foreground/20 bg-black/20">
                                            <div className="text-center">
                                                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">{t("dashboard.resultant_yield")}</div>
                                                <div className="text-4xl font-black text-white">{scoreQuiz()} / {questions.length}</div>
                                            </div>
                                                                            <div className="w-20 h-20 rounded-2xl bg-white text-black flex items-center justify-center text-2xl font-black shadow-glow">
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
        </ErrorBoundary>
    )
}

export default DashboardHome
