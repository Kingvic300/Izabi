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
    ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { api } from "@/lib/apiClient";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAppToast } from "@/hooks/useAppToast";
import type { Exam, Question } from "@/types/api";

const DashboardExams = () => {
    const [view, setView] = useState<'lobby' | 'exam' | 'result'>('lobby');
    const [activeTab, setActiveTab] = useState<'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY'>('JAMB');
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    
    // Exam State
    const [currentExam, setCurrentExam] = useState<Exam | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [score, setScore] = useState(0);

    // Generation Form State
    const [subject, setSubject] = useState("");
    const [uniName, setUniName] = useState("");
    const [courseTitle, setCourseTitle] = useState("");

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

    const fetchHistory = async () => {
        try {
            const res = await api.getExams(activeTab); // This gets past questions actually
            // For user history we use a different endpoint, but checking past-questions for now
            // Actually let's use user history
            // const history = await api.getUserExams(); 
            // setExams(history);
            // Let's stick to the requested "Simulations" flow
        } catch (err) {
            console.error(err);
        }
    }

    const startSimulation = async () => {
        if (!subject) {
            appToast.error({ title: "Subject Required", description: "Please enter a subject to start." });
            return;
        }

        setGenerating(true);
        try {
            // Use the Simulation endpoint
            const exam = await api.getSimulation(activeTab, subject);
            setCurrentExam(exam);
            setTimeLeft(exam.duration * 60);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setView('exam');
        } catch (err: any) {
            appToast.error({ title: "Simulation Failed", description: err.message || "Could not generate exam." });
        } finally {
            setGenerating(false);
        }
    }

    const startCustomExam = async () => {
        if (activeTab === 'UNIVERSITY' && (!uniName || !courseTitle)) {
             appToast.error({ title: "Details Required", description: "Please enter University and Course Title." });
             return;
        }
        if (activeTab !== 'UNIVERSITY' && !subject) {
            appToast.error({ title: "Subject Required", description: "Please enter a subject." });
            return;
        }

        setGenerating(true);
        try {
            const config = {
                category: activeTab,
                subject: activeTab === 'UNIVERSITY' ? undefined : subject,
                universityName: activeTab === 'UNIVERSITY' ? uniName : undefined,
                courseTitle: activeTab === 'UNIVERSITY' ? courseTitle : undefined,
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
            setGenerating(false);
        }
    }

    const handleAnswer = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
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
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">Exam Center</h1>
                    <p className="text-muted-foreground font-medium mt-2">Select your category and start a simulation.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl">
                    {(['JAMB', 'WAEC', 'JUPEB', 'UNIVERSITY'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-primary text-white shadow-lg' : 'hover:bg-white/5 text-muted-foreground'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Simulation Card */}
                <Card className="glass stagger-card border-primary/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Zap className="text-yellow-400 fill-yellow-400" />
                            Full Simulation
                        </CardTitle>
                        <CardDescription>Timed, standard exam conditions. Great for final prep.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase opacity-60">Subject</label>
                            <Input 
                                placeholder="e.g. Use of English, Mathematics" 
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="bg-white/5 border-white/10 h-12"
                            />
                        </div>
                        <Button 
                            onClick={startSimulation} 
                            disabled={generating}
                            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 mt-4"
                        >
                            {generating ? <Loader2 className="animate-spin" /> : "Start Simulation"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Custom Practice Card */}
                <Card className="glass stagger-card border-white/10 shadow-xl relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Target className="text-blue-400" />
                            Custom Practice
                        </CardTitle>
                        <CardDescription>Short, targeted tests generated by AI.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeTab === 'UNIVERSITY' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase opacity-60">University</label>
                                    <Input 
                                        placeholder="e.g. UNILAG" 
                                        value={uniName}
                                        onChange={e => setUniName(e.target.value)}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase opacity-60">Course Title</label>
                                    <Input 
                                        placeholder="e.g. Intro to Computer Science" 
                                        value={courseTitle}
                                        onChange={e => setCourseTitle(e.target.value)}
                                        className="bg-white/5 border-white/10"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase opacity-60">Topic / Subject</label>
                                <Input 
                                    placeholder="e.g. Organic Chemistry" 
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="bg-white/5 border-white/10"
                                />
                            </div>
                        )}
                        <Button 
                            onClick={startCustomExam} 
                            disabled={generating}
                            variant="outline"
                            className="w-full h-12 text-lg font-bold border-primary/50 text-primary hover:bg-primary/10 mt-4"
                        >
                            {generating ? <Loader2 className="animate-spin" /> : "Generate Practice"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
            
            <div className="stagger-card bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} />
                    Your Recent Performance
                </h3>
                <div className="text-center py-8 opacity-40 italic">
                    Start an exam to see your history here.
                </div>
            </div>
        </div>
    );

    const renderExam = () => (
        <div className="max-w-4xl mx-auto min-h-screen flex flex-col pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 sticky top-4 z-50 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl">
                <div>
                    <h2 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">{currentExam?.subject}</h2>
                    <p className="text-xs font-bold uppercase opacity-60">{activeTab} • Question {currentQuestionIndex + 1} of {currentExam?.questions.length}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl font-mono font-bold text-xl ${timeLeft < 60 ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-primary/10 text-primary'}`}>
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
                <Card className="glass border-white/10 shadow-2xl p-6 md:p-10 rounded-[32px]">
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
                                    ? 'border-primary bg-primary/10 shadow-glow' 
                                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                                    answers[currentQuestionIndex] === option ? 'border-primary bg-primary text-white' : 'border-white/20'
                                }`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="text-lg">{option}</span>
                            </button>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-background/90 backdrop-blur border-t border-white/10 flex justify-center gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="w-32 h-12 rounded-xl font-bold"
                >
                    Previous
                </Button>
                
                {currentQuestionIndex === (currentExam?.questions.length || 0) - 1 ? (
                    <Button 
                        onClick={submitExam}
                        className="w-32 h-12 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white"
                    >
                        Submit
                    </Button>
                ) : (
                    <Button 
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="w-32 h-12 rounded-xl font-bold"
                    >
                        Next
                    </Button>
                )}
            </div>
        </div>
    );

    const renderResult = () => (
        <div className="max-w-2xl mx-auto text-center space-y-8 pt-10">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-40 h-40 mx-auto rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-glow mb-8"
            >
                <div className="text-5xl font-black text-white">{Math.round(score)}%</div>
            </motion.div>

            <h2 className="text-4xl font-bold tracking-tighter">
                {score >= 70 ? "Excellent Work! 🎉" : score >= 50 ? "Good Effort! 👍" : "Keep Practicing! 💪"}
            </h2>
            <p className="text-xl text-muted-foreground">
                You answered {Math.round((score / 100) * (currentExam?.questions.length || 0))} out of {currentExam?.questions.length} questions correctly.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <Card className="p-4 bg-green-500/10 border-green-500/20">
                    <div className="font-bold text-green-500 text-xl">Correct</div>
                    <div className="text-2xl font-black">{Math.round((score / 100) * (currentExam?.questions.length || 0))}</div>
                </Card>
                <Card className="p-4 bg-red-500/10 border-red-500/20">
                    <div className="font-bold text-red-500 text-xl">Incorrect</div>
                    <div className="text-2xl font-black">{(currentExam?.questions.length || 0) - Math.round((score / 100) * (currentExam?.questions.length || 0))}</div>
                </Card>
            </div>

            <Button 
                onClick={() => setView('lobby')}
                className="h-14 px-8 rounded-xl font-bold text-lg bg-white text-black hover:bg-white/90"
            >
                Return to Lobby
            </Button>
        </div>
    );

    return (
        <div ref={containerRef} className="min-h-screen w-full px-4 md:px-8 py-8 pb-32">
            <ErrorBoundary>
                {view === 'lobby' && renderLobby()}
                {view === 'exam' && renderExam()}
                {view === 'result' && renderResult()}
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
