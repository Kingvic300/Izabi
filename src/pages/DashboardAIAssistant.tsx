'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppToast } from '@/hooks/useAppToast';
import ChatHeader from '@/components/dashboard-ai-assistant/ChatHeader';
import ChatMessages from '@/components/dashboard-ai-assistant/ChatMessages';
import ChatInput from '@/components/dashboard-ai-assistant/ChatInput';
import {
    buildTranscript,
    buildWelcomeMessages,
    copyText,
    getReadableErrorMessage,
} from '@/components/dashboard-ai-assistant/chatUtils';
import type {
    ActiveDocument,
    ChatSession,
    Message,
} from '@/components/dashboard-ai-assistant/types';

const DashboardAIAssistant = () => {
    const navigate = useNavigate();
    const appToast = useAppToast();
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>(
        buildWelcomeMessages(),
    );
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [activeDocuments, setActiveDocuments] = useState<ActiveDocument[]>([]);
    const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    const handleCopyTranscript = async () => {
        try {
            await copyText(buildTranscript(messages));
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
        await handleShareText(
            buildTranscript(messages),
            'Izabi chat transcript',
        );
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
                activeDocuments.map((d) => d.documentId).join(','),
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

    const handleFileUploads = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        // Limit total to 5
        const currentCount = activeDocuments.length;
        const incomingCount = files.length;
        if (currentCount + incomingCount > 5) {
            appToast.error({
                title: 'Limit Reached',
                description: 'You can only have up to 5 documents active at once.',
            });
            event.target.value = '';
            return;
        }

        const MAX_FILE_BYTES = 100 * 1024 * 1024;
        const validFiles = files.filter((f) => f.size <= MAX_FILE_BYTES);

        if (validFiles.length < files.length) {
            appToast.error({
                title: 'Some Files Too Large',
                description: 'One or more files exceed the 100MB limit and were skipped.',
            });
        }

        if (validFiles.length === 0) {
            event.target.value = '';
            return;
        }

        setIsUploadingPdf(true);
        try {
            const res = await api.uploadFilesForChat(validFiles);
            if (res?.success && Array.isArray(res?.data)) {
                const newDocs: ActiveDocument[] = res.data.map((d: any) => ({
                    documentId: d.documentId,
                    fileName: d.fileName,
                }));

                setActiveDocuments((prev) => [...prev, ...newDocs]);

                const fileNames = newDocs.map((d) => `"${d.fileName}"`).join(', ');
                const systemMessage: Message = {
                    id: `upload-${Date.now()}`,
                    role: 'assistant',
                    content: `${newDocs.length} file(s) [${fileNames}] uploaded successfully. I will now use them to answer your questions.`,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, systemMessage]);

                appToast.success({
                    title: 'Upload Successful',
                    description: `${newDocs.length} new materials indexed and ready for chat.`,
                });
            }
        } catch (error: any) {
            console.error('File upload failed:', error);
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

    const handlePdfTrigger = () => {
        pdfInputRef.current?.click();
    };

    return (
        <div
            ref={containerRef}
            className="w-full px-3 md:px-6 xl:px-8 pt-4 md:pt-6 pb-0 flex flex-col h-full min-h-0 overflow-hidden"
        >
            <div className="flex flex-col min-h-0 gap-4 md:gap-6 flex-1">
                <ChatHeader
                    isUploadingPdf={isUploadingPdf}
                    isLoading={isLoading}
                    onStartNewChat={startNewChat}
                    onCopyTranscript={handleCopyTranscript}
                    onShareTranscript={handleShareTranscript}
                    pdfInputRef={pdfInputRef}
                    onPdfUpload={handleFileUploads}
                    onClearHistory={handleClearHistory}
                    chatSessions={chatSessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={handleSelectSession}
                />

                <Card className="chat-card flex-1 min-h-0 flex flex-col overflow-hidden glass-card border-foreground/10 rounded-2xl shadow-xl md:shadow-2xl relative">
                    {/* Background decorative element */}

                    <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden p-0">
                        <ChatMessages
                            messages={messages}
                            isLoading={isLoading}
                            copiedMessageId={copiedMessageId}
                            onCopyMessage={handleCopyMessage}
                            onShareMessage={(content) =>
                                handleShareText(content, 'Izabi message')
                            }
                            messagesEndRef={messagesEndRef}
                        />

                        <ChatInput
                            activeDocuments={activeDocuments}
                            inputValue={inputValue}
                            isLoading={isLoading}
                            isUploadingPdf={isUploadingPdf}
                            onInputChange={setInputValue}
                            onKeyPress={handleKeyPress}
                            onSend={handleSendMessage}
                            onUploadClick={handlePdfTrigger}
                            onRemoveDocument={(id) =>
                                setActiveDocuments((prev) =>
                                    prev.filter(
                                        (d) => d.documentId !== id,
                                    ),
                                )
                            }
                            onSuggestionClick={redirectToDashboardUpload}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DashboardAIAssistant;
