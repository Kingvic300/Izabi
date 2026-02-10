import axios from "axios"
import axiosRetry from 'axios-retry';
import { BASE_URL } from "@/constants"
import { toast } from "sonner"

// Simple in-memory cache for GET requests
const apiCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/*
 * How: Creates an Axios instance with base URL, credential handling, and custom timeout.
 * Why: To standardize HTTP requests across the application and handle slow network conditions.
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 120000, // Increased timeout for heavy AI generation or processing
})

// --- LOW NETWORK OPTIMIZATIONS ---

// 1. Automatic Retries with Exponential Backoff
// WHY: On bad networks (edge, weak 3G), requests often fail randomly. 
// This invisibly retries them rather than showing an error to the user.
axiosRetry(apiClient, { 
    retries: 3, 
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
               (error.response?.status && error.response.status >= 500);
    }
});

// 2. Cache Interceptor
// WHY: Reduces data usage and provides instant "perceived speed" for repeated views.
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    // Only cache GET requests
    if (config.method?.toLowerCase() === 'get') {
        const cacheKey = config.url + JSON.stringify(config.params || {});
        const cached = apiCache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            // Signal to the response interceptor that this is a cache hit
            (config as any)._isCacheHit = true;
            (config as any)._cachedData = cached.data;
        }
    }

    return config
})

/*
 * How: Intercepts responses to strictly handle errors, show toasts, and manage caching.
 */
apiClient.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        if (response.config.method?.toLowerCase() === 'get' && response.data) {
            const cacheKey = response.config.url + JSON.stringify(response.config.params || {});
            apiCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        }
        return response
    },
    (error) => {
        // Handle Cache Hit shortcut
        if (error.config?._isCacheHit) {
            return Promise.resolve({ ...error.config, data: error.config._cachedData, status: 200 });
        }

        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred"
        const statusCode = error.response?.status

        // Handle specific status codes
        if (statusCode === 401) {
            localStorage.removeItem("authToken")
            localStorage.removeItem("userId")
            window.location.href = "/login"
            toast.error("Session Expired")
        } else if (statusCode >= 500) {
            toast.error("Server synchronization error. Retrying background nodes...")
        } else if (!navigator.onLine) {
            toast.error("Offline Mode", {
                description: "Check your data connection. Some features may be restricted.",
            })
        }

        return Promise.reject(error)
    }
)

// Helper to check if error is network-related
export const isNetworkError = (error: any): boolean => {
    return (
        !navigator.onLine ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.message === "Network Error" ||
        (error.response && error.response.status >= 500)
    )
}

// Direct API wrapper
export const api = {
    /*
     * How: CRUD operations for study notes.
     * Why: Users need to create, read, update, and delete their generated notes.
     */
    async getNotes() {
        const response = await apiClient.get(`/api/notes`)
        return response.data
    },

    async createNote(note: any) {
        const response = await apiClient.post("/api/notes", note)
        return response.data
    },

    async updateNote(id: string, updates: any) {
        const userId = updates.userId || localStorage.getItem("userId")
        const response = await apiClient.put(`/api/notes/${id}`, { ...updates, userId })
        return response.data
    },

    async deleteNote(id: string) {
        await apiClient.delete(`/api/notes/${id}`)
    },

    // Quiz Results API
    async getQuizResults() {
        const response = await apiClient.get(`/api/quiz/results`)
        return response.data
    },

    async submitQuizResult(result: any) {
        const response = await apiClient.post("/api/quiz/results", result)
        return response.data
    },

    async getDailyChallenge() {
        const response = await apiClient.get(`/api/quiz/daily-challenge`)
        return response.data
    },

    async getPracticeQuestions(count: number = 5) {
        const response = await apiClient.get(`/api/quiz/practice-questions?count=${count}`)
        return response.data
    },

    async startQuickTest() {
        const response = await apiClient.post("/api/quiz/quick-test/start")
        return response.data
    },

    async submitQuickTest(quizId: string, answers: Record<string, string>) {
        const response = await apiClient.post("/api/quiz/quick-test/submit", { quizId, answers })
        return response.data
    },

    async feedPet() {
        const response = await apiClient.post("/api/user/pet/feed")
        return response.data
    },

    // User Stats API
    async getUserStats() {
        const response = await apiClient.get(`/api/user/stats`)
        return response.data
    },

    // Exams API
    async getExams(category: string, type?: string, institution?: string, subject?: string) {
        const params = new URLSearchParams()
        params.append('category', category)
        if (type) params.append('type', type)
        if (institution) params.append('institution', institution)
        if (subject) params.append('subject', subject)
        
        const response = await apiClient.get(`/api/exams/past-questions?${params.toString()}`)
        return response.data
    },

    /*
     * How: Generates a new exam based on topic/type using AI or backend logic.
     * Why: To provide on-demand practice material.
     */
    async generatePracticeExam(config: any) {
        const response = await apiClient.post("/api/exams/generate", config)
        return response.data
    },

    async getSimulation(config: any) {
        const params = new URLSearchParams()
        Object.entries(config).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString())
        })
        const response = await apiClient.get(`/api/exams/simulation?${params.toString()}`)
        return response.data
    },
    
    async generateVoice(text: string, lang: string = 'en', isPidgin: boolean = false) {
        const response = await apiClient.post("/api/study/generate-voice", { text, lang, isPidgin })
        return response.data
    },

    // Leaderboard API
    async getLeaderboard() {
        const userId = localStorage.getItem("userId")
        const response = await apiClient.get(`/api/study/leaderboard${userId ? `?userId=${userId}` : ''}`)
        return response.data
    },

    async getAIResponse(message: string) {
        const response = await apiClient.post("/api/ai/chat", { message })
        return response.data.response
    },

    /*
     * How: Establishes an EventSource connection for streaming AI responses.
     * Why: To provide a real-time, typewriter-style chat experience for long AI generations.
     */
    getAIStream(message: string, onChunk: (text: string) => void, onError: (err: any) => void, onComplete?: () => void) {
        const token = localStorage.getItem("authToken")
        const url = `${BASE_URL}/api/ai/stream?message=${encodeURIComponent(message)}&token=${token}`
        const eventSource = new EventSource(url)

        eventSource.onmessage = (event) => {
            if (event.data === "[DONE]") {
                eventSource.close()
                if (onComplete) onComplete()
                return
            }

            // Handle Stream Errors
            if (event.data.startsWith("[ERROR]:")) {
                const errorMsg = event.data.replace("[ERROR]:", "").trim();
                if (errorMsg.toLowerCase().includes("daily limit")) {
                    const now = new Date();
                    const midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    const diff = midnight.getTime() - now.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

                    toast.error("Daily Limit Reached", {
                        description: `${errorMsg} Resets in ${hours}h ${minutes}m.`,
                        duration: Infinity,
                    });
                } else {
                    toast.error("AI Error", { description: errorMsg });
                }
                eventSource.close();
                if (onComplete) onComplete();
                return;
            }

            try {
                const data = JSON.parse(event.data)
                if (data && typeof data === 'object' && data.data) {
                    onChunk(data.data)
                } else {
                    onChunk(event.data)
                }
            } catch (e) {
                onChunk(event.data)
            }
        }

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err)
            onError(err)
            eventSource.close()
            if (onComplete) onComplete()
        }

        return eventSource
    },

    async getChatHistory() {
        const response = await apiClient.get(`/api/ai/history`)
        return response.data
    },

    async clearChatHistory() {
        const response = await apiClient.post(`/api/ai/clear-history`)
        return response.data
    },

    // Study History API
    async getStudyHistory() {
        const response = await apiClient.get(`/api/study/history`)
        return response.data
    },

    // User Profile API
    async getUserProfile() {
        const response = await apiClient.get(`/api/user/profile`)
        return response.data
    },

    async updateUserProfile(updates: any) {
        const response = await apiClient.put(`/api/user/profile`, updates)
        return response.data
    },

    async submitGroqKey(apiKey: string) {
        const response = await apiClient.post("/api/user/submit-groq-key", { apiKey })
        return response.data
    },

    
    // Admin API
    async getAdminStats() {
        const response = await apiClient.get("/api/admin/stats")
        return response.data
    },

    async getAllUsers() {
        const response = await apiClient.get("/api/admin/users")
        return response.data
    },

    async getContributedKeys() {
        const response = await apiClient.get("/api/admin/contributed-keys")
        return response.data
    },

    async getUserHistory(userId: string) {
        const response = await apiClient.get(`/api/admin/users/${userId}/history`)
        return response.data
    },

    async deleteUser(userId: string) {
        await apiClient.delete(`/api/admin/users/${userId}`)
    },

    async logout() {
        await apiClient.post("/api/user/logout");
    },

    // --- BACKGROUND PROCESSING ---
    async ingestDirect(file: File, type: string, options?: any) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        if (options) {
            formData.append('options', JSON.stringify(options));
        }

        const response = await apiClient.post("/api/study/ingest-direct", formData);
        return response.data;
    },

    async ingestText(data: { text: string, fileName: string, type: string, options?: any }) {
        const response = await apiClient.post("/api/study/ingest-text", data)
        return response.data
    },

    async getJobStatus(jobId: string) {
        const response = await apiClient.get(`/api/study/job-status/${jobId}`)
        return response.data
    },

    // PDF Splitting API
    async analyzePDF(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post("/api/study/analyze-pdf", formData);
        return response.data;
    },

    async processPDFSection(data: {
        fileUrl: string;
        pageStart: number;
        pageEnd: number;
        sectionTitle?: string;
        type: 'summary' | 'flashcards' | 'quiz' | 'study-guide';
        options?: any;
    }) {
        const response = await apiClient.post("/api/study/process-pdf-section", data);
        return response.data;
    }
}

export default apiClient
