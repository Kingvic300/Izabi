import React from 'react';
import { Flame, Star, TrendingUp, Clock } from 'lucide-react';

interface StatTilesProps {
    streak?: string;
    totalPoints?: number;
    pointsToday?: number;
    studyTime?: string;
}

export const StatTiles: React.FC<StatTilesProps> = ({
    streak = '0 Days',
    totalPoints = 0,
    pointsToday = 0,
    studyTime = '0h',
}) => {
    const metrics = [
        {
            id: 'streak',
            label: 'Consecutive Consistency',
            value: streak,
            trend: 'Keep it going',
            icon: Flame,
        },
        {
            id: 'points',
            label: 'Mastery Yield',
            value: `${totalPoints.toLocaleString()} XP`,
            trend: 'Total earned',
            icon: Star,
        },
        {
            id: 'daily',
            label: 'Daily Session Target',
            value: pointsToday >= 0 ? `+${pointsToday} XP` : `${pointsToday} XP`,
            trend: 'Target: 50 XP',
            icon: TrendingUp,
        },
        {
            id: 'time',
            label: 'Deep Focus Duration',
            value: studyTime,
            trend: 'Total study time',
            icon: Clock,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
            {metrics.map((metric) => {
                const IconComponent = metric.icon;
                return (
                    <div
                        key={metric.id}
                        className="group rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-card transition-all duration-200 hover:border-primary/30 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground truncate">
                                {metric.label}
                            </span>
                            <IconComponent className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>

                        <div>
                            <div className="text-2xl sm:text-3xl font-extrabold tabular text-foreground tracking-tight tabular-nums">
                                {metric.value}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] tabular text-muted-foreground mt-1">
                                <span>{metric.trend}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatTiles;
