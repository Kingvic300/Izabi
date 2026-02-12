import { useEffect } from 'react';
import { toast } from 'sonner';
import { getReadableError } from '@/lib/readableErrors';

export const GlobalErrorHandlers = () => {
    useEffect(() => {
        const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
            const readable = getReadableError(event.reason);
            toast.error(readable.title || 'Action failed', {
                description: readable.description,
                duration: 6500,
            });
        };

        const handleError = (event: ErrorEvent) => {
            const readable = getReadableError(event.error || event.message);
            toast.error('Something went wrong', {
                description: readable.description,
                duration: 6500,
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
