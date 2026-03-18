import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import { api } from '@/lib/apiClient';
import {
    SummaryContent,
    normalizeSummaryContent,
} from '@/lib/summaryUtils';

interface StudyJob {
    id: string;
    fileName: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress: number;
    type: string;
    result?: any;
}

interface StudySession {
    fileNames: string[];
    pdfFiles: File[];
    pdfSelections: any[];
    numberOfQuestions: number;
    quizDifficulty: 'easy' | 'balanced' | 'hard';
    quizStyle: 'mixed' | 'mcq' | 'short';
    shuffleQuestions: boolean;
    showExplanations: boolean;
    summary: SummaryContent;
    questions: any[];
    flashcards: any[];
    studyGuide: string;
    lastJobId?: string;
}

interface StudyContextType {
    activeJobs: StudyJob[];
    session: StudySession;
    addJob: (jobId: string, fileNames: string[], type: string) => void;
    removeJob: (jobId: string) => void;
    updateSession: (updates: Partial<StudySession>) => void;
    clearSession: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [activeJobs, setActiveJobs] = useState<StudyJob[]>([]);
    const [session, setSession] = useState<StudySession>({
        fileNames: [],
        pdfFiles: [],
        pdfSelections: [],
        numberOfQuestions: 5,
        quizDifficulty: 'balanced',
        quizStyle: 'mixed',
        shuffleQuestions: true,
        showExplanations: true,
        summary: '',
        questions: [],
        flashcards: [],
        studyGuide: '',
    });

    const addJob = useCallback((id: string, fileNames: string[], type: string) => {
        setActiveJobs((prev) => [
            ...prev,
            { id, fileName: fileNames.join(', '), status: 'PENDING', progress: 0, type },
        ]);
        setSession((prev) => ({ ...prev, lastJobId: id, fileNames }));
    }, []);

    const updateSession = useCallback((updates: Partial<StudySession>) => {
        setSession((prev) => ({ ...prev, ...updates }));
    }, []);

    const clearSession = useCallback(() => {
        setSession({
            fileNames: [],
            pdfFiles: [],
            pdfSelections: [],
            numberOfQuestions: 5,
            quizDifficulty: 'balanced',
            quizStyle: 'mixed',
        shuffleQuestions: true,
        showExplanations: true,
        summary: '',
            questions: [],
            flashcards: [],
            studyGuide: '',
        });
    }, []);

    const removeJob = useCallback((id: string) => {
        setActiveJobs((prev) => prev.filter((j) => j.id !== id));
    }, []);

    const updateJobStatus = useCallback(
        (id: string, updates: Partial<StudyJob>) => {
            setActiveJobs((prev) =>
                prev.map((j) => (j.id === id ? { ...j, ...updates } : j)),
            );
        },
        [],
    );

    // Polling logic for all active jobs
    useEffect(() => {
        let attempts = 0;
        let timeout: number | undefined;
        const baseDelay = 1500;
        const maxDelay = 12000;

        const scheduleNext = () => {
            const exponent = Math.min(Math.floor(attempts / 4), 4);
            const delay = Math.min(maxDelay, baseDelay * Math.pow(2, exponent));
            timeout = window.setTimeout(tick, delay);
        };

        const tick = async () => {
            attempts += 1;
            const jobsToPoll = activeJobs.filter(
                (j) => j.status === 'PENDING' || j.status === 'PROCESSING',
            );

            for (const job of jobsToPoll) {
                try {
                    const statusData = await api.getJobStatus(job.id);
                    // Standardize access to the nested data property
                    const jobInfo = statusData.data;

                    if (jobInfo?.status === 'COMPLETED') {
                        updateJobStatus(job.id, {
                            status: 'COMPLETED',
                            progress: 100,
                            result: jobInfo.result,
                        });

                        // Automatically update session if it matches the current active document
                        if (session.lastJobId === job.id) {
                            if (job.type === 'summary') {
                                updateSession({
                                    summary: normalizeSummaryContent(
                                        jobInfo.result?.summary,
                                    ),
                                });
                            } else if (job.type === 'study-guide') {
                                updateSession({
                                    studyGuide: jobInfo.result?.summary || '',
                                });
                            } else if (job.type === 'quiz') {
                                updateSession({
                                    questions: jobInfo.result?.questions || [],
                                });
                            } else if (job.type === 'flashcards') {
                                updateSession({
                                    flashcards:
                                        jobInfo.result?.flashcards || [],
                                });
                            }
                        }
                    } else if (jobInfo?.status === 'FAILED') {
                        updateJobStatus(job.id, { status: 'FAILED' });
                    } else {
                        // Use backend progress if available, else estimate
                        const currentProgress =
                            jobInfo?.progress ||
                            (job.progress >= 92 ? 98 : job.progress + 8);
                        updateJobStatus(job.id, {
                            status: 'PROCESSING',
                            progress: currentProgress,
                        });
                    }
                } catch (err) {
                    console.error('Polling error for job', job.id, err);
                }
            }

            if (activeJobs.some(
                (j) => j.status === 'PENDING' || j.status === 'PROCESSING',
            )) {
                scheduleNext();
            }
        };

        if (activeJobs.length > 0) {
            scheduleNext();
        }

        return () => {
            if (timeout) {
                window.clearTimeout(timeout);
            }
        };
    }, [activeJobs, updateJobStatus]);

    return (
        <StudyContext.Provider
            value={{
                activeJobs,
                session,
                addJob,
                removeJob,
                updateSession,
                clearSession,
            }}
        >
            {children}
        </StudyContext.Provider>
    );
};

export const useStudy = () => {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error('useStudy must be used within a StudyProvider');
    }
    return context;
};
