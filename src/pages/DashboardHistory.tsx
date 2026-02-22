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

const DashboardHistory = () => {
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
                (item.summary || item.content || '')
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
        ],
        [history],
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
                    Gathering your learning journey...
                </p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 sm:space-y-8 pb-24 sm:pb-32 px-4 sm:px-6">
            <HistoryHeader
                activeType={activeType}
                onTypeChange={setActiveType}
            />

            <HistoryStatsRow stats={stats} />

            <HistorySearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <HistoryList
                items={filteredHistory}
                onSelect={setSelectedItem}
            />

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
