import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
    Upload,
    FileText,
    Eye,
    Settings,
    Zap,
    Trash2,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PDFPreview from './PDFPreview';
import PageSelector from './PageSelector';
import { ErrorList } from '@/components/ui/error-display';
import { SuccessDisplay } from '@/components/ui/success-display';
import { LoadingSpinner } from '@/components/ui/loading';
import { useApiError } from '@/hooks/useApiError';
import { PDFSelection } from '@/types/pdf';
import { cn } from '@/lib/utils';
import { useStudy } from '@/contexts/StudyContext';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface PDFUploadSectionProps {
    onSelectionComplete?: (data: {
        selections: PDFSelection[];
        files: File[];
    }) => void;
    className?: string;
}

const UPLOAD_LIMIT_MB = 500;
const LARGE_FILE_NOTICE_MB = 100;

const PDFUploadSection: React.FC<PDFUploadSectionProps> = ({
    onSelectionComplete,
    className,
}) => {
    const { session, updateSession, clearSession } = useStudy();

    const [uploadedFiles, setUploadedFiles] = useState<File[]>(
        session.pdfFiles || [],
    );
    // Track pages for the first PDF if it's the only one, or handle simplified multi-pdf selection
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedPages, setSelectedPages] = useState<number[]>([]);

    const [activeTab, setActiveTab] = useState<string>('load');

    useEffect(() => {
        // If we have files and NO selections, we might be adding more.
        // If we have files and selections, we are usually in sync/ready state.
        if (session.pdfFiles.length > 0 && session.pdfSelections.length > 0) {
            setActiveTab('sync');
        }
    }, [session.pdfFiles.length, session.pdfSelections.length]);
    const [isProcessing, setIsProcessing] = useState(false);

    const [success, setSuccess] = useState<string | null>(null);
    const [numQuestions, setNumQuestions] = useState<number>(
        session.numberOfQuestions || 5,
    );
    const [scanProgress, setScanProgress] = useState(0);
    const [topicText, setTopicText] = useState<string>('');
    const [previewFile, setPreviewFile] = useState<File | null>(null);

    const { errors, addError, clearErrors, clearError } = useApiError();

    useEffect(() => {
        if (uploadedFiles.length > 0 && scanProgress < 100) {
            const timer = setInterval(() => {
                setScanProgress((prev) =>
                    Math.min(prev + Math.random() * 20, 100),
                );
            }, 50);
            return () => clearInterval(timer);
        }
    }, [uploadedFiles, scanProgress]);

    // Sync back to context for persistence
    useEffect(() => {
        updateSession({
            pdfFiles: uploadedFiles,
            fileNames: uploadedFiles.map((f) => f.name),
            numberOfQuestions: numQuestions,
            // Selections are managed via handleProcessSelection/onSelectionComplete
        });
    }, [uploadedFiles, numQuestions]);

    const handleTopicSubmit = () => {
        if (!topicText.trim()) {
            addError({
                message: 'Please enter a topic or question.',
                type: 'validation',
            });
            return;
        }

        if (topicText.trim().length < 3) {
            addError({
                message: 'Topic must be at least 3 characters.',
                type: 'validation',
            });
            return;
        }

        clearErrors();

        // Create a virtual text file from the topic input
        const blob = new Blob([topicText], { type: 'text/plain' });
        const virtualFile = new File([blob], 'topic.txt', {
            type: 'text/plain',
        });

        setUploadedFiles([virtualFile]);
        setTotalPages(1);
        setSelectedPages([1]);
        setScanProgress(100);
        setTimeout(() => setActiveTab('sync'), 500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift for multi-line)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTopicSubmit();
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        const newFiles = [...uploadedFiles];
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain',
            'text/csv',
            'text/markdown',
            'image/png',
            'image/jpeg',
            'image/jpg',
        ];

        const maxSize = UPLOAD_LIMIT_MB * 1024 * 1024;
        
        for (const file of files) {
            if (newFiles.length >= 5) {
                addError({
                    message: 'Maximum 5 files allowed.',
                    type: 'validation',
                });
                break;
            }

            if (file.size > maxSize) {
                addError({
                    message: `File ${file.name} exceeds the ${UPLOAD_LIMIT_MB}MB limit.`,
                    type: 'validation',
                });
                continue;
            }

            if (!allowedTypes.includes(file.type)) {
                addError({
                    message: `File ${file.name} is an unsupported type.`,
                    type: 'validation',
                });
                continue;
            }

            newFiles.push(file);
        }

        clearErrors();
        setUploadedFiles(newFiles);
        setScanProgress(0);
        
        // Reset input value to allow selecting the same file again if removed
        event.target.value = '';
    };

    const removeFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        if (newFiles.length === 0) {
            setActiveTab('load');
        }
    };

    const handlePDFLoadSuccess = (numPages: number) => {
        setTotalPages(numPages);
        setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
    };

    const handlePageSelect = (pageNumber: number) => {
        setSelectedPages((prev) =>
            prev.includes(pageNumber)
                ? prev.filter((p) => p !== pageNumber)
                : [...prev, pageNumber].sort((a, b) => a - b),
        );
    };

    const handleProcessSelection = () => {
        if (uploadedFiles.length === 0) {
            addError({
                message: 'Select at least one document segment for ingestion.',
                type: 'validation',
            });
            return;
        }

        setIsProcessing(true);
        clearErrors();

        const selections: PDFSelection[] = uploadedFiles.map((f, idx) => ({
            selectedPages: idx === 0 && f.type === 'application/pdf' ? selectedPages : [1],
            selectedText: [],
            selectionType: 'pages',
            metadata: {
                totalPages: idx === 0 ? totalPages : 1,
                fileName: f.name,
                fileSize: f.size,
            },
            numberOfQuestions: numQuestions,
        }));

        setTimeout(() => {
            onSelectionComplete?.({ selections, files: uploadedFiles });
            setSuccess('Documents are ready. You can now generate study tools.');
            setIsProcessing(false);
        }, 1000);
    };

    const resetUpload = () => {
        setUploadedFiles([]);
        setTotalPages(0);
        setSelectedPages([]);
        setActiveTab('load');
        setSuccess(null);
        clearErrors();
        setNumQuestions(5);
        setScanProgress(0);
        setTopicText('');

        // Global clear as well
        clearSession();
    };

    return (
        <div className={cn('space-y-8', className)}>
            {/* Error handling handled via toast in useApiError */}

            {success && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <SuccessDisplay
                        message={success}
                        onDismiss={() => setSuccess(null)}
                        actions={[
                            {
                                label: 'Reset Node',
                                onClick: resetUpload,
                                variant: 'outline',
                            },
                        ]}
                    />
                </motion.div>
            )}

            <div className="relative">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsContent
                        key="load"
                        value="load"
                        className="m-0 outline-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-6 md:space-y-8"
                        >
                            {/* Header */}
                            <div className="text-center space-y-2 sm:space-y-3 px-4">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-primary/10 border border-primary/20"
                                >
                                    <Zap
                                        size={16}
                                        className="sm:w-5 sm:h-5 text-primary"
                                        fill="currentColor"
                                    />
                                    <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">
                                        AI-Powered Study Generator
                                    </span>
                                </motion.div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent px-2">
                                    Study Material Setup
                                </h2>
                                <p className="text-muted-foreground text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
                                    Choose your preferred method to generate
                                    personalized study materials
                                </p>
                            </div>

                            {/* Main Content - Two Column Grid on Desktop */}
                            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                                {/* Option 1: Quick Topic Input */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-0.5 bg-primary rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <div className="relative h-full bg-card border border-foreground/10 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 hover:border-primary/30 transition-all">
                                        {/* Icon Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                                    <FileText
                                                        size={20}
                                                        className="sm:w-6 sm:h-6 text-foreground"
                                                    />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold">
                                                    Type a Topic
                                                </h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                    Quick generation from any
                                                    subject
                                                </p>
                                            </div>
                                            <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold shrink-0">
                                                FASTEST
                                            </div>
                                        </div>

                                        {/* Text Input */}
                                        <div className="space-y-2 sm:space-y-3">
                                            <textarea
                                                value={topicText}
                                                onChange={(e) =>
                                                    setTopicText(e.target.value)
                                                }
                                                onKeyDown={handleKeyDown}
                                                placeholder="E.g., Photosynthesis, World War II, Quantum Physics..."
                                                className="w-full h-28 sm:h-32 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-card/5 border border-foreground/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm placeholder:text-muted-foreground/50"
                                                maxLength={500}
                                            />

                                            <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                                <span className="text-muted-foreground/60">
                                                    {topicText.length}/500
                                                </span>
                                                <span className="text-muted-foreground/40 hidden sm:inline">
                                                    Enter to submit •
                                                    Shift+Enter for new line
                                                </span>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            onClick={handleTopicSubmit}
                                            disabled={
                                                !topicText.trim() ||
                                                topicText.trim().length < 3
                                            }
                                            className="w-full h-11 sm:h-12 rounded-lg sm:rounded-xl bg-primary hover:bg-primary/90 text-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            <Zap
                                                size={16}
                                                className="sm:w-[18px] sm:h-[18px]"
                                                fill="currentColor"
                                            />
                                            <span className="ml-2">
                                                Generate Now
                                            </span>
                                        </Button>
                                    </div>
                                </motion.div>

                                {/* Option 2: File Upload */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative group"
                                >
                                    <div className="absolute -inset-0.5 bg-primary rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    <div className="relative h-full bg-card border border-foreground/10 rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 hover:border-primary/30 transition-all">
                                        {/* Icon Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/80 flex items-center justify-center shadow-lg shadow-primary/10 shrink-0">
                                                    <Upload
                                                        size={20}
                                                        className="sm:w-6 sm:h-6 text-foreground"
                                                    />
                                                </div>
                                                <h3 className="text-lg sm:text-xl font-bold">
                                                    Upload Files{' '}
                                                    <span className={cn(
                                                        "text-xs ml-2 px-2 py-0.5 rounded-full border bg-card/60",
                                                        uploadedFiles.length >= 5 ? "text-destructive border-destructive/20" : "text-primary border-primary/20"
                                                    )}>
                                                        {uploadedFiles.length}/5
                                                    </span>
                                                </h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                    PDF, images, documents &
                                                    more
                                                </p>
                                                <p className="text-[11px] text-muted-foreground/80 mt-1">
                                                    Max 5 files. One-by-one or all at once.
                                                </p>
                                                <p className="text-[11px] text-muted-foreground/80">
                                                    Files above{' '}
                                                    {LARGE_FILE_NOTICE_MB}
                                                    MB may take longer to upload.
                                                </p>
                                            </div>
                                            <div className="px-2 sm:px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold shrink-0 whitespace-nowrap">
                                                {UPLOAD_LIMIT_MB}MB Limit
                                            </div>
                                        </div>

                                        {/* Upload Area */}
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload-redesign"
                                            multiple
                                            accept=".pdf,.docx,.doc,.txt,.csv,.md,.png,.jpg,.jpeg"
                                        />
                                        <label
                                            htmlFor="file-upload-redesign"
                                            className="block cursor-pointer"
                                        >
                                            <div className="relative border-2 border-dashed border-primary/20 hover:border-primary/50 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center transition-all group/upload bg-primary/[0.02] hover:bg-primary/[0.05] active:scale-[0.98]">
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/upload:opacity-100 rounded-xl sm:rounded-2xl transition-opacity"></div>
                                                <div className="relative space-y-2 sm:space-y-4">
                                                    {uploadedFiles.length >= 5 ? (
                                                        <>
                                                            <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                                                                <FileText
                                                                     size={20}
                                                                     className="sm:w-7 sm:h-7 text-destructive"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-bold text-xs sm:text-sm text-destructive uppercase tracking-widest">
                                                                     Limit Reached
                                                                 </p>
                                                                 <p className="text-[10px] sm:text-xs text-muted-foreground">
                                                                     Max 5 documents per node
                                                                 </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center group-hover/upload:border-primary/50 group-hover/upload:scale-110 transition-all bg-primary/5">
                                                                <Upload
                                                                     size={20}
                                                                     className="sm:w-7 sm:h-7 text-primary transition-colors"
                                                                 />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="font-bold text-xs sm:text-sm uppercase tracking-widest">
                                                                    {uploadedFiles.length > 0 ? "Add Another Node" : "Ingest Document"}
                                                                </p>
                                                                <p className="text-[10px] sm:text-xs text-muted-foreground opacity-60">
                                                                    {uploadedFiles.length > 0 ? `Stacking library (${uploadedFiles.length}/5)` : "Select PDF, Word, or Image"}
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </label>

                                        {/* Progress Bar for indexing */}
                                        {uploadedFiles.length > 0 && scanProgress < 100 && (
                                            <div className="space-y-2 px-1 sm:px-4 pt-2">
                                                <div className="flex justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                                                    <span className="flex items-center gap-2">
                                                        <Sparkles size={10} className="text-primary animate-pulse" />
                                                        Indexing source...
                                                    </span>
                                                    <span>{Math.round(scanProgress)}%</span>
                                                </div>
                                                <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-primary shadow-[0_0_10px_#10b981]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${scanProgress}%` }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Quick File List in Upload Tab */}
                                        {uploadedFiles.length > 0 && (
                                            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                                                {uploadedFiles.map((file, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-primary/[0.03] border border-primary/5 text-[10px] sm:text-xs">
                                                        <div className="flex items-center gap-2 truncate flex-1">
                                                            <FileText size={12} className="text-primary/60 shrink-0" />
                                                            <span className="truncate font-bold opacity-80">{file.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 ml-2">
                                                            <button 
                                                                onClick={(e) => { e.preventDefault(); removeFile(idx); }}
                                                                className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-all"
                                                                title="Remove"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Continue Button */}
                                        {uploadedFiles.length > 0 &&
                                            scanProgress === 100 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="pt-2"
                                                >
                                                    <Button
                                                        onClick={() =>
                                                            setActiveTab(
                                                                uploadedFiles.length === 1 && uploadedFiles[0].type ===
                                                                    'application/pdf'
                                                                    ? 'analyze'
                                                                    : 'sync',
                                                            )
                                                        }
                                                        className="w-full h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                                                    >
                                                        Parameter Setup
                                                        <ArrowRight
                                                            size={14}
                                                            className="sm:w-4 sm:h-4"
                                                        />
                                                    </Button>
                                                </motion.div>
                                            )}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Features Footer */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 pt-2 sm:pt-4"
                            >
                                {[
                                    { icon: '⚡', label: 'Instant Generation' },
                                    { icon: '🎯', label: 'AI-Powered' },
                                    { icon: '📚', label: 'Multiple Formats' },
                                    { icon: '🔒', label: 'Secure & Private' },
                                ].map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-card/[0.02] border border-foreground/5"
                                    >
                                        <span className="text-base sm:text-xl shrink-0">
                                            {feature.icon}
                                        </span>
                                        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">
                                            {feature.label}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </TabsContent>

                    <TabsContent
                        key="analyze"
                        value="analyze"
                        className="m-0 outline-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-6"
                        >
                            {uploadedFiles.length === 1 && uploadedFiles[0].type === 'application/pdf' && (
                                <div className="glass border-foreground/5 rounded-2xl overflow-hidden p-4 md:p-8 space-y-6 md:space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold flex items-center gap-3">
                                                <div className="w-2 h-6 bg-primary rounded-2xl" />
                                                SCAN MODE
                                            </h3>
                                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                                Verifying neural fragments
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => setActiveTab('sync')}
                                            disabled={totalPages === 0}
                                            className="rounded-2xl font-bold border-foreground/10 hover:bg-card/5 gap-2 px-6"
                                        >
                                            NEXT
                                            <ArrowRight size={16} />
                                        </Button>
                                    </div>

                                    <div className="rounded-2xl overflow-hidden border border-foreground/5 shadow-2xl bg-card/60 relative group min-h-[400px]">
                                        <div className="absolute inset-x-0 h-0.5 bg-primary/40 shadow-glow top-0 animate-[scan_3s_ease-in-out_infinite] z-10 pointer-events-none" />
                                        <PDFPreview
                                            file={uploadedFiles[0]}
                                            onLoadSuccess={handlePDFLoadSuccess}
                                            onLoadError={(e) => addError(e)}
                                            selectedPages={selectedPages}
                                            onPageSelect={handlePageSelect}
                                            className="w-full opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>

                    <TabsContent
                        key="sync"
                        value="sync"
                        className="m-0 outline-none"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col gap-8"
                        >
                            {uploadedFiles.length === 1 &&
                                uploadedFiles[0].type === 'application/pdf' && (
                                    <PageSelector
                                        totalPages={totalPages}
                                        selectedPages={selectedPages}
                                        onSelectionChange={setSelectedPages}
                                        className="glass border-foreground/5 rounded-2xl p-8 shadow-none"
                                    />
                                )}

                            <div className="glass p-10 rounded-2xl border border-foreground/5 space-y-10 relative overflow-hidden">
                                <div className="relative">
                                    <h3 className="text-2xl font-bold mb-2 tracking-tight">
                                        SYNC PARAMETERS
                                    </h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                                        Optimize extraction weights
                                    </p>
                                </div>

                                <div className="space-y-6 relative">
                                    <div className="flex justify-between items-end">
                                        <Label className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
                                            Output Density (KP Generator)
                                        </Label>
                                        <span className="text-2xl font-bold text-primary">
                                            {numQuestions}
                                        </span>
                                    </div>
                                    <div className="relative pt-2">
                                        <input
                                            type="range"
                                            min={3}
                                            max={30}
                                            value={numQuestions}
                                            onChange={(e) =>
                                                setNumQuestions(
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="w-full h-2 bg-card/5 rounded-2xl appearance-none cursor-pointer accent-primary"
                                        />
                                        <div className="flex justify-between mt-3 text-[10px] font-bold opacity-30">
                                            <span>LOW FREQUENCY</span>
                                            <span>HIGH FREQUENCY</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 rounded-2xl bg-card/5 border border-foreground/5 space-y-4 shadow-inner">
                                    <div className="flex justify-between text-sm py-2 border-b border-foreground/5">
                                        <span className="font-bold opacity-30 uppercase tracking-widest text-[10px]">
                                            Reference
                                        </span>
                                        <span className="font-bold truncate max-w-[200px]">
                                            {uploadedFiles.length === 1 ? uploadedFiles[0].name : `${uploadedFiles.length} Documents`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm py-2">
                                        <span className="font-bold opacity-30 uppercase tracking-widest text-[10px]">
                                            Segment Count
                                        </span>
                                        <span className="font-bold text-primary">
                                            {selectedPages.length || 1} Blocks
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-card/5 rounded-2xl overflow-hidden mt-4">
                                        <motion.div
                                            className="h-full bg-primary shadow-[0_0_15px_#10b981]"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(Math.max(selectedPages.length, 1) / Math.max(totalPages, 1)) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <Button
                                        onClick={handleProcessSelection}
                                        disabled={
                                            isProcessing ||
                                            uploadedFiles.length === 0
                                        }
                                        className="w-full h-14 sm:h-16 md:h-20 rounded-[28px] bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base sm:text-lg md:text-xl shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] gap-3 sm:gap-4"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span>
                                                    INITIALIZING NODE...
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span>ACTIVATE NODE</span>
                                                <Zap
                                                    size={24}
                                                    fill="currentColor"
                                                />
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        onClick={resetUpload}
                                        className="w-full h-12 font-bold text-[10px] tracking-[0.3em] opacity-20 hover:opacity-100 hover:bg-transparent text-destructive gap-2"
                                    >
                                        <Trash2 size={14} />
                                        TERMINATE SEQUENCE
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Document Preview Modal */}
            <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 glass border-foreground/10 rounded-2xl">
                    <DialogHeader className="p-6 border-b border-foreground/5 shrink-0 bg-card/60 backdrop-blur-xl">
                        <DialogTitle className="flex items-center gap-3">
                            <FileText className="text-primary" />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold truncate max-w-[300px] sm:max-w-md">
                                    {previewFile?.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Document Preview
                                </span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-4 sm:p-6 bg-background/40">
                        {previewFile && (
                            <div className="w-full flex justify-center">
                                {previewFile.type.startsWith('image/') ? (
                                    <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                                        <img 
                                            src={URL.createObjectURL(previewFile)} 
                                            alt={previewFile.name}
                                            className="max-w-full h-auto object-contain rounded-xl"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ) : previewFile.type === 'application/pdf' ? (
                                    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-2xl border border-foreground/5">
                                        <PDFPreview 
                                            file={previewFile}
                                            className="w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full p-8 rounded-2xl border border-dashed border-foreground/10 flex flex-col items-center justify-center gap-4 text-center">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                            <FileText size={40} className="text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-lg">Detailed Info</h4>
                                            <p className="text-sm text-muted-foreground max-w-xs">
                                                Full preview is not available for this file type, but it will be indexed for study tools.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                                            <div className="p-4 rounded-xl bg-card/50 border border-foreground/5">
                                                <p className="text-[10px] font-bold uppercase opacity-40">Format</p>
                                                <p className="font-bold">{previewFile.name.split('.').pop()?.toUpperCase()}</p>
                                            </div>
                                            <div className="p-4 rounded-xl bg-card/50 border border-foreground/5">
                                                <p className="text-[10px] font-bold uppercase opacity-40">Size</p>
                                                <p className="font-bold">{(previewFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
          @keyframes scan {
            0% { top: 0; opacity: 0; }
            5% { opacity: 1; }
            95% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .shadow-glow {
            box-shadow: 0 0 30px hsla(var(--primary)/0.4);
          }
        `}</style>
        </div>
    );
};

export default PDFUploadSection;
