import React, { useState, useEffect } from 'react';
import { LoadingSpinner, SkeletonLoader } from '@/components/ui/loading';
import ErrorDisplay from '@/components/ui/error-display';
import { cn } from '@/lib/utils';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { CheckCircle2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface PDFPreviewProps {
    file: File;
    onLoadSuccess?: (numPages: number) => void;
    onLoadError?: (error: Error) => void;
    selectedPages?: number[];
    onPageSelect?: (pageNumber: number) => void;
    className?: string;
}

const LazyPage: React.FC<{
    pageNumber: number;
    isSelected: boolean;
    isLoaded: boolean;
    onLoadSuccess: (data: { pageNumber: number }) => void;
    onClick: () => void;
}> = ({ pageNumber, isSelected, isLoaded, onLoadSuccess, onClick }) => {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }, // Start loading even before it hits the viewport
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                'relative cursor-pointer rounded-lg overflow-hidden min-h-[180px] bg-white border-2 transition-colors',
                isSelected
                    ? 'border-primary'
                    : 'border-transparent opacity-60 hover:opacity-100',
            )}
            onClick={onClick}
        >
            {isVisible ? (
                <>
                    <Page
                        pageNumber={pageNumber}
                        width={160}
                        onLoadSuccess={onLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center h-full min-h-[180px]">
                                <SkeletonLoader
                                    variant="image"
                                    className="w-full h-full"
                                />
                            </div>
                        }
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />

                    <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 text-[11px] font-medium text-background">
                        {pageNumber}
                    </div>

                    {isSelected && (
                        <div className="absolute top-1.5 right-1.5 z-10 bg-primary text-primary-foreground rounded-full">
                            <CheckCircle2 size={18} />
                        </div>
                    )}

                    {!isLoaded && (
                        <div className="absolute inset-0 bg-background/20 flex items-center justify-center z-20">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full min-h-[180px]">
                    <SkeletonLoader variant="image" className="w-full h-full" />
                </div>
            )}
        </div>
    );
};

export const PDFPreview: React.FC<PDFPreviewProps> = ({
    file,
    onLoadSuccess,
    onLoadError,
    selectedPages = [],
    onPageSelect,
    className,
}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [error, setError] = useState<Error | null>(null);
    const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

    const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setError(null);
        onLoadSuccess?.(numPages);
    };

    const handleDocumentLoadError = (error: Error) => {
        setError(error);
        onLoadError?.(error);
    };

    const handlePageLoadSuccess = ({ pageNumber }: { pageNumber: number }) => {
        setLoadedPages((prev) => new Set([...prev, pageNumber]));
    };

    const handlePageClick = (pageNumber: number) => {
        onPageSelect?.(pageNumber);
    };

    if (error) {
        return (
            <ErrorDisplay
                error={{
                    id: 'pdf-preview-error',
                    type: 'validation',
                    message: 'Failed to load PDF preview',
                    details: error.message,
                    timestamp: Date.now(),
                }}
            />
        );
    }

    return (
        <div className={cn('w-full', className)}>
            <Document
                file={file}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={
                    <div className="flex flex-col items-center justify-center min-h-[240px] w-full py-10">
                        <LoadingSpinner size="lg" text="Loading PDF…" />
                    </div>
                }
            >
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-3">
                    {Array.from({ length: numPages }, (_, index) => {
                        const pageNumber = index + 1;
                        const isSelected = selectedPages.includes(pageNumber);
                        const isLoaded = loadedPages.has(pageNumber);

                        return (
                            <LazyPage
                                key={pageNumber}
                                pageNumber={pageNumber}
                                isSelected={isSelected}
                                isLoaded={isLoaded}
                                onLoadSuccess={handlePageLoadSuccess}
                                onClick={() => handlePageClick(pageNumber)}
                            />
                        );
                    })}
                </div>
            </Document>
        </div>
    );
};

export default PDFPreview;
