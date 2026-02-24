'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Trophy, Flame, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    LeaderboardData,
    LeaderboardType,
} from '@/components/dashboard-leaderboard/types';
import { Podium } from '@/components/dashboard-leaderboard/Podium';
import { LeaderboardTable } from '@/components/dashboard-leaderboard/LeaderboardTable';
import { useLocation } from 'react-router-dom';

export default function LeaderboardPublic() {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>({
        topStudents: [],
        topStreaks: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<LeaderboardType>('xp');
    const containerRef = useRef(null);
    const location = useLocation();

    const sharedUserId = useMemo(() => {
        const params = new URLSearchParams(location.search || '');
        return params.get('userId');
    }, [location.search]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
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
        };
        fetchLeaderboard();
    }, [sharedUserId]);

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
            className="space-y-6 md:space-y-8 pb-20 w-full max-w-none mx-auto px-4 sm:px-6 md:px-10 lg:px-14 pt-6 md:pt-10"
        >
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-6 border-b border-foreground/5">
                <div className="space-y-2">
                    <Badge
                        variant="outline"
                        className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold text-[10px] tracking-widest uppercase mb-1"
                    >
                        Global Rankings
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-none">
                        Hall of <span className="text-gradient">Fame</span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base font-medium max-w-lg">
                        See where you stand among the top scholars. Compete for
                        XP or maintain your daily study consistency.
                    </p>
                </div>
            </header>

            <Tabs
                defaultValue="xp"
                className="w-full"
                onValueChange={(value) => setActiveTab(value as LeaderboardType)}
            >
                <div className="flex justify-center mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
                    <TabsList className="bg-card/5 border border-foreground/10 p-1 rounded-full h-12 sm:h-14">
                        <TabsTrigger
                            value="xp"
                            className="rounded-full px-4 sm:px-8 h-full font-bold uppercase text-[10px] sm:text-xs tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <Zap size={14} className="sm:w-4 sm:h-4" /> Total XP
                        </TabsTrigger>
                        <TabsTrigger
                            value="streak"
                            className="rounded-full px-4 sm:px-8 h-full font-bold uppercase text-[10px] sm:text-xs tracking-wider data-[state=active]:bg-orange-500 data-[state=active]:text-foreground transition-all gap-1.5 sm:gap-2 whitespace-nowrap"
                        >
                            <Flame size={14} className="sm:w-4 sm:h-4" /> Top
                            Streaks
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="xp" className="space-y-6 sm:space-y-10">
                    <Podium
                        users={leaderboardData.topStudents || []}
                        type="xp"
                        currentUserId={sharedUserId}
                    />

                    <LeaderboardTable
                        users={leaderboardData.topStudents || []}
                        type="xp"
                        currentUserId={sharedUserId}
                        title="Leaderboard Standings"
                        icon={
                            <Trophy
                                className="text-primary sm:w-5 sm:h-5"
                                size={18}
                            />
                        }
                    />
                </TabsContent>

                <TabsContent value="streak" className="space-y-6 sm:space-y-10">
                    <Podium
                        users={leaderboardData.topStreaks || []}
                        type="streak"
                        currentUserId={sharedUserId}
                    />

                    <LeaderboardTable
                        users={leaderboardData.topStreaks || []}
                        type="streak"
                        currentUserId={sharedUserId}
                        title="Persistence Rankings"
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
    );
}
