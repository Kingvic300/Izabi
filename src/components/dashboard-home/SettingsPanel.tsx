'use client';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { QUESTION_COUNTS, DIFFICULTY_OPTIONS, QUIZ_STYLE_OPTIONS } from '@/components/dashboard-home/dashboard';
import { QuizDifficulty, QuizStyle } from '@/components/dashboard-home/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsPanelProps {
    numberOfQuestions: number;
    quizDifficulty: QuizDifficulty;
    quizStyle: QuizStyle;
    shuffleQuestions: boolean;
    showExplanations: boolean;
    isProcessing: boolean;
    onQuestionsChange: (value: number) => void;
    onDifficultyChange: (value: QuizDifficulty) => void;
    onStyleChange: (value: QuizStyle) => void;
    onShuffleChange: (checked: boolean) => void;
    onExplanationsChange: (checked: boolean) => void;
}

export const SettingsPanel = ({
    numberOfQuestions,
    quizDifficulty,
    quizStyle,
    shuffleQuestions,
    showExplanations,
    isProcessing,
    onQuestionsChange,
    onDifficultyChange,
    onStyleChange,
    onShuffleChange,
    onExplanationsChange,
}: SettingsPanelProps) => {
    const { t } = useLanguage();
    return (
        <div className="space-y-5 p-5">
            <h4 className="font-display text-lg">{t('module.session_settings')}</h4>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <div className="text-sm font-bold">
                        {t('module.questions_label')}
                    </div>
                    <ToggleGroup
                        type="single"
                        value={String(numberOfQuestions)}
                        onValueChange={(val) => val && onQuestionsChange(Number(val))}
                        disabled={isProcessing}
                        className="grid grid-cols-3 sm:grid-cols-5 gap-2"
                    >
                        {QUESTION_COUNTS.map((num) => (
                            <ToggleGroupItem
                                key={num}
                                value={String(num)}
                                className="h-9 text-sm"
                            >
                                {num}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-bold">
                        {t('module.difficulty_label')}
                    </div>
                    <ToggleGroup
                        type="single"
                        value={quizDifficulty}
                        onValueChange={(val) => val && onDifficultyChange(val as QuizDifficulty)}
                        disabled={isProcessing}
                        className="grid grid-cols-3 gap-2"
                    >
                        {DIFFICULTY_OPTIONS.map((opt) => (
                            <ToggleGroupItem key={opt} value={opt} className="h-9 text-sm">
                                {opt === 'easy'
                                    ? t('module.difficulty_easy')
                                    : opt === 'hard'
                                      ? t('module.difficulty_hard')
                                      : t('module.difficulty_balanced')}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-bold">
                        {t('module.question_type_label')}
                    </div>
                    <ToggleGroup
                        type="single"
                        value={quizStyle}
                        onValueChange={(val) => val && onStyleChange(val as QuizStyle)}
                        disabled={isProcessing}
                        className="grid grid-cols-3 gap-2"
                    >
                        {QUIZ_STYLE_OPTIONS.map((opt) => (
                            <ToggleGroupItem key={opt} value={opt} className="h-9 text-sm">
                                {opt === 'mcq' ? t('module.style_mcq') : opt === 'short' ? t('module.style_short') : t('module.style_mixed')}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                            <div className="text-sm font-bold">
                                {t('module.shuffle_label')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {t('module.shuffle_desc')}
                            </div>
                        </div>
                        <Switch
                            checked={shuffleQuestions}
                            onCheckedChange={onShuffleChange}
                            disabled={isProcessing}
                        />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                            <div className="text-sm font-bold">
                                {t('module.explanations_label')}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {t('module.explanations_desc')}
                            </div>
                        </div>
                        <Switch
                            checked={showExplanations}
                            onCheckedChange={onExplanationsChange}
                            disabled={isProcessing}
                        />
                    </div>
                </div>
            </div>

            {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
                    <Loader2 className="animate-spin" size={16} />
                    <span>
                        {t('module.creating_plan')}
                    </span>
                </div>
            )}
        </div>
    );
};