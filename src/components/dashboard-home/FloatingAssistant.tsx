import React, { useState } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface FloatingAssistantProps {
    isOpen: boolean;
    onToggle: () => void;
    currentTopic?: string;
    documentId?: string;
}

interface Message {
    id: string;
    sender: 'ai' | 'user';
    text: string;
    time: string;
}

export const FloatingAssistant: React.FC<FloatingAssistantProps> = ({
    isOpen,
    onToggle,
    currentTopic,
    documentId,
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'm1',
            sender: 'ai',
            text: currentTopic
                ? `Hey! I've indexed your materials for "${currentTopic}". Ask me to summarize, quiz you, or explain anything.`
                : "Hi! Upload a document and I'll help you study it — ask me to summarize, quiz you, or explain concepts.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async (textToSend?: string) => {
        const text = (textToSend || inputMessage).trim();
        if (!text) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            sender: 'user',
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!textToSend) setInputMessage('');
        setIsTyping(true);

        try {
            const reply = await api.getAIResponse(text, documentId);
            setMessages((prev) => [
                ...prev,
                {
                    id: `ai-${Date.now()}`,
                    sender: 'ai',
                    text: reply || "I couldn't generate a response just now — try again.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `ai-err-${Date.now()}`,
                    sender: 'ai',
                    text: 'Sorry, something went wrong reaching the AI assistant. Please try again.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickPrompts = [
        'Quick 3-question drill',
        'Summarize selected pages',
        'Explain the key concept',
        'Give me a mnemonic trick',
    ];

    return (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
            {!isOpen ? (
                <button
                    type="button"
                    onClick={onToggle}
                    aria-label="Open AI Study Assistant"
                    className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-card border-2 border-primary p-1 shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-30 pointer-events-none" />
                    <div className="w-full h-full rounded-full overflow-hidden bg-muted relative flex items-center justify-center">
                        <Bot className="w-7 h-7 text-primary" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                    </span>
                </button>
            ) : (
                <div className="w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] rounded-xl bg-card border border-border shadow-float flex flex-col overflow-hidden">
                    <div className="px-4 py-3.5 bg-muted/30 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/40 shrink-0 bg-background flex items-center justify-center">
                                <Bot className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <h3 className="text-xs sm:text-sm font-bold text-foreground">Izabi AI</h3>
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                </div>
                                {currentTopic && (
                                    <p className="text-[10px] text-muted-foreground font-mono">
                                        Context: {currentTopic}
                                    </p>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onToggle}
                            className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                            title="Minimize AI Assistant"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                        {messages.map((m) => {
                            const isAi = m.sender === 'ai';
                            return (
                                <div
                                    key={m.id}
                                    className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                                            isAi
                                                ? 'bg-muted/40 text-foreground/90 border border-border'
                                                : 'bg-primary text-primary-foreground shadow-md'
                                        }`}
                                    >
                                        {m.text}
                                    </div>
                                    <span className="text-[9px] font-mono text-muted-foreground mt-1 px-1">
                                        {m.time}
                                    </span>
                                </div>
                            );
                        })}

                        {isTyping && (
                            <div className="flex items-center gap-1.5 bg-muted/40 border border-border px-3 py-2 rounded-xl w-16">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]" />
                            </div>
                        )}
                    </div>

                    <div className="px-3 py-2 bg-muted/20 border-t border-border overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
                        {quickPrompts.map((p, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSendMessage(p)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/70 border border-border text-[11px] text-foreground/80 hover:text-foreground transition-colors cursor-pointer shrink-0"
                            >
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span>{p}</span>
                            </button>
                        ))}
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="p-3 bg-muted/30 border-t border-border flex items-center gap-2"
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about your study materials..."
                            className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                        />
                        <button
                            type="submit"
                            disabled={!inputMessage.trim()}
                            className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FloatingAssistant;
