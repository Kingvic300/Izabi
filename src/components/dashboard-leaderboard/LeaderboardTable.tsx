'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RankTrend } from './RankTrend';
import { LeaderboardUser, LeaderboardType } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeaderboardTableProps {
    users: LeaderboardUser[];
    type: LeaderboardType;
    currentUserId: string | null;
    title: string;
    icon: React.ReactNode;
}

export const LeaderboardTable = ({
    users,
    type,
    currentUserId,
    title,
    icon,
}: LeaderboardTableProps) => {
    const { t } = useLanguage();
    const getAvatarSrc = (user: LeaderboardUser) => 
        user.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`;
    const getAvatarFallback = (user: LeaderboardUser) => (user.firstName || 'U')[0];

    return (
        <div className="bg-card/5 border border-foreground/5 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
                <div className="space-y-1.5 sm:space-y-2 bg-transparent">
                    {users.slice(3).map((user, i) => (
                        <div
                            key={user._id}
                            className={cn(
                                'leaderboard-item flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-transparent transition-all hover:bg-card/5',
                                user._id === currentUserId
                                    ? 'bg-primary/10 border-primary/30'
                                    : 'bg-card/5',
                            )}
                        >
                            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
                                <div className="flex flex-col items-center w-6 sm:w-8 shrink-0">
                                    <span className="font-mono font-bold text-sm sm:text-lg opacity-60 leading-none">
                                        {i + 4}
                                    </span>
                                    <RankTrend change={user.rankChange} />
                                </div>
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-foreground/10 shrink-0">
                                    <AvatarImage src={getAvatarSrc(user)} />
                                    <AvatarFallback className={cn(
                                        "font-bold text-sm sm:text-base",
                                        type === 'xp' 
                                            ? 'bg-primary/30 text-primary'
                                            : 'bg-orange-500/30 text-orange-500'
                                    )}>
                                        {getAvatarFallback(user)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 overflow-hidden">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <h4 className="font-bold text-sm sm:text-base truncate">
                                            {user.firstName || t('leaderboard.anonymous')} {user.lastName || ''}
                                        </h4>
                                        {user._id === currentUserId && (
                                            <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0 shrink-0">
                                                {t('leaderboard.you_badge')}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-foreground/70 font-medium truncate">
                                        {type === 'xp'
                                            ? (user.institution || t('leaderboard.scholar'))
                                            : (user.pet ? `${user.pet.name} (Lvl ${user.pet.level})` : t('leaderboard.scholar'))
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                {type === 'xp' ? (
                                    <>
                                        <span className="font-black text-base sm:text-xl tracking-tight">
                                            {user.points.toLocaleString()}
                                        </span>
                                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-50 leading-none">
                                            {t('leaderboard.xp_label')}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-end gap-1">
                                            <Flame size={12} className="text-orange-500 fill-orange-500 sm:w-3.5 sm:h-3.5" />
                                            <span className="font-black text-base sm:text-xl tracking-tight">
                                                {user.streak}
                                            </span>
                                        </div>
                                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-50 leading-none">
                                            {t('leaderboard.days_label')}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};