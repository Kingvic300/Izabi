import React from 'react';
interface SuccessDisplayProps {
    message: string;
    persistent?: boolean;
    onDismiss?: () => void;
    actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'default' | 'outline';
    }>;
    className?: string;
}
export declare const SuccessDisplay: React.FC<SuccessDisplayProps>;
export declare const useSuccess: () => {
    success: string;
    showSuccess: (message: string) => void;
    clearSuccess: () => void;
};
export {};
