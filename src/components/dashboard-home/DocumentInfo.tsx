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
        <div className="h-full space-y-4 rounded-lg border border-border bg-card p-5">
            <div>
                <h4 className="font-display text-lg">{t('doc.your_files')}</h4>
                <p className="tabular text-sm text-muted-foreground">
                    {fileNames.length} of 5
                </p>
            </div>

            <ul className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {fileNames.map((name, idx) => (
                    <li
                        key={idx}
                        className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-1.5"
                    >
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText
                                size={16}
                                className="shrink-0 text-muted-foreground"
                            />
                            <span className="text-sm truncate">{name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
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
