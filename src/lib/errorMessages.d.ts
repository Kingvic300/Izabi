export declare const errorMessages: {
    network: {
        offline: string;
        timeout: string;
        connectionFailed: string;
    };
    auth: {
        invalidCredentials: string;
        emailNotFound: string;
        emailAlreadyExists: string;
        weakPassword: string;
        otpExpired: string;
        otpInvalid: string;
    };
    validation: {
        emailInvalid: string;
        passwordTooShort: string;
        passwordMismatch: string;
        fieldRequired: string;
        invalidInput: string;
    };
    notes: {
        createFailed: string;
        updateFailed: string;
        deleteFailed: string;
        loadFailed: string;
        titleEmpty: string;
        contentEmpty: string;
    };
    profile: {
        updateFailed: string;
        loadFailed: string;
        photoUploadFailed: string;
    };
    settings: {
        saveFailed: string;
        loadFailed: string;
        downloadFailed: string;
    };
    generic: {
        unexpected: string;
        tryAgain: string;
        contactSupport: string;
    };
    getErrorMessage: (errorType: string, defaultMessage?: string) => string;
};
