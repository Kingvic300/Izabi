export type ToastVariant = "default" | "destructive" | "success" | "warning" | "info";
interface ToastOptions {
    title?: string;
    description: string;
    duration?: number;
}
export declare const useAppToast: () => {
    success: (options: ToastOptions) => void;
    error: (options: ToastOptions) => void;
    warning: (options: ToastOptions) => void;
    info: (options: ToastOptions) => void;
    noteSaved: () => void;
    noteDeleted: () => void;
    profileUpdated: () => void;
    settingChanged: (settingName: string) => void;
    loginFailed: (reason: string) => void;
    signupFailed: (reason: string) => void;
    networkError: () => void;
    validationError: (fieldName: string, reason: string) => void;
};
export {};
