import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/apiClient';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, FileText, Trophy } from 'lucide-react';
import HistoryHeader from '@/components/dashboard-history/HistoryHeader';
import HistoryStatsRow from '@/components/dashboard-history/HistoryStatsRow';
import HistorySearchBar from '@/components/dashboard-history/HistorySearchBar';
import HistoryList from '@/components/dashboard-history/HistoryList';
import HistoryDetailModal from '@/components/dashboard-history/HistoryDetailModal';
import { normalizeHistory } from '@/components/dashboard-history/historyUtils';
import type { HistoryType } from '@/components/dashboard-history/historyTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { PageLoader } from '@/components/PageLoader';

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
                color: 'text-learning-blue',
            },
            {
                label: t('history.stat_ai_mentions'),
                value: history.filter((h) => h.hType === 'chat').length,
                icon: Brain,
                color: 'text-learning-purple',
            },
            {
                label: t('history.stat_quiz_avg'),
                value: history.filter((h) => h.score).length
                    ? `${Math.round(history.reduce((acc, h) => acc + (h.score || 0), 0) / history.filter((h) => h.score).length)}%`
                    : '0%',
                icon: Trophy,
                color: 'text-urgent',
            },
            {
                label: t('history.stat_notes_saved'),
                value: history.filter((h) => h.hType === 'note').length,
                icon: FileText,
                color: 'text-reward',
            },
        ],
        [history, t],
    );

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title={t('history.title')}
                    description={t('history.subtitle')}
                />
                <PageLoader variant="skeleton-cards" itemCount={3} text={t('history.gathering')} />
            </div>
        );
    }

    return (
        <div className="w-full space-y-10 pb-16">
            <PageHeader
                title={t('history.title')}
                description={t('history.subtitle')}
            />

            <HistoryStatsRow stats={stats} />

            <section className="space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="w-full lg:max-w-md">
                        <HistorySearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />
                    </div>
                    <HistoryHeader
                        activeType={activeType}
                        onTypeChange={setActiveType}
                    />
                </div>
                <HistoryList
                    items={filteredHistory}
                    onSelect={setSelectedItem}
                />
            </section>

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
