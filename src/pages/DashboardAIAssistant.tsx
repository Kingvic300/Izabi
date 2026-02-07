"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Send, Loader, User, Brain, History, Sparkles, Plus, Search, Calendar, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/apiClient"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

const DashboardAIAssistant = () => {
    const { toast } = useToast()
    const containerRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content:
                "Hello! I'm Izabi, your AI learning assistant. I'm here to help you understand complex concepts, answer questions, and guide your learning journey. What would you like to learn about today?",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [historyGroups, setHistoryGroups] = useState<{ [key: string]: Message[] }>({})
    const userId = localStorage.getItem("userId") || "default-user"

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // Modern Entrance Animation
    useGSAP(() => {
        gsap.from(".chat-card", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        })
        gsap.from(".chat-header", {
            x: -20,
            opacity: 0,
            duration: 0.6,
            delay: 0.3,
            ease: "back.out(1.7)"
        })
    }, { scope: containerRef })

    useEffect(() => {
        /*
         * How: Retrieves past chat interactions for the current user from the backend.
         * Why: Ensures context persistence so users can continue previous conversations.
         */
        const fetchHistory = async () => {
            try {
                const res = await api.getChatHistory(userId)
                if (res.success && res.data && res.data.messages) {
                    const formattedMessages = res.data.messages.map((m: any) => ({
                        id: m._id || Math.random().toString(),
                        role: m.role,
                        content: m.content,
                        timestamp: new Date(m.createdAt || m.timestamp || Date.now()),
                    }))
                    
                    // Group by date for history view
                    const groups: { [key: string]: Message[] } = {}
                    formattedMessages.forEach((m: Message) => {
                        const dateStr = m.timestamp.toLocaleDateString()
                        if (!groups[dateStr]) groups[dateStr] = []
                        groups[dateStr].push(m)
                    })
                    setHistoryGroups(groups)
                    
                    // Show last 10 messages in active view
                    setMessages((prev) => {
                        const existingIds = new Set(prev.map(p => p.id));
                        const newOnes = formattedMessages.filter((m: Message) => !existingIds.has(m.id));
                        return [...prev, ...newOnes].slice(-20);
                    })
                }
            } catch (error) {
                console.error("Failed to fetch chat history:", error)
            }
        }
        fetchHistory()
    }, [userId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    /*
     * How: Appends user message to UI state, then initiates an event stream for the AI response. Updates the assistant's placeholder message chunk-by-chunk.
     * Why: Provides a responsive, real-time typing experience typical of modern LLM interfaces.
     */
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setIsLoading(true)

        // Add a placeholder message for the assistant
        const assistantMessageId = (Date.now() + 1).toString()
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        try {
            let fullResponse = ""
            api.getAIStream(
                inputValue,
                userId,
                (chunk) => {
                    fullResponse += chunk
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg)),
                    )
                },
                (error) => {
                    console.error("Stream Error:", error)
                    // Errors are now handled globally by the interceptor
                },
                () => {
                    setIsLoading(false)
                },
            )
        } catch (error) {
            console.error("Error starting AI stream:", error)
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const startNewChat = () => {
        setMessages([
            {
                id: "1",
                role: "assistant",
                content: "Hello! I'm Izabi, your AI learning assistant. New session started. What's on your mind?",
                timestamp: new Date(),
            },
        ])
    }

    const handleClearHistory = async () => {
        if (!confirm("Are you sure you want to delete all chat history? This cannot be undone.")) return;
        try {
            const res = await api.clearChatHistory(userId);
            if (res.success) {
                setHistoryGroups({});
                startNewChat();
                toast({
                    title: "History Cleared",
                    description: "Your conversation history has been permanently deleted.",
                });
            }
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    }

    return (
        <div ref={containerRef} className="space-y-6 md:space-y-8 w-full pb-20 px-0 md:px-8 lg:px-12 pt-6 md:pt-12 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            <div className="chat-header flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-1 flex items-center gap-3">
                        <span className="text-gradient">Izabi AI</span>
                        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground font-medium">Your personal co-pilot for smarter learning.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={startNewChat}
                        className="hidden md:flex items-center gap-2 glass border-primary/20 hover:bg-primary/10 text-primary font-bold transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </Button>
                    
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2 glass-card font-bold hover:bg-foreground/5">
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">History</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-card border-foreground/10 p-0 flex flex-col">
                            <SheetHeader className="p-6 pb-4">
                                <SheetTitle className="text-2xl font-bold flex items-center gap-3">
                                    <History className="text-primary" />
                                    <span>Chat History</span>
                                </SheetTitle>
                                <SheetDescription className="font-medium opacity-60">
                                    Browse your past interactions with Izabi.
                                </SheetDescription>
                            </SheetHeader>
                            <Separator className="bg-foreground/5" />
                            <ScrollArea className="flex-1 px-4 py-6">
                                <div className="space-y-8">
                                    {Object.keys(historyGroups).length === 0 ? (
                                        <div className="text-center py-20 opacity-40">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest">No history recorded yet</p>
                                        </div>
                                    ) : (
                                        Object.keys(historyGroups).sort((a,b) => new Date(b).getTime() - new Date(a).getTime()).map(date => (
                                            <div key={date} className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{date}</span>
                                                    <Separator className="flex-1 bg-primary/20" />
                                                </div>
                                                <div className="space-y-3">
                                                    {historyGroups[date].filter(m => m.role === 'user' && m.content.length > 0).map(m => (
                                                        <Button 
                                                            key={m.id} 
                                                            variant="ghost" 
                                                            onClick={() => {
                                                                // Find matching exchange
                                                                const idx = historyGroups[date].findIndex(msg => msg.id === m.id);
                                                                const exchange = historyGroups[date].slice(idx, idx + 2);
                                                                setMessages(prev => {
                                                                    const existingIds = new Set(prev.map(p => p.id));
                                                                    const toAdd = exchange.filter(e => !existingIds.has(e.id));
                                                                    return [...prev, ...toAdd];
                                                                });
                                                            }}
                                                            className="w-full justify-start h-auto py-3 px-4 rounded-xl hover:bg-primary/10 group transition-all"
                                                        >
                                                            <div className="flex flex-col items-start gap-1 overflow-hidden">
                                                                <span className="text-xs font-bold text-foreground/80 line-clamp-2 text-left group-hover:text-primary transition-colors">
                                                                    {m.content}
                                                                </span>
                                                                <span className="text-[9px] opacity-40 font-bold uppercase tracking-widest">
                                                                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="p-6 border-t border-foreground/5">
                                <Button 
                                    variant="destructive" 
                                    onClick={handleClearHistory}
                                    className="w-full rounded-xl font-bold gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
                                >
                                    <XCircle size={16} />
                                    Clear All History
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <Card className="chat-card flex-1 flex flex-col overflow-hidden glass-card border-foreground/10 shadow-2xl relative">
                {/* Background decorative element */}

                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-thin scrollbar-thumb-primary/10">
                        {messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border 
                                    ${message.role === "user" 
                                        ? "bg-primary/20 border-primary/30 text-primary" 
                                        : "bg-accent/20 border-accent/30 text-accent"}`}
                                >
                                    {message.role === "user" ? <User className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
                                </div>
                                <div
                                    className={`max-w-[85%] lg:max-w-[70%] px-5 py-4 rounded-2xl shadow-sm leading-relaxed
                                        ${message.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-muted/50 backdrop-blur-sm border border-foreground/5 rounded-tl-none"
                                    }`}
                                >
                                    <div className="text-sm md:text-base prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                                        {message.content === "" ? (
                                            <div className="flex gap-1 py-1">
                                                <div className="w-1.5 h-1.5 bg-accent animate-bounce" />
                                                <div className="w-1.5 h-1.5 bg-accent animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-1.5 h-1.5 bg-accent animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                        ) : message.content}
                                    </div>
                                    <div className={`text-[10px] mt-2 opacity-40 uppercase tracking-widest font-bold 
                                        ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && messages[messages.length-1].content !== "" && (
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

                    {/* Input Area */}
                    <div className="p-6 pt-0">
                        <div className="relative group glass flex items-center rounded-2xl p-1 px-2 border-foreground/10 ring-offset-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Input
                                placeholder="Ask Izabi anything..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-6 text-lg"
                            />
                            <Button 
                                onClick={handleSendMessage} 
                                disabled={isLoading || !inputValue.trim()} 
                                size="icon"
                                className="h-10 w-10 rounded-xl transition-transform hover:scale-110 active:scale-95 bg-primary hover:bg-primary-glow"
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-[10px] text-center mt-3 text-muted-foreground/60 uppercase tracking-widest font-medium">
                            Izabi AI may provide inaccurate info. Verify important facts.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardAIAssistant
