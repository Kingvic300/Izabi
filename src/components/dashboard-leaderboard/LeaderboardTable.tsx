import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { RankTrend } from './RankTrend';
import { LeaderboardUser, LeaderboardType } from './types';
import { avatarSrc, displayName } from './Podium';
import { useLanguage } from '@/contexts/LanguageContext';

interface LeaderboardTableProps {
    users: LeaderboardUser[];
    type: LeaderboardType;
    currentUserId: string | null;
    title: string;
    icon?: React.ReactNode;
}

export const LeaderboardTable = ({
    users,
    type,
    currentUserId,
    title,
}: LeaderboardTableProps) => {
    const { t } = useLanguage();
    const rest = users.slice(3);
    if (rest.length === 0) return null;

    return (
        <section className="overflow-hidden rounded-lg border border-border bg-card">
            <h3 className="border-b border-border px-5 py-4 font-display text-lg sm:px-6">
                {title}
            </h3>
            <ol className="divide-y divide-border">
                {rest.map((user, i) => {
                    const isYou = user._id === currentUserId;
                    return (
                        <li
                            key={user._id}
                            className={cn(
                                'flex items-center gap-3 px-5 py-3 sm:gap-4 sm:px-6',
                                isYou && 'bg-highlight/15',
                            )}
                        >
                            <div className="flex w-8 shrink-0 flex-col items-center">
                                <span className="tabular text-sm font-bold text-muted-foreground">
                                    {i + 4}
                                </span>
                                <RankTrend change={user.rankChange} />
                            </div>
                            <Avatar className="h-9 w-9 shrink-0 border border-border">
                                <AvatarImage src={avatarSrc(user)} alt="" />
                                <AvatarFallback className="text-sm font-bold">
                                    {(user.firstName || 'S')[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-bold">
                                    {displayName(user, t('leaderboard.anonymous'))}
                                    {isYou && (
                                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                                            ({t('leaderboard.you_badge')})
                                        </span>
                                    )}
                                </p>
                                <p className="truncate text-sm text-muted-foreground">
                                    {type === 'xp'
                                        ? user.institution || t('leaderboard.scholar')
                                        : user.pet
                                          ? `${user.pet.name}, level ${user.pet.level}`
                                          : t('leaderboard.scholar')}
                                </p>
                            </div>
                            <p className="shrink-0 text-right">
                                <span className="tabular font-bold">
                                    {type === 'xp'
                                        ? user.points.toLocaleString()
                                        : user.streak}
                                </span>{' '}
                                <span className="text-sm text-muted-foreground">
                                    {type === 'xp'
                                        ? t('leaderboard.xp_label')
                                        : t('leaderboard.days_label')}
                                </span>
                            </p>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
};
