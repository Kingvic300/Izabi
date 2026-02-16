import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path locally to bypass CORS and MIME issues from CDNs
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export const usePDFExtraction = () => {
    const [isExtracting, setIsExtracting] = useState(false);

    const extractTextFromPDF = async (file: File) => {
        setIsExtracting(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = '';
            const maxPages = Math.min(pdf.numPages, 300); // Support up to 300 pages for textbooks

            for (let i = 1; i <= maxPages; i++) {
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