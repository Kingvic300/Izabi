'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Copy, Loader, Paperclip, Plus, Share2, Sparkles } from 'lucide-react';
import ChatHistorySheet from './ChatHistorySheet';
import type { ChatSession } from './types';

type ChatHeaderProps = {
    isUploadingPdf: boolean;
    isLoading: boolean;
    onStartNewChat: () => void;
    onCopyTranscript: () => void;
    onShareTranscript: () => void;
    pdfInputRef: React.RefObject<HTMLInputElement>;
    onPdfUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearHistory: () => void;
    chatSessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (sessionId: string) => void;
};

export default function ChatHeader({
    isUploadingPdf,
    isLoading,
    onStartNewChat,
    onCopyTranscript,
    onShareTranscript,
    pdfInputRef,
    onPdfUpload,
    onClearHistory,
    chatSessions,
    activeSessionId,
    onSelectSession,
}: ChatHeaderProps) {
    const handleUploadClick = () => {
        pdfInputRef.current?.click();
    };

    return (
        <div className="chat-header flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 flex items-center gap-2 sm:gap-3">
                    <span className="text-gradient">Izabi AI</span>
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-pulse" />
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    Your personal co-pilot for smarter learning.
                </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onStartNewChat}
                    className="sm:hidden h-9 w-9"
                    aria-label="Start new chat"
                >
                    <Plus className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onCopyTranscript}
                    className="h-9 w-9"
                    aria-label="Copy chat transcript"
                >
                    <Copy className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onShareTranscript}
                    className="h-9 w-9"
                    aria-label="Share chat transcript"
                >
                    <Share2 className="h-3 w-3" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onStartNewChat}
                    className="hidden sm:flex items-center gap-2 glass border-primary/20 hover:bg-primary/10 text-primary font-bold transition-all"
                >
                    <Plus className="h-3 w-3" />
                    New Chat
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUploadClick}
                    disabled={isUploadingPdf || isLoading}
                    className="sm:hidden h-9 w-9"
                    aria-label="Upload PDF"
                >
                    {isUploadingPdf ? (
                        <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                        <Paperclip className="h-3 w-3" />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUploadClick}
                    disabled={isUploadingPdf || isLoading}
                    className="hidden sm:flex items-center gap-2 glass border-primary/20 hover:bg-primary/10 text-primary font-bold transition-all"
                >
                    {isUploadingPdf ? (
                        <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                        <Paperclip className="h-3 w-3" />
                    )}
                    Upload PDF
                </Button>
                <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={onPdfUpload}
                    className="hidden"
                />

                <ChatHistorySheet
                    chatSessions={chatSessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={onSelectSession}
                    onClearHistory={onClearHistory}
                />
            </div>
        </div>
    );
}
