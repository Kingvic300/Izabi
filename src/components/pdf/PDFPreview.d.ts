import React from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
interface PDFPreviewProps {
    file: File;
    onLoadSuccess?: (numPages: number) => void;
    onLoadError?: (error: Error) => void;
    selectedPages?: number[];
    onPageSelect?: (pageNumber: number) => void;
    className?: string;
}
export declare const PDFPreview: React.FC<PDFPreviewProps>;
export default PDFPreview;
