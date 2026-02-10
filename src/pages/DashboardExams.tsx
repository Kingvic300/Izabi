"use client"

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    BookOpen, 
    GraduationCap, 
    School, 
    Search, 
    Zap, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    ChevronRight, 
    Trophy, 
    Target, 
    Sparkles, 
    Filter, 
    Play,
    Loader2,
    Calendar,
    ArrowLeft,
    FileText,
    Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { api } from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppToast } from "@/hooks/useAppToast";
import type { Exam, Question } from "@/types/api";

const DashboardExams = () => {
    const [view, setView] = useState<'lobby' | 'exam' | 'result'>('lobby');
    const [activeTab, setActiveTab] = useState<'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY'>('JAMB');
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isPracticing, setIsPracticing] = useState(false);
    
    // Exam State
    const [currentExam, setCurrentExam] = useState<Exam | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);

    // Generation Form State
    const [simSubject, setSimSubject] = useState("");
    const [simUniName, setSimUniName] = useState("");
    const [simCourseTitle, setSimCourseTitle] = useState("");
    
    const [practiceSubject, setPracticeSubject] = useState("");
    const [practiceUniName, setPracticeUniName] = useState("");
    const [practiceCourseTitle, setPracticeCourseTitle] = useState("");
    
    // Note Practice State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isNotePracticing, setIsNotePracticing] = useState(false);
    const [recentResults, setRecentResults] = useState<any[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const appToast = useAppToast();

    useGSAP(() => {
        if (view === 'lobby') {
            gsap.from(".stagger-card", {
                y: 20,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }, [view]);

    // Resume Logic
    useEffect(() => {
        const savedExam = localStorage.getItem("active_exam");
        const savedView = localStorage.getItem("active_exam_view");
        const savedAnswers = localStorage.getItem("active_exam_answers");
        const savedIndex = localStorage.getItem("active_exam_index");
        const savedTime = localStorage.getItem("active_exam_time");

        if (savedExam && savedView === 'exam') {
            try {
                setCurrentExam(JSON.parse(savedExam));
                setView('exam');
                if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
                if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex));
                if (savedTime) setTimeLeft(parseInt(savedTime));
            } catch (e) {
                console.error("Failed to restore exam", e);
            }
        }
    }, []);

    // Sync state to local storage
    useEffect(() => {
        if (view === 'exam' && currentExam) {
            localStorage.setItem("active_exam", JSON.stringify(currentExam));
            localStorage.setItem("active_exam_view", view);
            localStorage.setItem("active_exam_answers", JSON.stringify(answers));
            localStorage.setItem("active_exam_index", currentQuestionIndex.toString());
            localStorage.setItem("active_exam_time", timeLeft.toString());
        } else if (view === 'result' || view === 'lobby') {
            // Don't clear if lobby but keep if navigating away? 
            // Actually user implies "switch tab" so we keep it.
            // We only clear on 'result' (completion).
            if (view === 'result') {
                localStorage.removeItem("active_exam");
                localStorage.removeItem("active_exam_view");
                localStorage.removeItem("active_exam_answers");
                localStorage.removeItem("active_exam_index");
                localStorage.removeItem("active_exam_time");
            }
        }
    }, [view, currentExam, answers, currentQuestionIndex, timeLeft]);

    const fetchHistory = async () => {
        try {
            const res = await api.getQuizResults(); 
            const data = Array.isArray(res) ? res : (res?.data && Array.isArray(res.data)) ? res.data : [];
            setRecentResults(data.slice(0, 5)); // Show last 5
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchHistory();
    }, []);

    const startSimulation = async () => {
        if (activeTab === 'UNIVERSITY' && (!simUniName || !simCourseTitle)) {
            appToast.error({ title: "Details Required", description: "Please enter University and Course Title." });
            return;
        }
        if (activeTab !== 'UNIVERSITY' && !simSubject) {
            appToast.error({ title: "Subject Required", description: "Please enter a subject to start." });
            return;
        }

        setIsSimulating(true);
        appToast.info({ title: "Preparing Simulation", description: "Generating your standard CBT exam paper. This might take up to 30 seconds." });
        try {
            // Use the Simulation endpoint
            const exam = await api.getSimulation({
                category: activeTab,
                subject: activeTab === 'UNIVERSITY' ? undefined : simSubject,
                universityName: activeTab === 'UNIVERSITY' ? simUniName : undefined,
                courseTitle: activeTab === 'UNIVERSITY' ? simCourseTitle : undefined,
                count: 25 // Mini-Simulation for better reliability
            });
            setCurrentExam(exam);
            setTimeLeft(exam.duration * 60);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setView('exam');
            appToast.success({ title: "Exam Ready", description: "Your simulation has loaded. Good luck!" });
        } catch (err: any) {
            appToast.error({ title: "Simulation Failed", description: err.message || "Could not generate exam. AI nodes timed out." });
        } finally {
            setIsSimulating(false);
        }
    }

    const startCustomExam = async () => {
        if (activeTab === 'UNIVERSITY' && (!practiceUniName || !practiceCourseTitle)) {
             appToast.error({ title: "Details Required", description: "Please enter University and Course Title." });
             return;
        }
        if (activeTab !== 'UNIVERSITY' && !practiceSubject) {
            appToast.error({ title: "Subject Required", description: "Please enter a subject." });
            return;
        }

        setIsPracticing(true);
        try {
            const config = {
                category: activeTab,
                subject: activeTab === 'UNIVERSITY' ? undefined : practiceSubject,
                universityName: activeTab === 'UNIVERSITY' ? practiceUniName : undefined,
                courseTitle: activeTab === 'UNIVERSITY' ? practiceCourseTitle : undefined,
                count: 15 // Short practice
            };
            const exam = await api.generatePracticeExam(config);
            setCurrentExam(exam);
            setTimeLeft(exam.duration * 60);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setView('exam');
        } catch (err: any) {
             appToast.error({ title: "Generation Failed", description: err.message || "Could not generate exam." });
        } finally {
            setIsPracticing(false);
        }
    }

    const handleAnswer = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const startNotePractice = async () => {
        if (!selectedFile) {
            appToast.error({ title: "No File", description: "Please upload your notes (PDF) first." });
            return;
        }

        setIsNotePracticing(true);
        appToast.info({ title: "Scanning Notes", description: "Our AI is reading your notes to create a custom exam paper." });
        
        try {
            // First ingest the file
            const res = await api.ingestDirect(selectedFile, 'practice-exam');
            const jobId = res.jobId;

            // Poll for completion
            let status = 'PENDING';
            let examData = null;
            
            while (status !== 'COMPLETED' && status !== 'FAILED') {
                await new Promise(r => setTimeout(r, 2000));
                const job = await api.getJobStatus(jobId);
                status = job.status;
                if (status === 'COMPLETED') {
                    // Extract exam from job data if applicable, 
                    // or request generation now that it's "ingested"
                    // For now, let's assume the backend generates it as the "result" of this specific job type
                    examData = job.result; 
                }
            }

            if (status === 'FAILED' || !examData) throw new Error("Could not process notes.");

            setCurrentExam(examData);
            setTimeLeft(examData.duration * 60 || 1800);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setView('exam');
            appToast.success({ title: "Ready!", description: "Exam generated from your notes. Good luck!" });

        } catch (err: any) {
             appToast.error({ title: "Note Practice Failed", description: err.message || "Could not read notes." });
        } finally {
            setIsNotePracticing(false);
        }
    };

    const submitExam = useCallback(async () => {
        if (!currentExam) return;
        
        // Calculate Score
        let correct = 0;
        currentExam.questions.forEach((q, i) => {
            if (answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase() ||
                answers[i]?.startsWith(q.answer.charAt(0))) { // Handle "A) Option" vs "A"
                correct++;
            }
        });

        setScore((correct / currentExam.questions.length) * 100);
        setView('result');

        try {
            await api.submitQuizResult({
                score: Math.round((correct / currentExam.questions.length) * 100),
                totalQuestions: currentExam.questions.length,
                correctAnswers: correct,
                subject: currentExam.subject,
                date: new Date().toISOString()
            });
        } catch (err) {
            console.error("Failed to save result", err);
        }
    }, [currentExam, answers]);

    // Timer - must come AFTER submitExam is declared
    useEffect(() => {
        if (view === 'exam' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (view === 'exam' && timeLeft === 0) {
            submitExam();
        }
    }, [view, timeLeft, submitExam]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const renderLobby = () => (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-6xl font-extrabold tracking-tighter mb-2 italic">
                        Exam <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 bg-clip-text text-transparent">Center</span>
                    </h1>
                    <p className="text-muted-foreground text-xl font-medium">Select your category and start a professional simulation.</p>
                </div>

                {localStorage.getItem("active_exam") && view === 'lobby' && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/10 border border-primary/20 p-4 rounded-3xl flex items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse border border-primary/30">
                                <Play className="text-primary fill-primary" size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Ongoing Session</p>
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40">Ready to resume</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setView('exam')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            Resume Now
                        </Button>
                    </motion.div>
                )}

                <div className="flex bg-card/20 p-1.5 rounded-3xl backdrop-blur-xl border border-foreground/5 shadow-inner">
                    {(['JAMB', 'WAEC', 'JUPEB', 'UNIVERSITY'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-8 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.2em]",
                                activeTab === tab 
                                    ? "bg-primary text-primary-foreground shadow-2xl flex items-center gap-2" 
                                    : "hover:bg-foreground/5 text-muted-foreground"
                            )}
                        >
                            {activeTab === tab && <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Simulation Card */}
                <Card className="glass-card stagger-card border-primary/20 shadow-2xl relative overflow-hidden group rounded-[40px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="relative z-10 p-8">
                        <CardTitle className="flex items-center gap-4 text-3xl font-black italic tracking-tighter">
                            <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-inner">
                                <Zap className="fill-primary" size={24} />
                            </div>
                            Full <span className="text-primary">Sim</span>
                        </CardTitle>
                        <CardDescription className="text-base font-medium opacity-70">Timed, standard exam conditions for final prep.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-20 p-8 pt-0">
                        <div className="space-y-4">
                            {activeTab === 'UNIVERSITY' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">University</label>
                                        <Input 
                                            placeholder="e.g. UNILAG" 
                                            value={simUniName}
                                            onChange={e => setSimUniName(e.target.value)}
                                            className="bg-background/50 border-foreground/10 h-14 rounded-2xl focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Course Title</label>
                                        <Input 
                                            placeholder="e.g. Intro to Computer Science" 
                                            value={simCourseTitle}
                                            onChange={e => setSimCourseTitle(e.target.value)}
                                            className="bg-background/50 border-foreground/10 h-14 rounded-2xl focus:ring-primary/20"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Subject</label>
                                    <Input 
                                        id="sim-subject-input"
                                        type="text"
                                        placeholder="e.g. Use of English, Mathematics" 
                                        value={simSubject}
                                        onChange={e => setSimSubject(e.target.value)}
                                        className="bg-background/50 border-foreground/10 h-14 rounded-2xl shadow-sm focus:border-primary/50 text-lg font-bold"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                        <Button 
                            onClick={startSimulation} 
                            disabled={isSimulating}
                            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] bg-primary hover:bg-primary/90 text-primary-foreground mt-4 relative z-30 shadow-2xl shadow-primary/20 active:scale-95 transition-all rounded-[20px]"
                        >
                            {isSimulating ? <Loader2 className="animate-spin" /> : "Start Exam"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Custom Practice Card */}
                <Card className="glass-card stagger-card border-blue-500/20 shadow-2xl relative overflow-hidden group rounded-[40px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="relative z-10 p-8">
                        <CardTitle className="flex items-center gap-4 text-3xl font-black italic tracking-tighter">
                            <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500 shadow-inner">
                                <Target size={24} />
                            </div>
                            Custom <span className="text-blue-500">Practice</span>
                        </CardTitle>
                        <CardDescription className="text-base font-medium opacity-70">Short, targeted AI-generated tests by subject.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-20 p-8 pt-0">
                        {activeTab === 'UNIVERSITY' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">University</label>
                                    <Input 
                                        placeholder="e.g. UNILAG" 
                                        value={practiceUniName}
                                        onChange={e => setPracticeUniName(e.target.value)}
                                        className="bg-background/50 border-foreground/10 h-14 rounded-2xl focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Course Title</label>
                                    <Input 
                                        placeholder="e.g. Intro to Computer Science" 
                                        value={practiceCourseTitle}
                                        onChange={e => setPracticeCourseTitle(e.target.value)}
                                        className="bg-background/50 border-foreground/10 h-14 rounded-2xl focus:ring-blue-500/20"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Topic / Subject</label>
                                <Input 
                                    id="practice-subject-input"
                                    type="text"
                                    placeholder="e.g. Organic Chemistry" 
                                    value={practiceSubject}
                                    onChange={e => setPracticeSubject(e.target.value)}
                                    className="bg-background/50 border-foreground/10 h-14 rounded-2xl shadow-sm focus:border-blue-500/50 text-lg font-bold"
                                />
                            </div>
                        )}
                        <Button 
                            onClick={startCustomExam} 
                            disabled={isPracticing}
                            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] bg-blue-600 hover:bg-blue-500 text-white mt-4 relative z-30 shadow-2xl shadow-blue-500/20 active:scale-95 transition-all rounded-[20px]"
                        >
                            {isPracticing ? <Loader2 className="animate-spin" /> : "Start Practice"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Note Practice Card */}
                <Card className="glass-card stagger-card border-blue-600/20 shadow-2xl relative overflow-hidden group rounded-[40px]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="relative z-10 p-8">
                        <CardTitle className="flex items-center gap-4 text-3xl font-black italic tracking-tighter">
                            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-600 shadow-inner">
                                <FileText size={24} />
                            </div>
                            Notes <span className="text-blue-600">Practice</span>
                        </CardTitle>
                        <CardDescription className="text-base font-medium opacity-70">Upload PDF notes to practice on your own material.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-20 p-8 pt-0">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Upload PDF</label>
                            <div className="border-2 border-dashed border-foreground/10 rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-600/50 transition-all cursor-pointer relative bg-background/50 group/upload hover:bg-blue-600/5">
                                <input 
                                    type="file" 
                                    accept=".pdf" 
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                />
                                {selectedFile ? (
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-2 text-blue-600">
                                            <FileText size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-blue-600 truncate max-w-[200px]">{selectedFile.name}</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">Click to change</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                            <Upload size={24} className="text-muted-foreground group-hover/upload:text-blue-600 transition-colors" />
                                        </div>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">Select Research Notes</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <Button 
                            onClick={startNotePractice} 
                            disabled={isNotePracticing || !selectedFile}
                            className="w-full h-16 text-lg font-black uppercase tracking-[0.2em] bg-blue-700 hover:bg-blue-600 text-white mt-4 relative z-30 shadow-2xl shadow-blue-700/20 active:scale-95 transition-all rounded-[20px]"
                        >
                            {isNotePracticing ? <Loader2 className="animate-spin" /> : "Start Note Exam"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            <div className="stagger-card glass-card rounded-[40px] p-10 border border-foreground/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                    <Trophy size={200} />
                </div>
                <div className="flex items-center justify-between mb-10 relative z-10">
                    <h3 className="text-3xl font-black flex items-center gap-4 tracking-tighter italic">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <Trophy size={28} />
                        </div>
                        RECENT <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent underline decoration-blue-500/30">STATS</span>
                    </h3>
                    <Button variant="ghost" onClick={() => window.location.href='/dashboard/history'} className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:bg-foreground/5 transition-all">
                        Historical Data <ChevronRight size={14} className="ml-2" />
                    </Button>
                </div>
                
                <div className="relative z-10">
                    {recentResults.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {recentResults.map((res, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-card/40 rounded-[24px] border border-foreground/5 hover:border-primary/20 transition-all group/stat hover:translate-x-1">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-2xl shadow-inner",
                                            res.score >= 70 ? "bg-blue-500/10 text-blue-500" : res.score >= 45 ? "bg-blue-400/10 text-blue-400" : "bg-destructive/10 text-destructive"
                                        )}>
                                            {Math.round(res.score)}<span className="text-xs opacity-60 ml-0.5">%</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-lg uppercase tracking-tight truncate max-w-[200px] mb-1">{res.subject}</p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-[10px] font-black opacity-30 uppercase tracking-widest bg-foreground/5 px-2 py-1 rounded-md">
                                                    <Calendar size={10} /> {new Date(res.date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black opacity-30 uppercase tracking-widest bg-blue-500/5 text-blue-500/60 px-2 py-1 rounded-md">
                                                    <CheckCircle2 size={10} /> {res.correctAnswers}/{res.totalQuestions}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-10 h-10 rounded-xl bg-primary/5 text-primary opacity-0 group-hover/stat:opacity-100 transition-all flex items-center justify-center hover:bg-primary hover:text-white">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-background/40 rounded-[32px] border border-dashed border-foreground/10">
                            <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto mb-6">
                                <Clock size={40} className="text-muted-foreground opacity-30" />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-widest opacity-20">Archive Empty</h4>
                            <p className="text-sm opacity-40 mt-2 max-w-xs mx-auto font-medium leading-relaxed">Complete your first simulation to begin tracking your neural improvement.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderExam = () => (
        <div className="w-full min-h-screen flex flex-col pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-4 z-50 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-foreground/10 shadow-xl">
                <div>
                    <h2 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">{currentExam?.subject}</h2>
                    <p className="text-xs font-bold uppercase opacity-60 tracking-widest">{activeTab} • Question {currentQuestionIndex + 1} of {currentExam?.questions.length}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-mono font-black text-2xl ${timeLeft < 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-blue-500/10 text-blue-500'}`}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Card */}
            <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
            >
                <Card className="glass border-foreground/10 shadow-2xl p-6 md:p-10 rounded-[32px]">
                    <div className="mb-8">
                        <p className="text-lg md:text-2xl font-medium leading-relaxed">
                            {currentExam?.questions[currentQuestionIndex].question}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {currentExam?.questions[currentQuestionIndex].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className={`text-left p-6 rounded-2xl transition-all border-2 flex items-center gap-4 group ${
                                    answers[currentQuestionIndex] === option 
                                    ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(37,99,235,0.15)]' 
                                    : 'border-foreground/5 bg-card/5 hover:bg-card/10 hover:border-foreground/10'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                                    answers[currentQuestionIndex] === option ? 'border-blue-500 bg-blue-500 text-white' : 'border-foreground/20'
                                }`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-lg font-medium">{option}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Footer Navigation */}
                <div className="mt-8 flex justify-center gap-4 pb-12">
                    <Button 
                        variant="ghost" 
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="w-32 h-12 rounded-xl font-bold border border-foreground/5 hover:bg-card"
                    >
                        Previous
                    </Button>
                    
                    {currentQuestionIndex === (currentExam?.questions.length || 0) - 1 ? (
                        <Button 
                            onClick={submitExam}
                            className="w-40 h-14 rounded-2xl font-black uppercase tracking-widest text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
                        >
                            Final Submission
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="w-32 h-12 rounded-[14px] font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            Next
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );

    const renderResult = () => (
        <div className="w-full text-center space-y-12 pt-10 px-4 md:px-20">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-56 h-56 mx-auto rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-blue-400 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] mb-8 border-4 border-white/10"
            >
                <div className="text-7xl font-black text-white">{Math.round(score)}%</div>
            </motion.div>

            <h2 className="text-4xl font-bold tracking-tighter">
                {score >= 70 ? "Excellent Work! 🎉" : score >= 50 ? "Good Effort! 👍" : "Keep Practicing! 💪"}
            </h2>
            <p className="text-xl text-muted-foreground">
                You answered {Math.round((score / 100) * (currentExam?.questions.length || 0))} out of {currentExam?.questions.length} questions correctly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="p-10 bg-blue-500/5 border-blue-500/20 rounded-[32px] shadow-inner group">
                    <div className="font-black text-blue-500 text-sm uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">Correct Responses</div>
                    <div className="text-5xl font-black">{Math.round((score / 100) * (currentExam?.questions.length || 0))}</div>
                </Card>
                <Card className="p-10 bg-destructive/5 border-destructive/20 rounded-[32px] shadow-inner group">
                    <div className="font-black text-destructive/60 text-sm uppercase tracking-widest mb-2 group-hover:translate-x-1 transition-transform">Incorrect Responses</div>
                    <div className="text-5xl font-black">{(currentExam?.questions.length || 0) - Math.round((score / 100) * (currentExam?.questions.length || 0))}</div>
                </Card>
            </div>

            <Button 
                onClick={() => setView('lobby')}
                className="h-16 px-12 rounded-[20px] font-black uppercase tracking-[0.2em] text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-95"
            >
                Return to Lobby
            </Button>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen w-full px-4 md:px-12 py-10 pb-32 bg-background">
            <ErrorBoundary>
                <AnimatePresence mode="wait">
                    {view === 'lobby' && (
                        <motion.div
                            key="lobby"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {renderLobby()}
                        </motion.div>
                    )}
                    {view === 'exam' && (
                        <motion.div
                            key="exam"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {renderExam()}
                        </motion.div>
                    )}
                    {view === 'result' && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {renderResult()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </ErrorBoundary>
        </div>
    );
};

export default function DashboardExamsPage() {
    return (
        <ErrorBoundary>
            <DashboardExams />
        </ErrorBoundary>
    );
}
