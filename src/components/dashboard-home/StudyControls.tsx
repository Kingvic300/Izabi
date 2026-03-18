'use client';

import { Card } from '@/components/ui/card';
import { ModuleCard } from './ModuleCard';
import { SettingsPanel } from './SettingsPanel';
import { MODULE_CARDS } from '@/components/dashboard-home/dashboard';
import { ModuleStatuses, QuizDifficulty, QuizStyle } from '@/components/dashboard-home/types';

interface StudyControlsProps {
    moduleStatuses: ModuleStatuses;
    isProcessing: boolean;
    numberOfQuestions: number;
    quizDifficulty: QuizDifficulty;
    quizStyle: QuizStyle;
    shuffleQuestions: boolean;
    showExplanations: boolean;
    onModuleClick: (endpoint: string, includeQuestions: boolean) => void;
    onQuestionsChange: (value: number) => void;
    onDifficultyChange: (value: QuizDifficulty) => void;
    onStyleChange: (value: QuizStyle) => void;
    onShuffleChange: (checked: boolean) => void;
    onExplanationsChange: (checked: boolean) => void;
}

export const StudyControls = ({
    moduleStatuses,
    isProcessing,
    numberOfQuestions,
    quizDifficulty,
    quizStyle,
    shuffleQuestions,
    showExplanations,
    onModuleClick,
    onQuestionsChange,
    onDifficultyChange,
    onStyleChange,
    onShuffleChange,
    onExplanationsChange,
}: StudyControlsProps) => {
    const getModuleHandler = (module: typeof MODULE_CARDS[0]) => {
        const includeQuestions = module.id === 'quiz' || module.id === 'guide';
        return () => onModuleClick(module.endpoint, includeQuestions);
    };

    return (
        <div className="space-y-6">
            <Card className="relative overflow-hidden rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl shadow-2xl transition-all duration-500">
                <div id="study-modes-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-foreground/5">
                    {MODULE_CARDS.map((module) => (
                        <ModuleCard
                            key={module.id}
                            {...module}
                            status={moduleStatuses[module.id]}
                            isProcessing={isProcessing}
                            numberOfQuestions={numberOfQuestions}
                            onClick={getModuleHandler(module)}
                        />
                    ))}
                </div>
            </Card>

            <Card className="rounded-[32px] border border-foreground/5 bg-card/30 backdrop-blur-xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                        Engine Parameters
                    </span>
                    <div className="h-px flex-1 bg-foreground/5" />
                </div>
                <SettingsPanel
                    numberOfQuestions={numberOfQuestions}
                    quizDifficulty={quizDifficulty}
                    quizStyle={quizStyle}
                    shuffleQuestions={shuffleQuestions}
                    showExplanations={showExplanations}
                    isProcessing={isProcessing}
                    onQuestionsChange={onQuestionsChange}
                    onDifficultyChange={onDifficultyChange}
                    onStyleChange={onStyleChange}
                    onShuffleChange={onShuffleChange}
                    onExplanationsChange={onExplanationsChange}
                />
            </Card>
        </div>
    );
};