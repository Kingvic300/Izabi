'use client';

import type React from 'react';

import { AIMarkdown } from '@/components/ui/ai-markdown';
import { Button } from '@/components/ui/button';
import { Brain, Check, Copy, Loader, Share2, User } from 'lucide-react';
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
    return (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 md:space-y-6 p-4 md:p-6 scrollbar-thin scrollbar-thumb-primary/10">
            <div className="mx-auto w-full max-w-[1500px] space-y-4 md:space-y-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0 border 
                                    ${
                                        message.role === 'user'
                                            ? 'bg-primary/20 border-primary/30 text-primary'
                                            : 'bg-accent/20 border-accent/30 text-accent'
                                    }`}
                        >
                            {message.role === 'user' ? (
                                <User className="h-4 w-4 md:h-5 md:w-5" />
                            ) : (
                                <Brain className="h-4 w-4 md:h-5 md:w-5" />
                            )}
                        </div>
                        <div
                            className={`max-w-[92%] sm:max-w-[85%] lg:max-w-[72%] xl:max-w-[65%] px-4 md:px-5 pt-3 md:pt-4 pb-1 rounded-2xl shadow-sm leading-relaxed relative group
                                        ${
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                : 'bg-muted/50 backdrop-blur-sm border border-foreground/5 rounded-tl-none'
                                        }`}
                        >
                            <div className="text-sm md:text-base max-w-none break-words">
                                {message.content === '' ? (
                                    <div className="flex gap-0.5 py-1">
                                        <div className="w-1.5 h-1.5 bg-accent animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-accent animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-accent animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                ) : message.role === 'assistant' ? (
                                    <AIMarkdown
                                        content={message.content}
                                        className="text-sm md:text-base"
                                    />
                                ) : (
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                )}
                            </div>
                            <div
                                className={`text-[10px] mt-2 opacity-40 uppercase tracking-widest font-bold 
                                            ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                            >
                                {message.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                {message.content &&
                                    String(message.content).trim() && (
                                        <div
                                            className={`absolute  ${
                                                message.role === 'user'
                                                    ? 'left-2 '
                                                    : 'right-2'
                                            } bottom-0.02 flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-[10px]`}
                                        >
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    onCopyMessage(
                                                        message.id,
                                                        message.content,
                                                    )
                                                }
                                                className="h-6 w-6 rounded-md hover:bg-foreground/5"
                                                aria-label={t(
                                                    'assistant.copy_message_aria',
                                                )}
                                            >
                                                {copiedMessageId ===
                                                message.id ? (
                                                    <Check className="h-3 w-3" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() =>
                                                    onShareMessage(
                                                        message.content,
                                                    )
                                                }
                                                className="h-6 w-6 rounded-md hover:bg-foreground/5"
                                                aria-label={t(
                                                    'assistant.share_message_aria',
                                                )}
                                            >
                                                <Share2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length - 1].content !== '' && (
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 text-accent">
                            <Brain className="h-5 w-5" />
                        </div>
                        <div className="bg-muted/50 backdrop-blur-sm border border-foreground/5 px-5 py-4 rounded-2xl rounded-tl-none">
                            <Loader className="h-4 w-4 animate-spin text-accent" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}
