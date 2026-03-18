import type { SummaryContent } from '@/lib/summaryUtils';

export type ModuleCardId = 'summarize' | 'quiz' | 'guide' | 'cards';
export type ModuleCardStatus = 'idle' | 'processing' | 'completed' | 'failed';
export type QuizDifficulty = 'easy' | 'balanced' | 'hard';
export type QuizStyle = 'mixed' | 'mcq' | 'short';

export interface ModuleStatuses {
    summarize: ModuleCardStatus;
    quiz: ModuleCardStatus;
    guide: ModuleCardStatus;
    cards: ModuleCardStatus;
}

export interface Question {
    question: string;
    options: string[];
    answer: string;
    difficulty?: string;
    questionType?: string;
    explanation?: string;
}

export interface Flashcard {
    front: string;
    back: string;
}

export interface DashboardSession {
    summary: SummaryContent;
    studyGuide: string;
    questions: Question[];
    flashcards: Flashcard[];
    pdfFile: File | null;
    pdfSelection: any | null;
    fileName: string;
    numberOfQuestions: number;
    quizDifficulty: QuizDifficulty;
    quizStyle: QuizStyle;
    shuffleQuestions: boolean;
    showExplanations: boolean;
}

export interface UserStats {
    data: {
        firstName: string;
        totalPoints: number;
        dailyPoints: number;
        totalStudyMinutes: number;
        studyStreak: number;
        streakData?: {
            academicStreak: number;
        };
        pet?: {
            name: string;
            level: number;
        };
    };
}
