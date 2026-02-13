import { useState, useCallback } from 'react';
import { ErrorType } from '@/types/pdf';
import { toast } from 'sonner';
import { getReadableError } from '@/lib/readableErrors';
import { getToastDedupe } from '@/lib/toastDedupe';

export const useApiError = () => {
    const [errors, setErrors] = useState<ErrorType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const categorizeError = (error: any): ErrorType['type'] => {
        if (
            error?.type === 'validation' ||
            error?.type === 'backend' ||
            error?.type === 'network'
        ) {
            return error.type;
        }

        if (error.response?.status >= 400 && error.response?.status < 500)
            return 'validation';
        if (error.response?.status >= 500) return 'backend';
        if (error.code === 'NETWORK_ERROR' || !navigator.onLine)
            return 'network';
        return 'backend';
    };

    const addError = useCallback((error: any) => {
        const readable = getReadableError(error);
        const message = error?.message || readable.description;
        const type = categorizeError(error);
        const statusCode = error?.response?.status;
        const skipGlobalToast = Boolean(error?.config?.skipGlobalErrorToast);
        const willGlobalToast =
            !skipGlobalToast &&
            (!statusCode || statusCode === 401 || statusCode >= 500);

        const errorObj: ErrorType = {
            id: Date.now().toString(),
            type,
            message,
            details: error?.stack || '',
            timestamp: Date.now(),
        };

        setErrors((prev) => [...prev, errorObj]);

        // TRIGGER TOAST AUTOMATICALLY (avoid duplicates when global handler will also toast)
        if (!willGlobalToast) {
            if (type === 'network') {
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
            } else if (type === 'validation') {
                const title = readable.title || 'Please check your details';
                const { id, suppressed } = getToastDedupe(
                    'warning',
                    title,
                    readable.description,
                    5000,
                );
                if (!suppressed) {
                    toast.warning(title, {
                        id,
                        description: readable.description,
                        duration: 5000,
                    });
                }
            } else {
                const title = readable.title || 'Action failed';
                const { id, suppressed } = getToastDedupe(
                    'error',
                    title,
                    readable.description,
                    5000,
                );
                if (!suppressed) {
                    toast.error(title, {
                        id,
                        description: readable.description,
                        duration: 5000,
                    });
                }
            }
        }
    }, []);

    // Clears all errors
    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    // Clears a single error by id (optional id)
    const clearError = useCallback((id?: string) => {
        if (!id) {
            setErrors([]); // If no id provided, clear all errors
        } else {
            setErrors((prev) => prev.filter((error) => error.id !== id));
        }
    }, []);

    return {
        errors,
        isLoading,
        setIsLoading,
        addError,
        clearErrors,
        clearError,
    };
};
