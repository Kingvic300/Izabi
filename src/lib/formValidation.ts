export interface ValidationResult {
    isValid: boolean
    error?: string
}

export const formValidation = {
    // Email validation
    /*
     * How: Checks if the email string matches a standard regex pattern for email addresses.
     * Why: Ensures communication channels are valid and properly formatted before submission.
     */
    email: (email: string): ValidationResult => {
        if (!email.trim()) {
            return { isValid: false, error: "Email is required" }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { isValid: false, error: "Please enter a valid email address" }
        }
        return { isValid: true }
    },

    // Password validation
    /*
     * How: Enforces complexity rules: minimum length, uppercase letter, and number requirement.
     * Why: Increases account security by preventing weak or easily guessable passwords.
     */
    password: (password: string): ValidationResult => {
        if (!password) {
            return { isValid: false, error: "Password is required" }
        }
        if (password.length < 6) {
            return { isValid: false, error: "Password must be at least 6 characters long" }
        }
        if (!/[A-Z]/.test(password)) {
            return { isValid: false, error: "Password must include at least one uppercase letter" }
        }
        if (!/[0-9]/.test(password)) {
            return { isValid: false, error: "Password must include at least one number" }
        }
        return { isValid: true }
    },

    // Password match validation
    passwordMatch: (password: string, confirmPassword: string): ValidationResult => {
        if (password !== confirmPassword) {
            return { isValid: false, error: "Passwords do not match" }
        }
        return { isValid: true }
    },

    // Note title validation
    noteTitle: (title: string): ValidationResult => {
        if (!title.trim()) {
            return { isValid: false, error: "Note title cannot be empty" }
        }
        if (title.length > 200) {
            return { isValid: false, error: "Note title must be less than 200 characters" }
        }
        return { isValid: true }
    },

    // Note content validation
    noteContent: (content: string): ValidationResult => {
        if (!content.trim()) {
            return { isValid: false, error: "Note content cannot be empty" }
        }
        if (content.length > 10000) {
            return { isValid: false, error: "Note content must be less than 10,000 characters" }
        }
        return { isValid: true }
    },

    // Generic required field
    required: (value: string, fieldName: string): ValidationResult => {
        if (!value.trim()) {
            return { isValid: false, error: `${fieldName} is required` }
        }
        return { isValid: true }
    },
}
