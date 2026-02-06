import { useEffect } from 'react';
import { BASE_URL } from '@/constants';

/*
 * What: A silent component that pings the backend every 5 minutes.
 * Why: To prevent platforms like Render from sleeping the free-tier backend instance.
 */
export const Heartbeat = () => {
    useEffect(() => {
        const pingBackend = async () => {
            try {
                // We use fetch directly to avoid triggering global error handlers/toasts if the ping fails silently
                await fetch(`${BASE_URL}/api`, { method: 'GET', keepalive: true });
                // console.debug('[Heartbeat] Backend ping successful');
            } catch (error) {
                // console.warn('[Heartbeat] Backend ping failed', error);
                // We intentionally stifle errors here to not disrupt the user experience
            }
        };

        // Initial ping
        pingBackend();

        // Set up interval for 5 minutes (300,000 ms)
        const intervalId = setInterval(pingBackend, 5 * 60 * 1000);

        // Cleanup on unmount
        return () => clearInterval(intervalId);
    }, []);

    return null; // This component renders nothing
};
