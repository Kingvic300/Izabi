import axios from "axios"
import { BASE_URL } from "@/contants/contants.ts"

// Configure axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 8000,
})

// Add a request interceptor to attach the auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Helper to check if error is network-related
const isNetworkError = (error: any): boolean => {
    return (
        !navigator.onLine ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.message === "Network Error" ||
        (error.response && error.response.status >= 500)
    )
}

// Helper to log mock data usage
const logMockDataUsage = (endpoint: string, reason: string) => {
    console.warn(`[API Fallback] Using mock data for ${endpoint}: ${reason}`)
}

const handleApiError = (endpoint: string, error: any, context?: any) => {
    const errorMessage = error.response?.data?.message || error.message || "Unknown error"
    const statusCode = error.response?.status

    console.error(`[API Error] ${endpoint}:`, errorMessage)

    // Log to context if available (for UI display)
    if (context?.setError) {
        context.setError({
            message: `Failed to load data`,
            description: `${endpoint}: ${errorMessage}`,
            type: "error",
        })
    }

    return {
        error: true,
        message: errorMessage,
        statusCode,
    }
}

// Direct API wrapper
export const apiWithFallback = {
    // Notes API
    async getNotes() {
        const response = await apiClient.get("/api/notes")
        return response.data
    },

    async createNote(note: any) {
        const response = await apiClient.post("/api/notes", note)
        return response.data
    },

    async updateNote(id: string, updates: any) {
        const response = await apiClient.put(`/api/notes/${id}`, updates)
        return response.data
    },

    async deleteNote(id: string) {
        await apiClient.delete(`/api/notes/${id}`)
    },

    // Quiz Results API
    async getQuizResults() {
        const response = await apiClient.get("/api/quiz/results")
        return response.data
    },

    async submitQuizResult(result: any) {
        const response = await apiClient.post("/api/quiz/results", result)
        return response.data
    },

    // User Stats API
    async getUserStats(userId?: string) {
        const id = userId || localStorage.getItem("userId")
        const response = await apiClient.get(`/api/user/stats${id ? `?userId=${id}` : ""}`)
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

    async generateMockExam(topic: string, type: string) {
        const response = await apiClient.post("/api/exams/generate-mock", { topic, type })
        return response.data
    },

    // Leaderboard API
    async getLeaderboard() {
        const response = await apiClient.get("/api/study/leaderboard")
        return response.data
    },

    async getAIResponse(message: string) {
        const response = await apiClient.post("/api/ai/chat", { message })
        return response.data.response
    },

    getAIStream(message: string, userId: string, onChunk: (text: string) => void, onError: (err: any) => void, onComplete?: () => void) {
        const url = `${BASE_URL}/api/ai/stream?message=${encodeURIComponent(message)}&userId=${encodeURIComponent(userId)}`
        const eventSource = new EventSource(url, { withCredentials: true })

        eventSource.onmessage = (event) => {
            if (event.data === "[DONE]") {
                eventSource.close()
                if (onComplete) onComplete()
                return
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

    async getChatHistory(userId: string) {
        try {
            const response = await apiClient.get(`/api/ai/history?userId=${userId}`)
            return response.data
        } catch (error: any) {
            console.error("[API Error] Failed to fetch chat history:", error.message)
            return null
        }
    },

    // Study History API
    async getStudyHistory(userId: string) {
        const response = await apiClient.get(`/api/study/history?userId=${userId}`)
        return response.data
    },

    // User Profile API
    async getUserProfile(userId: string) {
        const response = await apiClient.get(`/api/user/profile/${userId}`)
        return response.data
    },

    async updateUserProfile(userId: string, updates: any) {
        const response = await apiClient.put(`/api/user/profile/${userId}`, updates)
        return response.data
    },
}

// Add a request interceptor to attach the auth token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const api = apiWithFallback;

export default apiClient

