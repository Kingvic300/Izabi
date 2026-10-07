import React, { useState } from 'react';
import { Trophy, Flame, Zap } from 'lucide-react';
import type { LeaderboardUser, LeaderboardType } from './types';

interface LeaderboardViewProps {
    users: LeaderboardUser[];
    type: LeaderboardType;
    currentUserId?: string | null;
    onLaunchChallenge?: () => void;
}

const getDisplayName = (u: LeaderboardUser) =>
    [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'Scholar';

/**
 * Compact podium + ranked-list leaderboard view, ported from izabi-new's
 * LeaderboardView. Izabi's DashboardLeaderboard page already has a full
 * Podium + LeaderboardTable implementation wired to api.getLeaderboard();
 * this component offers the same real LeaderboardData in an alternate,
 * single-card layout for embedding elsewhere (e.g. a dashboard summary).
 */
export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
    users,
    type,
    currentUserId,
    onLaunchChallenge,
}) => {
    const [cheeredUsers, setCheeredUsers] = useState<Record<string, boolean>>({});

    const sorted = [...users].sort((a, b) =>
        type === 'xp' ? b.points - a.points : b.streak - a.streak,
    );
    const top3 = sorted.slice(0, 3);
    const rest = sorted.slice(3);

    const handleCheer = (userId: string) => {
        setCheeredUsers((prev) => ({ ...prev, [userId]: true }));
    };

    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {top3.map((user, idx) => {
                    const isGold = idx === 0;
                    const isSilver = idx === 1;
                    const isCurrentUser = user._id === currentUserId;
                    const crownColor = isGold
                        ? 'text-urgent border-urgent/40 bg-urgent/10'
                        : isSilver
                          ? 'text-muted-foreground border-border bg-muted/40'
                          : 'text-urgent border-urgent/40 bg-urgent/10';

                    return (
                        <div
                            key={user._id}
                            className={`rounded-2xl border p-5 text-center flex flex-col justify-between transition-all duration-200 relative ${
                                isGold
                                    ? 'bg-card border-primary ring-1 ring-primary/40 shadow-float order-1 sm:order-2'
                                    : 'bg-card border-border order-2 sm:order-1'
                            } ${isCurrentUser ? 'ring-2 ring-primary/60' : ''}`}
                        >
                            <div
                                className={`w-7 h-7 mx-auto rounded-full border flex items-center justify-center text-xs tabular font-bold mb-3 ${crownColor}`}
                            >
                                #{idx + 1}
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-foreground truncate">
                                    {getDisplayName(user)}
                                </h4>
                                {user.institution && (
                                    <p className="text-[11px] text-muted-foreground truncate">
                                        {user.institution}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-border flex items-center justify-around">
                                <div className="text-center">
                                    <span className="text-xs text-muted-foreground block tabular">
                                        XP
                                    </span>
                                    <span className="text-sm font-extrabold text-foreground tabular">
                                        {user.points.toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <span className="text-xs text-muted-foreground block tabular">
                                        Streak
                                    </span>
                                    <span className="text-sm font-bold text-urgent tabular flex items-center justify-center gap-0.5">
                                        <Flame className="w-3 h-3 fill-urgent" />
                                        {user.streak}d
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-card">
                <div className="p-4 border-b border-border flex items-center justify-between text-xs font-semibold text-muted-foreground tabular">
                    <span>Rank & Scholar</span>
                    <div className="flex items-center gap-8">
                        <span className="hidden sm:inline">Streak</span>
                        <span>Total XP</span>
                        <span className="w-16 text-right">Action</span>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {rest.map((user, idx) => {
                        const rank = idx + 4;
                        const isCurrentUser = user._id === currentUserId;
                        const hasCheered = cheeredUsers[user._id];

                        return (
                            <div
                                key={user._id}
                                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                                    isCurrentUser
                                        ? 'bg-primary/10 border-l-4 border-l-primary'
                                        : 'hover:bg-muted/40'
                                }`}
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <span
                                        className={`w-6 text-center font-mono text-xs font-bold ${
                                            isCurrentUser ? 'text-primary' : 'text-muted-foreground'
                                        }`}
                                    >
                                        #{rank}
                                    </span>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`text-xs sm:text-sm font-bold truncate ${
                                                    isCurrentUser ? 'text-primary' : 'text-foreground'
                                                }`}
                                            >
                                                {getDisplayName(user)}
                                            </span>
                                            {isCurrentUser && (
                                                <span className="text-[11px] tabular text-primary font-medium">
                                                    (You)
                                                </span>
                                            )}
                                        </div>
                                        {user.institution && (
                                            <p className="text-[11px] text-muted-foreground truncate">
                                                {user.institution}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 sm:gap-8 shrink-0">
                                    <div className="hidden sm:flex items-center gap-1 text-xs tabular font-bold text-urgent">
                                        <Flame className="w-3.5 h-3.5 fill-urgent" />
                                        <span>{user.streak}d</span>
                                    </div>

                                    <div className="text-xs sm:text-sm font-extrabold text-foreground tabular tabular-nums">
                                        {user.points.toLocaleString()} XP
                                    </div>

                                    <div className="w-16 flex justify-end">
                                        {isCurrentUser ? (
                                            <button
                                                type="button"
                                                onClick={onLaunchChallenge}
                                                className="px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-semibold transition-colors cursor-pointer"
                                            >
                                                Drill
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleCheer(user._id)}
                                                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                                                    hasCheered
                                                        ? 'bg-learning-green/20 text-learning-green border border-learning-green/30'
                                                        : 'bg-muted hover:bg-muted/70 border border-border text-foreground/80'
                                                }`}
                                            >
                                                <Zap className="w-3 h-3 text-primary" />
                                                <span>{hasCheered ? 'Cheered' : 'Cheer'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardView;
