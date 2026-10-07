import React, { useState, useRef } from 'react';
import {
    UploadCloud,
    FileCheck,
    AlertCircle,
    ArrowRight,
    Layers,
    X,
    Sparkles,
} from 'lucide-react';

interface UploadedFileInfo {
    name: string;
    size: string;
    pages: number;
}

interface UploadCardProps {
    // Wires into real file handling (DashboardHome's handleSelectionComplete /
    // PDF extraction pipeline) rather than the izabi-new simulated progress bar.
    onFilesSelected: (files: File[]) => void;
    onTopicSubmit?: (topic: string) => void;
    onOpenPdfPicker?: () => void;
    currentFile?: UploadedFileInfo | null;
    isProcessing?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
    onFilesSelected,
    onTopicSubmit,
    onOpenPdfPicker,
    currentFile,
    isProcessing = false,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [topic, setTopic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateAndEmit = (files: File[]) => {
        setErrorMessage('');
        const oversized = files.find((f) => f.size > 25 * 1024 * 1024);
        if (oversized) {
            setErrorMessage('File exceeds the 25 MB maximum size limit.');
            return;
        }
        onFilesSelected(files);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.length) {
            validateAndEmit(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            validateAndEmit(Array.from(e.target.files));
        }
    };

    const handleTopicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !onTopicSubmit) return;
        onTopicSubmit(topic);
    };

    return (
        <div className="rounded-2xl bg-card border border-border p-5 sm:p-6 shadow-card transition-all">
            <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                    Ingest Curriculum Material
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                    Upload slide decks, lecture PDFs, research papers, or specify a topic.
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />

            {currentFile && !isProcessing ? (
                <div className="rounded-xl border border-border bg-muted/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                            <FileCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground truncate max-w-[220px] sm:max-w-xs">
                                    {currentFile.name}
                                </span>
                                <span className="text-xs tabular text-learning-green bg-learning-green/10 px-1.5 py-0.5 rounded border border-learning-green/20">
                                    Ready
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs tabular text-muted-foreground mt-0.5">
                                <span>{currentFile.size}</span>
                                <span>·</span>
                                <span>{currentFile.pages} pages extracted</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {onOpenPdfPicker && (
                            <button
                                type="button"
                                onClick={onOpenPdfPicker}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all shadow-sm cursor-pointer"
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span>Select Pages ({currentFile.pages})</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-xl bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer border border-border"
                            title="Replace file"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            ) : isProcessing ? (
                <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 animate-spin">
                        <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                        Processing document...
                    </p>
                </div>
            ) : errorMessage ? (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:p-5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-destructive">Upload failed</p>
                            <p className="text-xs text-destructive/80 mt-0.5">{errorMessage}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setErrorMessage('')}
                        className="text-xs font-medium text-foreground/80 hover:text-foreground underline cursor-pointer"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group rounded-xl border border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer ${
                        dragActive
                            ? 'border-primary bg-primary/5 scale-[0.99]'
                            : 'border-border hover:border-primary/40 bg-muted/10 hover:bg-muted/20'
                    }`}
                >
                    <div className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto mb-3 transition-transform">
                        <UploadCloud className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors" />
                    </div>

                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        Drop your lecture document here
                        <span className="text-muted-foreground font-normal ml-1">or browse files</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-1">
                        PDF, Word slides, or notes · up to 25 MB
                    </p>
                </div>
            )}

            {onTopicSubmit && (
                <>
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-card px-3 text-muted-foreground tabular text-[11px]">
                                OR SYNTHESIZE BY TOPIC
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleTopicSubmit} className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Type any curriculum topic..."
                                className="w-full h-10 px-3.5 rounded-xl bg-muted/30 border border-border text-xs sm:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                            {topic && (
                                <button
                                    type="button"
                                    onClick={() => setTopic('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!topic.trim()}
                            className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed shadow-sm shrink-0"
                        >
                            <span>Synthesize</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default UploadCard;
