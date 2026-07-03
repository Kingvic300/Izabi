import { Brain, Zap, FileText, Layers } from 'lucide-react';
import { ModuleCardId } from './types';

export const DEFAULT_PRACTICE_QUESTION_COUNT = 2;

export const MODULE_CARDS: Array<{
    id: ModuleCardId;
    icon: any;
    labelKey: string;
    descKey: string;
    color: string;
    endpoint: string;
}> = [
    {
        id: 'summarize',
        icon: Brain,
        labelKey: 'module.summarize_label',
        descKey: 'module.summarize_desc',
        color: 'text-blue-400',
        endpoint: 'summarize',
    },
    {
        id: 'quiz',
        icon: Zap,
        labelKey: 'quiz.practice_title',
        descKey: 'module.quiz_desc',
        color: 'text-yellow-400',
        endpoint: 'generate-questions',
    },
    {
        id: 'guide',
        icon: FileText,
        labelKey: 'module.guide_label',
        descKey: 'module.guide_desc',
        color: 'text-primary',
        endpoint: 'generate-study-material',
    },
    {
        id: 'cards',
        icon: Layers,
        labelKey: 'flashcards.title',
        descKey: 'module.cards_desc',
        color: 'text-blue-400',
        endpoint: 'flashcards',
    },
];

export const INITIAL_MODULE_STATUSES = {
    summarize: 'idle',
    quiz: 'idle',
    guide: 'idle',
    cards: 'idle',
} as const;

export const ENDPOINT_TO_MODULE_ID: Record<string, ModuleCardId> = {
    summarize: 'summarize',
    'generate-questions': 'quiz',
    'generate-study-material': 'guide',
    flashcards: 'cards',
};

export const QUESTION_COUNTS = [3, 5, 8, 10, 15];
export const DIFFICULTY_OPTIONS = ['easy', 'balanced', 'hard'] as const;
export const QUIZ_STYLE_OPTIONS = ['mixed', 'mcq', 'short'] as const;
