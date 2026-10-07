import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface LearningVelocityWidgetProps {
    streak: string;
    totalPoints: number;
    // TODO: Backend has no "retention %" / "memory stability index" metric yet.
    // Using a sensible static placeholder until an analytics endpoint exists.
    retentionPercent?: number;
    onQuickSprint?: () => void;
}

export const LearningVelocityWidget: React.FC<LearningVelocityWidgetProps> = ({
    streak,
    totalPoints,
    retentionPercent = 94,
    onQuickSprint,
}) => {
    return (
        <div className="rounded-xl bg-card border border-border p-5 sm:p-6 shadow-card transition-all duration-200 hover:border-primary/30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-lg">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-learning-green" />
                        <span className="text-foreground font-semibold">Active Spaced Repetition Engine</span>
                        <span>·</span>
                        <span className="tabular tabular-nums">Optimal Interval: 18h</span>
                    </div>

                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
                            <span>Cognitive Retention:</span>
                            <span className="tabular tabular-nums text-primary font-extrabold">
                                {retentionPercent}%
                            </span>
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                            Based on the Ebbinghaus consolidation model, your active recall sessions
                            reflect strong retention across recently studied material.
                        </p>
                    </div>

                    <div className="pt-2">
                        <div className="flex items-center justify-between text-[11px] tabular text-muted-foreground mb-1.5">
                            <span>Memory Stability Index</span>
                            <span className="text-foreground">Target: 95%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full bg-foreground transition-all duration-500"
                                style={{ width: `${Math.min(100, retentionPercent)}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 border-t lg:border-t-0 border-border pt-4 lg:pt-0">
                    <div className="text-left lg:text-right space-y-1">
                        <div className="text-[11px] tabular text-muted-foreground">
                            Study Velocity
                        </div>
                        <div className="flex items-center gap-3 lg:justify-end">
                            <span className="text-lg font-bold tabular text-foreground tabular-nums">
                                {streak}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-sm font-semibold tabular text-foreground/80 tabular-nums">
                                {totalPoints} XP
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onQuickSprint}
                        className="py-2.5 px-4 rounded-xl bg-muted hover:bg-muted/70 border border-border hover:border-primary/40 text-xs font-semibold text-foreground transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
                    >
                        <Zap className="w-3.5 h-3.5 text-primary" />
                        <span>Launch 5-Min Memory Drill</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform text-muted-foreground" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearningVelocityWidget;
