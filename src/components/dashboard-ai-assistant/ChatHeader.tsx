'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Copy, Loader, Paperclip, Plus, Share2 } from 'lucide-react';
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
    const { t } = useLanguage();
    const handleUploadClick = () => {
        pdfInputRef.current?.click();
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <h2 className="text-[1.75rem] leading-tight sm:text-[2rem]">
                    Assistant
                </h2>
                <p className="text-muted-foreground">
                    {t('assistant.subtitle')}
                </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onStartNewChat}
                    className="sm:hidden h-9 w-9"
                    aria-label={t('assistant.new_chat_aria')}
                >
                    <Plus />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onCopyTranscript}
                    className="h-9 w-9"
                    aria-label={t('assistant.copy_transcript_aria')}
                >
                    <Copy />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onShareTranscript}
                    className="h-9 w-9"
                    aria-label={t('assistant.share_transcript_aria')}
                >
                    <Share2 />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onStartNewChat}
                    className="hidden sm:inline-flex"
                >
                    <Plus />
                    {t('assistant.new_chat')}
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleUploadClick}
                    disabled={isUploadingPdf || isLoading}
                    className="sm:hidden h-9 w-9"
                    aria-label={t('assistant.upload_files_aria')}
                >
                    {isUploadingPdf ? (
                        <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                        <Paperclip />
                    )}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUploadClick}
                    disabled={isUploadingPdf || isLoading}
                    className="hidden sm:inline-flex"
                >
                    {isUploadingPdf ? (
                        <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                        <Paperclip />
                    )}
                    {t('assistant.upload_materials')}
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
