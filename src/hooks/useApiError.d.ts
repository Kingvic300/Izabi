import { ErrorType } from '@/types/pdf';
export declare const useApiError: () => {
    errors: ErrorType[];
    isLoading: boolean;
    setIsLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    addError: (error: any) => void;
    clearErrors: () => void;
    clearError: (id?: string) => void;
};
