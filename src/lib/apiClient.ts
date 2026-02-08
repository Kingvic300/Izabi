import axios from "axios"
import { BASE_URL } from "@/constants"
import { toast } from "sonner"

/*
 * How: Creates an Axios instance with base URL, credential handling, and custom timeout.
 * Why: To standardize HTTP requests across the application and handle slow network conditions.
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 15000, 
})

/*
 * How: Intercepts outgoing requests to append the Authorization header with the stored token.
 * Why: To ensure all API calls are authenticated without manual header management.
 */
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/*
 * How: Intercepts responses to strictly handle errors, show toasts for specific status codes (401, 403, etc.), and manage redirects.
 * Why: To provide consistent global error feedback and handle session expiration automatically.
 */
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred"
        const statusCode = error.response?.status

        // Handle specific status codes
        if (statusCode === 401) {
            // Unauthorized - clear token and redirect if needed
            localStorage.removeItem("authToken")
            localStorage.removeItem("userId")
            window.location.href = "/login"
            toast.error("Session Expired", {
                description: "Please sign in again to continue.",
            })
        } else if (statusCode === 403) {
            toast.error("Access Denied", {
                description: "You don't have permission to perform this action.",
            })
        } else if (statusCode === 404) {
            const detail = error.response?.data?.message || "The requested resource could not be located."
            toast.error("Not Found", {
                description: detail,
            })
        } else if (statusCode >= 500) {
            toast.error("Engine Overload", {
                description: "The Izabi core is experiencing high thermal load. It's us, not you! Please wait a moment while we recalibrate.",
            })
        } else if (!navigator.onLine) {
            toast.error("Connection Failed", {
                description: "Please check your internet connection.",
            })
        } else if (error.code === "ECONNABORTED") {
            toast.error("Temporal Anomaly", {
                description: "The request took too long to synchronize. Our engines are a bit slow today—please try again!",
            })
        } else {
            // Check for daily limit errors
            if (errorMessage.toLowerCase().includes("daily limit")) {
                const now = new Date();
                const midnight = new Date();
                midnight.setHours(24, 0, 0, 0);
                const diff = midnight.getTime() - now.getTime();
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                
                toast.error("Daily Limit Reached", {
                    description: `${errorMessage} Resets in ${hours}h ${minutes}m.`,
                    duration: Infinity, // Permanent toast
                })
            } else {
                // Generic error for other cases (like 400 Bad Request if not handled locally)
                toast.error("Error", {
                    description: errorMessage,
                })
            }
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
    async getNotes(userId?: string) {
        const id = userId || localStorage.getItem("userId")
        const response = await apiClient.get(`/api/notes${id ? `?userId=${id}` : ""}`)
        return response.data
    },

    async createNote(note: any) {
        const userId = note.userId || localStorage.getItem("userId")
        const response = await apiClient.post("/api/notes", { ...note, userId })
        return response.data
    },

    async updateNote(id: string, updates: any) {
        const userId = updates.userId || localStorage.getItem("userId")
        const response = await apiClient.put(`/api/notes/${id}`, { ...updates, userId })
        return response.data
    },

    async deleteNote(id: string) {
        const userId = localStorage.getItem("userId")
        await apiClient.delete(`/api/notes/${id}${userId ? `?userId=${userId}` : ""}`)
    },

    // Quiz Results API
    async getQuizResults() {
        const userId = localStorage.getItem("userId")
        const response = await apiClient.get(`/api/quiz/results${userId ? `?userId=${userId}` : ""}`)
        return response.data
    },

    async submitQuizResult(result: any) {
        const response = await apiClient.post("/api/quiz/results", result)
        return response.data
    },

    async getDailyChallenge() {
        const userId = localStorage.getItem("userId")
        const response = await apiClient.get(`/api/quiz/daily-challenge${userId ? `?userId=${userId}` : ""}`)
        return response.data
    },

    async getPracticeQuestions(count: number = 5) {
        const response = await apiClient.get(`/api/quiz/practice-questions?count=${count}`)
        return response.data
    },

    async feedPet(userId: string) {
        const response = await apiClient.post("/api/user/pet/feed", { userId })
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

    /*
     * How: Generates a new exam based on topic/type using AI or backend logic.
     * Why: To provide on-demand practice material.
     */
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

    /*
     * How: Establishes an EventSource connection for streaming AI responses.
     * Why: To provide a real-time, typewriter-style chat experience for long AI generations.
     */
    getAIStream(message: string, userId: string, onChunk: (text: string) => void, onError: (err: any) => void, onComplete?: () => void) {
        const url = `${BASE_URL}/api/ai/stream?message=${encodeURIComponent(message)}&userId=${encodeURIComponent(userId)}`
        const eventSource = new EventSource(url, { withCredentials: true })

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

    async getChatHistory(userId: string) {
        const response = await apiClient.get(`/api/ai/history?userId=${userId}`)
        return response.data
    },

    async clearChatHistory(userId: string) {
        const response = await apiClient.post(`/api/ai/clear-history`, { userId })
        return response.data
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

    async submitGroqKey(userId: string, apiKey: string) {
        const response = await apiClient.post("/api/user/submit-groq-key", { userId, apiKey })
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

    async logout(userId: string | null) {
        if (!userId) return;
        await apiClient.post("/api/user/logout", { userId });
    }
}

export default apiClient

