import type React from "react";
import type { ErrorType } from "@/types/pdf";
interface ErrorDisplayProps {
    error: ErrorType;
    onDismiss?: () => void;
    onRetry?: () => void;
}
declare const ErrorDisplay: React.FC<ErrorDisplayProps>;
interface ErrorListProps {
    errors: ErrorType[];
    onDismiss?: (id: string) => void;
    onRetry?: () => void;
}
export declare const ErrorList: React.FC<ErrorListProps>;
export default ErrorDisplay;
