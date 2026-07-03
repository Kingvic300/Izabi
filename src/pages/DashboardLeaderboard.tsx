'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Flame, Zap, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
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

    useGSAP(() => {
        if (!isLoading) {
            gsap.from('.leaderboard-item', {
                y: 20,
                opacity: 1,
                duration: 0.4,
                stagger: 0.02,
                ease: 'power2.out',
                clearProps: 'opacity',
            });
        }
    }, [isLoading, activeTab]);

    return (
        <div
            ref={containerRef}
            className="space-y-8 md:space-y-12 pb-20 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 md:pt-12"
        >
            {!isAdmin ? (
                <ShareRankDialog
                    open={isShareModalOpen}
                    onOpenChange={setIsShareModalOpen}
                    sharePayload={sharePayload}
                    onCopy={handleCopyShare}
                />
            ) : null}

            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                        {t('leaderboard.eyebrow')}
                    </span>
                </div>
                <header className="glass-card border-foreground/10 rounded-[28px] p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Badge
                            variant="outline"
                            className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold text-[10px] tracking-widest uppercase mb-1"
                        >
                            {t('leaderboard.badge')}
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-none">
                            {t('leaderboard.title_top')}{' '}
                            <span className="text-gradient">
                                {t('leaderboard.title_gradient')}
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base font-medium max-w-none">
                            {t('leaderboard.subtitle')}
                        </p>
                    </div>

                    <YourRankCard
                        activeTab={activeTab}
                        isLoading={isLoading}
                        isSharing={isSharing}
                        userRank={leaderboardData.userRank}
                        onShare={() => handleShare(activeTab)}
                        showShare={!isAdmin}
                    />
                </header>
            </div>

            <div className="glass-card border-foreground/10 rounded-[28px] p-4 sm:p-6">
                <Tabs
                    defaultValue="xp"
                    className="w-full"
                    onValueChange={(value) =>
                        setActiveTab(value as LeaderboardType)
                    }
                >
                    <div className="flex justify-center mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
                        <TabsList className="bg-card/5 border border-foreground/10 p-1 rounded-full h-12 sm:h-14">
                            <TabsTrigger
                                value="xp"
                                className="rounded-full px-4 sm:px-8 h-full font-bold uppercase text-[10px] sm:text-xs tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
                            >
                                <Zap
                                    size={14}
                                    className="sm:w-4 sm:h-4"
                                />{' '}
                                {t('leaderboard.tab_xp')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="streak"
                                className="rounded-full px-4 sm:px-8 h-full font-bold uppercase text-[10px] sm:text-xs tracking-wider data-[state=active]:bg-orange-500 data-[state=active]:text-foreground transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
                            >
                                <Flame
                                    size={14}
                                    className="sm:w-4 sm:h-4"
                                />{' '}
                                {t('leaderboard.tab_streak')}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="xp" className="space-y-6 sm:space-y-10">
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
                            icon={
                                <Trophy
                                    className="text-primary sm:w-5 sm:h-5"
                                    size={18}
                                />
                            }
                        />
                    </TabsContent>

                    <TabsContent
                        value="streak"
                        className="space-y-6 sm:space-y-10"
                    >
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
                            icon={
                                <Flame
                                    className="text-orange-500 sm:w-5 sm:h-5"
                                    size={18}
                                />
                            }
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
