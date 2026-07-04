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
        <div className="shrink-0 p-0">
            <div className="w-full space-y-2 md:space-y-3">
                {activeDocuments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {activeDocuments.map((doc) => (
                            <div
                                key={doc.documentId}
                                className="flex items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-2 py-1"
                            >
                                <div className="flex items-center gap-2 text-[10px] text-primary font-medium min-w-0">
                                    <FileText className="h-3 w-3" />
                                    <span className="truncate max-w-[120px] sm:max-w-[180px]">
                                        {doc.fileName}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onRemoveDocument(doc.documentId)}
                                    className="text-primary/70 hover:text-primary transition-colors font-bold text-xs"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Smart Suggestions */}
                {!inputValue && !isLoading && (
                    <div className="flex gap-2 overflow-x-auto pb-0 animate-in fade-in slide-in-from-bottom-1.5 duration-500">
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
                                className="h-8 shrink-0 rounded-full bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 text-[10px] font-bold uppercase tracking-wider gap-2 transition-all hover:scale-105"
                            >
                                {s.icon} {s.label}
                            </Button>
                        ))}
                    </div>
                )}

                <div className="relative group glass flex items-center rounded-2xl p-1 px-2 border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-primary/20 transition-all bg-card/5 backdrop-blur-xl">
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
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-4 md:py-6 text-base md:text-lg"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onUploadClick}
                        disabled={isUploadingPdf || isLoading}
                        className="h-8 w-8 md:h-9 md:w-9 rounded-lg"
                    >
                        {isUploadingPdf ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Paperclip className="h-3 w-3" />
                        )}
                    </Button>
                    <Button
                        onClick={onSend}
                        disabled={isLoading || isUploadingPdf || !inputValue.trim()}
                        size="icon"
                        className="h-9 w-9 md:h-10 md:w-10 rounded-xl transition-transform hover:scale-110 active:scale-95 bg-primary hover:bg-primary/90 shadow-glow shadow-primary/20 relative overflow-hidden group/btn"
                    >
                        <Send className="h-4 w-4 md:h-5 md:w-5 relative z-10" />
                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-shimmer" />
                    </Button>
                </div>
                <p className="text-[9px] md:text-[10px] text-center mt-1 md:mt-2 text-muted-foreground/60 uppercase tracking-[0.15em] font-medium">
                    {t('assistant.disclaimer')}
                </p>
            </div>
        </div>
    );
}
