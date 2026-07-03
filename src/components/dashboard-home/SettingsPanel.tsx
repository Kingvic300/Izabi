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
        <div className="p-4 sm:p-6 bg-card/[0.02] border-t border-foreground/5 space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                    {t('module.session_settings')}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-30">
                    {t('module.mobile_ready')}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-foreground/5 bg-card/5 p-4 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
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
                                className="h-10 text-xs font-bold"
                            >
                                {num}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-card/5 p-4 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
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
                            <ToggleGroupItem key={opt} value={opt} className="h-10 text-xs font-bold">
                                {opt === 'easy'
                                    ? t('module.difficulty_easy')
                                    : opt === 'hard'
                                      ? t('module.difficulty_hard')
                                      : t('module.difficulty_balanced')}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-card/5 p-4 space-y-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
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
                            <ToggleGroupItem key={opt} value={opt} className="h-10 text-[11px] font-bold">
                                {opt === 'mcq' ? t('module.style_mcq') : opt === 'short' ? t('module.style_short') : t('module.style_mixed')}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-card/5 p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
                                {t('module.shuffle_label')}
                            </div>
                            <div className="text-xs font-medium text-muted-foreground">
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
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
                                {t('module.explanations_label')}
                            </div>
                            <div className="text-xs font-medium text-muted-foreground">
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
                <div className="flex items-center gap-4 text-primary animate-pulse">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                        {t('module.creating_plan')}
                    </span>
                </div>
            )}
        </div>
    );
};