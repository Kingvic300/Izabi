import type { Message } from './types';

export const buildWelcomeMessages = (): Message[] => [
    {
        id: '1',
        role: 'assistant',
        content:
            "Hello! I'm Izabi, your AI learning assistant. I'm here to help you understand complex concepts, answer questions, and guide your learning journey. What would you like to learn about today?",
        timestamp: new Date(),
    },
];

export const buildTranscript = (messages: Message[]): string => {
    const transcriptMessages = messages.filter((m) =>
        String(m?.content || '').trim(),
    );

    return transcriptMessages
        .map((m) => {
            const speaker = m.role === 'user' ? 'You' : 'Izabi';
            return `**${speaker}:**\n${m.content}`;
        })
        .join('\n\n---\n\n');
};

export const copyText = async (text: string): Promise<void> => {
    const resolved = String(text || '');
    if (!resolved.trim()) return;

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(resolved);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = resolved;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
};

export const getReadableErrorMessage = (error: any): string => {
    const message = error?.response?.data?.message;
    if (Array.isArray(message)) {
        return message.join(', ');
    }
    if (message && typeof message === 'object') {
        const nested = (message as any).message || (message as any).error;
        if (typeof nested === 'string' && nested.trim()) {
            return nested;
        }
    }
    const fallbackMessage = error?.response?.data?.error;
    if (typeof fallbackMessage === 'string' && fallbackMessage.trim()) {
        return fallbackMessage;
    }
    if (typeof message === 'string' && message.trim()) {
        return message;
    }
    if (typeof error?.message === 'string' && error.message.trim()) {
        return error.message;
    }
    return 'Failed to upload and process PDF.';
};
