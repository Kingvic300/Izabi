import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bubble } from '@/components/ui/bubble';
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

    return (
        <div id="brain-drop-section" className="h-full">
            {isCompleted ? (
                <div className="flex h-full items-start gap-4">
                    <Bubble state="filled" size="lg" />
                    <div>
                        <p className="font-display text-xl">
                            Done for today.
                        </p>
                        <p className="mt-1 text-muted-foreground">
                            Your next Brain Drop question arrives tomorrow
                            morning.
                        </p>
                    </div>
                </div>
            ) : question ? (
                <BrainDrop question={question} onAnswer={onAnswer} />
            ) : (
                <div className="flex h-full flex-col justify-between gap-4">
                    <div>
                        <p className="font-display text-xl">
                            {t('module.activate_brain_drop')}
                        </p>
                        <p className="mt-1 text-muted-foreground">
                            {t('module.brain_drop_desc')}
                        </p>
                    </div>
                    <Button
                        onClick={onUploadClick}
                        variant="outline"
                        size="sm"
                        className="self-start"
                    >
                        <Upload />
                        {t('module.ingest_document')}
                    </Button>
                </div>
            )}
        </div>
    );
};
