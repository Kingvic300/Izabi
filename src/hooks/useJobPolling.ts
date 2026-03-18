import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { ModuleCardId, ModuleCardStatus } from '@/components/dashboard-home/types';
import { useApiError } from '@/hooks/useApiError';
import { useStudy } from '@/contexts/StudyContext';
import { ENDPOINT_TO_MODULE_ID } from '@/components/dashboard-home/dashboard';
import { normalizeSummaryContent } from '@/lib/summaryUtils';

export const useJobPolling = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [moduleStatuses, setModuleStatuses] = useState({
        summarize: 'idle' as ModuleCardStatus,
        quiz: 'idle' as ModuleCardStatus,
        guide: 'idle' as ModuleCardStatus,
        cards: 'idle' as ModuleCardStatus,
    });
    const { addError } = useApiError();
    const { updateSession } = useStudy();

    const pollJobStatus = (jobId: string, endpoint: string) => {
        const moduleId = ENDPOINT_TO_MODULE_ID[endpoint];
        let attempts = 0;
        const maxAttempts = 120;
        const baseDelay = 1500;
        const maxDelay = 12000;

        const scheduleNext = (fn: () => void) => {
            const exponent = Math.min(Math.floor(attempts / 4), 4);
            const delay = Math.min(maxDelay, baseDelay * Math.pow(2, exponent));
            return window.setTimeout(fn, delay);
        };

        const tick = async () => {
            attempts += 1;

            if (attempts > maxAttempts) {
                setIsProcessing(false);
                if (moduleId) {
                    setModuleStatuses((prev) => ({
                        ...prev,
                        [moduleId]: 'failed',
                    }));
                }
                addError({
                    message:
                        'Processing is taking longer than expected. Please try again.',
                    type: 'api',
                });
                return;
            }

            try {
                const response = await api.getJobStatus(jobId);
                const job = response.data;

                if (job?.status === 'COMPLETED') {
                    setIsProcessing(false);
                    if (moduleId) {
                        setModuleStatuses((prev) => ({
                            ...prev,
                            [moduleId]: 'completed',
                        }));
                    }

                    const result = job.result;
                    if (endpoint === 'summarize') {
                        updateSession({
                            summary: normalizeSummaryContent(result?.summary),
                            studyGuide: '',
                            questions: [],
                            flashcards: [],
                        });
                    } else if (endpoint === 'generate-study-material') {
                        updateSession({
                            summary: '',
                            studyGuide: result?.summary || '',
                            questions: [],
                            flashcards: [],
                        });
                    } else if (endpoint === 'generate-questions') {
                        updateSession({
                            summary: '',
                            studyGuide: '',
                            questions: result?.questions || [],
                            flashcards: [],
                        });
                    } else if (endpoint === 'flashcards') {
                        updateSession({
                            summary: '',
                            studyGuide: '',
                            questions: [],
                            flashcards: result?.flashcards || [],
                        });
                    }
                } else if (job?.status === 'FAILED') {
                    setIsProcessing(false);
                    if (moduleId) {
                        setModuleStatuses((prev) => ({
                            ...prev,
                            [moduleId]: 'failed',
                        }));
                    }
                    addError({
                        message:
                            job?.error ||
                            'We could not generate your study material. Please try again.',
                        type: 'api',
                    });
                } else {
                    scheduleNext(tick);
                }
            } catch {
                if (attempts >= maxAttempts) {
                    setIsProcessing(false);
                    if (moduleId) {
                        setModuleStatuses((prev) => ({
                            ...prev,
                            [moduleId]: 'failed',
                        }));
                    }
                    addError({
                        message:
                            'Connection issue while checking progress. Please try again.',
                        type: 'api',
                    });
                } else {
                    scheduleNext(tick);
                }
            }
        };

        scheduleNext(tick);
    };

    return {
        isProcessing,
        setIsProcessing,
        moduleStatuses,
        setModuleStatuses,
        pollJobStatus,
    };
};
