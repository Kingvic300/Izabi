'use client';

import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

export interface AppError {
    id: string;
    message: string;
    description?: string;
    type: 'error' | 'warning' | 'info';
    timestamp: number;
}

interface ErrorContextType {
    error: AppError | null;
    setError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [error, setErrorState] = useState<AppError | null>(null);

    const setError = useCallback(
        (errorData: Omit<AppError, 'id' | 'timestamp'>) => {
            const newError: AppError = {
                ...errorData,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
            };
            setErrorState(newError);
        },
        [],
    );

    const clearError = useCallback(() => {
        setErrorState(null);
    }, []);

    return (
        <ErrorContext.Provider value={{ error, setError, clearError }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
};
