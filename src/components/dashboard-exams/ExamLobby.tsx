'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    FileText,
    Loader2,
    Play,
    Trophy,
    Upload,
    Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type ExamTab = 'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY';

type ExamLobbyProps = {
    activeTab: ExamTab;
    onTabChange: (tab: ExamTab) => void;
    showResume: boolean;
    onResume: () => void;
    simSubject: string;
    simUniName: string;
    simCourseTitle: string;
    onSimSubjectChange: (value: string) => void;
    onSimUniNameChange: (value: string) => void;
    onSimCourseTitleChange: (value: string) => void;
    onStartSimulation: () => void;
    isSimulating: boolean;
    selectedFile: File | null;
    onSelectFile: (file: File | null) => void;
    onStartNotePractice: () => void;
    isNotePracticing: boolean;
    recentResults: any[];
    onSelectResult: (result: any) => void;
};

export default function ExamLobby({
    activeTab,
    onTabChange,
    showResume,
    onResume,
    simSubject,
    simUniName,
    simCourseTitle,
    onSimSubjectChange,
    onSimUniNameChange,
    onSimCourseTitleChange,
    onStartSimulation,
    isSimulating,
    selectedFile,
    onSelectFile,
    onStartNotePractice,
    isNotePracticing,
    recentResults,
    onSelectResult,
}: ExamLobbyProps) {
    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tighter mb-2 italic">
                        Exam{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                            Center
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-base sm:text-lg lg:text-xl font-medium">
                        Select your category and start a professional
                        simulation.
                    </p>
                </div>

                {showResume && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/10 border border-primary/20 p-4 rounded-3xl flex items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-4 px-2">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse border border-primary/30">
                                <Play
                                    className="text-primary fill-primary"
                                    size={20}
                                />
                            </div>
                            <div>
                                <p className="font-bold text-sm">
                                    Ongoing Session
                                </p>
                                <p className="text-[10px] uppercase font-black tracking-widest opacity-40">
                                    Ready to resume
                                </p>
                            </div>
                        </div>
                        <Button
                            onClick={onResume}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs px-8 h-12 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            Resume Now
                        </Button>
                    </motion.div>
                )}

                <div className="flex bg-card/20 p-1.5 rounded-3xl backdrop-blur-xl border border-foreground/5 shadow-inner overflow-x-auto scrollbar-hide max-w-full w-full md:w-auto">
                    {(['JAMB', 'WAEC', 'JUPEB', 'UNIVERSITY'] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                onClick={() => onTabChange(tab)}
                                className={cn(
                                    'px-5 sm:px-8 py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-[0.15em] sm:tracking-[0.2em] whitespace-nowrap',
                                    activeTab === tab
                                        ? 'bg-primary text-primary-foreground shadow-2xl flex items-center gap-2'
                                        : 'hover:bg-foreground/5 text-muted-foreground',
                                )}
                            >
                                {activeTab === tab && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                )}
                                {tab}
                            </button>
                        ),
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {/* Simulation Card */}
                <Card className="glass-card stagger-card border-primary/20 shadow-2xl relative overflow-hidden group rounded-[40px]">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="relative z-10 p-5 sm:p-8">
                        <CardTitle className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-black italic tracking-tighter">
                            <div className="p-3 rounded-2xl bg-primary/20 text-primary shadow-inner">
                                <Zap className="fill-primary" size={24} />
                            </div>
                            Full <span className="text-primary">Sim</span>
                        </CardTitle>
                        <CardDescription className="text-base font-medium opacity-70">
                            Timed, standard exam conditions for final prep.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-20 p-5 sm:p-8 pt-0">
                        <div className="space-y-4">
                            {activeTab === 'UNIVERSITY' ? (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">
                                            University
                                        </label>
                                        <Input
                                            placeholder="e.g. UNILAG"
                                            value={simUniName}
                                            onChange={(e) =>
                                                onSimUniNameChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-background/50 border-foreground/10 h-14 rounded-2xl focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">
                                            Course Title
                                        </label>
                                        <Input
                                            placeholder="e.g. Intro to Computer Science"
                                            value={simCourseTitle}
                                            onChange={(e) =>
                                                onSimCourseTitleChange(
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-background/50 border-foreground/10 h-14 rounded-2xl focus:ring-primary/20"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">
                                        Subject
                                    </label>
                                    <Input
                                        id="sim-subject-input"
                                        type="text"
                                        placeholder="e.g. Use of English, Mathematics"
                                        value={simSubject}
                                        onChange={(e) =>
                                            onSimSubjectChange(e.target.value)
                                        }
                                        className="bg-background/50 border-foreground/10 h-14 rounded-2xl shadow-sm focus:border-primary/50 text-lg font-bold"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>
                        <Button
                            onClick={onStartSimulation}
                            disabled={isSimulating}
                            className="w-full h-14 sm:h-16 text-base sm:text-lg font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-primary hover:bg-primary/90 text-primary-foreground mt-4 relative z-30 shadow-2xl shadow-primary/20 active:scale-95 transition-all rounded-[20px]"
                        >
                            {isSimulating ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Start Exam'
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Note Practice Card */}
                <Card className="glass-card stagger-card border-blue-600/20 shadow-2xl relative overflow-hidden group rounded-[40px]">
                    <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <CardHeader className="relative z-10 p-5 sm:p-8">
                        <CardTitle className="flex items-center gap-3 sm:gap-4 text-2xl sm:text-3xl font-black italic tracking-tighter">
                            <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-600 shadow-inner">
                                <FileText size={24} />
                            </div>
                            Notes{' '}
                            <span className="text-blue-600">Practice</span>
                        </CardTitle>
                        <CardDescription className="text-base font-medium opacity-70">
                            Upload PDF notes to practice on your own material.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-20 p-5 sm:p-8 pt-0">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">
                                Upload PDF
                            </label>
                            <div className="border-2 border-dashed border-foreground/10 rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-600/50 transition-all cursor-pointer relative bg-background/50 group/upload hover:bg-blue-600/5">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        onSelectFile(
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {selectedFile ? (
                                    <div className="text-center">
                                        <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-2 text-blue-600">
                                            <FileText size={20} />
                                        </div>
                                        <p className="text-xs font-bold text-blue-600 truncate max-w-[170px] sm:max-w-[200px]">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">
                                            Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                                            <Upload
                                                size={24}
                                                className="text-muted-foreground group-hover/upload:text-blue-600 transition-colors"
                                            />
                                        </div>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                                            Select Research Notes
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={onStartNotePractice}
                            disabled={isNotePracticing || !selectedFile}
                            className="w-full h-14 sm:h-16 text-base sm:text-lg font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-blue-700 hover:bg-blue-600 text-white mt-4 relative z-30 shadow-2xl shadow-blue-700/20 active:scale-95 transition-all rounded-[20px]"
                        >
                            {isNotePracticing ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Start Note Exam'
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="stagger-card glass-card rounded-[24px] sm:rounded-[40px] p-5 sm:p-10 border border-foreground/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                    <Trophy size={200} />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10 relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-black flex items-center gap-3 sm:gap-4 tracking-tighter italic">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                            <Trophy size={28} />
                        </div>
                        RECENT{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent underline decoration-blue-500/30">
                            STATS
                        </span>
                    </h3>
                    <Button
                        variant="ghost"
                        onClick={() =>
                            (window.location.href = '/dashboard/history')
                        }
                        className="h-12 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:bg-foreground/5 transition-all"
                    >
                        Historical Data{' '}
                        <ChevronRight size={14} className="ml-2" />
                    </Button>
                </div>

                <div className="relative z-10">
                    {recentResults.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {recentResults.map((res, i) => (
                                <button
                                    key={i}
                                    onClick={() => onSelectResult(res)}
                                    className="flex items-center justify-between p-6 bg-card/40 rounded-[24px] border border-foreground/5 hover:border-primary/20 transition-all group/stat hover:translate-x-1 cursor-pointer text-left w-full"
                                >
                                    <div className="flex items-center gap-5">
                                        <div
                                            className={cn(
                                                'w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-2xl shadow-inner',
                                                res.score >= 70
                                                    ? 'bg-blue-500/10 text-blue-500'
                                                    : res.score >= 45
                                                      ? 'bg-blue-400/10 text-blue-400'
                                                      : 'bg-destructive/10 text-destructive',
                                            )}
                                        >
                                            {Math.round(res.score)}
                                            <span className="text-xs opacity-60 ml-0.5">
                                                %
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-black text-base sm:text-lg uppercase tracking-tight truncate max-w-[170px] sm:max-w-[200px] mb-1">
                                                {res.subject}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-[10px] font-black opacity-30 uppercase tracking-widest bg-foreground/5 px-2 py-1 rounded-md">
                                                    <Calendar size={10} />{' '}
                                                    {new Date(
                                                        res.date,
                                                    ).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-black opacity-30 uppercase tracking-widest bg-blue-500/5 text-blue-500/60 px-2 py-1 rounded-md">
                                                    <CheckCircle2 size={10} />{' '}
                                                    {res.correctAnswers}/
                                                    {res.totalQuestions}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary opacity-0 group-hover/stat:opacity-100 transition-all flex items-center justify-center group-hover/stat:bg-primary group-hover/stat:text-white">
                                        <ChevronRight size={20} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-background/40 rounded-[32px] border border-dashed border-foreground/10">
                            <div className="w-20 h-20 rounded-3xl bg-foreground/5 flex items-center justify-center mx-auto mb-6">
                                <Clock
                                    size={40}
                                    className="text-muted-foreground opacity-30"
                                />
                            </div>
                            <h4 className="text-xl font-black uppercase tracking-widest opacity-20">
                                Archive Empty
                            </h4>
                            <p className="text-sm opacity-40 mt-2 max-w-xs mx-auto font-medium leading-relaxed">
                                Complete your first simulation to begin tracking
                                your neural improvement.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
