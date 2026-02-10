import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/apiClient';
import { toast } from 'sonner';

interface StudyJob {
    id: string;
    fileName: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    progress: number;
    type: string;
    result?: any;
}

interface StudyContextType {
    activeJobs: StudyJob[];
    addJob: (jobId: string, fileName: string, type: string) => void;
    removeJob: (jobId: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeJobs, setActiveJobs] = useState<StudyJob[]>([]);

    const addJob = useCallback((id: string, fileName: string, type: string) => {
        setActiveJobs(prev => [...prev, { id, fileName, status: 'PENDING', progress: 0, type }]);
    }, []);

    const removeJob = useCallback((id: string) => {
        setActiveJobs(prev => prev.filter(j => j.id !== id));
    }, []);

    const updateJobStatus = useCallback((id: string, updates: Partial<StudyJob>) => {
        setActiveJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
    }, []);

    // Polling logic for all active jobs
    useEffect(() => {
        const interval = setInterval(async () => {
            const jobsToPoll = activeJobs.filter(j => j.status === 'PENDING' || j.status === 'PROCESSING');
            
            for (const job of jobsToPoll) {
                try {
                    const statusData = await api.getJobStatus(job.id);
                    
                    if (statusData.status === 'COMPLETED') {
                        updateJobStatus(job.id, { 
                            status: 'COMPLETED', 
                            progress: 100, 
                            result: statusData 
                        });
                        toast.success(`Analysis Complete: ${job.fileName}`, {
                            description: "Your study material is ready."
                        });
                    } else if (statusData.status === 'FAILED') {
                        updateJobStatus(job.id, { status: 'FAILED' });
                        toast.error(`Analysis Failed: ${job.fileName}`, {
                            description: statusData.metadata?.error || "Unknown error"
                        });
                    } else {
                        // Estimate progress if not provided by backend
                        const currentProgress = job.progress >= 90 ? 95 : job.progress + 5;
                        updateJobStatus(job.id, { status: 'PROCESSING', progress: currentProgress });
                    }
                } catch (err) {
                    console.error("Polling error for job", job.id, err);
                }
            }
        }, 3000); // Poll every 3 seconds for global state

        return () => clearInterval(interval);
    }, [activeJobs, updateJobStatus]);

    return (
        <StudyContext.Provider value={{ activeJobs, addJob, removeJob }}>
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
