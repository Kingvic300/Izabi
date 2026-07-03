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
    startedAt?: number;
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
    // Track which StudyHistory document backs each currently-displayed
    // material so we can re-fetch it in a new language on demand instead
    // of regenerating from scratch. In this backend, the "jobId" returned
    // on generation IS the StudyHistory document id.
    summaryHistoryId?: string;
    questionsHistoryId?: string;
    flashcardsHistoryId?: string;
}

interface StudyContextType {
    activeJobs: StudyJob[];
    session: StudySession;
    addJob: (jobId: string, fileNames: string[], type: string) => void;
    removeJob: (jobId: string) => void;
    updateSession: (updates: Partial<StudySession>) => void;
    clearSession: () => void;
    // Re-fetches whichever materials are currently loaded in `lang`,
    // hitting the on-demand translation endpoints. Cheap no-op for any
    // material that hasn't been generated yet in this session.
    refreshMaterialsForLanguage: (lang: string) => Promise<void>;
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
            { id, fileName: fileNames.join(', '), status: 'PENDING', progress: 0, type, startedAt: Date.now() },
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
            summaryHistoryId: undefined,
            questionsHistoryId: undefined,
            flashcardsHistoryId: undefined,
        });
    }, []);

    const removeJob = useCallback((id: string) => {
        setActiveJobs((prev) => prev.filter((j) => j.id !== id));
    }, []);

    // HOW: For each material currently loaded in this session, calls the
    //      matching on-demand-translate endpoint for `lang` and swaps the
    //      displayed content in place.
    // WHY: This is what makes the language toggle feel instant for content
    //      that's already on screen, instead of only affecting the *next*
    //      thing the user generates.
    const refreshMaterialsForLanguage = useCallback(
        async (lang: string) => {
            const tasks: Array<Promise<void>> = [];

            if (session.flashcardsHistoryId) {
                tasks.push(
                    api
                        .getFlashcardsForLanguage(
                            session.flashcardsHistoryId,
                            lang,
                        )
                        .then((res) => {
                            const flashcards =
                                res?.data?.flashcards ?? res?.flashcards;
                            if (Array.isArray(flashcards)) {
                                updateSession({ flashcards });
                            }
                        })
                        .catch((err) =>
                            console.error(
                                'Failed to translate flashcards',
                                err,
                            ),
                        ),
                );
            }

            if (session.questionsHistoryId) {
                tasks.push(
                    api
                        .getQuestionsForLanguage(
                            session.questionsHistoryId,
                            lang,
                        )
                        .then((res) => {
                            const questions =
                                res?.data?.questions ?? res?.questions;
                            if (Array.isArray(questions)) {
                                updateSession({ questions });
                            }
                        })
                        .catch((err) =>
                            console.error(
                                'Failed to translate questions',
                                err,
                            ),
                        ),
                );
            }

            if (session.summaryHistoryId) {
                tasks.push(
                    api
                        .getSummaryForLanguage(session.summaryHistoryId, lang)
                        .then((res) => {
                            const summary =
                                res?.data?.summary ?? res?.summary;
                            if (summary) {
                                updateSession({
                                    summary: normalizeSummaryContent(summary),
                                });
                            }
                        })
                        .catch((err) =>
                            console.error('Failed to translate summary', err),
                        ),
                );
            }

            await Promise.all(tasks);
        },
        [
            session.flashcardsHistoryId,
            session.questionsHistoryId,
            session.summaryHistoryId,
            updateSession,
        ],
    );

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
        let timeout: number | undefined;
        const pollingInterval = 1500; // Fast polling for snappy UI updates

        const scheduleNext = () => {
            timeout = window.setTimeout(tick, pollingInterval);
        };

        const tick = async () => {
            const jobsToPoll = activeJobs.filter(
                (j) => j.status === 'PENDING' || j.status === 'PROCESSING',
            );

            for (const job of jobsToPoll) {
                // Check timeout: 2 minutes (120,000 ms)
                if (job.startedAt && (Date.now() - job.startedAt) > 120000) {
                    console.error('Job timed out after 2 minutes', job.id);
                    updateJobStatus(job.id, { status: 'FAILED' });
                    continue;
                }

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
                                    summaryHistoryId: job.id,
                                });
                            } else if (job.type === 'study-guide') {
                                updateSession({
                                    studyGuide: jobInfo.result?.summary || '',
                                });
                            } else if (job.type === 'quiz') {
                                updateSession({
                                    questions: jobInfo.result?.questions || [],
                                    questionsHistoryId: job.id,
                                });
                            } else if (job.type === 'flashcards') {
                                updateSession({
                                    flashcards:
                                        jobInfo.result?.flashcards || [],
                                    flashcardsHistoryId: job.id,
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
                refreshMaterialsForLanguage,
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
