import { useEffect, useRef } from 'react';
import { Sparkles, User } from 'lucide-react';
import type { PartnerMessage } from '../partnerTypes';

type ChatMessagesProps = {
    messages: PartnerMessage[];
    currentUserId: string;
};

export default function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    if (messages.length === 0) {
        return (
            <div className="flex-1 min-h-[200px] flex items-center justify-center p-6 text-center">
                <p className="text-sm text-muted-foreground">
                    No messages yet. Say hi to your accountability partner!
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-0 overflow-y-auto space-y-3 p-4 scrollbar-thin scrollbar-thumb-primary/10">
            {messages.map((message) => {
                const isMe = message.senderId === currentUserId;
                const isNudge = message.type === 'nudge';
                return (
                    <div
                        key={message.id || message._id}
                        className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                                isMe
                                    ? 'bg-primary/20 border-primary/30 text-primary'
                                    : 'bg-accent/20 border-accent/30 text-accent'
                            }`}
                        >
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <div
                            className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isMe
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-muted/50 border border-foreground/5 rounded-bl-none'
                            } ${isNudge ? 'font-semibold' : ''}`}
                        >
                            {isNudge && (
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest opacity-70 mb-0.5">
                                    <Sparkles className="h-3 w-3" /> Nudge
                                </span>
                            )}
                            <p className="whitespace-pre-wrap break-words">
                                {message.content}
                            </p>
                            <span className="block text-[9px] mt-1 opacity-50 uppercase tracking-widest font-bold">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
