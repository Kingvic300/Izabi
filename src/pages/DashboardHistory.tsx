import React, { useState, useEffect, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    FileText,
    Calendar,
    Eye,
    Brain,
    HelpCircle,
    BookOpen,
    X,
    Trophy,
    MessageSquare,
    Zap,
    Clock,
    Filter,
    ChevronRight,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type HistoryType = 'all' | 'generation' | 'quiz' | 'note' | 'chat';

const DashboardHistory = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeType, setActiveType] = useState<HistoryType>('all');
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    useEffect(() => {
        const fetchEverything = async () => {
            setLoading(true);
            try {
                const [generationsRes, quizResultsRes, notesRes, chatsRes] =
                    await Promise.all([
                        api.getStudyHistory(),
                        api.getQuizResults(),
                        api.getNotes(),
                        api.getChatHistory(),
                    ]);

                // Normalize: Check if response is raw array or wrapped in { data: ... }
                const getItems = (res: any) => {
                    if (!res) return [];
                    if (Array.isArray(res)) return res;
                    if (res.data && Array.isArray(res.data)) return res.data;
                    if (res.items && Array.isArray(res.items)) return res.items;
                    return [];
                };

                const generations = getItems(generationsRes);
                const quizResults = getItems(quizResultsRes);
                const notes = getItems(notesRes);
                const chats = getItems(chatsRes);

                const normalized = [
                    ...generations.map((g: any) => ({
                        ...g,
                        hType: 'generation',
                        hDate: g.createdAt || g.timestamp || new Date(),
                        title: g.fileName || g.topic || 'Study Material',
                    })),
                    ...quizResults.map((q: any) => ({
                        ...q,
                        hType: 'quiz',
                        hDate: q.date || q.createdAt || new Date(),
                        title: q.quizTitle || q.subject || 'Practice Quiz',
                        // Calculate correct answers if missing
                        correctAnswers:
                            q.correctAnswers ??
                            Math.round(
                                ((q.score || 0) / 100) *
                                    (q.totalQuestions || 0),
                            ),
                    })),
                    ...notes.map((n: any) => ({
                        ...n,
                        hType: 'note',
                        hDate: n.updatedAt || n.createdAt || new Date(),
                        title: n.title || 'Quick Note',
                    })),
                    ...chats.map((c: any) => ({
                        ...c,
                        hType: 'chat',
                        hDate: c.createdAt || new Date(),
                        title: c.message
                            ? c.message.length > 30
                                ? c.message.substring(0, 30) + '...'
                                : c.message
                            : 'AI Conversation',
                    })),
                ].sort(
                    (a, b) =>
                        new Date(b.hDate).getTime() -
                        new Date(a.hDate).getTime(),
                );

                setHistory(normalized);
            } catch (err) {
                console.error('Error fetching history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEverything();
    }, []);

    const filteredHistory = useMemo(() => {
        return history.filter((item) => {
            const matchesSearch =
                (
                    item.fileName ||
                    item.title ||
                    item.subject ||
                    item.message ||
                    ''
                )
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                (item.summary || item.content || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesType =
                activeType === 'all' || item.hType === activeType;

            return matchesSearch && matchesType;
        });
    }, [history, searchQuery, activeType]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'generation':
                return <Brain className="text-purple-400" />;
            case 'quiz':
                return <Trophy className="text-yellow-400" />;
            case 'note':
                return <FileText className="text-blue-400" />;
            case 'chat':
                return <MessageSquare className="text-green-400" />;
            default:
                return <Clock />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    <Sparkles
                        className="absolute -top-2 -right-2 text-yellow-500 animate-pulse"
                        size={20}
                    />
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">
                    Gathering your learning journey...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                        Learning History
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Tracing your path to excellence, one step at a time.
                    </p>
                </div>

                <div className="flex bg-card/5 backdrop-blur-xl border border-foreground/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    {(
                        ['all', 'generation', 'quiz', 'note', 'chat'] as const
                    ).map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveType(type)}
                            className={cn(
                                'px-6 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap',
                                activeType === type
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-foreground/5',
                            )}
                        >
                            {type === 'generation'
                                ? 'AI Study'
                                : type === 'quiz'
                                  ? 'Quizzes'
                                  : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Total Sessions',
                        value: history.length,
                        icon: Clock,
                        color: 'text-blue-400',
                    },
                    {
                        label: 'AI Mentions',
                        value: history.filter((h) => h.hType === 'chat').length,
                        icon: Brain,
                        color: 'text-purple-400',
                    },
                    {
                        label: 'Quiz Avg',
                        value: history.filter((h) => h.score).length
                            ? `${Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / history.filter((h) => h.score).length)}%`
                            : '0%',
                        icon: Trophy,
                        color: 'text-yellow-400',
                    },
                    {
                        label: 'Notes Saved',
                        value: history.filter((h) => h.hType === 'note').length,
                        icon: FileText,
                        color: 'text-green-400',
                    },
                ].map((stat, i) => (
                    <Card
                        key={i}
                        className="glass border-foreground/5 overflow-hidden group"
                    >
                        <CardContent className="p-4 flex items-center gap-4">
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform',
                                    stat.color,
                                )}
                            >
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                                    {stat.label}
                                </p>
                                <p className="text-xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                    size={20}
                />
                <Input
                    placeholder="Search through notes, quiz titles, or AI summaries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 pl-12 bg-card/5 border-foreground/10 rounded-2xl focus-visible:ring-primary/20 text-lg shadow-sm"
                />
            </div>

            {/* History Feed */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredHistory.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card
                                onClick={() => setSelectedItem(item)}
                                className="group glass border-foreground/5 hover:border-primary/20 transition-all cursor-pointer overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:via-primary/[0.02] transition-all" />

                                <CardContent className="p-5 flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                        {getIcon(item.hType)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg truncate uppercase tracking-tight">
                                                {item.title}
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] font-black uppercase opacity-60"
                                            >
                                                {item.hType === 'generation'
                                                    ? 'AI Material'
                                                    : item.hType}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold opacity-40 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={12} />{' '}
                                                {new Date(
                                                    item.hDate,
                                                ).toLocaleDateString()}
                                            </span>
                                            {item.hType === 'generation' && (
                                                <span>
                                                    {item.questions?.length ||
                                                        0}{' '}
                                                    Questions
                                                </span>
                                            )}
                                            {item.hType === 'note' && (
                                                <span>
                                                    {item.content?.length || 0}{' '}
                                                    chars
                                                </span>
                                            )}
                                            {item.hType === 'quiz' && (
                                                <span>
                                                    {item.correctAnswers}/
                                                    {item.totalQuestions}{' '}
                                                    Correct
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {item.score !== undefined && (
                                        <div className="px-6 py-2 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                                            <div className="text-xl font-black text-primary">
                                                {Math.round(item.score)}%
                                            </div>
                                            <div className="text-[10px] uppercase font-black opacity-40">
                                                Score
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-10 h-10 rounded-full border border-foreground/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 bg-card/50">
                                        <ChevronRight size={18} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredHistory.length === 0 && (
                    <div className="text-center py-20 bg-card/5 rounded-[32px] border-2 border-dashed border-foreground/5">
                        <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search
                                className="text-muted-foreground"
                                size={32}
                            />
                        </div>
                        <h3 className="text-xl font-bold">No items found</h3>
                        <p className="text-muted-foreground">
                            Adjust your filters or start a new study session.
                        </p>
                    </div>
                )}
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-card glass border border-foreground/10 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[40px] shadow-2xl relative z-10 flex flex-col"
                        >
                            <div className="p-8 border-b border-foreground/5 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
                                <div>
                                    <Badge className="mb-2 bg-primary text-primary-foreground font-black uppercase tracking-tighter">
                                        {selectedItem.hType}
                                    </Badge>
                                    <h2 className="text-2xl font-black uppercase tracking-tight">
                                        {selectedItem.fileName ||
                                            selectedItem.title ||
                                            selectedItem.subject ||
                                            'Detailed View'}
                                    </h2>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setSelectedItem(null)}
                                    className="rounded-2xl hover:bg-foreground/5"
                                >
                                    <X size={24} />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <div className="space-y-8">
                                    {/* Content based on type */}
                                    {selectedItem.hType === 'generation' && (
                                        <div className="space-y-6">
                                            <div className="bg-primary/5 p-6 rounded-[32px] border border-primary/10">
                                                <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-3">
                                                    <Brain size={14} /> AI
                                                    Summary
                                                </h4>
                                                <p className="text-lg leading-relaxed font-medium opacity-80">
                                                    {selectedItem.summary}
                                                </p>
                                            </div>

                                            {selectedItem.keyPoints?.length >
                                                0 && (
                                                <div className="space-y-4">
                                                    <h4 className="text-xs font-black uppercase tracking-widest opacity-40">
                                                        Key Insights
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {selectedItem.keyPoints.map(
                                                            (
                                                                p: string,
                                                                i: number,
                                                            ) => (
                                                                <div
                                                                    key={i}
                                                                    className="p-4 bg-card/50 border border-foreground/5 rounded-2xl flex gap-3 italic"
                                                                >
                                                                    <Zap
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-yellow-500 shrink-0 mt-1"
                                                                    />
                                                                    <p className="text-sm font-medium">
                                                                        {p}
                                                                    </p>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {selectedItem.hType === 'note' && (
                                        <div className="prose prose-invert max-w-none">
                                            <div className="p-8 bg-card/50 border border-foreground/5 rounded-[32px]">
                                                <p className="whitespace-pre-wrap text-lg leading-relaxed font-medium">
                                                    {selectedItem.content}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.hType === 'quiz' && (
                                        <div className="space-y-6 text-center py-10">
                                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-glow mb-4">
                                                <span className="text-4xl font-black text-primary">
                                                    {Math.round(
                                                        selectedItem.score,
                                                    )}
                                                    %
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold">
                                                    Quiz Performance
                                                </h3>
                                                <p className="text-muted-foreground mt-2">
                                                    You got{' '}
                                                    {
                                                        selectedItem.correctAnswers
                                                    }{' '}
                                                    out of{' '}
                                                    {
                                                        selectedItem.totalQuestions
                                                    }{' '}
                                                    questions right.
                                                </p>
                                            </div>
                                            <div className="flex justify-center gap-4">
                                                <div className="px-6 py-3 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-500 font-bold">
                                                    {
                                                        selectedItem.correctAnswers
                                                    }{' '}
                                                    Correct
                                                </div>
                                                <div className="px-6 py-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 font-bold">
                                                    {selectedItem.totalQuestions -
                                                        selectedItem.correctAnswers}{' '}
                                                    Wrong
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.hType === 'chat' && (
                                        <div className="space-y-6">
                                            <div className="p-6 bg-card/50 border border-foreground/5 rounded-2xl italic">
                                                <p className="text-muted-foreground text-sm font-bold uppercase mb-2">
                                                    You asked:
                                                </p>
                                                <p className="text-xl font-medium">
                                                    "{selectedItem.message}"
                                                </p>
                                            </div>
                                            <div className="p-6 bg-primary/5 border border-primary/10 rounded-[32px]">
                                                <p className="text-primary text-sm font-bold uppercase mb-2">
                                                    Izabi AI replied:
                                                </p>
                                                <p className="text-lg leading-relaxed">
                                                    {selectedItem.response}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-foreground/5 flex justify-end gap-3 bg-card/50">
                                <Button
                                    variant="ghost"
                                    onClick={() => setSelectedItem(null)}
                                    className="rounded-xl font-bold"
                                >
                                    Close View
                                </Button>
                                <Button className="rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                                    Continue Learning
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardHistory;
