declare const apiClient: import("axios").AxiosInstance;
export declare const apiWithFallback: {
    getNotes(): Promise<any>;
    createNote(note: any): Promise<any>;
    updateNote(id: string, updates: any): Promise<any>;
    deleteNote(id: string): Promise<void>;
    getQuizResults(): Promise<any>;
    submitQuizResult(result: any): Promise<any>;
    getUserStats(): Promise<any>;
    getAIResponse(message: string): Promise<any>;
    getAIStream(message: string, userId: string, onChunk: (text: string) => void, onError: (err: any) => void, onComplete?: () => void): EventSource;
    getChatHistory(userId: string): Promise<any>;
    getStudyHistory(userId: string): Promise<any>;
    getUserProfile(userId: string): Promise<any>;
    updateUserProfile(userId: string, updates: any): Promise<any>;
};
export default apiClient;
