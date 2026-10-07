import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, X, ArrowLeft, ArrowRight } from 'lucide-react';
import PDFPreview from './PDFPreview';
import PageSelector from './PageSelector';
import { useApiError } from '@/hooks/useApiError';
import { PDFSelection, MAX_SELECTED_PAGES } from '@/types/pdf';
import { cn } from '@/lib/utils';
import { useStudy } from '@/contexts/StudyContext';

interface PDFUploadSectionProps {
    onSelectionComplete?: (data: {
        selections: PDFSelection[];
        files: File[];
    }) => void;
    className?: string;
}

const UPLOAD_LIMIT_MB =
    Number(import.meta.env.VITE_UPLOAD_LIMIT_MB) || 25;

const PDFUploadSection: React.FC<PDFUploadSectionProps> = ({
    onSelectionComplete,
    className,
}) => {
    const { session, updateSession, clearSession } = useStudy();

    const [uploadedFiles, setUploadedFiles] = useState<File[]>(
        session.pdfFiles || [],
    );
    // Track pages for the first PDF if it's the only one, or handle simplified multi-pdf selection
    const [totalPages, setTotalPages] = useState<number>(
        session.pdfSelections?.[0]?.metadata?.totalPages || 0,
    );
    const [selectedPages, setSelectedPages] = useState<number[]>(
        session.pdfSelections?.[0]?.selectedPages || [],
    );

    const [step, setStep] = useState<'files' | 'pages'>('files');

    useEffect(() => {
        // If we have files and NO selections, we might be adding more.
        // If we have files and selections, we are usually in sync/ready state.
        if (session.pdfFiles.length > 0 && session.pdfSelections.length > 0) {
            setStep('pages');
        }
    }, [session.pdfFiles.length, session.pdfSelections.length]);
    const [isProcessing, setIsProcessing] = useState(false);

    const [topicText, setTopicText] = useState<string>('');
    const numQuestions = session.numberOfQuestions || 5;

    const { addError, clearErrors } = useApiError();

    // Sync back to context for persistence
    useEffect(() => {
        updateSession({
            pdfFiles: uploadedFiles,
            fileNames: uploadedFiles.map((f) => f.name),
        });
    }, [uploadedFiles]);

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
        onSelectionComplete?.({
            selections: [
                {
                    selectedPages: [1],
                    selectedText: [],
                    selectionType: 'pages',
                    metadata: {
                        totalPages: 1,
                        fileName: virtualFile.name,
                        fileSize: virtualFile.size,
                    },
                    numberOfQuestions: numQuestions,
                },
            ],
            files: [virtualFile],
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
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

        // Reset input value to allow selecting the same file again if removed
        event.target.value = '';
    };

    const removeFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
        if (newFiles.length === 0) {
            setStep('files');
        }
    };

    const handlePDFLoadSuccess = (numPages: number) => {
        setTotalPages(numPages);
        // Keep an existing selection (e.g. when returning to this step);
        // otherwise start with the first MAX_SELECTED_PAGES pages.
        setSelectedPages((prev) => {
            const valid = prev.filter((p) => p <= numPages);
            if (valid.length > 0) return valid;
            return Array.from(
                { length: Math.min(numPages, MAX_SELECTED_PAGES) },
                (_, i) => i + 1,
            );
        });
    };

    const handlePageSelect = (pageNumber: number) => {
        if (
            !selectedPages.includes(pageNumber) &&
            selectedPages.length >= MAX_SELECTED_PAGES
        ) {
            addError({
                message: `You can select at most ${MAX_SELECTED_PAGES} pages at a time.`,
                type: 'validation',
            });
            return;
        }
        setSelectedPages((prev) =>
            prev.includes(pageNumber)
                ? prev.filter((p) => p !== pageNumber)
                : [...prev, pageNumber].sort((a, b) => a - b),
        );
    };

    const isSinglePDF =
        uploadedFiles.length === 1 && uploadedFiles[0].type === 'application/pdf';

    const handleProcessSelection = () => {
        if (uploadedFiles.length === 0) {
            addError({
                message: 'Add at least one file.',
                type: 'validation',
            });
            return;
        }

        if (isSinglePDF && selectedPages.length === 0) {
            addError({
                message: 'Select at least one page.',
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

        onSelectionComplete?.({ selections, files: uploadedFiles });
        setIsProcessing(false);
    };

    const resetUpload = () => {
        setUploadedFiles([]);
        setTotalPages(0);
        setSelectedPages([]);
        setStep('files');
        clearErrors();
        setTopicText('');

        // Global clear as well
        clearSession();
    };

    const formatSize = (bytes: number) =>
        bytes < 1024 * 1024
            ? `${Math.max(1, Math.round(bytes / 1024))} KB`
            : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

    if (step === 'pages' && uploadedFiles.length > 0) {
        return (
            <div className={cn('space-y-4', className)}>
                {isSinglePDF ? (
                    <>
                        <div>
                            <p className="font-display text-lg">Choose pages</p>
                            <p className="text-sm text-muted-foreground">
                                Tap a page to add or remove it. Up to{' '}
                                {MAX_SELECTED_PAGES} pages.
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 max-h-[60vh] overflow-y-auto">
                            <PDFPreview
                                file={uploadedFiles[0]}
                                onLoadSuccess={handlePDFLoadSuccess}
                                onLoadError={(e) => addError(e)}
                                selectedPages={selectedPages}
                                onPageSelect={handlePageSelect}
                            />
                        </div>
                        {totalPages > 0 && (
                            <PageSelector
                                totalPages={totalPages}
                                selectedPages={selectedPages}
                                onSelectionChange={setSelectedPages}
                                maxPages={MAX_SELECTED_PAGES}
                            />
                        )}
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        All {uploadedFiles.length} files will be used.
                    </p>
                )}

                <div className="flex items-center justify-between gap-2 pt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setStep('files')}
                    >
                        <ArrowLeft size={14} />
                        Back
                    </Button>
                    <Button
                        onClick={handleProcessSelection}
                        disabled={
                            isProcessing ||
                            (isSinglePDF && selectedPages.length === 0)
                        }
                        className="gap-2"
                    >
                        {isSinglePDF
                            ? `Use ${selectedPages.length} page${selectedPages.length === 1 ? '' : 's'}`
                            : 'Continue'}
                        <ArrowRight size={14} />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-4', className)}>
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
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-[1.5px] border-dashed border-sheet/45 px-4 py-12 text-center transition-colors hover:border-foreground/50 hover:bg-muted/40 focus-within:border-foreground"
            >
                <Upload size={22} className="text-muted-foreground" />
                <span className="font-display text-lg">
                    {uploadedFiles.length > 0
                        ? 'Add more files'
                        : 'Click to choose files'}
                </span>
                <span className="text-sm text-muted-foreground">
                    PDF, Word, text or images. Up to 5 files,{' '}
                    {UPLOAD_LIMIT_MB} MB each.
                </span>
            </label>

            {uploadedFiles.length > 0 && (
                <>
                    <ul className="space-y-1.5">
                        {uploadedFiles.map((file, idx) => (
                            <li
                                key={`${file.name}-${idx}`}
                                className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileText
                                        size={16}
                                        className="shrink-0 text-muted-foreground"
                                    />
                                    <span className="text-sm truncate">
                                        {file.name}
                                    </span>
                                    <span className="tabular shrink-0 text-sm text-muted-foreground">
                                        {formatSize(file.size)}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0"
                                    onClick={() => removeFile(idx)}
                                    aria-label={`Remove ${file.name}`}
                                >
                                    <X size={14} />
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                            onClick={resetUpload}
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={() => setStep('pages')}
                            className="gap-2"
                        >
                            Continue
                            <ArrowRight size={14} />
                        </Button>
                    </div>
                </>
            )}

            {uploadedFiles.length === 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="h-px flex-1 bg-border" />
                        or type a topic
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="flex gap-2">
                        <Input
                            value={topicText}
                            onChange={(e) => setTopicText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. Photosynthesis"
                            maxLength={500}
                            aria-label="Topic"
                            className="h-11"
                        />
                        <Button
                            onClick={handleTopicSubmit}
                            disabled={topicText.trim().length < 3}
                            className="h-11 shrink-0"
                        >
                            Study this
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PDFUploadSection;
