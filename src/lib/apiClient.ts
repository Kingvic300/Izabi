import axios from 'axios';
import axiosRetry from 'axios-retry';
import { BASE_URL } from '@/constants';
import { toast } from 'sonner';
import { getReadableError } from '@/lib/readableErrors';
import { getToastDedupe } from '@/lib/toastDedupe';
import { clearImpersonationSession } from '@/lib/impersonation';

// Simple in-memory cache for GET requests
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const clearApiCache = () => {
    apiCache.clear();
};

/*
 * How: Creates an Axios instance with base URL, credential handling, and custom timeout.
 * Why: To standardize HTTP requests across the application and handle slow network conditions.
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 120000, // Increased timeout for heavy AI generation or processing
});

const refreshClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 120000,
});

let isRefreshingToken = false;
let refreshQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const clearAuthSession = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userProfilePicturePath');
    clearImpersonationSession();
};

const redirectToLogin = () => {
    if (typeof window === 'undefined') return;
    const isAlreadyOnLogin =
        window.location.pathname === '/login' ||
        window.location.pathname.startsWith('/login/');
    if (!isAlreadyOnLogin) {
        window.location.replace('/login');
    }
};

const resolveRefreshQueue = (token: string) => {
    refreshQueue.forEach((item) => item.resolve(token));
    refreshQueue = [];
};

const rejectRefreshQueue = (error: any) => {
    refreshQueue.forEach((item) => item.reject(error));
    refreshQueue = [];
};

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('Missing refresh token');
    }

    const response = await refreshClient.post(
        '/api/auth/refresh',
        null,
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        },
    );

    return response.data as {
        accessToken: string;
        refreshToken?: string;
    };
};

// --- LOW NETWORK OPTIMIZATIONS ---

// 1. Automatic Retries with Exponential Backoff
// WHY: On bad networks (edge, weak 3G), requests often fail randomly.
// This invisibly retries them rather than showing an error to the user.
axiosRetry(apiClient, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            (error.response?.status && error.response.status >= 500)
        );
    },
});

// 2. Cache Interceptor
// WHY: Reduces data usage and provides instant "perceived speed" for repeated views.
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const skipCache =
        (config.headers as any)?.['x-skip-cache'] ||
        (config as any).skipCache;

    // Only cache GET requests
    if (!skipCache && config.method?.toLowerCase() === 'get') {
        const cacheKey =
            (config.baseURL || '') +
            (config.url || '') +
            JSON.stringify(config.params || {});
        const cached = apiCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            // Signal to the response interceptor that this is a cache hit
            (config as any)._isCacheHit = true;
            (config as any)._cachedData = cached.data;
        }
    }

    return config;
});

/*
 * How: Intercepts responses to strictly handle errors, show toasts, and manage caching.
 */
apiClient.interceptors.response.use(
    (response) => {
        // Cache successful GET responses
        const skipCache =
            (response.config.headers as any)?.['x-skip-cache'] ||
            (response.config as any).skipCache;
        if (
            !skipCache &&
            response.config.method?.toLowerCase() === 'get' &&
            response.data
        ) {
            const cacheKey =
                (response.config.baseURL || '') +
                (response.config.url || '') +
                JSON.stringify(response.config.params || {});
            apiCache.set(cacheKey, {
                data: response.data,
                timestamp: Date.now(),
            });
        }
        return response;
    },
    async (error) => {
        // Handle Cache Hit shortcut
        if (error.config?._isCacheHit) {
            return Promise.resolve({
                ...error.config,
                data: error.config._cachedData,
                status: 200,
            });
        }

        const statusCode = error.response?.status;
        const originalRequest = error.config || {};

        if (
            statusCode === 401 &&
            !originalRequest._retry &&
            !originalRequest.skipAuthRefresh
        ) {
            if (!localStorage.getItem('refreshToken')) {
                return Promise.reject(error);
            }

            if (isRefreshingToken) {
                return new Promise((resolve, reject) => {
                    refreshQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers =
                                originalRequest.headers || {};
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshingToken = true;

            try {
                const tokens = await refreshAccessToken();
                const newAccessToken = tokens.accessToken;
                localStorage.setItem('authToken', newAccessToken);
                if (tokens.refreshToken) {
                    localStorage.setItem('refreshToken', tokens.refreshToken);
                }

                resolveRefreshQueue(newAccessToken);
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError: any) {
                rejectRefreshQueue(refreshError);
                const refreshStatus = refreshError?.response?.status;
                if (refreshStatus === 401 || refreshStatus === 403) {
                    clearAuthSession();
                    redirectToLogin();
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshingToken = false;
            }
        }

        const readable = getReadableError(error);
        const shouldShowGlobalToast =
            !error.config?.skipGlobalErrorToast &&
            (!statusCode || statusCode === 401 || statusCode >= 500);

        // Show a single toast for global errors (including 401) without forcing logout
        if (shouldShowGlobalToast) {
            const { id, suppressed } = getToastDedupe(
                'error',
                readable.title,
                readable.description,
                5000,
            );
            if (!suppressed) {
                toast.error(readable.title, {
                    id,
                    description: readable.description,
                    duration: 5000,
                });
            }
        }

        return Promise.reject(error);
    },
);

// Helper to check if error is network-related
export const isNetworkError = (error: any): boolean => {
    return (
        !navigator.onLine ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND' ||
        error.message === 'Network Error' ||
        (error.response && error.response.status >= 500)
    );
};

// Direct API wrapper
export const api = {
    /*
     * How: CRUD operations for study notes.
     * Why: Users need to create, read, update, and delete their generated notes.
     */
    async getNotes(groupId?: string) {
        const response = await apiClient.get(`/api/notes`, {
            params: groupId ? { groupId } : undefined,
        });
        return response.data;
    },

    async createNote(note: any) {
        const response = await apiClient.post('/api/notes', note);
        return response.data;
    },

    async updateNote(id: string, updates: any) {
        const normalizedId = String(id || '').trim();
        if (
            !normalizedId ||
            normalizedId === 'undefined' ||
            normalizedId === 'null'
        ) {
            throw new Error('Invalid note identifier');
        }
        const userId = updates.userId || localStorage.getItem('userId');
        const response = await apiClient.put(`/api/notes/${normalizedId}`, {
            ...updates,
            userId,
        });
        return response.data;
    },

    async deleteNote(id: string) {
        const normalizedId = String(id || '').trim();
        if (
            !normalizedId ||
            normalizedId === 'undefined' ||
            normalizedId === 'null'
        ) {
            throw new Error('Invalid note identifier');
        }
        await apiClient.delete(`/api/notes/${normalizedId}`);
    },

    async getGroups() {
        const response = await apiClient.get(`/api/groups`);
        return response.data;
    },

    async createGroup(name: string) {
        const response = await apiClient.post(`/api/groups`, { name });
        return response.data;
    },

    async updateGroup(id: string, name: string) {
        const normalizedId = String(id || '').trim();
        if (
            !normalizedId ||
            normalizedId === 'undefined' ||
            normalizedId === 'null'
        ) {
            throw new Error('Invalid group identifier');
        }
        const response = await apiClient.patch(`/api/groups/${normalizedId}`, {
            name,
        });
        return response.data;
    },

    async deleteGroup(id: string) {
        const normalizedId = String(id || '').trim();
        if (
            !normalizedId ||
            normalizedId === 'undefined' ||
            normalizedId === 'null'
        ) {
            throw new Error('Invalid group identifier');
        }
        await apiClient.delete(`/api/groups/${normalizedId}`);
    },

    async importNote(
        file: File,
        metadata?: { title?: string; subject?: string },
        options?: { preview?: boolean },
    ) {
        const formData = new FormData();
        formData.append('file', file);
        if (metadata?.title) formData.append('title', metadata.title);
        if (metadata?.subject) formData.append('subject', metadata.subject);

        const previewParam = options?.preview ? '?preview=true' : '';
        const response = await apiClient.post(
            `/api/notes/import${previewParam}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data', 'x-skip-cache': 'true' },
            },
        );
        return response.data;
    },

    // Quiz Results API
    async getQuizResults() {
        const response = await apiClient.get(`/api/quiz/results`);
        return response.data;
    },

    async submitQuizResult(result: any) {
        const normalizedPayload = {
            ...result,
            quizTitle:
                (typeof result?.quizTitle === 'string' &&
                    result.quizTitle.trim()) ||
                (typeof result?.subject === 'string' &&
                    result.subject.trim()) ||
                'Practice Quiz',
        };
        const response = await apiClient.post(
            '/api/quiz/results',
            normalizedPayload,
        );
        return response.data;
    },

    async getDailyChallenge() {
        const response = await apiClient.get(`/api/quiz/daily-challenge`);
        return response.data;
    },

    async getPracticeQuestions(count: number = 5) {
        const response = await apiClient.get(
            `/api/quiz/practice-questions?count=${count}`,
        );
        return response.data;
    },

    async startQuickTest() {
        const response = await apiClient.post('/api/quiz/quick-test/start');
        return response.data;
    },

    async submitQuickTest(quizId: string, answers: Record<string, string>) {
        const response = await apiClient.post('/api/quiz/quick-test/submit', {
            quizId,
            answers,
        });
        return response.data;
    },

    async feedPet() {
        const response = await apiClient.post('/api/user/pet/feed');
        return response.data;
    },

    // User Stats API
    async getUserStats() {
        const response = await apiClient.get(`/api/user/stats`);
        return response.data;
    },

    // Exams API
    async getExams(
        category: string,
        type?: string,
        institution?: string,
        subject?: string,
    ) {
        const params = new URLSearchParams();
        params.append('category', category);
        if (type) params.append('type', type);
        if (institution) params.append('institution', institution);
        if (subject) params.append('subject', subject);

        const response = await apiClient.get(
            `/api/exams/past-questions?${params.toString()}`,
        );
        return response.data;
    },

    /*
     * How: Generates a new exam based on topic/type using AI or backend logic.
     * Why: To provide on-demand practice material.
     */
    async generatePracticeExam(config: any) {
        const response = await apiClient.post('/api/exams/generate', config);
        return response.data;
    },

    async getSimulation(config: any) {
        const params = new URLSearchParams();
        Object.entries(config).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString());
        });
        const response = await apiClient.get(
            `/api/exams/simulation?${params.toString()}`,
        );
        return response.data;
    },

    async generateVoice(
        text: string,
        lang: string = 'en',
        isPidgin: boolean = false,
    ) {
        const response = await apiClient.post('/api/study/generate-voice', {
            text,
            lang,
            isPidgin,
        });
        return response.data;
    },

    // Leaderboard API
    async getLeaderboard() {
        const userId = localStorage.getItem('userId');
        const response = await apiClient.get(
            `/api/study/leaderboard${userId ? `?userId=${userId}` : ''}`,
        );
        return response.data;
    },

    async getLeaderboardShare(type: 'xp' | 'streak' = 'xp') {
        const query = new URLSearchParams();
        if (type) query.set('type', type);
        const response = await apiClient.get(
            `/api/study/leaderboard/share?${query.toString()}`,
        );
        return response.data;
    },

    async getAIResponse(
        message: string,
        documentId?: string,
        sessionId?: string,
    ) {
        const response = await apiClient.post('/api/ai/chat', {
            message,
            documentId,
            sessionId,
        });
        return response.data.response;
    },

    async summarizeText(text: string) {
        const response = await apiClient.post('/api/ai/summarize', { text });
        return response.data;
    },

    async getAiJobStatus(jobId: string) {
        const response = await apiClient.get(`/api/ai/jobs/${jobId}`);
        return response.data;
    },

    /*
     * How: Establishes an EventSource connection for streaming AI responses.
     * Why: To provide a real-time, typewriter-style chat experience for long AI generations.
     */
    getAIStream(
        message: string,
        onChunk: (text: string) => void,
        onError: (err: any) => void,
        onComplete?: () => void,
        documentId?: string,
        sessionId?: string,
    ) {
        const token = localStorage.getItem('authToken');
        const query = new URLSearchParams({
            message,
            token: token || '',
        });
        if (documentId) {
            query.append('documentId', documentId);
        }
        if (sessionId) {
            query.append('sessionId', sessionId);
        }
        const url = `${BASE_URL}/api/ai/stream?${query.toString()}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
                eventSource.close();
                if (onComplete) onComplete();
                return;
            }

            // Handle Stream Errors
            if (event.data.startsWith('[ERROR]:')) {
                const errorMsg = event.data.replace('[ERROR]:', '').trim();
                if (errorMsg.toLowerCase().includes('daily limit')) {
                    const now = new Date();
                    const midnight = new Date();
                    midnight.setHours(24, 0, 0, 0);
                    const diff = midnight.getTime() - now.getTime();
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const minutes = Math.floor(
                        (diff % (1000 * 60 * 60)) / (1000 * 60),
                    );

                    const description = `${errorMsg} Resets in ${hours}h ${minutes}m.`;
                    const { id, suppressed } = getToastDedupe(
                        'error',
                        'Daily Limit Reached',
                        description,
                        5000,
                    );
                    if (!suppressed) {
                        toast.error('Daily Limit Reached', {
                            id,
                            description,
                            duration: 5000,
                        });
                    }
                } else {
                    const { id, suppressed } = getToastDedupe(
                        'error',
                        'AI Error',
                        errorMsg,
                        5000,
                    );
                    if (!suppressed) {
                        toast.error('AI Error', {
                            id,
                            description: errorMsg,
                        });
                    }
                }
                eventSource.close();
                if (onComplete) onComplete();
                return;
            }

            try {
                const data = JSON.parse(event.data);
                if (data && typeof data === 'object' && data.data) {
                    onChunk(data.data);
                } else {
                    onChunk(event.data);
                }
            } catch (e) {
                onChunk(event.data);
            }
        };

        eventSource.onerror = (err) => {
            console.error('EventSource failed:', err);
            onError(err);
            eventSource.close();
            if (onComplete) onComplete();
        };

        return eventSource;
    },

    async getChatHistory(sessionId?: string) {
        const query = new URLSearchParams();
        if (sessionId) query.set('sessionId', sessionId);
        const response = await apiClient.get(
            `/api/ai/history?${query.toString()}`,
        );
        return response.data;
    },

    async clearChatHistory(sessionId?: string) {
        const response = await apiClient.post(`/api/ai/clear-history`, {
            sessionId,
        });
        return response.data;
    },

    async getChatSessions() {
        const response = await apiClient.get(`/api/ai/sessions`);
        return response.data;
    },

    async createChatSession() {
        const response = await apiClient.post(`/api/ai/sessions`);
        return response.data;
    },

    async uploadPDFForChat(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/api/ai/upload-pdf', formData);
        return response.data;
    },

    // Study History API
    async getStudyHistory() {
        const response = await apiClient.get(`/api/study/history`);
        return response.data;
    },

    // User Profile API
    async getUserProfile() {
        const response = await apiClient.get(`/api/user/profile`);
        return response.data;
    },

    async updateUserProfile(updates: any) {
        const response = await apiClient.put(`/api/user/profile`, updates);
        return response.data;
    },

    async submitGroqKey(apiKey: string) {
        const response = await apiClient.post('/api/user/submit-groq-key', {
            apiKey,
        });
        return response.data;
    },

    // Admin API
    async getAdminStats() {
        const response = await apiClient.get('/api/admin/stats');
        return response.data;
    },

    async getAllUsers() {
        const response = await apiClient.get('/api/admin/users');
        return response.data;
    },

    async sendLiveAnnouncement(payload?: { dryRun?: boolean; limit?: number }) {
        const response = await apiClient.post(
            '/api/admin/announce-live',
            payload || {},
        );
        return response.data;
    },

    async getUserHistory(userId: string) {
        const response = await apiClient.get(
            `/api/admin/users/${userId}/history`,
        );
        return response.data;
    },

    async deleteUser(userId: string) {
        await apiClient.delete(`/api/admin/users/${userId}`);
    },

    // Impersonation API
    async startImpersonation(userId: string) {
        const response = await apiClient.post(`/api/admin/impersonate/${userId}`);
        return response.data;
    },

    async stopImpersonation() {
        const response = await apiClient.post('/api/admin/stop-impersonation');
        return response.data;
    },

    async getImpersonationStatus() {
        const response = await apiClient.get('/api/admin/impersonation-status');
        return response.data;
    },

    async getImpersonationHistory() {
        const response = await apiClient.get('/api/admin/impersonation-history');
        return response.data;
    },

    async logout() {
        await apiClient.post(
            '/api/auth/logout',
            null,
            { skipGlobalErrorToast: true } as any,
        );
    },

    // --- BACKGROUND PROCESSING ---
    async ingestDirect(file: File, type: string, options?: any) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        if (options) {
            formData.append('options', JSON.stringify(options));
        }

        const response = await apiClient.post(
            '/api/study/ingest-direct',
            formData,
        );
        return response.data;
    },

    async ingestText(data: {
        text: string;
        fileName: string;
        type: string;
        options?: any;
    }) {
        const response = await apiClient.post('/api/study/ingest-text', data);
        return response.data;
    },

    async getJobStatus(jobId: string) {
        const response = await apiClient.get(`/api/study/job-status/${jobId}`);
        return response.data;
    },

    // PDF Splitting API
    async analyzePDF(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(
            '/api/study/analyze-pdf',
            formData,
        );
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
        const response = await apiClient.post(
            '/api/study/process-pdf-section',
            data,
        );
        return response.data;
    },

    // Payment/Subscription APIs
    async startPayment(plan: 'pro_monthly' | 'premium_monthly') {
        const response = await apiClient.post('/api/payments/initialize', {
            plan,
        });
        return response.data;
    },

    async verifyPayment(reference: string) {
        const response = await apiClient.get(
            `/api/payments/verify/${reference}`,
        );
        return response.data;
    },

    async cancelAutoRenew() {
        const response = await apiClient.post(
            '/api/payments/cancel-auto-renew',
        );
        return response.data;
    },
};

export default apiClient;
