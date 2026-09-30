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
            iconClass: 'text-orange-500 bg-orange-500/10',
        },
        {
            label: t('module.knowledge_xp'),
            value: totalPoints.toLocaleString(),
            icon: Star,
            iconClass: 'text-primary bg-primary/10',
        },
        {
            label: t('home.daily_xp'),
            value: `+${dailyPoints.toLocaleString()}`,
            icon: TrendingUp,
            iconClass: 'text-emerald-500 bg-emerald-500/10',
        },
        {
            label: t('home.total_study_time'),
            value: `${studyHours}h`,
            icon: Clock,
            iconClass: 'text-sky-500 bg-sky-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                >
                    <div
                        className={`h-9 w-9 shrink-0 rounded-lg flex items-center justify-center ${stat.iconClass}`}
                    >
                        <stat.icon size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                            {stat.label}
                        </p>
                        <p className="text-lg font-semibold leading-tight">
                            {stat.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
