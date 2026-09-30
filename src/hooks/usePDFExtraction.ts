import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Same worker as PDFPreview (react-pdf shares this global) so versions never mismatch
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export const usePDFExtraction = () => {
    const [isExtracting, setIsExtracting] = useState(false);

    const extractTextFromPDF = async (file: File, pages?: number[]) => {
        setIsExtracting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = '';
            // Only the pages the user picked; whole document when none given
            const pageNumbers =
                pages && pages.length > 0
                    ? pages.filter((n) => n >= 1 && n <= pdf.numPages)
                    : Array.from({ length: pdf.numPages }, (_, i) => i + 1);

            for (const i of pageNumbers) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const pageText = content.items
                    .map((item: any) => item.str)
                    .join(' ');
                text += pageText + '\n\n';
            }
            return text;
        } catch (error) {
            console.error('[PDF Extraction] Error:', error);
            throw new Error('Failed to extract text from PDF locally.');
        } finally {
            setIsExtracting(false);
        }
    };

    return { extractTextFromPDF, isExtracting };
};