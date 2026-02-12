export type ReadableErrorKind =
    | 'network'
    | 'validation'
    | 'auth'
    | 'server'
    | 'unknown';

export interface ReadableError {
    kind: ReadableErrorKind;
    title: string;
    description: string;
    statusCode?: number;
}

const hasNavigator = typeof navigator !== 'undefined';

const cleanMessage = (message?: string) => {
    if (!message) return '';
    return String(message).trim();
};

const extractServerMessage = (error: any) => {
    const payload = error?.response?.data;
    const message = payload?.message;

    if (Array.isArray(message)) {
        return cleanMessage(message.join(', '));
    }

    if (typeof message === 'string') {
        return cleanMessage(message);
    }

    if (message && typeof message === 'object') {
        const nested =
            (message as any).message ||
            (message as any).error ||
            (message as any).detail;
        if (typeof nested === 'string') {
            return cleanMessage(nested);
        }
    }

    if (typeof payload?.error === 'string') {
        return cleanMessage(payload.error);
    }

    return '';
};

const defaultMessageByStatus = (statusCode: number) => {
    switch (statusCode) {
        case 400:
            return {
                kind: 'validation' as const,
                title: 'Please check your details',
                description:
                    'Some information is invalid. Review your input and try again.',
            };
        case 401:
            return {
                kind: 'auth' as const,
                title: 'Session expired',
                description: 'Please log in again to continue.',
            };
        case 403:
            return {
                kind: 'auth' as const,
                title: 'Access denied',
                description:
                    'You do not have permission to perform this action.',
            };
        case 404:
            return {
                kind: 'validation' as const,
                title: 'Not found',
                description:
                    'The requested item was not found. Refresh and try again.',
            };
        case 409:
            return {
                kind: 'validation' as const,
                title: 'Action could not be completed',
                description:
                    'This request conflicts with existing data. Check and try again.',
            };
        case 413:
            return {
                kind: 'validation' as const,
                title: 'File too large',
                description:
                    'The file is too large for upload. Please choose a smaller file.',
            };
        case 422:
            return {
                kind: 'validation' as const,
                title: 'Invalid information',
                description:
                    'Some values are not valid. Update the form and try again.',
            };
        case 429:
            return {
                kind: 'server' as const,
                title: 'Too many attempts',
                description:
                    'You have made too many requests. Please wait a moment and retry.',
            };
        default:
            if (statusCode >= 500) {
                return {
                    kind: 'server' as const,
                    title: 'Server issue',
                    description:
                        'We are having trouble on our side. Please try again shortly.',
                };
            }
            return {
                kind: 'unknown' as const,
                title: 'Request failed',
                description: 'Something went wrong. Please try again.',
            };
    }
};

export const getReadableError = (error: any): ReadableError => {
    const statusCode = error?.response?.status as number | undefined;
    const serverMessage = extractServerMessage(error);
    const rawMessage = cleanMessage(error?.message);
    const timeout =
        error?.code === 'ECONNABORTED' ||
        rawMessage.toLowerCase().includes('timeout');

    if (!hasNavigator || !navigator.onLine) {
        return {
            kind: 'network',
            title: 'No internet connection',
            description: 'Check your network and try again.',
            statusCode,
        };
    }

    if (error?.code === 'ENOTFOUND' || rawMessage === 'Network Error') {
        return {
            kind: 'network',
            title: 'Connection problem',
            description:
                'We could not reach the server. Please check your network and retry.',
            statusCode,
        };
    }

    if (timeout) {
        return {
            kind: 'network',
            title: 'Request timed out',
            description:
                'The server took too long to respond. Please try again.',
            statusCode,
        };
    }

    const normalizedServerMessage = serverMessage.toLowerCase();
    if (
        normalizedServerMessage.includes('extraction failed') ||
        normalizedServerMessage.includes('could not read text from this file') ||
        normalizedServerMessage.includes('no text extracted from file') ||
        normalizedServerMessage.includes('content too short')
    ) {
        return {
            kind: 'validation',
            title: 'We could not read this document',
            description:
                'Click Upload Document and use a clear text-based PDF/DOCX/TXT. If it is a scanned file, upload the pages as PNG/JPG for OCR.',
            statusCode,
        };
    }

    if (statusCode) {
        const fallback = defaultMessageByStatus(statusCode);
        const shouldUseServerMessage = Boolean(serverMessage) && statusCode < 500;
        return {
            ...fallback,
            description: shouldUseServerMessage
                ? serverMessage
                : fallback.description,
            statusCode,
        };
    }

    if (rawMessage) {
        return {
            kind: 'unknown',
            title: 'Action failed',
            description: rawMessage,
        };
    }

    return {
        kind: 'unknown',
        title: 'Something went wrong',
        description: 'Please try again.',
    };
};
