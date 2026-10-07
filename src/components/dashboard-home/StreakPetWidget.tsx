import React, { useState } from 'react';
import { Flame, Sparkles, ChevronRight } from 'lucide-react';

export interface StreakPetData {
    stage: 1 | 2 | 3 | 4;
    level: number;
    xpTowardsNextStage: number; // 0 - 100
    totalStreak: number;
    // TODO: pet portrait images are not part of the real backend/profile payload yet.
    // Falls back to a generic icon tile when no image is supplied.
    image?: string;
}

export const PET_STAGES: Array<{
    stage: 1 | 2 | 3 | 4;
    name: string;
    minStreak: number;
    description: string;
    perk: string;
}> = [
    {
        stage: 1,
        name: 'Spark Hatchling',
        minStreak: 1,
        description: 'An elemental AI companion born from your first study session.',
        perk: '+5% XP on Daily Brain Drops',
    },
    {
        stage: 2,
        name: 'Forge Scout',
        minStreak: 3,
        description: 'Hovering cyber-companion tracking your flashcard velocity.',
        perk: 'Unlocks 5-Min Timed Sprints with Audio Coach',
    },
    {
        stage: 3,
        name: 'Knowledge Sentinel',
        minStreak: 7,
        description: 'A sleek scholar companion with holographic memory indexes.',
        perk: '1 Free Streak Freeze per week + Priority PDF parsing',
    },
    {
        stage: 4,
        name: 'Quantum Archon',
        minStreak: 14,
        description: 'Legendary companion radiating pure study energy.',
        perk: '2x XP multipliers on all study modes + Grandmaster badge',
    },
];

interface StreakPetWidgetProps {
    pet: StreakPetData;
    onOpenSanctuary: () => void;
    onFeedPet: () => void;
}

export const StreakPetWidget: React.FC<StreakPetWidgetProps> = ({
    pet,
    onOpenSanctuary,
    onFeedPet,
}) => {
    const [justFed, setJustFed] = useState(false);

    const handleFeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFeedPet();
        setJustFed(true);
        setTimeout(() => setJustFed(false), 1200);
    };

    const currentStageInfo = PET_STAGES.find((s) => s.stage === pet.stage) || PET_STAGES[0];

    return (
        <div
            onClick={onOpenSanctuary}
            className="group relative rounded-xl bg-card border border-border hover:border-primary/50 p-4 sm:p-5 shadow-card transition-all duration-200 cursor-pointer"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                        <div
                            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-1 bg-muted border-2 border-primary overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105 flex items-center justify-center ${
                                justFed ? '' : ''
                            }`}
                        >
                            {pet.image ? (
                                <img
                                    src={pet.image}
                                    alt={currentStageInfo.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <Sparkles className="w-7 h-7 text-primary" />
                            )}
                        </div>

                        <span className="absolute -bottom-1.5 -right-1 bg-primary text-primary-foreground text-xs tabular font-bold px-1.5 py-0.5 rounded-full border border-background shadow">
                            Lv.{pet.level}
                        </span>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                            <span className="tabular text-primary font-semibold">
                                Streak Pet · Stage {pet.stage}/4
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <span className="tabular text-urgent font-medium flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 fill-urgent" />
                                {pet.totalStreak}d Streak
                            </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-foreground tracking-tight truncate mt-0.5">
                            {currentStageInfo.name}
                        </h4>

                        <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                <span>Growth to Stage {Math.min(pet.stage + 1, 4)}</span>
                                <span className="tabular text-foreground/80 tabular-nums">
                                    {pet.xpTowardsNextStage}%
                                </span>
                            </div>
                            <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden border border-border">
                                <div
                                    className="h-full rounded-full bg-foreground transition-all duration-300"
                                    style={{ width: `${pet.xpTowardsNextStage}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={handleFeed}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow cursor-pointer ${
                            justFed
                                ? 'bg-learning-green text-background'
                                : 'bg-muted hover:bg-primary text-foreground/80 hover:text-primary-foreground border border-border'
                        }`}
                        title="Feed pet study XP"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Feed XP</span>
                    </button>

                    <div className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-primary/40 transition-colors">
                        <ChevronRight className="w-4 h-4 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakPetWidget;
