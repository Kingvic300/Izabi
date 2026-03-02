'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PDFUploadSection from '@/components/pdf/PDFUploadSection';

interface UploadPromptProps {
    onSelectionComplete: (data: any) => void;
    onReadyToLearn: () => void;
}

export const UploadPrompt = ({ onSelectionComplete, onReadyToLearn }: UploadPromptProps) => {
    const { t } = useLanguage();

    return (
        <Card
            id="upload-section"
            className="h-full glass shadow-2xl rounded-[28px] md:rounded-[48px] overflow-hidden group relative border-0"
        >
            <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
            <CardHeader className="p-6 sm:p-10 md:p-14 text-center md:text-left text-foreground">
                <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold font-mono tracking-tighter mb-4 sm:mb-6 relative uppercase">
                    {t('dashboard.upload_title') || 'Document Upload'}
                    <span className="absolute -top-1 -right-8 w-2 h-2 bg-primary rounded-full animate-ping" />
                </CardTitle>
                <CardDescription className="text-base sm:text-lg font-medium opacity-60 max-w-xl mx-auto md:mx-0 leading-relaxed font-mono">
                    {t('dashboard.upload_desc') ||
                        'Upload notes, textbooks, images, or documents to start studying.'}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 md:px-8 lg:px-10 pb-8 sm:pb-14">
                <PDFUploadSection
                    onSelectionComplete={onSelectionComplete}
                    className="md:mt-0"
                />
            </CardContent>
        </Card>
    );
};

export const UploadSidebar = ({ onReadyToLearn }: { onReadyToLearn: () => void }) => {
    const { t } = useLanguage();

    return (
        <Card className="glass shadow-2xl p-6 sm:p-10 md:p-14 rounded-[28px] md:rounded-[48px] flex flex-col items-center text-center space-y-6 sm:space-y-8 h-full min-h-[320px] sm:min-h-[400px] border-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] sm:rounded-[32px] bg-card/5 flex items-center justify-center border border-foreground/5 shadow-2xl rotate-3 group-hover:rotate-0 transition-all mt-2 sm:mt-4">
                <Cpu size={48} className="text-primary animate-float" />
            </div>
            <div className="space-y-4 pt-4">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight font-sans uppercase">
                    {t('dashboard.init_node') || 'Study Setup'}
                </h3>
                <p className="text-base font-medium text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                    {t('dashboard.init_desc') ||
                        'Upload a document to unlock your personalized study tools.'}
                </p>
            </div>
            <div className="flex-1 flex items-end pb-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReadyToLearn}
                    className="h-10 rounded-full border-foreground/10 bg-card/5 px-4 text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] opacity-70 hover:opacity-100"
                >
                    <Upload size={12} />
                    <span>Upload document</span>
                </Button>
            </div>
        </Card>
    );
};