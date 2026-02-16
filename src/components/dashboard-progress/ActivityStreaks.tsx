import { Activity, Brain, FileText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActivityStreaks as ActivityStreaksType } from './progressTypes';

type ActivityStreaksProps = {
    activityStreaks: ActivityStreaksType;
};

const tracks = [
    {
        label: 'Quiz Master',
        key: 'quizzes',
        icon: Brain,
        color: 'text-blue-500',
        desc: 'Daily assessment streak',
    },
    {
        label: 'Note Architect',
        key: 'summaries',
        icon: FileText,
        color: 'text-blue-400',
        desc: 'Daily knowledge indexing',
    },
    {
        label: 'Daily Voyager',
        key: 'login',
        icon: Zap,
        color: 'text-yellow-400',
        desc: 'Platform check-in streak',
    },
] as const;

export default function ActivityStreaks({
    activityStreaks,
}: ActivityStreaksProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Multi-Track Consistency
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tracks.map((track) => {
                    const streak =
                        activityStreaks?.[track.key as keyof ActivityStreaksType]
                            ?.current || 0;
                    return (
                        <div
                            key={track.label}
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
                                        {track.label}
                                    </p>
                                    <p className="text-[10px] font-medium opacity-40 uppercase tracking-widest">
                                        {track.desc}
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
                                    Days
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
