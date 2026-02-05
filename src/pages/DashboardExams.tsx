import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, School, Search, Zap, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_URL } from "@/contants/contants.ts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import axios from "axios";

const DashboardExams = () => {
  const [activeTab, setActiveTab] = useState<'jamb' | 'university' | 'secondary'>('jamb');
  const [searchQuery, setSearchQuery] = useState("");
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const typeMap = {
        jamb: 'JAMB',
        university: 'UNI-COURSE',
        secondary: 'WAEC'
      };
      const response = await axios.get(`${BASE_URL}/api/exams/past-questions?category=${activeTab === 'university' ? 'University' : 'Secondary'}&type=${typeMap[activeTab]}`);
      setExams(response.data);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [activeTab]);

  const startExam = (exam: any) => {
    setSelectedExam(exam);
    setAnswers({});
    setIsSubmitted(false);
  };

  const handleAnswer = (qIndex: number, option: string) => {
    if (!isSubmitted) {
      setAnswers(prev => ({ ...prev, [qIndex]: option }));
    }
  };

  const submitExam = () => {
    setIsSubmitted(true);
  };

  const score = selectedExam ? selectedExam.questions.reduce((acc: number, q: any, i: number) => {
    return acc + (answers[i] === q.answer ? 1 : 0);
  }, 0) : 0;

  return (
    <div className="space-y-12 w-full pb-20 px-6 lg:px-12 pt-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-4">
          <h1 className="text-6xl font-black tracking-tighter leading-none">
            Exam <span className="text-gradient">Center</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl">
            Simulate JAMB exams and practice with actual past questions from your institution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'jamb', name: 'JAMB Simulation', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { id: 'university', name: 'University Past Questions', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
          { id: 'secondary', name: 'Secondary School (WAEC/NECO)', icon: School, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`h-32 flex flex-col items-center justify-center gap-4 rounded-[32px] glass transition-all border-white/5 hover:scale-[1.02] active:scale-[0.95]
              ${activeTab === tab.id ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] opacity-60'}`}
          >
            <div className={`p-4 rounded-2xl ${tab.bg} ${tab.color}`}>
              <tab.icon size={32} />
            </div>
            <span className="font-black tracking-tight">{tab.name}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-12 space-y-8">
          {!selectedExam ? (
            <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-black">{activeTab.toUpperCase()} Repository</CardTitle>
                  <CardDescription className="text-lg">Select a subject or year to begin simulation</CardDescription>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input 
                    placeholder="Search biology, UNILAG..." 
                    className="pl-12 rounded-full glass border-white/10 h-12 font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-10 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-40">
                    <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full" />
                    <span className="font-black uppercase tracking-widest text-xs">Accessing Database...</span>
                  </div>
                ) : exams.length > 0 ? (
                  exams.map((exam, i) => (
                    <Card key={i} className="glass bg-white/[0.02] border-white/5 p-6 rounded-[24px] hover:bg-white/[0.05] transition-all group cursor-pointer" onClick={() => startExam(exam)}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                          <BookOpen size={20} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{exam.year || '2024'}</span>
                      </div>
                      <h4 className="text-xl font-black mb-2">{exam.title}</h4>
                      <p className="text-sm opacity-60 font-medium mb-4">{exam.subject} • {exam.questions?.length || 0} Questions</p>
                      <Button className="w-full rounded-xl font-black bg-white/5 hover:bg-primary hover:text-white transition-all">Start Simulation</Button>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center opacity-30">
                    <GraduationCap size={64} className="mx-auto mb-4" />
                    <p className="text-xl font-bold">No simulations found for this category yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
              <div className="flex items-center justify-between">
                <Button variant="ghost" className="font-bold opacity-60 hover:opacity-100" onClick={() => setSelectedExam(null)}>
                  ← Back to Repository
                </Button>
                <div className="flex items-center gap-4 glass px-6 py-3 rounded-full border-white/10">
                   <Clock size={16} className="text-primary" />
                   <span className="font-black font-mono">00:45:00</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-6">
                  {selectedExam.questions.map((q: any, i: number) => (
                    <Card key={i} className="glass border-white/5 rounded-[32px] p-8 space-y-6">
                      <div className="flex justify-between items-start gap-6">
                        <div className="space-y-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Question {i+1}</span>
                           <h3 className="text-xl font-black leading-tight">{q.question}</h3>
                        </div>
                        {isSubmitted && (
                          <div className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-2
                            ${answers[i] === q.answer ? 'bg-emerald-500 text-white' : 'bg-destructive text-white'}`}>
                            {answers[i] === q.answer ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {answers[i] === q.answer ? 'Correct' : 'Incorrect'}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {q.options.map((opt: string, idx: number) => {
                          const isSelected = answers[i] === opt;
                          const isCorrect = isSubmitted && opt === q.answer;
                          const isWrong = isSubmitted && isSelected && opt !== q.answer;

                          return (
                            <Button
                              key={idx}
                              onClick={() => handleAnswer(i, opt)}
                              className={`h-auto py-5 px-8 justify-start text-left rounded-2xl transition-all font-bold border border-white/5
                                ${isSelected ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white'}
                                ${isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 !bg-opacity-20' : ''}
                                ${isWrong ? 'bg-destructive/20 border-destructive text-destructive-foreground !bg-opacity-20' : ''}`}
                            >
                                <span className="mr-4 opacity-40 font-black">{String.fromCharCode(65 + idx)}.</span>
                                {opt}
                            </Button>
                          );
                        })}
                      </div>

                      {isSubmitted && q.explanation && (
                        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 block">Insight</span>
                           <p className="text-sm font-medium opacity-80">{q.explanation}</p>
                        </div>
                      )}
                    </Card>
                  ))}
                  
                  {!isSubmitted && (
                    <Button onClick={submitExam} className="w-full h-20 rounded-[32px] bg-primary text-white font-black text-2xl shadow-glow">
                      Submit Simulation
                    </Button>
                  )}
                </div>

                <div className="lg:col-span-4 h-fit sticky top-12">
                   <Card className="glass border-white/10 rounded-[32px] p-8 shadow-2xl">
                      <h3 className="text-xl font-black mb-6">Performance Report</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                           <span className="font-bold opacity-60">Score</span>
                           <span className="text-2xl font-black">{isSubmitted ? `${score} / ${selectedExam.questions.length}` : '—'}</span>
                        </div>
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                           <span className="font-bold opacity-60">Completion</span>
                           <span className="text-2xl font-black font-mono">
                             {Math.round((Object.keys(answers).length / selectedExam.questions.length) * 100)}%
                           </span>
                        </div>
                        {isSubmitted && (
                          <div className={`p-8 rounded-3xl text-center space-y-2
                            ${(score / selectedExam.questions.length) >= 0.7 ? 'bg-emerald-500/20' : 'bg-orange-500/20'}`}>
                             <div className="text-4xl font-black text-white">{Math.round((score/selectedExam.questions.length)*100)}%</div>
                             <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Mastery Yield</div>
                          </div>
                        )}
                        <Button className="w-full h-12 rounded-xl font-black" variant="secondary" onClick={() => setSelectedExam(null)}>
                           Exit Simulation
                        </Button>
                      </div>
                   </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
