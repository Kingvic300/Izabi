'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/apiClient';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { LeaderboardData, LeaderboardType } from '@/components/dashboard-leaderboard/types';
import { YourRankCard } from '@/components/dashboard-leaderboard/YourRankCard';
import { Podium } from '@/components/dashboard-leaderboard/Podium';
import { LeaderboardTable } from '@/components/dashboard-leaderboard/LeaderboardTable';
import { ShareRankDialog } from '@/components/dashboard-leaderboard/ShareRankDialog';
import { useLeaderboardShare } from '@/components/dashboard-leaderboard/useLeaderboardShare';
import { getLeaderboardSocket } from '@/lib/leaderboardSocket';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardLeaderboard() {
    const { t } = useLanguage();
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
        topStudents: [],
        topStreaks: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<LeaderboardType>('xp');
    const containerRef = useRef(null);
    const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const userRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    const isAdmin = (userRole || '').trim().toUpperCase() === 'ADMIN';
    
    const {
        isSharing,
        isShareModalOpen,
        sharePayload,
        setIsShareModalOpen,
        handleShare,
        handleCopyShare,
    } = useLeaderboardShare();

    const fetchLeaderboard = useCallback(async () => {
        try {
            const res = await api.getLeaderboard();
            if (res.success && res.data) {
                setLeaderboardData(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    useEffect(() => {
        const socket = getLeaderboardSocket();
        const handleUpdate = () => {
            fetchLeaderboard();
        };
        socket.on('leaderboard:updated', handleUpdate);
        return () => {
            socket.off('leaderboard:updated', handleUpdate);
        };
    }, [fetchLeaderboard]);


    return (
        <div
            ref={containerRef}
            className="w-full space-y-10 pb-16"
        >
            {!isAdmin ? (
                <ShareRankDialog
                    open={isShareModalOpen}
                    onOpenChange={setIsShareModalOpen}
                    sharePayload={sharePayload}
                    onCopy={handleCopyShare}
                />
            ) : null}

            <PageHeader
                title={t('leaderboard.eyebrow')}
                description={t('leaderboard.subtitle')}
                actions={
                    <YourRankCard
                        activeTab={activeTab}
                        isLoading={isLoading}
                        isSharing={isSharing}
                        userRank={leaderboardData.userRank}
                        onShare={() => handleShare(activeTab)}
                        showShare={!isAdmin}
                    />
                }
            />

            <Tabs
                defaultValue="xp"
                className="w-full"
                onValueChange={(value) => setActiveTab(value as LeaderboardType)}
            >
                <TabsList>
                    <TabsTrigger value="xp" className="px-5">
                        {t('leaderboard.tab_xp')}
                    </TabsTrigger>
                    <TabsTrigger value="streak" className="px-5">
                        {t('leaderboard.tab_streak')}
                    </TabsTrigger>
                </TabsList>

                {!isLoading &&
                    (leaderboardData.topStudents?.length ?? 0) === 0 &&
                    (leaderboardData.topStreaks?.length ?? 0) === 0 && (
                        <div className="mt-6 rounded-lg border border-dashed border-sheet/45 px-6 py-10">
                            <p className="font-display text-xl">No rankings yet</p>
                            <p className="mt-1 text-muted-foreground">
                                Finish a quiz or answer today’s Brain Drop to get on the board.
                            </p>
                        </div>
                    )}

                <TabsContent value="xp" className="mt-6 space-y-6">
                    <Podium
                        users={leaderboardData.topStudents || []}
                        type="xp"
                        currentUserId={currentUserId}
                    />
                    <LeaderboardTable
                        users={leaderboardData.topStudents || []}
                        type="xp"
                        currentUserId={currentUserId}
                        title={t('leaderboard.standings_title')}
                    />
                </TabsContent>

                <TabsContent value="streak" className="mt-6 space-y-6">
                    <Podium
                        users={leaderboardData.topStreaks || []}
                        type="streak"
                        currentUserId={currentUserId}
                    />
                    <LeaderboardTable
                        users={leaderboardData.topStreaks || []}
                        type="streak"
                        currentUserId={currentUserId}
                        title={t('leaderboard.persistence_title')}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
