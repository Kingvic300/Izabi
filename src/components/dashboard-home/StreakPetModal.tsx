import React, { useState } from 'react';
import { X, Flame, Sparkles, Award, Shield, Lock } from 'lucide-react';
import { PET_STAGES, StreakPetData } from './StreakPetWidget';

interface StreakPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    pet: StreakPetData;
    onFeedPet: () => void;
    // TODO: stage selection is a cosmetic preview only — backend pet stage is
    // derived from totalStreak, not settable directly. No apiClient endpoint exists for this.
    onSetStage?: (stage: 1 | 2 | 3 | 4) => void;
}

export const StreakPetModal: React.FC<StreakPetModalProps> = ({
    isOpen,
    onClose,
    pet,
    onFeedPet,
    onSetStage,
}) => {
    const [justFed, setJustFed] = useState(false);

    if (!isOpen) return null;

    const currentStageInfo = PET_STAGES.find((s) => s.stage === pet.stage) || PET_STAGES[0];

    const handleFeed = () => {
        onFeedPet();
        setJustFed(true);
        setTimeout(() => setJustFed(false), 1500);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-card border border-border rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-elevated">
                <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                                Study Companion · Evolution Index
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Evolves automatically as you maintain daily study streaks
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="rounded-2xl bg-muted/40 border border-border p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border border-primary/40 bg-background p-1 flex items-center justify-center">
                            {pet.image ? (
                                <img
                                    src={pet.image}
                                    alt={currentStageInfo.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover rounded-xl"
                                />
                            ) : (
                                <Sparkles className="w-16 h-16 text-primary" />
                            )}
                        </div>
                        <span className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-[11px] tabular font-bold px-2 py-0.5 rounded-full border-2 border-card shadow">
                            Lv.{pet.level}
                        </span>
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                            <span className="text-xs tabular font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/25">
                                STAGE {pet.stage} / 4
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs tabular text-urgent bg-urgent/10 px-2 py-0.5 rounded-md border border-urgent/25">
                                <Flame className="w-3.5 h-3.5 fill-urgent" />
                                <span>{pet.totalStreak}d Active Streak</span>
                            </span>
                        </div>

                        <h4 className="text-xl font-bold text-foreground tracking-tight">
                            {currentStageInfo.name}
                        </h4>

                        <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                            {currentStageInfo.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-[11px] text-muted-foreground tabular mb-1">
                                    <span>Growth Progress</span>
                                    <span className="text-foreground font-bold">
                                        {pet.xpTowardsNextStage}%
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border">
                                    <div
                                        className="bg-primary h-full rounded-full transition-all duration-300"
                                        style={{ width: `${pet.xpTowardsNextStage}%` }}
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleFeed}
                                className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                    justFed
                                        ? 'bg-learning-green text-background'
                                        : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                                }`}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{justFed ? 'XP Fed (+15)' : 'Feed XP'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground">
                        <span className="tabular text-foreground/80">
                            Evolution Stages
                        </span>
                        <span className="text-[11px]">Select a tier to inspect perks</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PET_STAGES.map((s) => {
                            const isSelected = pet.stage === s.stage;
                            const isUnlocked = pet.totalStreak >= s.minStreak || pet.stage >= s.stage;

                            return (
                                <button
                                    key={s.stage}
                                    type="button"
                                    onClick={() => onSetStage?.(s.stage)}
                                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                                        isSelected
                                            ? 'bg-muted border-primary ring-1 ring-primary/50 shadow-lg shadow-primary/10'
                                            : 'bg-muted/30 border-border hover:bg-muted/50'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs tabular text-muted-foreground">
                                            Tier 0{s.stage}
                                        </span>
                                        {isSelected ? (
                                            <span className="w-2 h-2 rounded-full bg-primary" />
                                        ) : !isUnlocked ? (
                                            <Lock className="w-3 h-3 text-muted-foreground" />
                                        ) : null}
                                    </div>

                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-border mb-2 bg-background flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>

                                    <div>
                                        <h5 className="text-xs font-bold text-foreground truncate">
                                            {s.name}
                                        </h5>
                                        <span className="text-xs tabular text-primary block mt-0.5">
                                            Day {s.minStreak}+
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-5 p-3.5 rounded-2xl bg-muted/40 border border-border flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-foreground/80 font-medium">Stage {pet.stage} Perk:</span>
                        <span className="text-foreground font-semibold">{currentStageInfo.perk}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-learning-green tabular text-[11px] shrink-0">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Streak Shield Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakPetModal;
