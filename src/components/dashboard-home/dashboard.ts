import { AlignLeft, ListChecks, BookOpen, Layers } from 'lucide-react';
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
        icon: AlignLeft,
        labelKey: 'module.summarize_label',
        descKey: 'module.summarize_desc',
        color: '',
        endpoint: 'summarize',
    },
    {
        id: 'quiz',
        icon: ListChecks,
        labelKey: 'quiz.practice_title',
        descKey: 'module.quiz_desc',
        color: '',
        endpoint: 'generate-questions',
    },
    {
        id: 'guide',
        icon: BookOpen,
        labelKey: 'module.guide_label',
        descKey: 'module.guide_desc',
        color: '',
        endpoint: 'generate-study-material',
    },
    {
        id: 'cards',
        icon: Layers,
        labelKey: 'flashcards.title',
        descKey: 'module.cards_desc',
        color: '',
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
