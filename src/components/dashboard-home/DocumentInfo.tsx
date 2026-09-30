'use client';

import { Button } from '@/components/ui/button';
import { FileText, RotateCcw, Plus, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DocumentInfoProps {
    fileNames: string[];
    userStats: any;
    onReset: () => void;
    onAddMore: () => void;
    onPreview: (index: number) => void;
}

export const DocumentInfo = ({
    fileNames,
    onReset,
    onAddMore,
    onPreview,
}: DocumentInfoProps) => {
    const { t } = useLanguage();

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4 h-full">
            <div>
                <h4 className="font-medium">{t('doc.your_files')}</h4>
                <p className="text-sm text-muted-foreground">
                    {fileNames.length} / 5
                </p>
            </div>

            <ul className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {fileNames.map((name, idx) => (
                    <li
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText
                                size={16}
                                className="text-primary shrink-0"
                            />
                            <span className="text-sm truncate">{name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0"
                            onClick={() => onPreview(idx)}
                            aria-label={`Preview ${name}`}
                        >
                            <Eye size={14} />
                        </Button>
                    </li>
                ))}
            </ul>

            <div className="flex flex-col gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={onAddMore}
                    disabled={fileNames.length >= 5}
                >
                    <Plus size={14} />
                    {t('doc.add_files')}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-destructive"
                    onClick={onReset}
                >
                    <RotateCcw size={14} />
                    {t('doc.start_over')}
                </Button>
            </div>
        </div>
    );
};
