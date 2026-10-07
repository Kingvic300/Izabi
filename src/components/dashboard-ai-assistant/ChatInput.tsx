import type React from 'react';
import { ArrowUp, FileText, Loader, Paperclip, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import type { ActiveDocument } from './types';

type ChatInputProps = {
    activeDocuments: ActiveDocument[];
    inputValue: string;
    isLoading: boolean;
    isUploadingPdf: boolean;
    onInputChange: (value: string) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    onUploadClick: () => void;
    onRemoveDocument: (documentId: string) => void;
    variant?: 'docked' | 'hero';
};

export default function ChatInput({
    activeDocuments,
    inputValue,
    isLoading,
    isUploadingPdf,
    onInputChange,
    onKeyPress,
    onSend,
    onUploadClick,
    onRemoveDocument,
    variant = 'docked',
}: ChatInputProps) {
    const { t } = useLanguage();
    const hero = variant === 'hero';
    const busy = isLoading || isUploadingPdf;

    const composer = (
        <div className="w-full">
            <div
                className={cn(
                    'rounded-lg border border-input bg-card transition-colors focus-within:border-foreground',
                    hero && 'shadow-elevated',
                )}
            >
                {activeDocuments.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-b border-border px-3 py-2">
                        {activeDocuments.map((doc) => (
                            <span
                                key={doc.documentId}
                                className="inline-flex max-w-[16rem] items-center gap-1.5 rounded-md bg-muted py-1 pl-2 pr-1 text-sm"
                            >
                                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="truncate">{doc.fileName}</span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveDocument(doc.documentId)}
                                    aria-label={`Remove ${doc.fileName}`}
                                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
                <textarea
                    value={inputValue}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={onKeyPress}
                    disabled={busy}
                    rows={hero ? 3 : 1}
                    aria-label="Message"
                    placeholder={
                        activeDocuments.length > 0
                            ? t('assistant.placeholder_with_docs')
                            : t('assistant.placeholder_default')
                    }
                    className={cn(
                        'block max-h-48 w-full resize-none bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground/80 disabled:opacity-60',
                        hero ? 'min-h-[5.5rem] pt-4' : 'min-h-[2.75rem] py-3',
                    )}
                />
                <div className="flex items-center justify-between gap-2 px-2 pb-2">
                    <button
                        type="button"
                        onClick={onUploadClick}
                        disabled={busy}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                    >
                        {isUploadingPdf ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Paperclip className="h-4 w-4" />
                        )}
                        {t('assistant.upload_materials')}
                    </button>
                    <button
                        type="button"
                        onClick={onSend}
                        disabled={busy || !inputValue.trim()}
                        aria-label="Send message"
                        className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/85 disabled:bg-muted disabled:text-muted-foreground"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
                {t('assistant.disclaimer')}
            </p>
        </div>
    );

    if (hero) return composer;

    return (
        <div className="shrink-0 border-t border-border bg-background px-4 pb-3 pt-3 sm:px-6">
            <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </div>
    );
}
