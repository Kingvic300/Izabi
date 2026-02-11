import { useState, useCallback } from 'react';
import { ErrorType } from '@/types/pdf';
import { toast } from 'sonner';

export const useApiError = () => {
    const [errors, setErrors] = useState<ErrorType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getErrorMessage = (error: any): string => {
        if (error.response?.status) {
            switch (error.response.status) {
                case 400:
                    return 'Invalid request data. Please check your input.';
                case 404:
                    return 'Resource not found. Please try again.';
                case 413:
                    return 'File too large. Please upload a smaller PDF.';
                case 500:
                    return 'Server error. Please try again later.';
                default:
                    return (
                        error.response?.data?.message ||
                        'An unexpected error occurred.'
                    );
            }
        }

        if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
            return 'Connection lost. Please check your internet connection.';
        }

        return error.message || 'An unexpected error occurred.';
    };

    const categorizeError = (error: any): ErrorType['type'] => {
        if (error.response?.status >= 400 && error.response?.status < 500)
            return 'validation';
        if (error.response?.status >= 500) return 'backend';
        if (error.code === 'NETWORK_ERROR' || !navigator.onLine)
            return 'network';
        return 'backend';
    };

    const addError = useCallback((error: any) => {
        const message = getErrorMessage(error);
        const type = categorizeError(error);

        const errorObj: ErrorType = {
            id: Date.now().toString(),
            type,
            message,
            details: error.stack || JSON.stringify(error, null, 2),
            timestamp: Date.now(),
        };

        setErrors((prev) => [...prev, errorObj]);

        // TRIGGER TOAST AUTOMATICALLY
        if (type === 'network') {
            toast.error('Connection Lost', {
                description: message,
            });
        } else if (type === 'validation') {
            toast.warning('Check your input', {
                description: message,
            });
        } else {
            toast.error('System Error', {
                description: message,
            });
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
