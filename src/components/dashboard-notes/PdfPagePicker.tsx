import React, { useState } from 'react';
import {
    ArrowLeft,
    Check,
    FileText,
    CheckSquare,
    Square,
    Layers,
    ArrowRight,
} from 'lucide-react';

export interface PdfPageItem {
    id: number;
    pageNumber: number;
    title: string;
    selected: boolean;
    snippet: string;
}

interface PdfPagePickerProps {
    onBack: () => void;
    onConfirmPages: (selectedPageNumbers: number[]) => void;
    documentTitle?: string;
    pages: PdfPageItem[];
}

/**
 * Ported from izabi-new's PdfPagePicker. The original component included a
 * full digital-highlighter/annotation reader over hardcoded Biology lecture
 * content; since Izabi's apiClient has no endpoint to persist highlights or
 * annotated passages, and real page text comes from usePDFExtraction (not
 * static sample content), this port keeps the page-selection grid — the
 * part that maps directly onto StudyContext.session.pdfSelections — and
 * drops the simulated document-reader/highlighter view.
 * TODO: wire a real highlighter/annotation feature once a backend endpoint
 * to persist per-page highlights exists.
 */
export const PdfPagePicker: React.FC<PdfPagePickerProps> = ({
    onBack,
    onConfirmPages,
    documentTitle = 'Document',
    pages: initialPages,
}) => {
    const [pages, setPages] = useState<PdfPageItem[]>(initialPages);

    const selectedCount = pages.filter((p) => p.selected).length;

    const togglePage = (id: number) => {
        setPages((prev) =>
            prev.map((page) => (page.id === id ? { ...page, selected: !page.selected } : page)),
        );
    };

    const handleSelectAll = () => {
        const allSelected = pages.every((p) => p.selected);
        setPages((prev) => prev.map((p) => ({ ...p, selected: !allSelected })));
    };

    const handleConfirm = () => {
        if (selectedCount === 0) return;
        const selectedPageNums = pages.filter((p) => p.selected).map((p) => p.pageNumber);
        onConfirmPages(selectedPageNums);
    };

    return (
        <div className="w-full flex flex-col min-h-[calc(100vh-140px)] pb-24 text-foreground">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 mb-3 border-b border-border">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="w-9 h-9 rounded-xl bg-card border border-border hover:border-primary/40 hover:text-primary text-foreground/80 flex items-center justify-center transition-colors cursor-pointer"
                        title="Go back to PDF Library"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-bold text-foreground tracking-tight truncate max-w-[240px] sm:max-w-md">
                                {documentTitle}
                            </h2>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Select which pages to include in your generated study pack.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-auto">
                    <button
                        type="button"
                        disabled={selectedCount === 0}
                        onClick={handleConfirm}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                        <span>Open Study Studio ({selectedCount})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 py-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 px-1">
                    <span>
                        Selected: <strong className="text-foreground font-mono">{selectedCount}</strong> of{' '}
                        {pages.length} pages
                    </span>
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="text-primary hover:underline font-semibold cursor-pointer"
                    >
                        {selectedCount === pages.length ? 'Deselect All' : 'Select All'}
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            onClick={() => togglePage(page.id)}
                            className={`group relative rounded-2xl border p-4 transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                                page.selected
                                    ? 'bg-card border-primary shadow-md shadow-primary/10 ring-1 ring-primary'
                                    : 'bg-card border-border hover:border-primary/30'
                            }`}
                        >
                            <div>
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-xs font-mono text-primary font-bold">
                                        Page {page.pageNumber}
                                    </span>

                                    <div
                                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                            page.selected
                                                ? 'bg-primary border-primary text-primary-foreground'
                                                : 'border-border bg-muted'
                                        }`}
                                    >
                                        {page.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                </div>

                                <h4 className="text-xs font-bold text-foreground mb-1.5 line-clamp-1">
                                    {page.title}
                                </h4>

                                <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                                    {page.snippet}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-border flex items-center justify-end text-[11px]">
                                {page.selected ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-primary" />
                                ) : (
                                    <Square className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PdfPagePicker;
