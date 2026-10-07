import type { ProgressData } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bubble } from '@/components/ui/bubble';
import { cn } from '@/lib/utils';

type AchievementsSectionProps = {
    progressData: ProgressData;
};

const achievements = [
    {
        titleKey: 'progress.ach_streak_title',
        descKey: 'progress.ach_streak_desc',
        isUnlocked: (data: ProgressData) => data.studyStreak >= 7,
    },
    {
        titleKey: 'progress.ach_quiz_title',
        descKey: 'progress.ach_quiz_desc',
        isUnlocked: (data: ProgressData) => data.totalQuizzes >= 50,
    },
    {
        titleKey: 'progress.ach_perfect_title',
        descKey: 'progress.ach_perfect_desc',
        isUnlocked: (data: ProgressData) => data.perfectScore,
    },
];

export default function AchievementsSection({
    progressData,
}: AchievementsSectionProps) {
    const { t } = useLanguage();
    return (
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {achievements.map((ach) => {
                const isUnlocked = ach.isUnlocked(progressData);
                return (
                    <li
                        key={ach.titleKey}
                        className="flex items-start gap-4 bg-card p-5 sm:p-6"
                    >
                        <Bubble
                            state={isUnlocked ? 'filled' : 'empty'}
                            size="md"
                            className="mt-0.5"
                        />
                        <div>
                            <p
                                className={cn(
                                    'font-display text-lg leading-tight',
                                    !isUnlocked && 'text-muted-foreground',
                                )}
                            >
                                {t(ach.titleKey)}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {isUnlocked
                                    ? t(ach.descKey)
                                    : t('progress.locked_milestone')}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
