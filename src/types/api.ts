export interface User {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'USER' | 'ADMIN';
    isVerified: boolean;
    points: number;
    streak: number;
    pet?: {
        name: string;
        level: number;
        health: number;
        mood: string;
    };
}

export interface Question {
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
}

export interface Exam {
    _id: string;
    userId: string;
    category: 'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY';
    subject: string;
    institution?: string;
    type: string;
    questions: Question[];
    duration: number; // in minutes
    createdAt: string;
}

export interface QuizResult {
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    subject: string;
    date: string;
}

export interface StudyMaterial {
    _id: string;
    type: 'summary' | 'flashcards' | 'quiz' | 'study-guide';
    content: string | Record<string, unknown>;
    title: string;
    createdAt: string;
}

export interface VoiceResponse {
    success: true;
    voiceUrl: string;
    text: string;
}

export interface ExamGenerationConfig {
    category: 'JAMB' | 'WAEC' | 'JUPEB' | 'UNIVERSITY';
    subject?: string;
    universityName?: string;
    department?: string;
    courseTitle?: string;
    count?: number;
}
