import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/apiClient';
import {
    LeaderboardData,
    LeaderboardType,
} from '@/components/dashboard-leaderboard/types';
import { Podium } from '@/components/dashboard-leaderboard/Podium';
import { LeaderboardTable } from '@/components/dashboard-leaderboard/LeaderboardTable';
import { getLeaderboardSocket } from '@/lib/leaderboardSocket';
import { useLanguage } from '@/contexts/LanguageContext';
import { MarketingPage } from '@/components/marketing/MarketingPage';

export default function LeaderboardPublic() {
    const { t } = useLanguage();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
        topStudents: [],
        topStreaks: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [, setActiveTab] = useState<LeaderboardType>('xp');
    const location = useLocation();

    const sharedUserId = useMemo(() => {
        const params = new URLSearchParams(location.search || '');
        return params.get('userId');
    }, [location.search]);

    const fetchLeaderboard = useCallback(async () => {
        try {
            const res = await api.getPublicLeaderboard(sharedUserId);
            if (res.success && res.data) {
                setLeaderboardData(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard', error);
        } finally {
            setIsLoading(false);
        }
    }, [sharedUserId]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    useEffect(() => {
        const socket = getLeaderboardSocket();
        const handleUpdate = () => fetchLeaderboard();
        socket.on('leaderboard:updated', handleUpdate);
        return () => {
            socket.off('leaderboard:updated', handleUpdate);
        };
    }, [fetchLeaderboard]);

    const empty =
        !isLoading &&
        leaderboardData.topStudents.length === 0 &&
        leaderboardData.topStreaks.length === 0;

    return (
        <MarketingPage
            title="Leaderboard"
            intro="Students earn points as they practise. Streaks count the days in a row they studied."
        >
            <section className="page-gutter py-12 sm:py-16">
                <Tabs
                    defaultValue="xp"
                    onValueChange={(v) => setActiveTab(v as LeaderboardType)}
                >
                    <TabsList>
                        <TabsTrigger value="xp" className="px-5">
                            {t('leaderboard.tab_xp')}
                        </TabsTrigger>
                        <TabsTrigger value="streak" className="px-5">
                            {t('leaderboard.tab_streak')}
                        </TabsTrigger>
                    </TabsList>

                    {isLoading ? (
                        <div className="mt-8 h-48 animate-pulse rounded-lg border border-border bg-card" />
                    ) : empty ? (
                        <p className="mt-8 text-muted-foreground">
                            No rankings yet. Be the first on the board.
                        </p>
                    ) : (
                        <>
                            <TabsContent value="xp" className="mt-8 space-y-6">
                                <Podium
                                    users={leaderboardData.topStudents || []}
                                    type="xp"
                                    currentUserId={sharedUserId}
                                />
                                <LeaderboardTable
                                    users={leaderboardData.topStudents || []}
                                    type="xp"
                                    currentUserId={sharedUserId}
                                    title={t('leaderboard.standings_title')}
                                />
                            </TabsContent>
                            <TabsContent value="streak" className="mt-8 space-y-6">
                                <Podium
                                    users={leaderboardData.topStreaks || []}
                                    type="streak"
                                    currentUserId={sharedUserId}
                                />
                                <LeaderboardTable
                                    users={leaderboardData.topStreaks || []}
                                    type="streak"
                                    currentUserId={sharedUserId}
                                    title={t('leaderboard.persistence_title')}
                                />
                            </TabsContent>
                        </>
                    )}
                </Tabs>
            </section>

            <section className="page-gutter border-t border-border py-16 sm:py-20">
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                    <h2 className="text-[1.75rem] sm:text-[2rem]">
                        Want your name on this list?
                    </h2>
                    <Button asChild size="lg">
                        <Link to="/signup">Create a free account</Link>
                    </Button>
                </div>
            </section>
        </MarketingPage>
    );
}
