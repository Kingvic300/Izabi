'use client';

import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BrainDrop from '@/components/BrainDrop';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrainDropSectionProps {
    isCompleted: boolean;
    question: any;
    onAnswer: (answer: string, isCorrect: boolean) => void;
    onUploadClick: () => void;
}

export const BrainDropSection = ({
    isCompleted,
    question,
    onAnswer,
    onUploadClick,
}: BrainDropSectionProps) => {
    const { t } = useLanguage();
    if (isCompleted) return null;

    return (
        <div id="brain-drop-section" className="h-full">
            {question ? (
                <BrainDrop question={question} onAnswer={onAnswer} />
            ) : (
                <div className="h-full flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                        <p className="font-medium">
                            {t('module.activate_brain_drop')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t('module.brain_drop_desc')}
                        </p>
                    </div>
                    <Button
                        onClick={onUploadClick}
                        variant="outline"
                        size="sm"
                        className="gap-2 self-start"
                    >
                        <Upload size={14} />
                        {t('module.ingest_document')}
                    </Button>
                </div>
            )}
        </div>
    );
};