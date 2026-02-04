import type React from "react";
export interface AppError {
    id: string;
    message: string;
    description?: string;
    type: "error" | "warning" | "info";
    timestamp: number;
}
interface ErrorContextType {
    error: AppError | null;
    setError: (error: Omit<AppError, "id" | "timestamp">) => void;
    clearError: () => void;
}
export declare const ErrorProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useError: () => ErrorContextType;
export {};
