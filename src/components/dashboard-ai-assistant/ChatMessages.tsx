'use client';

import type React from 'react';

import { AIMarkdown } from '@/components/ui/ai-markdown';
import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Message } from './types';

type ChatMessagesProps = {
    messages: Message[];
    isLoading: boolean;
    copiedMessageId: string | null;
    onCopyMessage: (messageId: string, content: string) => void;
    onShareMessage: (content: string) => void;
    messagesEndRef: React.RefObject<HTMLDivElement>;
};

export default function ChatMessages({
    messages,
    isLoading,
    copiedMessageId,
    onCopyMessage,
    onShareMessage,
    messagesEndRef,
}: ChatMessagesProps) {
    const { t } = useLanguage();
    const typing = (
        <span className="flex gap-1 py-2" aria-label="Izabi is writing">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground [animation-delay:0.4s]" />
        </span>
    );
    const time = (d: Date) =>
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto w-full max-w-3xl space-y-8" aria-live="polite">
                {messages.map((message) =>
                    message.role === 'user' ? (
                        <div key={message.id} className="flex flex-col items-end">
                            <div className="max-w-[85%] rounded-lg rounded-br-sm bg-muted px-4 py-3">
                                <p className="whitespace-pre-wrap break-words leading-relaxed">
                                    {message.content}
                                </p>
                            </div>
                            <span className="tabular mt-1 text-xs text-muted-foreground">
                                {time(message.timestamp)}
                            </span>
                        </div>
                    ) : (
                        <div key={message.id} className="group flex gap-3">
                            <img
                                src="/logo-mark-light.png"
                                alt=""
                                className="mt-0.5 h-7 w-7 shrink-0 rounded-full border border-border bg-card object-contain p-0.5 dark:hidden"
                            />
                            <img
                                src="/logo-mark-dark.png"
                                alt=""
                                className="mt-0.5 hidden h-7 w-7 shrink-0 rounded-full border border-border bg-card object-contain p-0.5 dark:block"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="break-words">
                                    {message.content === '' ? (
                                        typing
                                    ) : (
                                        <AIMarkdown content={message.content} className="text-base" />
                                    )}
                                </div>
                                {message.content && String(message.content).trim() && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                        <span className="tabular mr-1">{time(message.timestamp)}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onCopyMessage(message.id, message.content)}
                                            className="h-7 w-7 text-muted-foreground md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                                            aria-label={t('assistant.copy_message_aria')}
                                        >
                                            {copiedMessageId === message.id ? <Check /> : <Copy />}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onShareMessage(message.content)}
                                            className="h-7 w-7 text-muted-foreground md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                                            aria-label={t('assistant.share_message_aria')}
                                        >
                                            <Share2 />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ),
                )}
                {isLoading && messages[messages.length - 1]?.content !== '' && (
                    <div className="flex gap-3 pl-10">{typing}</div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
