export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ActiveDocument {
    documentId: string;
    fileName: string;
}

export interface ChatSession {
    sessionId: string;
    title?: string;
    promptCount?: number;
    createdAt?: string;
    updatedAt?: string;
    lastMessage?: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
    } | null;
}
