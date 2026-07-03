'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { LeaderboardUser, LeaderboardType } from './types';
import { useLanguage } from '@/contexts/LanguageContext';

interface PodiumProps {
    users: LeaderboardUser[];
    type: LeaderboardType;
    currentUserId: string | null;
}

export const Podium = ({ users, type, currentUserId }: PodiumProps) => {
    const { t } = useLanguage();
    if (!users || users.length === 0) return null;

    const first = users[0];
    const second = users[1];
    const third = users[2];

    const getAvatarSrc = (user: LeaderboardUser) => 
        user.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`;
    const getAvatarFallback = (user: LeaderboardUser) => (user.firstName || 'U')[0];

    return (
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 min-h-[300px] px-2 sm:px-4">
            {/* Second Place - Left */}
            {second && (
                <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-1/3 max-w-[200px] sm:max-w-[240px]">
                    <div className="relative mb-3 sm:mb-4">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-gray-300 shadow-[0_0_15px_rgba(209,213,219,0.3)]">
                            <AvatarImage src={getAvatarSrc(second)} />
                            <AvatarFallback className="bg-gray-300 text-gray-900 font-bold text-lg sm:text-xl">
                                {getAvatarFallback(second)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-gray-900 font-bold px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs shadow-lg">
                            #2
                        </div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-card/5 border border-foreground/10 rounded-2xl sm:rounded-3xl w-full backdrop-blur-md relative overflow-hidden group hover:border-gray-300/30 transition-all">
                        <div className="absolute inset-0 bg-gray-300/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-bold text-sm sm:text-lg truncate text-foreground opacity-100 leading-tight">
                                {second.firstName || ''} {second.lastName || '' || t('leaderboard.scholar')}
                            </h3>
                            {second._id === currentUserId && (
                                <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">
                                    {t('leaderboard.you_badge')}
                                </Badge>
                            )}
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate mb-2 sm:mb-3 font-medium uppercase tracking-wider">
                            {second.institution || t('leaderboard.scholar')}
                        </p>
                        <Badge
                            variant="outline"
                            className="border-gray-300/30 text-gray-300 bg-gray-300/10 px-2 sm:px-3 py-0.5 sm:py-1 text-sm sm:text-lg font-bold"
                        >
                            {type === 'xp' ? second.points.toLocaleString() : second.streak}
                        </Badge>
                    </div>
                </div>
            )}

            {/* First Place - Middle */}
            {first && (
                <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-1/3 max-w-[240px] sm:max-w-[280px] mb-4 md:mb-0 z-10">
                    <div className="relative mb-4 sm:mb-6">
                        <div className="absolute -top-10 sm:-top-14 inset-x-0 flex justify-center pointer-events-none">
                            <Crown className="text-yellow-400 w-8 h-8 sm:w-10 sm:h-10 animate-bounce drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
                        </div>
                        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 sm:border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                            <AvatarImage src={getAvatarSrc(first)} />
                            <AvatarFallback className="bg-yellow-400 text-yellow-900 font-bold text-2xl sm:text-3xl">
                                {getAvatarFallback(first)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 font-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm shadow-xl border sm:border-2 border-yellow-200">
                            #1
                        </div>
                    </div>
                    <div className="text-center p-6 sm:p-8 bg-yellow-400/10 border border-yellow-400/30 rounded-[1.5rem] sm:rounded-[2rem] w-full backdrop-blur-xl relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.1)] group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute inset-0 bg-yellow-400/10 opacity-50" />
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-bold text-xl sm:text-2xl truncate text-foreground leading-tight opacity-100">
                                {first.firstName || ''} {first.lastName || '' || t('leaderboard.scholar')}
                            </h3>
                            {first._id === currentUserId && (
                                <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">
                                    {t('leaderboard.you_badge')}
                                </Badge>
                            )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-foreground/60 dark:text-yellow-500/80 truncate mb-3 sm:mb-4 font-bold tracking-wide uppercase">
                            {(first.institution || t('leaderboard.champion')).substring(0, 20)}
                        </p>
                        <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">
                            {type === 'xp' ? first.points.toLocaleString() : first.streak}
                        </div>
                        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mt-1 sm:mt-2">
                            {type === 'xp' ? t('leaderboard.experience_points') : t('leaderboard.consecutive_days')}
                        </p>
                    </div>
                </div>
            )}

            {/* Third Place - Right */}
            {third && (
                <div className="order-3 md:order-3 flex flex-col items-center w-full md:w-1/3 max-w-[200px] sm:max-w-[240px]">
                    <div className="relative mb-3 sm:mb-4">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                            <AvatarImage src={getAvatarSrc(third)} />
                            <AvatarFallback className="bg-amber-600 text-foreground font-bold text-lg sm:text-xl">
                                {getAvatarFallback(third)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-foreground font-bold px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs shadow-lg">
                            #3
                        </div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-card/5 border border-foreground/10 rounded-2xl sm:rounded-3xl w-full backdrop-blur-md relative overflow-hidden group hover:border-amber-600/30 transition-all">
                        <div className="absolute inset-0 bg-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-bold text-sm sm:text-lg truncate text-foreground opacity-100 leading-tight">
                                {third.firstName || ''} {third.lastName || '' || t('leaderboard.scholar')}
                            </h3>
                            {third._id === currentUserId && (
                                <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">
                                    {t('leaderboard.you_badge')}
                                </Badge>
                            )}
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate mb-2 sm:mb-3 font-medium uppercase tracking-wider">
                            {third.institution || t('leaderboard.scholar')}
                        </p>
                        <Badge
                            variant="outline"
                            className="border-amber-600/30 text-amber-500 bg-amber-600/10 px-2 sm:px-3 py-0.5 sm:py-1 text-sm sm:text-lg font-bold"
                        >
                            {type === 'xp' ? third.points.toLocaleString() : third.streak}
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    );
};