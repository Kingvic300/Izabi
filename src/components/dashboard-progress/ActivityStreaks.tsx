import { Activity, Brain, FileText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityStreaks as ActivityStreaksType } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type ActivityStreaksProps = {
    activityStreaks: ActivityStreaksType;
};

const tracks = [
    {
        labelKey: 'progress.track_quiz_label',
        key: 'quizzes',
        icon: Brain,
        color: 'text-blue-500',
        descKey: 'progress.track_quiz_desc',
    },
    {
        labelKey: 'progress.track_notes_label',
        key: 'summaries',
        icon: FileText,
        color: 'text-blue-400',
        descKey: 'progress.track_notes_desc',
    },
    {
        labelKey: 'progress.track_login_label',
        key: 'login',
        icon: Zap,
        color: 'text-yellow-400',
        descKey: 'progress.track_login_desc',
    },
] as const;

export default function ActivityStreaks({
    activityStreaks,
}: ActivityStreaksProps) {
    const { t } = useLanguage();
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                {t('progress.multi_track')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tracks.map((track) => {
                    const streak =
                        activityStreaks?.[track.key as keyof ActivityStreaksType]
                            ?.current || 0;
                    return (
                        <div
                            key={track.labelKey}
                            className="glass p-4 sm:p-6 rounded-3xl border-foreground/5 bg-card/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-card/[0.04] transition-all"
                        >
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                <div
                                    className={cn(
                                        'p-4 rounded-2xl bg-card/5',
                                        track.color,
                                    )}
                                >
                                    <track.icon size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-base sm:text-lg leading-tight">
                                        {t(track.labelKey)}
                                    </p>
                                    <p className="text-[10px] font-medium opacity-40 uppercase tracking-widest">
                                        {t(track.descKey)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto">
                                <div
                                    className={cn(
                                        'text-xl sm:text-2xl font-black',
                                        track.color,
                                    )}
                                >
                                    {streak}
                                </div>
                                <p className="text-[8px] font-bold opacity-30 uppercase tracking-tighter">
                                    {t('progress.days_suffix')}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
