import { useEffect } from 'react';
import { toast } from 'sonner';
import { getReadableError } from '@/lib/readableErrors';
import { getToastDedupe } from '@/lib/toastDedupe';

export const GlobalErrorHandlers = () => {
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const readable = getReadableError(event.reason);
            const title = readable.title || 'Action failed';
            const { id, suppressed } = getToastDedupe(
                'error',
                title,
                readable.description,
                5000,
            );
            if (suppressed) return;
            toast.error(title, {
                id,
                description: readable.description,
                duration: 5000,
            });
        };

        const handleError = (event: ErrorEvent) => {
            const readable = getReadableError(event.error || event.message);
            const title = 'Something went wrong';
            const { id, suppressed } = getToastDedupe(
                'error',
                title,
                readable.description,
                5000,
            );
            if (suppressed) return;
            toast.error(title, {
                id,
                description: readable.description,
                duration: 5000,
            });
        };

        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        window.addEventListener('error', handleError);

        return () => {
            window.removeEventListener(
                'unhandledrejection',
                handleUnhandledRejection,
            );
            window.removeEventListener('error', handleError);
        };
    }, []);

    return null;
};
