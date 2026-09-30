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
            className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-4"
        >
            <div>
                <h4 className="font-medium">{t('dashboard.upload_title')}</h4>
                <p className="text-sm text-muted-foreground">
                    {t('dashboard.upload_desc')}
                </p>
            </div>
            <PDFUploadSection onSelectionComplete={onSelectionComplete} />
        </div>
    );
};
