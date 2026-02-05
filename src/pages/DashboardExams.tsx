import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, School, Search, Zap, Clock, CheckCircle2, XCircle, ChevronRight, Trophy, Target, Sparkles, Filter, LayoutGrid } from "lucide-react";
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

  const submitExam = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const score = selectedExam ? selectedExam.questions.reduce((acc: number, q: any, i: number) => {
    return acc + (answers[i] === q.answer ? 1 : 0);
  }, 0) : 0;

  return (
    <div ref={containerRef} className="min-h-screen w-full pb-20 px-6 lg:px-12 pt-12 space-y-16">
      {/* Hero Section */}
      {!selectedExam && (
        <div className="relative space-y-8 stagger-in">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
                <Target size={14} />
                <span>Simulation Protocol Active</span>
              </div>
              <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                Master the <br />
                <span className="text-gradient">Arena</span>
              </h1>
              <p className="text-muted-foreground font-medium text-xl max-w-2xl leading-relaxed">
                Step into the high-frequency learning simulator. Practice with actual legacy documents 
                and verify your neural retention before the real deployment.
              </p>
            </div>
            
            <div className="flex gap-4">
               <div className="p-6 rounded-[32px] glass border-white/5 flex flex-col items-center gap-2">
                  <div className="text-3xl font-black">{exams.length}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Simulations</div>
               </div>
               <div className="p-6 rounded-[32px] glass border-white/5 flex flex-col items-center gap-2">
                  <div className="text-3xl font-black text-primary">24h</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Availability</div>
               </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {[
              { id: 'jamb', name: 'UTME Simulation', desc: 'Joint Admissions Terminal', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
              { id: 'university', name: 'University Node', desc: 'Institutional Coursework', icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
              { id: 'secondary', name: 'SSCE Terminal', desc: 'WAEC / NECO / GCE', icon: School, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`h-40 flex flex-col items-start p-8 justify-center gap-3 rounded-[32px] glass transition-all border-white/5 hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden
                  ${activeTab === tab.id ? 'bg-white/10 border-white/20' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
              >
                <div className={`p-4 rounded-2xl ${tab.bg} ${tab.color} group-hover:scale-110 transition-transform`}>
                  <tab.icon size={28} />
                </div>
                <div>
                  <div className="font-black text-xl tracking-tight text-white">{tab.name}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-40">{tab.desc}</div>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute top-4 right-4 text-primary">
                    <Sparkles size={20} className="animate-pulse" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Main Repository / Focus Mode */}
      <div className="relative">
        {!selectedExam ? (
          <div className="space-y-10 stagger-in">
            {/* Filter Bar */}
            <Card className="glass border-white/5 rounded-[32px] overflow-hidden shadow-2xl p-8">
              <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                    <div className="relative flex-1 md:min-w-[300px]">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <Input 
                        placeholder={`Search ${activeTab} subjects...`} 
                        className="pl-14 rounded-2xl glass border-white/10 h-14 font-bold text-lg focus:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 w-full xl:w-auto">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-foreground/5 text-foreground/40"><Filter size={18} /></div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-[180px] h-14 rounded-2xl glass border-white/10 font-bold text-sm">
                        <SelectValue placeholder="Protocol" />
                      </SelectTrigger>
                      <SelectContent className="glass border-white/10 font-bold">
                        <SelectItem value="ALL">All Protocols</SelectItem>
                        {activeTab === 'secondary' ? (
                          <>
                            <SelectItem value="WAEC">WAEC (SSCE)</SelectItem>
                            <SelectItem value="NECO">NECO (SSCE)</SelectItem>
                            <SelectItem value="GCE">GCE</SelectItem>
                          </>
                        ) : activeTab === 'university' ? (
                          <>
                            <SelectItem value="POST-UTME">Post-UTME</SelectItem>
                            <SelectItem value="UNI-COURSE">Semester Exams</SelectItem>
                          </>
                        ) : (
                          <SelectItem value="JAMB">UTME (JAMB)</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {activeTab === 'university' && (
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-foreground/5 text-foreground/40"><LayoutGrid size={18} /></div>
                      <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                        <SelectTrigger className="w-[180px] h-14 rounded-2xl glass border-white/10 font-bold text-sm">
                          <SelectValue placeholder="Terminal" />
                        </SelectTrigger>
                        <SelectContent className="glass border-white/10 font-bold">
                          <SelectItem value="ALL">All Terminals</SelectItem>
                          <SelectItem value="UNILAG">UNILAG</SelectItem>
                          <SelectItem value="UI">UI (Ibadan)</SelectItem>
                          <SelectItem value="OAU">OAU (Ife)</SelectItem>
                          <SelectItem value="UNIBEN">UNIBEN</SelectItem>
                          <SelectItem value="UNN">UNN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full py-40 flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="animate-spin h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap className="text-primary animate-pulse" size={24} />
                    </div>
                  </div>
                  <span className="font-black uppercase tracking-[0.3em] text-xs opacity-40">Syncing Simulation Data...</span>
                </div>
              ) : exams.length > 0 ? (
                exams.map((exam, i) => (
                  <Card 
                    key={i} 
                    className="group relative glass bg-transparent border-white/5 p-8 rounded-[40px] hover:border-primary/20 transition-all duration-500 cursor-pointer overflow-hidden"
                    onClick={() => startExam(exam)}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    
                    <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="p-4 rounded-[24px] bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-primary/40">
                          <BookOpen size={24} />
                        </div>
                        <div className="px-4 py-2 rounded-full glass border-white/5 text-[10px] font-black uppercase tracking-widest opacity-40">
                          {exam.year || '2024'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-2xl font-black mb-2 tracking-tight line-clamp-2">{exam.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-4">
                           <span className="px-3 py-1 rounded-lg bg-foreground/5 text-[10px] font-black uppercase tracking-widest opacity-60">
                             {exam.subject}
                           </span>
                           <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                             {exam.questions?.length || 0} Questions
                           </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest bg-white/[0.02] border border-white/5 hover:bg-primary hover:text-white hover:border-transparent transition-all flex items-center justify-center gap-3">
                          Enter Simulator
                          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-32 text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-foreground/5 flex items-center justify-center mx-auto">
                    <GraduationCap size={40} className="opacity-20" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-black">No Simulations Detected</p>
                    <p className="text-muted-foreground font-medium">Try recalibrating your search or changing the protocol.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5">
            {/* Simulator Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-white/5">
              <div className="flex items-center gap-6">
                <Button 
                  variant="ghost" 
                  className="h-14 w-14 rounded-2xl glass hover:bg-white/10"
                  onClick={() => setSelectedExam(null)}
                >
                  <ChevronRight className="rotate-180" size={24} />
                </Button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase">
                       {selectedExam.type} Simulator
                    </span>
                    {selectedExam.institution && (
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-black tracking-widest uppercase">
                         {selectedExam.institution}
                      </span>
                    )}
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">{selectedExam.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-[24px] glass border-white/10 shadow-xl">
                 <div className="p-3 rounded-xl bg-primary/10 text-primary"><Clock size={20} /></div>
                 <div className="text-2xl font-black font-mono tracking-wider tabular-nums">00:45:00</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
              <div className="xl:col-span-8 space-y-8">
                {selectedExam.questions.map((q: any, i: number) => (
                  <Card key={i} className={`relative glass border-white/5 rounded-[40px] p-10 space-y-10 transition-all duration-500 
                    ${answers[i] ? 'border-primary/20 bg-primary/[0.02]' : ''}`}>
                    <div className="flex justify-between items-start gap-8">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center text-xs font-black">
                               {i+1}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">System Inquiry</span>
                         </div>
                         <h3 className="text-2xl font-black leading-tight text-white/90">{q.question}</h3>
                      </div>
                      
                      {isSubmitted && (
                        <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-lg
                          ${answers[i] === q.answer ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                          {answers[i] === q.answer ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
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
                            className={`h-auto py-6 px-10 justify-start text-left rounded-3xl transition-all duration-500 font-bold border-2
                              ${isSelected 
                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 translate-x-1' 
                                : 'bg-white/[0.02] border-white/5 hover:bg-white/5 text-white/70 hover:text-white'}
                              ${isCorrect ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20 !opacity-100 !translate-x-1' : ''}
                              ${isWrong ? 'bg-rose-500 border-rose-500 text-white shadow-rose-500/20 !opacity-100' : ''}
                              ${isSubmitted && !isCorrect && !isWrong ? 'opacity-30' : ''}
                            `}
                          >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-6 font-black transition-colors
                                ${isSelected ? 'bg-white/20' : 'bg-foreground/5'}`}>
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-lg">{opt}</span>
                          </Button>
                        );
                      })}
                    </div>

                    {isSubmitted && q.explanation && (
                      <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 animate-in fade-in slide-in-from-top-4">
                         <div className="flex items-center gap-3 mb-4">
                            <Trophy size={18} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Neural Insight</span>
                         </div>
                         <p className="text-lg font-medium text-white/70 leading-relaxed italic">
                           "{q.explanation}"
                         </p>
                      </div>
                    )}
                  </Card>
                ))}
                
                {!isSubmitted && (
                  <Button 
                    onClick={submitExam} 
                    className="w-full h-24 rounded-[40px] bg-gradient-hero text-white font-black text-2xl shadow-glow hover:scale-[1.01] active:scale-[0.99] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      Terminate Protocol & Submit
                      <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Button>
                )}
              </div>

              {/* Progress Sidebar */}
              <div className="xl:col-span-4 h-fit sticky top-12 space-y-8">
                 <Card className="glass border-white/10 rounded-[40px] p-10 shadow-2xl space-y-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                    
                    <div>
                      <h3 className="text-2xl font-black mb-2">Simulation Stats</h3>
                      <p className="text-xs uppercase font-black tracking-[0.2em] opacity-40">Live Synchronization</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Questions</div>
                        <div className="text-3xl font-black">{selectedExam.questions.length}</div>
                      </div>
                      <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Completion</div>
                        <div className="text-3xl font-black text-primary">
                           {Math.round((Object.keys(answers).length / selectedExam.questions.length) * 100)}%
                        </div>
                      </div>
                    </div>

                    {isSubmitted ? (
                      <div className="space-y-8">
                        <div className="relative h-48 w-48 mx-auto">
                           <svg className="w-full h-full" viewBox="0 0 100 100">
                              <circle 
                                className="text-foreground/5 stroke-current" 
                                strokeWidth="8" 
                                cx="50" cy="50" r="40" fill="transparent" 
                              />
                              <circle 
                                className="text-primary stroke-current transition-all duration-1000 ease-out" 
                                strokeWidth="8" 
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * (score / selectedExam.questions.length))}
                                strokeLinecap="round" 
                                cx="50" cy="50" r="40" fill="transparent" 
                              />
                           </svg>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <div className="text-5xl font-black">{score}</div>
                              <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Correct</div>
                           </div>
                        </div>

                        <div className={`p-8 rounded-[32px] text-center space-y-2 transition-all duration-1000
                          ${(score / selectedExam.questions.length) >= 0.7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                           <div className="text-4xl font-black">{Math.round((score/selectedExam.questions.length)*100)}%</div>
                           <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Mastery Yield</div>
                        </div>

                        <Button 
                          className="w-full h-14 rounded-2xl font-black bg-white hover:bg-white/90 text-black transition-all" 
                          onClick={() => setSelectedExam(null)}
                        >
                           Exit Arena
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 rounded-3xl glass border-primary/20 bg-primary/5 text-center">
                            <Zap size={24} className="mx-auto mb-3 text-primary animate-bounce" />
                            <p className="text-sm font-bold text-primary/80">Stay focused, Scholar. Every question counts toward your neural profile.</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full h-14 rounded-2xl font-black opacity-60 hover:opacity-100" 
                          onClick={() => setSelectedExam(null)}
                        >
                           Abandon Simulator
                        </Button>
                      </div>
                    )}
                 </Card>
              </div>
            </div>
          </div>
        )}
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
