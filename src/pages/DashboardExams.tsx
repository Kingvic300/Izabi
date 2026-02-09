import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, School, Search, Zap, Clock, CheckCircle2, XCircle, ChevronRight, Trophy, Target, Sparkles, Filter, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { api } from "@/lib/apiClient";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const DashboardExams = () => {
  const [activeTab, setActiveTab] = useState<'jamb' | 'university' | 'secondary'>('jamb');
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("ALL");
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".stagger-in", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power4.out"
    });
  }, { scope: containerRef });

  const fetchExams = async () => {
    setLoading(true);
    try {
      const category = activeTab === 'university' ? 'University' : 'Secondary';
      const type = selectedType === "ALL" ? undefined : selectedType;
      const institution = selectedInstitution === "ALL" ? undefined : selectedInstitution;
      
      const response = await api.getExams(category, type, institution);
      setExams(response);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedType("ALL");
    setSelectedInstitution("ALL");
  }, [activeTab]);

  useEffect(() => {
    fetchExams();
  }, [activeTab, selectedType, selectedInstitution]);

  const startExam = (exam: any) => {
    setSelectedExam(exam);
    setAnswers({});
    setIsSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (qIndex: number, option: string) => {
    if (!isSubmitted) {
      setAnswers(prev => ({ ...prev, [qIndex]: option }));
    }
  };

  const submitExam = async () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const total = selectedExam.questions.length;
    const percentage = Math.round((score / total) * 100);

    try {
      await api.submitQuizResult({
        score: percentage,
        totalQuestions: total,
        correctAnswers: score,
        subject: selectedExam.subject || "Examination",
        date: new Date().toISOString()
      });
    } catch (err) {
      console.error("Failed to submit exam result:", err);
    }
  };

  const score = selectedExam ? selectedExam.questions.reduce((acc: number, q: any, i: number) => {
    return acc + (answers[i] === q.answer ? 1 : 0);
  }, 0) : 0;

    return (
        <div ref={containerRef} className="min-h-screen w-full flex flex-col items-center justify-center px-6 lg:px-12 py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-xl blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-xl blur-[120px]" />
            
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl w-full text-center space-y-12 relative z-10"
            >
                <div className="relative inline-block">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl bg-gradient-hero flex items-center justify-center shadow-glow mx-auto mb-10 group hover:scale-105 transition-transform duration-500">
                        <GraduationCap size={80} className="text-white group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <div className="absolute -top-4 -right-4 px-6 py-2 bg-rose-500 text-white text-[12px] font-bold uppercase tracking-[0.2em] rounded-xl shadow-2xl animate-bounce">
                        System Offline
                    </div>
                </div>

                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight text-white mb-4">
                        The <span className="text-gradient">Arena</span> is <br />
                        Under Calibration
                    </h1>
                    <p className="text-muted-foreground font-medium text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
                        We are currently optimizing the neural simulation protocols to provide a more accurate assessment experience. 
                        The Exam Center will be back online shortly.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10">
                    <div className="flex items-center gap-4 glass p-6 rounded-2xl border-white/5 bg-white/[0.02]">
                        <div className="p-4 rounded-xl bg-primary/10 text-primary">
                            <Clock size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Status</p>
                            <p className="text-lg font-bold text-white">Maintenance Mode</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 glass p-6 rounded-2xl border-white/5 bg-white/[0.02]">
                        <div className="p-4 rounded-xl bg-primary/10 text-primary">
                            <Zap size={24} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Estimated Return</p>
                            <p className="text-lg font-bold text-white">Check back later</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12">
                   <Button 
                        onClick={() => window.history.back()}
                        className="h-16 px-10 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all shadow-glow flex items-center gap-3 mx-auto"
                   >
                        <ChevronRight className="rotate-180" size={20} />
                        Return to Command Center
                   </Button>
                </div>
            </motion.div>

            <style>{`
                .shadow-glow {
                    box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
                }
            `}</style>
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
