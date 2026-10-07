'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Copy, Plus, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
    compact?: boolean;
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
    compact = false,
}: ChatHeaderProps) {
    const { t } = useLanguage();

    return (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-6">
            <p className="min-w-0 truncate text-sm text-muted-foreground">
                {compact ? t('assistant.subtitle') : ''}
            </p>
            <div className="flex shrink-0 items-center gap-1">
                {compact && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onCopyTranscript}
                            className="h-9 w-9 text-muted-foreground"
                            aria-label={t('assistant.copy_transcript_aria')}
                        >
                            <Copy />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onShareTranscript}
                            className="h-9 w-9 text-muted-foreground"
                            aria-label={t('assistant.share_transcript_aria')}
                        >
                            <Share2 />
                        </Button>
                    </>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onStartNewChat}
                    disabled={isLoading || isUploadingPdf}
                >
                    <Plus />
                    {t('assistant.new_chat')}
                </Button>
                <input
                    ref={pdfInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.xlsx,.txt,.csv,.md,.html,image/*"
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
