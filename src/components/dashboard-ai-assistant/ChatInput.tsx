'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    BookOpen,
    FileText,
    Loader,
    Paperclip,
    Send,
    Target,
    Zap,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { ActiveDocument } from './types';

type ChatInputProps = {
    activeDocuments: ActiveDocument[];
    inputValue: string;
    isLoading: boolean;
    isUploadingPdf: boolean;
    onInputChange: (value: string) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onUploadClick: () => void;
    onRemoveDocument: (documentId: string) => void;
    onSuggestionClick: (feature: string) => void;
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
    onSuggestionClick,
}: ChatInputProps) {
    const { t } = useLanguage();
    return (
        <div className="shrink-0 border-t border-border px-4 py-3 sm:px-6">
            <div className="mx-auto w-full max-w-3xl space-y-2">
                {activeDocuments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {activeDocuments.map((doc) => (
                            <div
                                key={doc.documentId}
                                className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/50 px-2 py-1"
                            >
                                <div className="flex min-w-0 items-center gap-2 text-sm">
                                    <FileText className="h-3 w-3" />
                                    <span className="truncate max-w-[120px] sm:max-w-[180px]">
                                        {doc.fileName}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveDocument(doc.documentId)}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Smart Suggestions */}
                {!inputValue && !isLoading && (
                    <div className="no-scrollbar flex gap-2 overflow-x-auto">
                        {[
                            {
                                label: t('assistant.suggestion_flashcards'),
                                icon: <Zap size={12} />,
                                feature: 'Flashcards',
                            },
                            {
                                label: t('assistant.suggestion_study_guide'),
                                icon: <BookOpen size={12} />,
                                feature: 'Study Guide',
                            },
                            {
                                label: t('assistant.suggestion_practice_quiz'),
                                icon: <Target size={12} />,
                                feature: 'Practice Quiz',
                            },
                        ].map((s, idx) => (
                            <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onSuggestionClick(s.feature)
                                }
                                className="h-8 shrink-0 rounded-full font-normal"
                            >
                                {s.icon} {s.label}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="relative flex items-center gap-1 rounded-lg border border-input bg-card px-2 transition-colors focus-within:border-foreground">
                    <Input
                        placeholder={
                            activeDocuments.length > 0
                                ? t('assistant.placeholder_with_docs')
                                : t('assistant.placeholder_default')
                        }
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyPress={onKeyPress}
                        disabled={isLoading || isUploadingPdf}
                        aria-label="Message"
                        className="h-12 border-0 bg-transparent px-2 text-base shadow-none focus-visible:border-0 focus-visible:ring-0"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onUploadClick}
                        disabled={isUploadingPdf || isLoading}
                        className="h-9 w-9 text-muted-foreground"
                        aria-label={t('assistant.upload_files_aria')}
                    >
                        {isUploadingPdf ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Paperclip />
                        )}
                    </Button>
                    <Button
                        onClick={onSend}
                        disabled={isLoading || isUploadingPdf || !inputValue.trim()}
                        size="icon"
                        className="h-9 w-9"
                        aria-label="Send message"
                    >
                        <Send />
                    </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                    {t('assistant.disclaimer')}
                </p>
            </div>
        </div>
    );
}
