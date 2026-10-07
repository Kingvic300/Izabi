import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LeaderboardUser, LeaderboardType } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PodiumProps {
    users: LeaderboardUser[];
    type: LeaderboardType;
    currentUserId: string | null;
}

export const avatarSrc = (user: LeaderboardUser) =>
    user.profilePicturePath ||
    `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.email)}`;

export const displayName = (user: LeaderboardUser, fallback: string) =>
    [user.firstName, user.lastName].filter(Boolean).join(' ') || fallback;

export const Podium = ({ users, type, currentUserId }: PodiumProps) => {
    const { t } = useLanguage();
    if (!users || users.length === 0) return null;

    const top = users.slice(0, 3);

    return (
        <ol className="grid grid-cols-1 gap-0 overflow-hidden rounded-lg border border-border bg-card md:grid-cols-3">
            {top.map((user, i) => {
                const isYou = user._id === currentUserId;
                const value =
                    type === 'xp' ? user.points.toLocaleString() : user.streak;
                return (
                    <li
                        key={user._id}
                        className={cn(
                            'relative flex items-center gap-4 p-5 sm:p-6 md:flex-col md:items-start md:gap-5',
                            i > 0 && 'border-t border-border md:border-l md:border-t-0',
                            i === 0 &&
                                'before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-foreground',
                            isYou && 'bg-highlight/15',
                        )}
                    >
                        <span className="tabular w-8 shrink-0 font-display text-4xl leading-none md:w-auto md:text-5xl">
                            {i + 1}
                        </span>
                        <div className="flex min-w-0 flex-1 items-center gap-3 md:w-full">
                            <Avatar className="h-11 w-11 shrink-0 border border-border">
                                <AvatarImage src={avatarSrc(user)} alt="" />
                                <AvatarFallback className="font-bold">
                                    {(user.firstName || 'S')[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate font-bold">
                                    {displayName(user, t('leaderboard.scholar'))}
                                    {isYou && (
                                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                                            ({t('leaderboard.you_badge')})
                                        </span>
                                    )}
                                </p>
                                <p className="truncate text-sm text-muted-foreground">
                                    {user.institution || t('leaderboard.scholar')}
                                </p>
                            </div>
                        </div>
                        <p className="shrink-0 text-right md:text-left">
                            <span className="tabular block font-display text-2xl leading-none md:text-3xl">
                                {value}
                            </span>
                            <span className="mt-1 block text-xs text-muted-foreground">
                                {type === 'xp'
                                    ? t('leaderboard.xp_label')
                                    : t('leaderboard.days_label')}
                            </span>
                        </p>
                    </li>
                );
            })}
        </ol>
    );
};
