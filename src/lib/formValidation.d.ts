export interface ValidationResult {
    isValid: boolean;
    error?: string;
}
export declare const formValidation: {
    email: (email: string) => ValidationResult;
    password: (password: string) => ValidationResult;
    passwordMatch: (password: string, confirmPassword: string) => ValidationResult;
    noteTitle: (title: string) => ValidationResult;
    noteContent: (content: string) => ValidationResult;
    required: (value: string, fieldName: string) => ValidationResult;
};
