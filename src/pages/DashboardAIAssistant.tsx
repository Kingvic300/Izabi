"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Send, Loader, User, Brain, History, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { apiWithFallback as api } from "@/lib/apiClient"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

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
        const fetchHistory = async () => {
            try {
                const history = await api.getChatHistory(userId)
                if (history && history.messages && history.messages.length > 0) {
                    const formattedMessages = history.messages.map((m: any) => ({
                        id: m._id || Math.random().toString(),
                        role: m.role,
                        content: m.content,
                        timestamp: new Date(m.timestamp),
                    }))
                    setMessages(formattedMessages)
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
                    toast({
                        title: "Connection Error",
                        description: "Izabi is taking a short nap. Please try again in a moment.",
                        variant: "destructive"
                    })
                },
                () => {
                    setIsLoading(false)
                },
            )
        } catch (error) {
            console.error("Error starting AI stream:", error)
            toast({
                title: "Error",
                description: "Failed to connect to AI assistant",
                variant: "destructive",
            })
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div ref={containerRef} className="space-y-6 flex flex-col h-[calc(100vh-140px)] w-full">
            <div className="chat-header flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold mb-1 flex items-center gap-3">
                        <span className="text-gradient">Izabi AI</span>
                        <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground">Your personal co-pilot for smarter learning.</p>
                </div>
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 glass-card">
                    <History className="h-4 w-4" />
                    Clear History
                </Button>
            </div>

            <Card className="chat-card flex-1 flex flex-col overflow-hidden glass-card border-white/10 shadow-2xl relative">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none rounded-full" />

                <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-6 p-6 scrollbar-thin scrollbar-thumb-primary/10">
                        {messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`flex items-start gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border 
                                    ${message.role === "user" 
                                        ? "bg-primary/20 border-primary/30 text-primary" 
                                        : "bg-accent/20 border-accent/30 text-accent"}`}
                                >
                                    {message.role === "user" ? <User className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
                                </div>
                                <div
                                    className={`max-w-[85%] lg:max-w-[70%] px-5 py-4 rounded-3xl shadow-sm leading-relaxed
                                        ${message.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-muted/50 backdrop-blur-sm border border-white/5 rounded-tl-none"
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
                                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-accent/20 border border-accent/30 text-accent">
                                    <Brain className="h-5 w-5" />
                                </div>
                                <div className="bg-muted/50 backdrop-blur-sm border border-white/5 px-5 py-4 rounded-3xl rounded-tl-none">
                                    <Loader className="h-4 w-4 animate-spin text-accent" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 pt-0">
                        <div className="relative group glass flex items-center rounded-3xl p-1 px-2 border-white/10 ring-offset-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
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
                                className="h-10 w-10 rounded-2xl transition-transform hover:scale-110 active:scale-95 bg-primary hover:bg-primary-glow"
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
