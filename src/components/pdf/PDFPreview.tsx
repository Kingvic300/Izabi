import React, { useState, useEffect } from "react";
import { LoadingSpinner, SkeletonLoader } from "@/components/ui/loading";
import ErrorDisplay from "@/components/ui/error-display";
import { cn } from "@/lib/utils";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

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
            { rootMargin: "200px" } // Start loading even before it hits the viewport
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative cursor-pointer transition-all duration-500 rounded-2xl overflow-hidden group min-h-[250px] bg-foreground/5",
                isSelected && "ring-4 ring-primary ring-offset-4 ring-offset-black scale-105",
                "hover:scale-[1.08] hover:shadow-[0_0_30px_hsla(var(--primary)/0.2)]"
            )}
            onClick={onClick}
        >
            {isVisible ? (
                <>
                    <Page
                        pageNumber={pageNumber}
                        width={200}
                        onLoadSuccess={onLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center h-full min-h-[250px]">
                                <SkeletonLoader variant="image" className="w-full h-full" />
                            </div>
                        }
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="opacity-90 group-hover:opacity-100 transition-opacity"
                    />

                    <div className="absolute top-4 left-4 px-2 py-0.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest text-white uppercase">
                        SEG {pageNumber}
                    </div>

                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                className="absolute top-4 right-4 z-10"
                            >
                                <div className="bg-primary text-white rounded-2xl p-1 shadow-glow ring-2 ring-white/20">
                                    <CheckCircle2 size={16} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!isLoaded && (
                        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-20">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}
                </>
            ) : (
                <div className="flex items-center justify-center h-full min-h-[250px]">
                    <SkeletonLoader variant="image" className="w-full h-full" />
                </div>
            )}
        </motion.div>
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
                    id: "pdf-preview-error",
                    type: "validation",
                    message: "Failed to load PDF preview",
                    details: error.message,
                    timestamp: Date.now(),
                }}
            />
        );
    }

    return (
        <div className={cn("w-full", className)}>
            <Document
                file={file}
                onLoadSuccess={handleDocumentLoadSuccess}
                onLoadError={handleDocumentLoadError}
                loading={
                    <div className="flex flex-col items-center justify-center min-h-[400px] w-full py-20">
                        <LoadingSpinner size="lg" text="Loading PDF Node..." />
                    </div>
                }
            >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
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
