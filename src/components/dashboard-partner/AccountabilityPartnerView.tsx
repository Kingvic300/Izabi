import React, { useState, useEffect } from 'react';
import { Flame, Zap, Play, Pause, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import type { Partnership, StreakSummary, Goal, CheckInStatus } from './partnerTypes';
import { getPartnerDisplayName } from './partnerUtils';
import { api } from '@/lib/apiClient';

interface AccountabilityPartnerViewProps {
    partnership: Partnership;
    streaks: StreakSummary | null;
    goal: Goal | null;
    checkInStatus: CheckInStatus | null;
    onLaunchStudy: () => void;
}

/**
 * Ported from izabi-new's AccountabilityPartnerView. The real Izabi backend
 * (useDashboardPartner / api.*) supports exactly one active partnership at a
 * time — there is no multi-partner "cohort" concept, so the cohort switcher
 * from the original design is dropped. The synchronized co-working Pomodoro
 * timer and nudge actions are preserved and wired to the real sendPartnerMessage
 * endpoint (type: 'nudge') instead of local-only toast simulation.
 */
export const AccountabilityPartnerView: React.FC<AccountabilityPartnerViewProps> = ({
    partnership,
    streaks,
    goal,
    checkInStatus,
    onLaunchStudy,
}) => {
    const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
    const [timerSeconds, setTimerSeconds] = useState(25 * 60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const partnerName = getPartnerDisplayName(partnership.partner);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds((prev) => prev - 1), 1000);
        } else if (timerSeconds === 0) {
            setIsTimerRunning(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, timerSeconds]);

    const formatTimer = (totalSecs: number) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSendNudge = async () => {
        try {
            await api.sendPartnerMessage(`⚡ Time to lock in! 📚`, 'nudge');
            setNudgeMessage(`⚡ Nudge sent to ${partnerName}!`);
        } catch {
            setNudgeMessage('Could not send nudge — please try again.');
        } finally {
            setTimeout(() => setNudgeMessage(null), 3500);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-card border border-border p-5 sm:p-6 shadow-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center font-bold text-lg text-primary shrink-0 tabular shadow-sm">
                            {partnerName.slice(0, 2).toUpperCase()}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-foreground tracking-tight">
                                {partnerName}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2 tabular">
                                <span className="text-urgent flex items-center gap-1 font-semibold">
                                    <Flame className="w-3.5 h-3.5 fill-urgent" />
                                    {streaks?.sharedStreak ?? 0}-Day Pact Streak
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                        <button
                            type="button"
                            onClick={handleSendNudge}
                            className="py-2 px-3 rounded-xl bg-muted hover:bg-muted/70 border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                            <Zap className="w-3.5 h-3.5 text-primary" />
                            <span>Nudge</span>
                        </button>
                    </div>
                </div>

                {nudgeMessage && (
                    <div className="mt-4 p-3 rounded-xl bg-primary/15 border border-primary/30 text-xs font-medium text-primary flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>{nudgeMessage}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs tabular text-muted-foreground">
                                Synchronized Co-Working Sprint
                            </span>
                        </div>

                        <div className="text-center py-6">
                            <div className="text-5xl sm:text-6xl font-extrabold tabular tracking-tight text-foreground tabular-nums">
                                {formatTimer(timerSeconds)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {isTimerRunning
                                    ? 'Deep Focus Sprint in Progress'
                                    : 'Ready to start co-working block'}
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                            >
                                {isTimerRunning ? (
                                    <>
                                        <Pause className="w-4 h-4" />
                                        <span>Pause Co-Sprint</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        <span>Start Co-Sprint</span>
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsTimerRunning(false);
                                    setTimerSeconds(25 * 60);
                                }}
                                className="p-2.5 rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground border border-border transition-colors cursor-pointer"
                                title="Reset to 25:00"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-bold text-foreground tracking-tight">
                                Daily Accountability Pact
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {goal ? goal.title : 'No shared goal set yet.'}
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 tabular text-[11px]">
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                    checkInStatus?.youCheckedInToday
                                        ? 'bg-learning-green/10 text-learning-green border border-learning-green/20'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                You: {checkInStatus?.youCheckedInToday ? 'Done' : 'Pending'}
                            </span>
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                    checkInStatus?.partnerCheckedInToday
                                        ? 'bg-learning-green/10 text-learning-green border border-learning-green/20'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {partnerName.split(' ')[0]}:{' '}
                                {checkInStatus?.partnerCheckedInToday ? 'Done' : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                            Ready to complete remaining goals?
                        </span>
                        <button
                            type="button"
                            onClick={onLaunchStudy}
                            className="py-2 px-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                            <span>Launch Study Session</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountabilityPartnerView;
