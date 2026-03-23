// Prefer explicit env; fall back to local backend, then production API.
// Using window.location.origin caused ws://localhost:5173 attempts in dev (frontend port).
export const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:3000' ||
    'https://izabi-backend.onrender.com';
