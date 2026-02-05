import axios from "axios"
import { BASE_URL } from "@/contants/contants.ts"

// Configure axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 8000,
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
    async getUserStats() {
        const response = await apiClient.get("/api/user/stats")
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

export const api = apiWithFallback;

export default apiClient

