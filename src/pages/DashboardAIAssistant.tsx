'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Zap,
    Send,
    Loader,
    User,
    Brain,
    History,
    Sparkles,
    Plus,
    Calendar,
    XCircle,
    BookOpen,
    Target,
    Paperclip,
    FileText,
    Copy,
    Share2,
    Check,
} from 'lucide-react';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppToast } from '@/hooks/useAppToast';
import { AIMarkdown } from '@/components/ui/ai-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ActiveDocument {
    documentId: string;
    fileName: string;
}

interface ChatSession {
    sessionId: string;
    title?: string;
    promptCount?: number;
    createdAt?: string;
    updatedAt?: string;
    lastMessage?: {
        role: 'user' | 'assistant';
        content: string;
        timestamp: string;
    } | null;
}

const DashboardAIAssistant = () => {
    const navigate = useNavigate();
    const appToast = useAppToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content:
                "Hello! I'm Izabi, your AI learning assistant. I'm here to help you understand complex concepts, answer questions, and guide your learning journey. What would you like to learn about today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [activeDocument, setActiveDocument] = useState<ActiveDocument | null>(
        null,
    );
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const copyText = async (text: string) => {
        const resolved = String(text || '');
        if (!resolved.trim()) return;

        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(resolved);
            return;
        }

        const textarea = document.createElement('textarea');
        textarea.value = resolved;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    };

    const handleCopyMessage = async (messageId: string, content: string) => {
        try {
            await copyText(content);
            setCopiedMessageId(messageId);
            window.setTimeout(() => {
                setCopiedMessageId((current) =>
                    current === messageId ? null : current,
                );
            }, 1500);
        } catch (error) {
            appToast.error({
                title: 'Copy failed',
                description: 'Unable to copy to clipboard on this device.',
            });
        }
    };

    const handleShareText = async (text: string, fallbackTitle: string) => {
        const resolved = String(text || '').trim();
        if (!resolved) return;

        try {
            if (typeof navigator !== 'undefined' && (navigator as any).share) {
                await (navigator as any).share({
                    title: fallbackTitle,
                    text: resolved,
                    url: window.location.href,
                });
                return;
            }

            await copyText(resolved);
            appToast.success({
                title: 'Copied to clipboard',
                description: 'Sharing is not supported in this browser.',
            });
        } catch (error: any) {
            const isAbort =
                error?.name === 'AbortError' ||
                String(error?.message || '').toLowerCase().includes('abort');
            if (!isAbort) {
                appToast.error({
                    title: 'Share failed',
                    description:
                        'Unable to share from this device. Try copying instead.',
                });
            }
        }
    };

    const buildTranscript = () => {
        const transcriptMessages = messages.filter((m) =>
            String(m?.content || '').trim(),
        );

        return transcriptMessages
            .map((m) => {
                const speaker = m.role === 'user' ? 'You' : 'Izabi';
                return `**${speaker}:**\n${m.content}`;
            })
            .join('\n\n---\n\n');
    };

    const handleCopyTranscript = async () => {
        try {
            await copyText(buildTranscript());
            appToast.success({
                title: 'Chat copied',
                description: 'Your chat transcript is now in the clipboard.',
            });
        } catch (error) {
            appToast.error({
                title: 'Copy failed',
                description: 'Unable to copy your chat transcript.',
            });
        }
    };

    const handleShareTranscript = async () => {
        await handleShareText(buildTranscript(), 'Izabi chat transcript');
    };

    // Modern Entrance Animation
    useGSAP(
        () => {
            gsap.from('.chat-card', {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
            gsap.from('.chat-header', {
                x: -20,
                opacity: 0,
                duration: 0.6,
                delay: 0.3,
                ease: 'back.out(1.7)',
            });
        },
        { scope: containerRef },
    );

    const buildWelcomeMessages = (): Message[] => [
        {
            id: '1',
            role: 'assistant',
            content:
                "Hello! I'm Izabi, your AI learning assistant. I'm here to help you understand complex concepts, answer questions, and guide your learning journey. What would you like to learn about today?",
            timestamp: new Date(),
        },
    ];

    const loadSessionHistory = async (sessionId: string) => {
        try {
            const res = await api.getChatHistory(sessionId);
            if (res.success && res.data && res.data.messages) {
                const formattedMessages = res.data.messages.map((m: any) => ({
                    id: m._id || Math.random().toString(),
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(
                        m.createdAt || m.timestamp || Date.now(),
                    ),
                }));

                if (formattedMessages.length) {
                    setMessages(formattedMessages);
                } else {
                    setMessages(buildWelcomeMessages());
                }
                return;
            }
            setMessages(buildWelcomeMessages());
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
            setMessages(buildWelcomeMessages());
        }
    };

    const loadSessions = async (preferredSessionId?: string) => {
        try {
            const res = await api.getChatSessions();
            if (res.success && Array.isArray(res.data)) {
                if (res.data.length === 0) {
                    const created = await api.createChatSession();
                    const createdSession = created?.data;
                    if (createdSession?.sessionId) {
                        setChatSessions([createdSession]);
                        setActiveSessionId(createdSession.sessionId);
                        await loadSessionHistory(createdSession.sessionId);
                        return;
                    }
                    setMessages(buildWelcomeMessages());
                    return;
                }

                setChatSessions(res.data);
                const nextSessionId =
                    preferredSessionId &&
                    res.data.some(
                        (session: ChatSession) =>
                            session.sessionId === preferredSessionId,
                    )
                        ? preferredSessionId
                        : res.data[0].sessionId;
                setActiveSessionId(nextSessionId);
                await loadSessionHistory(nextSessionId);
                return;
            }
            setMessages(buildWelcomeMessages());
        } catch (error) {
            console.error('Failed to load chat sessions:', error);
            setMessages(buildWelcomeMessages());
        }
    };

    const handleSelectSession = async (sessionId: string) => {
        setActiveSessionId(sessionId);
        await loadSessionHistory(sessionId);
    };

    useEffect(() => {
        loadSessions();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    /*
     * How: Appends user message to UI state, then initiates an event stream for the AI response. Updates the assistant's placeholder message chunk-by-chunk.
     * Why: Provides a responsive, real-time typing experience typical of modern LLM interfaces.
     */
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isUploadingPdf) return;

        let sessionIdToUse = activeSessionId;
        if (!sessionIdToUse) {
            const created = await api.createChatSession();
            const createdId = created?.data?.sessionId;
            if (createdId) {
                sessionIdToUse = createdId;
                setActiveSessionId(createdId);
                setChatSessions((prev) => [created.data, ...prev]);
            }
        }

        if (!sessionIdToUse) {
            appToast.error({
                title: 'Chat unavailable',
                description: 'Unable to start a new chat session.',
            });
            return;
        }

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Add a placeholder message for the assistant
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        try {
            let fullResponse = '';
            api.getAIStream(
                inputValue,
                (chunk) => {
                    fullResponse += chunk;
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === assistantMessageId
                                ? { ...msg, content: fullResponse }
                                : msg,
                        ),
                    );
                },
                (error) => {
                    console.error('Stream Error:', error);
                    // Errors are now handled globally by the interceptor
                },
                () => {
                    setIsLoading(false);
                    loadSessions(sessionIdToUse || undefined);
                },
                activeDocument?.documentId,
                sessionIdToUse,
            );
        } catch (error) {
            console.error('Error starting AI stream:', error);
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const startNewChat = async () => {
        try {
            const created = await api.createChatSession();
            const createdSession = created?.data;
            if (createdSession?.sessionId) {
                setActiveSessionId(createdSession.sessionId);
                setChatSessions((prev) => [
                    createdSession,
                    ...prev.filter(
                        (session) =>
                            session.sessionId !== createdSession.sessionId,
                    ),
                ]);
            }
            setMessages([
                {
                    id: '1',
                    role: 'assistant',
                    content:
                        "Hello! I'm Izabi, your AI learning assistant. New session started. What's on your mind?",
                    timestamp: new Date(),
                },
            ]);
        } catch (error) {
            console.error('Failed to start new chat:', error);
            appToast.error({
                title: 'Could Not Start Chat',
                description: 'Please try again.',
            });
        }
    };

    const handlePdfUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const getReadableErrorMessage = (error: any): string => {
            const message = error?.response?.data?.message;
            if (Array.isArray(message)) {
                return message.join(', ');
            }
            if (message && typeof message === 'object') {
                const nested = (message as any).message || (message as any).error;
                if (typeof nested === 'string' && nested.trim()) {
                    return nested;
                }
            }
            const fallbackMessage = error?.response?.data?.error;
            if (
                typeof fallbackMessage === 'string' &&
                fallbackMessage.trim()
            ) {
                return fallbackMessage;
            }
            if (typeof message === 'string' && message.trim()) {
                return message;
            }
            if (typeof error?.message === 'string' && error.message.trim()) {
                return error.message;
            }
            return 'Failed to upload and process PDF.';
        };

        const isPdf =
            file.type.toLowerCase().includes('pdf') ||
            file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
            appToast.error({
                title: 'Invalid File',
                description: 'Please upload a PDF document.',
            });
            event.target.value = '';
            return;
        }

        const MAX_PDF_BYTES = 100 * 1024 * 1024;
        if (file.size > MAX_PDF_BYTES) {
            appToast.error({
                title: 'File Too Large',
                description: 'PDF size must be 100MB or less.',
            });
            event.target.value = '';
            return;
        }

        setIsUploadingPdf(true);
        try {
            const res = await api.uploadPDFForChat(file);
            if (res?.success && res?.data?.documentId) {
                setActiveDocument({
                    documentId: res.data.documentId,
                    fileName: res.data.fileName || file.name,
                });

                const systemMessage: Message = {
                    id: `pdf-${Date.now()}`,
                    role: 'assistant',
                    content: `PDF "${res.data.fileName || file.name}" uploaded successfully. Ask me anything from this document.`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, systemMessage]);

                appToast.success({
                    title: 'PDF Ready',
                    description:
                        'Your PDF has been indexed and is now available in chat.',
                });
            }
        } catch (error: any) {
            console.error('PDF upload failed:', error);
            appToast.error({
                title: 'Upload Failed',
                description: getReadableErrorMessage(error),
            });
        } finally {
            setIsUploadingPdf(false);
            event.target.value = '';
        }
    };

    const handleClearHistory = async () => {
        if (
            !confirm(
                'Are you sure you want to delete all chat history? This cannot be undone.',
            )
        )
            return;
        try {
            const res = await api.clearChatHistory();
            if (res.success) {
                setChatSessions([]);
                setActiveSessionId(null);
                await startNewChat();
                appToast.success({
                    title: 'History Cleared',
                    description:
                        'Your conversation history has been permanently deleted.',
                });
            }
        } catch (error) {
            console.error('Failed to clear history:', error);
            appToast.error({
                title: 'Could Not Clear History',
                description:
                    'Please try again. If this keeps happening, check your connection.',
            });
        }
    };

    const redirectToDashboardUpload = (feature: string) => {
        appToast.info({
            title: `${feature} Requires PDF`,
            description: 'Please go to dashboard and upload a PDF first.',
        });
        navigate('/dashboard');
    };

    return (
        <div
            ref={containerRef}
            className="space-y-4 md:space-y-8 w-full px-3 md:px-6 xl:px-8 pt-4 md:pt-6 pb-0 flex flex-col h-full min-h-0 overflow-hidden"
        >
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
                        onClick={startNewChat}
                        className="sm:hidden h-9 w-9"
                        aria-label="Start new chat"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyTranscript}
                        className="h-9 w-9"
                        aria-label="Copy chat transcript"
                    >
                        <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShareTranscript}
                        className="h-9 w-9"
                        aria-label="Share chat transcript"
                    >
                        <Share2 className="h-3 w-3" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={startNewChat}
                        className="hidden sm:flex items-center gap-2 glass border-primary/20 hover:bg-primary/10 text-primary font-bold transition-all"
                    >
                        <Plus className="h-3 w-3" />
                        New Chat
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => pdfInputRef.current?.click()}
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
                        onClick={() => pdfInputRef.current?.click()}
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
                        onChange={handlePdfUpload}
                        className="hidden"
                    />

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 glass-card font-bold hover:bg-card/5"
                            >
                                <History className="h-3 w-3" />
                                <span className="hidden sm:inline">
                                    History
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[92vw] max-w-[380px] sm:max-w-[420px] bg-card border-foreground/10 p-0 flex flex-col"
                        >
                            <SheetHeader className="p-6 pb-4">
                                <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                                    <History className="text-primary" />
                                    <span>Chat History</span>
                                </SheetTitle>
                                <SheetDescription className="font-medium opacity-60">
                                    Browse your past interactions with Izabi.
                                </SheetDescription>
                            </SheetHeader>
                            <Separator className="bg-card/5" />
                            <ScrollArea className="flex-1 px-4 py-6">
                                <div className="space-y-3">
                                    {chatSessions.length === 0 ? (
                                        <div className="text-center py-20 opacity-40">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest">
                                                No history recorded yet
                                            </p>
                                        </div>
                                    ) : (
                                        chatSessions.map((session) => {
                                            const timestamp = new Date(
                                                session.updatedAt ||
                                                    session.createdAt ||
                                                    Date.now(),
                                            ).toLocaleString([], {
                                                month: 'short',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            });
                                            return (
                                                <Button
                                                    key={session.sessionId}
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleSelectSession(
                                                            session.sessionId,
                                                        )
                                                    }
                                                    className={`w-full justify-start h-auto py-3 px-4 rounded-xl transition-all border ${
                                                        session.sessionId ===
                                                        activeSessionId
                                                            ? 'bg-primary/10 border-primary/30'
                                                            : 'hover:bg-primary/10 border-transparent'
                                                    }`}
                                                >
                                                    <div className="flex flex-col items-start gap-0.5 overflow-hidden flex-1">
                                                        <span className="text-[10px] font-bold text-foreground/80 line-clamp-1 text-left">
                                                            {session.title ||
                                                                'Chat session'}
                                                        </span>
                                                        {session.lastMessage
                                                            ?.content ? (
                                                            <span className="text-[11px] opacity-60 line-clamp-1 text-left">
                                                                {
                                                                    session
                                                                        .lastMessage
                                                                        .content
                                                                }
                                                            </span>
                                                        ) : null}
                                                        <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">
                                                            {timestamp}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">
                                                        {(session.promptCount ??
                                                            0) + '/100'}
                                                    </span>
                                                </Button>
                                            );
                                        })
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="p-6 border-t border-foreground/5">
                                <Button
                                    variant="destructive"
                                    onClick={handleClearHistory}
                                    className="w-full rounded-xl font-bold gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-foreground transition-all"
                                >
                                    <XCircle size={16} />
                                    Clear All History
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <Card className="chat-card flex-1 min-h-0 flex flex-col overflow-hidden glass-card border-foreground/10 rounded-2xl shadow-xl md:shadow-2xl relative">
                {/* Background decorative element */}

                <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden p-0">
                    {/* Messages Container */}
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
                                            {message.timestamp.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                },
                                            )}
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
                                                                handleCopyMessage(
                                                                    message.id,
                                                                    message.content,
                                                                )
                                                            }
                                                            className="h-6 w-6 rounded-md hover:bg-foreground/5"
                                                            aria-label="Copy message"
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
                                                                handleShareText(
                                                                    message.content,
                                                                    'Izabi message',
                                                                )
                                                            }
                                                            className="h-6 w-6 rounded-md hover:bg-foreground/5"
                                                            aria-label="Share message"
                                                        >
                                                            <Share2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading &&
                                messages[messages.length - 1].content !== '' && (
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

                    {/* Input Area */}
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
                                        onClick={() => setActiveDocument(null)}
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
                                                redirectToDashboardUpload(
                                                    s.feature,
                                                )
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
                                    onChange={(e) =>
                                        setInputValue(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    disabled={isLoading || isUploadingPdf}
                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-4 md:py-6 text-base md:text-lg"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => pdfInputRef.current?.click()}
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
                                    onClick={handleSendMessage}
                                    disabled={
                                        isLoading ||
                                        isUploadingPdf ||
                                        !inputValue.trim()
                                    }
                                    size="icon"
                                    className="h-9 w-9 md:h-10 md:w-10 rounded-xl transition-transform hover:scale-110 active:scale-95 bg-primary hover:bg-primary/90 shadow-glow shadow-primary/20 relative overflow-hidden group/btn"
                                >
                                    <Send className="h-4 w-4 md:h-5 md:w-5 relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-shimmer" />
                                </Button>
                            </div>
                            <p className="text-[9px] md:text-[10px] text-center mt-2 md:mt-3 text-muted-foreground/60 uppercase tracking-[0.15em] font-medium">
                                Izabi AI may provide inaccurate info. Verify
                                important facts.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardAIAssistant;
