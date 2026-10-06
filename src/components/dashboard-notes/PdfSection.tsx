import React, { useState, useRef } from 'react';
import {
    FileText,
    UploadCloud,
    Layers,
    ArrowRight,
    Trash2,
    Search,
    BookOpen,
    HelpCircle,
    Plus,
    Highlighter,
} from 'lucide-react';

export interface PdfDocument {
    id: string;
    name: string;
    size: string;
    pages: number;
    selectedPages: number[];
    uploadedAt: string;
    topic: string;
    file?: File;
}

interface PdfSectionProps {
    documents: PdfDocument[];
    onFilesAdded: (files: File[]) => void;
    onSelectPdfAndStudy: (pdf: PdfDocument) => void;
    onOpenPagePicker: (pdf: PdfDocument, initialMode?: 'grid' | 'reader') => void;
    onDeletePdf?: (id: string) => void;
    isUploading?: boolean;
}

/**
 * Ported from izabi-new's PdfSection. There is no `/api/pdf-library` listing
 * endpoint in apiClient — Izabi's real PDF flow is session-scoped (upload ->
 * extract/ingest -> generate), not a persisted library. This component is
 * therefore a presentational "PDF library" shell driven by a `documents`
 * prop the caller owns (e.g. built from StudyContext.session.pdfFiles),
 * rather than a backend-synced list.
 */
export const PdfSection: React.FC<PdfSectionProps> = ({
    documents,
    onFilesAdded,
    onSelectPdfAndStudy,
    onOpenPagePicker,
    onDeletePdf,
    isUploading = false,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredPdfs = documents.filter(
        (pdf) =>
            pdf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pdf.topic.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            onFilesAdded(Array.from(e.target.files));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files?.length) {
            onFilesAdded(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div className="space-y-6" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-primary" />
                        <span>PDF Library</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Review lecture notes, curate pages, and generate study materials.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isUploading && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/30 border border-border text-xs text-foreground/80">
                            <UploadCloud className="w-3.5 h-3.5 text-primary animate-spin" />
                            <span>Ingesting...</span>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Upload PDF</span>
                    </button>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search documents by title or topic..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>

                <span className="text-xs font-mono text-muted-foreground">
                    {filteredPdfs.length} {filteredPdfs.length === 1 ? 'Document' : 'Documents'}
                </span>
            </div>

            {filteredPdfs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center text-sm text-muted-foreground">
                    No documents yet. Upload a PDF to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPdfs.map((pdf) => (
                        <div
                            key={pdf.id}
                            onClick={() => onSelectPdfAndStudy(pdf)}
                            className="group rounded-2xl bg-card border border-border hover:border-primary/30 p-5 shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 font-mono mt-0.5">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                                                {pdf.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                                {pdf.topic}
                                            </p>
                                        </div>
                                    </div>

                                    {onDeletePdf && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeletePdf(pdf.id);
                                            }}
                                            className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                                            title="Remove from library"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4 pt-1 border-t border-border">
                                    <span>{pdf.size}</span>
                                    <span>·</span>
                                    <span>{pdf.pages} Pages</span>
                                    <span>·</span>
                                    <span className="text-foreground/80">{pdf.selectedPages.length} Curated</span>
                                    <span>·</span>
                                    <span>{pdf.uploadedAt}</span>
                                </div>

                                <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-foreground/80">
                                    <span className="px-2 py-0.5 rounded-md bg-muted border border-border flex items-center gap-1">
                                        <BookOpen className="w-3 h-3 text-primary" />
                                        <span>Summary</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-muted border border-border flex items-center gap-1">
                                        <HelpCircle className="w-3 h-3 text-learning-green" />
                                        <span>Quizzes</span>
                                    </span>
                                    <span className="px-2 py-0.5 rounded-md bg-muted border border-border flex items-center gap-1">
                                        <Layers className="w-3 h-3 text-learning-blue" />
                                        <span>Flashcards</span>
                                    </span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenPagePicker(pdf, 'reader');
                                    }}
                                    className="text-xs font-semibold text-amber-600 hover:text-amber-500 transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5"
                                >
                                    <Highlighter className="w-3.5 h-3.5" />
                                    <span>Annotate & Review</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => onSelectPdfAndStudy(pdf)}
                                    className="py-1.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                    <span>Study Studio</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PdfSection;
