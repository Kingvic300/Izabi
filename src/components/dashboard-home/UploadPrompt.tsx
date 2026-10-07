'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import PDFUploadSection from '@/components/pdf/PDFUploadSection';

interface UploadPromptProps {
    onSelectionComplete: (data: any) => void;
    onReadyToLearn: () => void;
}

export const UploadPrompt = ({ onSelectionComplete }: UploadPromptProps) => {
    const { t } = useLanguage();

    return (
        <div
            id="upload-section"
            className="rounded-lg border border-border bg-card p-4 sm:p-6"
        >
            <h4 className="sr-only">{t('dashboard.upload_title')}</h4>
            <PDFUploadSection onSelectionComplete={onSelectionComplete} />
        </div>
    );
};
