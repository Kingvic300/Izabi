import { Brain, Zap, FileText, Layers } from 'lucide-react';
import { ModuleCardId } from './types';

export const DEFAULT_PRACTICE_QUESTION_COUNT = 2;

export const MODULE_CARDS: Array<{
    id: ModuleCardId;
    icon: any;
    label: string;
    desc: string;
    color: string;
    endpoint: string;
}> = [
    {
        id: 'summarize',
        icon: Brain,
        label: 'Smart Summary',
        desc: 'Key points distilled',
        color: 'text-blue-400',
        endpoint: 'summarize',
    },
    {
        id: 'quiz',
        icon: Zap,
        label: 'Practice Quiz',
        desc: 'Test understanding',
        color: 'text-yellow-400',
        endpoint: 'generate-questions',
    },
    {
        id: 'guide',
        icon: FileText,
        label: 'Study Guide',
        desc: 'Structured notes',
        color: 'text-emerald-400',
        endpoint: 'generate-study-material',
    },
    {
        id: 'cards',
        icon: Layers,
        label: 'Flashcards',
        desc: 'Quick memorization',
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