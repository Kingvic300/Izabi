import axios from "axios"
import { BASE_URL } from "@/contants/contants.ts"
import { mockApi } from "./mockApi"

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

// Hybrid API wrapper with fallback
export const apiWithFallback = {
    // Notes API
    async getNotes() {
        try {
            const response = await apiClient.get("/api/notes")
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("GET /api/notes", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to fetch notes:", error.message)
            }
            return mockApi.getNotes()
        }
    },

    async createNote(note: any) {
        try {
            const response = await apiClient.post("/api/notes", note)
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("POST /api/notes", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to create note:", error.message)
            }
            return mockApi.createNote(note)
        }
    },

    async updateNote(id: string, updates: any) {
        try {
            const response = await apiClient.put(`/api/notes/${id}`, updates)
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage(`PUT /api/notes/${id}`, "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to update note:", error.message)
            }
            return mockApi.updateNote(id, updates)
        }
    },

    async deleteNote(id: string) {
        try {
            await apiClient.delete(`/api/notes/${id}`)
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage(`DELETE /api/notes/${id}`, "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to delete note:", error.message)
            }
            return mockApi.deleteNote(id)
        }
    },

    // Quiz Results API
    async getQuizResults() {
        try {
            const response = await apiClient.get("/api/quiz/results")
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("GET /api/quiz/results", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to fetch quiz results:", error.message)
            }
            return mockApi.getQuizResults()
        }
    },

    async submitQuizResult(result: any) {
        try {
            const response = await apiClient.post("/api/quiz/results", result)
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("POST /api/quiz/results", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to submit quiz result:", error.message)
            }
            return mockApi.submitQuizResult(result)
        }
    },

    // User Stats API
    async getUserStats() {
        try {
            const response = await apiClient.get("/api/user/stats")
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("GET /api/user/stats", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to fetch user stats:", error.message)
            }
            return mockApi.getUserStats()
        }
    },

    // AI Assistant API
    async getAIResponse(message: string) {
        try {
            const response = await apiClient.post("/api/ai/chat", { message })
            return response.data.response
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("POST /api/ai/chat", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to get AI response:", error.message)
            }
            return mockApi.getAIResponse(message)
        }
    },

    // Study History API
    async getStudyHistory(userId: string) {
        try {
            const response = await apiClient.get(`/api/study/history?userId=${userId}`)
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("GET /api/study/history", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to fetch study history:", error.message)
            }
            return mockApi.getStudyHistory(userId)
        }
    },

    // User Profile API
    async getUserProfile(userId: string) {
        try {
            const response = await apiClient.get(`/api/user/profile/${userId}`)
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("GET /api/user/profile", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to fetch user profile:", error.message)
            }
            return mockApi.getUserProfile(userId)
        }
    },

    async updateUserProfile(userId: string, updates: any) {
        try {
            const response = await apiClient.put(`/api/user/profile/${userId}`, updates)
            return response.data
        } catch (error: any) {
            if (isNetworkError(error)) {
                logMockDataUsage("PUT /api/user/profile", "Network error or server unavailable")
            } else {
                console.error("[API Error] Failed to update user profile:", error.message)
            }
            return mockApi.updateUserProfile(userId, updates)
        }
    },
}

export default apiClient
