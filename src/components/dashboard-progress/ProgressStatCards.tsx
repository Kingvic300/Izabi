import type { ProgressData } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatStrip } from '@/components/dashboard/StatStrip';

type ProgressStatCardsProps = {
    progressData: ProgressData;
};

export default function ProgressStatCards({
    progressData,
}: ProgressStatCardsProps) {
    const { t } = useLanguage();
    return (
        <StatStrip
            items={[
                {
                    label: t('progress.total_quizzes'),
                    value: progressData.totalQuizzes,
                    unit: 'sessions',
                },
                {
                    label: t('progress.average_score'),
                    value: `${progressData.averageScore}%`,
                },
                {
                    label: t('progress.study_streak'),
                    value: progressData.studyStreak,
                    unit: progressData.studyStreak === 1 ? 'day' : 'days',
                },
                {
                    label: t('progress.study_hours'),
                    value: progressData.totalStudyHours,
                    unit: 'hours',
                },
            ]}
        />
    );
}
