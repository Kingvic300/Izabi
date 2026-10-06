'use client';

import { Flame, Star, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatsRowProps {
    streak: number;
    totalPoints: number;
    dailyPoints: number;
    studyHours: number;
}

export const StatsRow = ({
    streak,
    totalPoints,
    dailyPoints,
    studyHours,
}: StatsRowProps) => {
    const { t } = useLanguage();

    const stats = [
        {
            label: t('module.active_streak'),
            value: `${streak} ${t('leaderboard.days_label')}`,
            icon: Flame,
            accent: 'bg-urgent',
            iconClass: 'text-urgent bg-urgent/10',
        },
        {
            label: t('module.knowledge_xp'),
            value: totalPoints.toLocaleString(),
            icon: Star,
            accent: 'bg-primary',
            iconClass: 'text-primary bg-primary/10',
        },
        {
            label: t('home.daily_xp'),
            value: `+${dailyPoints.toLocaleString()}`,
            icon: TrendingUp,
            accent: 'bg-reward',
            iconClass: 'text-reward bg-reward/10',
        },
        {
            label: t('home.total_study_time'),
            value: `${studyHours}h`,
            icon: Clock,
            accent: 'bg-learning-purple',
            iconClass: 'text-learning-purple bg-learning-purple/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-border bg-card p-4"
                >
                    <span
                        aria-hidden="true"
                        className={`absolute inset-y-0 left-0 w-[3px] ${stat.accent}`}
                    />
                    <div
                        className={`h-9 w-9 shrink-0 rounded-md flex items-center justify-center ${stat.iconClass}`}
                    >
                        <stat.icon size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                            {stat.label}
                        </p>
                        <p className="text-lg font-semibold leading-tight font-display">
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
