export const errorMessages = {
    // Network errors
    network: {
        offline:
            'You appear to be offline. Please check your internet connection.',
        timeout: 'The request took too long. Please try again.',
        connectionFailed:
            'Failed to connect to the server. Please try again later.',
    },

    // Authentication errors
    auth: {
        invalidCredentials: 'Invalid email or password. Please try again.',
        emailNotFound: 'No account found with this email address.',
        emailAlreadyExists: 'An account with this email already exists.',
        weakPassword:
            'Your password is too weak. Please use a stronger password.',
        otpExpired: 'Your OTP has expired. Please request a new one.',
        otpInvalid: 'The OTP you entered is incorrect. Please try again.',
    },

    // Validation errors
    validation: {
        emailInvalid: 'Please enter a valid email address.',
        passwordTooShort: 'Password must be at least 6 characters long.',
        passwordMismatch: 'Passwords do not match.',
        fieldRequired: 'This field is required.',
        invalidInput: 'Please check your input and try again.',
    },

    // Note errors
    notes: {
        createFailed: 'Failed to create note. Please try again.',
        updateFailed: 'Failed to update note. Please try again.',
        deleteFailed: 'Failed to delete note. Please try again.',
        loadFailed: 'Failed to load your notes. Please refresh the page.',
        titleEmpty: 'Note title cannot be empty.',
        contentEmpty: 'Note content cannot be empty.',
    },

    // Profile errors
    profile: {
        updateFailed: 'Failed to update profile. Please try again.',
        loadFailed: 'Failed to load profile. Please refresh the page.',
        photoUploadFailed: 'Failed to upload photo. Please try again.',
    },

    // Settings errors
    settings: {
        saveFailed: 'Failed to save settings. Please try again.',
        loadFailed: 'Failed to load settings. Please refresh the page.',
        downloadFailed: 'Failed to download your data. Please try again.',
    },

    // Generic errors
    generic: {
        unexpected: 'An unexpected error occurred. Please try again.',
        tryAgain: 'Something went wrong. Please try again.',
        contactSupport: 'If this problem persists, please contact support.',
    },

    // Get appropriate error message based on error type
    getErrorMessage: (errorType: string, defaultMessage?: string): string => {
        return defaultMessage || errorMessages.generic.unexpected;
    },
};
