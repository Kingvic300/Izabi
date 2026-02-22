'use client';

import { Target, Loader2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RankTrend } from './RankTrend';
import { LeaderboardData, LeaderboardType } from './types';

interface YourRankCardProps {
    activeTab: LeaderboardType;
    isLoading: boolean;
    isSharing: boolean;
    userRank?: LeaderboardData['userRank'];
    onShare: () => void;
    showShare?: boolean;
}

export const YourRankCard = ({
    activeTab,
    isLoading,
    isSharing,
    userRank,
    onShare,
    showShare = true,
}: YourRankCardProps) => {
    const getRank = () => {
        if (isLoading && !userRank) return <span className="animate-pulse">...</span>;
        
        const rank = activeTab === 'xp' ? userRank?.xp : userRank?.streak;
        const rankChange = activeTab === 'xp' 
            ? Number(userRank?.xpChange) 
            : Number(userRank?.streakChange);

        if (!rank || rank === 'Not Ranked') return '#---';
        if (isNaN(Number(rank))) return rank || '...';
        
        return (
            <>
                #{rank}
                <RankTrend change={rankChange} />
            </>
        );
    };

    return (
        <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
            <div className="p-3 sm:p-4 rounded-2xl bg-card/5 border border-foreground/10 backdrop-blur-md flex items-center gap-3 sm:gap-4 w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Target size={20} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                        Your Rank
                    </p>
                    <p className="text-lg sm:text-xl font-black flex items-center gap-2">
                        {getRank()}
                    </p>
                </div>
            </div>

            {showShare ? (
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onShare}
                    disabled={isSharing || isLoading}
                >
                    {isSharing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Share2 className="h-4 w-4" />
                    )}
                    Share Rank
                </Button>
            ) : null}
        </div>
    );
};
