import type { ActivityStreaks as ActivityStreaksType } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';
import { StatStrip } from '@/components/dashboard/StatStrip';

type ActivityStreaksProps = {
    activityStreaks: ActivityStreaksType;
};

const tracks = [
    {
        labelKey: 'progress.track_quiz_label',
        key: 'quizzes',
        descKey: 'progress.track_quiz_desc',
    },
    {
        labelKey: 'progress.track_notes_label',
        key: 'summaries',
        descKey: 'progress.track_notes_desc',
    },
    {
        labelKey: 'progress.track_login_label',
        key: 'login',
        descKey: 'progress.track_login_desc',
    },
] as const;

export default function ActivityStreaks({
    activityStreaks,
}: ActivityStreaksProps) {
    const { t } = useLanguage();
    return (
        <StatStrip
            items={tracks.map((track) => {
                const streak =
                    activityStreaks?.[track.key as keyof ActivityStreaksType]
                        ?.current || 0;
                return {
                    label: t(track.labelKey),
                    value: streak,
                    unit: streak === 1 ? 'day' : 'days',
                    note: t(track.descKey),
                };
            })}
        />
    );
}
