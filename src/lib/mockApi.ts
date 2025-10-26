// Mock API utilities for dashboard features
// These functions simulate backend API calls and can be easily replaced with real API calls later

export interface MockNote {
    id: string
    title: string
    content: string
    subject?: string
    createdAt: Date
    updatedAt: Date
}

export interface MockQuizResult {
    id: string
    score: number
    totalQuestions: number
    date: Date
    subject: string
}

export interface MockUserStats {
    totalQuizzes: number
    averageScore: number
    studyStreak: number
    totalStudyHours: number
    lastStudyDate: Date
}

// Mock data storage
const mockNotes: MockNote[] = [
    {
        id: "1",
        title: "Biology Chapter 5 - Cell Structure",
        content:
            "Key concepts: Nucleus, Mitochondria, Endoplasmic Reticulum, Golgi Apparatus. Remember the function of each organelle.",
        subject: "Biology",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: "2",
        title: "Math - Calculus Derivatives",
        content: "Power rule: d/dx(x^n) = n*x^(n-1). Chain rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)",
        subject: "Math",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
]

const mockQuizResults: MockQuizResult[] = [
    { id: "1", score: 85, totalQuestions: 10, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), subject: "Biology" },
    { id: "2", score: 92, totalQuestions: 10, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), subject: "Math" },
    {
        id: "3",
        score: 78,
        totalQuestions: 10,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        subject: "Chemistry",
    },
]

const mockStudyHistory = [
    {
        id: "1",
        fileName: "Biology Chapter 5 - Cell Structure",
        summary: "Comprehensive overview of cell organelles and their functions",
        keyPoints: [
            "Nucleus contains genetic material",
            "Mitochondria produces ATP energy",
            "Endoplasmic reticulum synthesizes proteins",
            "Golgi apparatus packages proteins",
        ],
        questions: [
            {
                id: "q1",
                question: "What is the primary function of mitochondria?",
                options: ["Protein synthesis", "Energy production", "Photosynthesis", "Storage"],
                correctAnswer: "Energy production",
                difficulty: "easy",
            },
            {
                id: "q2",
                question: "Which organelle is responsible for protein synthesis?",
                options: ["Nucleus", "Ribosome", "Golgi", "Lysosome"],
                correctAnswer: "Ribosome",
                difficulty: "medium",
            },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        id: "2",
        fileName: "Math - Calculus Derivatives",
        summary: "Essential calculus concepts for derivatives and their applications",
        keyPoints: [
            "Power rule: d/dx(x^n) = n*x^(n-1)",
            "Chain rule: d/dx(f(g(x))) = f'(g(x)) * g'(x)",
            "Product rule: d/dx(f*g) = f'*g + f*g'",
            "Quotient rule for division",
        ],
        questions: [
            {
                id: "q3",
                question: "What is the derivative of x^3?",
                options: ["3x^2", "x^2", "3x", "x^3"],
                correctAnswer: "3x^2",
                difficulty: "easy",
            },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
]

const mockUserProfile = {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    bio: "Passionate learner focused on STEM subjects",
    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    totalNotesCreated: 24,
    totalQuizzesTaken: 15,
    averageScore: 82,
}

// Mock API functions - Replace these with real API calls when backend is ready
export const mockApi = {
    // Notes API
    async getNotes(): Promise<MockNote[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockNotes), 300)
        })
    },

    async createNote(note: Omit<MockNote, "id" | "createdAt" | "updatedAt">): Promise<MockNote> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newNote: MockNote = {
                    ...note,
                    id: Date.now().toString(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                mockNotes.unshift(newNote)
                resolve(newNote)
            }, 200)
        })
    },

    async updateNote(id: string, updates: Partial<MockNote>): Promise<MockNote> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const note = mockNotes.find((n) => n.id === id)
                if (note) {
                    Object.assign(note, updates, { updatedAt: new Date() })
                    resolve(note)
                }
            }, 200)
        })
    },

    async deleteNote(id: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const index = mockNotes.findIndex((n) => n.id === id)
                if (index > -1) mockNotes.splice(index, 1)
                resolve()
            }, 200)
        })
    },

    // Quiz Results API
    async getQuizResults(): Promise<MockQuizResult[]> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockQuizResults), 300)
        })
    },

    async submitQuizResult(result: Omit<MockQuizResult, "id">): Promise<MockQuizResult> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newResult: MockQuizResult = {
                    ...result,
                    id: Date.now().toString(),
                }
                mockQuizResults.unshift(newResult)
                resolve(newResult)
            }, 200)
        })
    },

    // User Stats API
    async getUserStats(): Promise<MockUserStats> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalQuizzes: mockQuizResults.length,
                    averageScore: Math.round(mockQuizResults.reduce((sum, r) => sum + r.score, 0) / mockQuizResults.length),
                    studyStreak: 7,
                    totalStudyHours: 24.5,
                    lastStudyDate: new Date(),
                })
            }, 300)
        })
    },

    // AI Assistant API
    async getAIResponse(message: string): Promise<string> {
        const responses = [
            "That's a great question! Let me break this down for you...",
            "Based on what you've learned, here's the key concept...",
            "Excellent observation! This relates to...",
            "Let me explain this step by step...",
            "That's an interesting perspective. Consider this...",
            "This is a common misconception. Actually...",
            "Great question! The answer involves understanding...",
            "Let me provide you with a detailed explanation...",
        ]

        return new Promise((resolve) => {
            setTimeout(() => {
                const randomResponse = responses[Math.floor(Math.random() * responses.length)]
                resolve(
                    `${randomResponse} Based on your question about "${message}", here are some key points to consider: 1) Understanding the fundamentals is crucial, 2) Practice with examples helps reinforce concepts, 3) Don't hesitate to ask follow-up questions. Would you like me to elaborate on any of these points?`,
                )
            }, 1500)
        })
    },

    // Study history API
    async getStudyHistory(userId: string) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockStudyHistory), 300)
        })
    },

    // User profile API
    async getUserProfile(userId: string) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(mockUserProfile), 300)
        })
    },

    async updateUserProfile(userId: string, updates: any) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const updated = { ...mockUserProfile, ...updates }
                resolve(updated)
            }, 300)
        })
    },
}
