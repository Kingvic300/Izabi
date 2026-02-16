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
import type { ActiveDocument } from './types';

type ChatInputProps = {
    activeDocument: ActiveDocument | null;
    inputValue: string;
    isLoading: boolean;
    isUploadingPdf: boolean;
    onInputChange: (value: string) => void;
    onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onUploadClick: () => void;
    onRemoveDocument: () => void;
    onSuggestionClick: (feature: string) => void;
};

export default function ChatInput({
    activeDocument,
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
    return (
        <div className="shrink-0 p-3 md:p-6 pt-0">
            <div className="mx-auto w-full max-w-[1500px] space-y-3 md:space-y-4">
                {activeDocument && (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
                        <div className="flex items-center gap-2 text-[10px] text-primary font-medium min-w-0">
                            <FileText className="h-3 w-3" />
                            <span className="truncate max-w-[170px] sm:max-w-[220px] md:max-w-[420px]">
                                {activeDocument.fileName}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRemoveDocument}
                            className="h-7 px-2 text-[11px]"
                        >
                            Remove
                        </Button>
                    </div>
                )}

                {/* Smart Suggestions */}
                {!inputValue && !isLoading && (
                    <div className="flex gap-2 overflow-x-auto pb-1 animate-in fade-in slide-in-from-bottom-1.5 duration-500">
                        {[
                            {
                                label: 'Generate Flashcards',
                                icon: <Zap size={12} />,
                                feature: 'Flashcards',
                            },
                            {
                                label: 'Study Guide',
                                icon: <BookOpen size={12} />,
                                feature: 'Study Guide',
                            },
                            {
                                label: 'Practice Quiz',
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
                            activeDocument
                                ? 'Ask questions about your uploaded PDF...'
                                : 'Ask Izabi to generate something or explain a topic...'
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
                <p className="text-[9px] md:text-[10px] text-center mt-2 md:mt-3 text-muted-foreground/60 uppercase tracking-[0.15em] font-medium">
                    Izabi AI may provide inaccurate info. Verify important facts.
                </p>
            </div>
        </div>
    );
}
