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
            value: streak.toLocaleString(),
            unit: streak === 1 ? 'day' : 'days',
        },
        {
            label: t('module.knowledge_xp'),
            value: totalPoints.toLocaleString(),
            unit: 'points',
        },
        {
            label: t('home.daily_xp'),
            value: `+${dailyPoints.toLocaleString()}`,
            unit: 'points',
        },
        {
            label: t('home.total_study_time'),
            value: String(studyHours),
            unit: studyHours === 1 ? 'hour' : 'hours',
        },
    ];

    return (
        <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-4">
            {stats.map((stat, i) => (
                <div
                    key={stat.label}
                    className={[
                        'px-5 py-4 sm:px-6 sm:py-5',
                        i % 2 === 1 ? 'border-l border-border' : '',
                        i >= 2 ? 'border-t border-border lg:border-t-0' : '',
                        i === 2 ? 'lg:border-l' : '',
                    ].join(' ')}
                >
                    <dt className="truncate text-sm text-muted-foreground">
                        {stat.label}
                    </dt>
                    <dd className="mt-1 flex items-baseline gap-1.5">
                        <span className="tabular font-display text-[1.75rem] leading-none sm:text-[2rem]">
                            {stat.value}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {stat.unit}
                        </span>
                    </dd>
                </div>
            ))}
        </dl>
    );
};
