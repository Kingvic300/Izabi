export interface MockNote {
    id: string;
    title: string;
    content: string;
    subject?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface MockQuizResult {
    id: string;
    score: number;
    totalQuestions: number;
    date: Date;
    subject: string;
}
export interface MockUserStats {
    totalQuizzes: number;
    averageScore: number;
    studyStreak: number;
    totalStudyHours: number;
    lastStudyDate: Date;
}
export declare const mockApi: {
    getNotes(): Promise<MockNote[]>;
    createNote(note: Omit<MockNote, "id" | "createdAt" | "updatedAt">): Promise<MockNote>;
    updateNote(id: string, updates: Partial<MockNote>): Promise<MockNote>;
    deleteNote(id: string): Promise<void>;
    getQuizResults(): Promise<MockQuizResult[]>;
    submitQuizResult(result: Omit<MockQuizResult, "id">): Promise<MockQuizResult>;
    getUserStats(): Promise<MockUserStats>;
    getAIResponse(message: string): Promise<string>;
    getStudyHistory(userId: string): Promise<unknown>;
    getUserProfile(userId: string): Promise<unknown>;
    updateUserProfile(userId: string, updates: any): Promise<unknown>;
};
