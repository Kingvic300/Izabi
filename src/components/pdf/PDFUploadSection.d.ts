import React from 'react';
import { PDFSelection } from '@/types/pdf';
interface PDFUploadSectionProps {
    onSelectionComplete?: (data: {
        selection: PDFSelection;
        file: File;
    }) => void;
    className?: string;
}
declare const PDFUploadSection: React.FC<PDFUploadSectionProps>;
export default PDFUploadSection;
