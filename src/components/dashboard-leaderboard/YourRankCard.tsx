'use client';

import { Loader2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RankTrend } from './RankTrend';
import { LeaderboardData, LeaderboardType } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

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
    const { t } = useLanguage();
    const getRank = () => {
        if (isLoading && !userRank) return <span className="text-muted-foreground">…</span>;
        
        const rank = activeTab === 'xp' ? userRank?.xp : userRank?.streak;
        const rankChange = activeTab === 'xp' 
            ? Number(userRank?.xpChange) 
            : Number(userRank?.streakChange);

        if (!rank || rank === 'Not Ranked') return '—';
        if (isNaN(Number(rank))) return rank || '...';
        
        return (
            <>
                #{rank}
                <RankTrend change={rankChange} />
            </>
        );
    };

    return (
        <div className="flex items-center gap-4">
            <p>
                <span className="block text-sm text-muted-foreground">
                    {t('leaderboard.your_rank')}
                </span>
                <span className="tabular flex items-center gap-2 font-display text-[2rem] leading-none">
                    {getRank()}
                </span>
            </p>
            {showShare ? (
                <Button
                    variant="outline"
                    onClick={onShare}
                    disabled={isSharing || isLoading}
                >
                    {isSharing ? <Loader2 className="animate-spin" /> : <Share2 />}
                    {t('leaderboard.share_rank')}
                </Button>
            ) : null}
        </div>
    );
};
