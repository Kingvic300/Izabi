import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JobStatusToastProps {
    job: {
        id: string;
        fileName: string;
        status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
        progress: number;
        type: string;
    };
    onClose: (id: string) => void;
}

const JobStatusToast: React.FC<JobStatusToastProps> = ({ job, onClose }) => {
    const isCompleted = job.status === 'COMPLETED';
    const isFailed = job.status === 'FAILED';
    const isProcessing =
        job.status === 'PROCESSING' || job.status === 'PENDING';

    // Format title based on type
    const getTitle = () => {
        const typeMap: Record<string, string> = {
            summary: 'Generating Summary',
            quiz: 'Generating Quiz',
            flashcards: 'Creating Flashcards',
            'study-guide': 'Building Study Guide',
        };
        return typeMap[job.type] || 'Processing Document';
    };

    const getStatusMessage = () => {
        if (isCompleted) return 'Analysis finished successfully.';
        if (isFailed) return 'Something went wrong.';
        return 'Brain is processing content...';
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
                'relative group w-full sm:w-96 max-w-full overflow-hidden rounded-xl border border-foreground/10 bg-card/95 backdrop-blur-xl shadow-2xl',
                'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1',
                isCompleted
                    ? 'before:bg-green-500'
                    : isFailed
                      ? 'before:bg-red-500'
                      : 'before:bg-primary',
            )}
        >
            <div className="flex items-center p-4 gap-4">
                {/* Circular Progress Area */}
                <div className="relative h-14 w-14 flex-shrink-0">
                    <svg className="h-full w-full -rotate-90">
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-white/5"
                        />
                        <motion.circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="150.8" // 2 * pi * 24
                            initial={{ strokeDashoffset: 150.8 }}
                            animate={{
                                strokeDashoffset:
                                    150.8 - (150.8 * job.progress) / 100,
                            }}
                            className={cn(
                                'transition-all duration-500 ease-out',
                                isCompleted
                                    ? 'text-green-500'
                                    : isFailed
                                      ? 'text-red-500'
                                      : 'text-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]',
                            )}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : isFailed ? (
                            <AlertCircle className="h-6 w-6 text-red-500" />
                        ) : (
                            <span className="text-[10px] font-black font-mono text-foreground/80">
                                {Math.round(job.progress)}%
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate">
                        {getTitle()}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate font-medium">
                        {isProcessing && (
                            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
                        )}
                        {getStatusMessage()}
                    </p>
                </div>

                {/* Actions */}
                <button
                    onClick={() => onClose(job.id)}
                    className="p-1 hover:bg-white/5 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                    {isCompleted || isFailed ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2">
                            Clear
                        </span>
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2">
                            Hide
                        </span>
                    )}
                </button>
            </div>

            {/* Bottom Progress Bar (Horizontal) */}
            {isProcessing && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                    <motion.div
                        className="h-full bg-primary shadow-[0_0_10px_theme(colors.primary.DEFAULT)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}
        </motion.div>
    );
};

export default JobStatusToast;
