'use client';

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
        <div className="space-y-4">
            <div
                id="study-modes-grid"
                className="grid grid-cols-1 overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-2 [&>*:nth-child(n+2)]:border-t sm:[&>*:nth-child(2)]:border-t-0 sm:[&>*:nth-child(even)]:border-l [&>*]:border-border"
            >
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

            <div className="rounded-lg border border-border bg-card">
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
            </div>
        </div>
    );
};
