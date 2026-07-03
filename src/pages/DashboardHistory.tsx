import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/apiClient';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, FileText, Loader2, Sparkles, Trophy } from 'lucide-react';
import HistoryHeader from '@/components/dashboard-history/HistoryHeader';
import HistoryStatsRow from '@/components/dashboard-history/HistoryStatsRow';
import HistorySearchBar from '@/components/dashboard-history/HistorySearchBar';
import HistoryList from '@/components/dashboard-history/HistoryList';
import HistoryDetailModal from '@/components/dashboard-history/HistoryDetailModal';
import { normalizeHistory } from '@/components/dashboard-history/historyUtils';
import type { HistoryType } from '@/components/dashboard-history/historyTypes';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardHistory = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
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
                        api.getChatSessions(),
                    ]);

                const normalized = normalizeHistory(
                    generationsRes,
                    quizResultsRes,
                    notesRes,
                    chatsRes,
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
                (item.summaryText || item.summary || item.content || '')
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesType =
                activeType === 'all' || item.hType === activeType;

            return matchesSearch && matchesType;
        });
    }, [history, searchQuery, activeType]);

    const stats = useMemo(
        () => [
            {
                label: t('history.stat_total_sessions'),
                value: history.length,
                icon: Clock,
                color: 'text-blue-400',
            },
            {
                label: t('history.stat_ai_mentions'),
                value: history.filter((h) => h.hType === 'chat').length,
                icon: Brain,
                color: 'text-purple-400',
            },
            {
                label: t('history.stat_quiz_avg'),
                value: history.filter((h) => h.score).length
                    ? `${Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / history.filter((h) => h.score).length)}%`
                    : '0%',
                icon: Trophy,
                color: 'text-yellow-400',
            },
            {
                label: t('history.stat_notes_saved'),
                value: history.filter((h) => h.hType === 'note').length,
                icon: FileText,
                color: 'text-green-400',
            },
        ],
        [history, t],
    );

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
                    {t('history.gathering')}
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 sm:space-y-12 pb-24 sm:pb-32 px-4 sm:px-6 md:px-8 xl:px-10 pt-6 md:pt-12">
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                        {t('history.eyebrow')}
                    </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            {t('history.title')}
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
                            {t('history.subtitle')}
                        </p>
                    </div>
                    <HistoryHeader
                        activeType={activeType}
                        onTypeChange={setActiveType}
                    />
                </div>
            </div>

            <div className="glass-card border-foreground/10 rounded-[28px] p-4 sm:p-6">
                <HistoryStatsRow stats={stats} />
            </div>

            <div className="glass-card border-foreground/10 rounded-[28px] p-4 sm:p-6 space-y-4">
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                    {t('history.search_filters')}
                </div>
                <HistorySearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            <div className="glass-card border-foreground/10 rounded-[28px] p-2 sm:p-4">
                <HistoryList
                    items={filteredHistory}
                    onSelect={setSelectedItem}
                />
            </div>

            <HistoryDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
                onContinue={() => {
                    setSelectedItem(null);
                    navigate('/dashboard/exams');
                }}
            />
        </div>
    );
};

export default DashboardHistory;
