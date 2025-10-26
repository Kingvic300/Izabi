"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Zap, Send, Loader } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { mockApi } from "@/lib/mockApi"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

const mockAIResponses = [
    "That's a great question! Let me break this down for you...",
    "Based on what you've learned, here's the key concept...",
    "Excellent observation! This relates to...",
    "Let me explain this step by step...",
    "That's an interesting perspective. Consider this...",
    "This is a common misconception. Actually...",
    "Great question! The answer involves understanding...",
    "Let me provide you with a detailed explanation...",
]

const DashboardAIAssistant = () => {
    const { toast } = useToast()
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content:
                "Hello! I'm your AI learning assistant. I'm here to help you understand complex concepts, answer questions, and guide your learning journey. What would you like to learn about today?",
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) {
            toast({
                title: "Empty Message",
                description: "Please type a message before sending.",
                variant: "destructive",
            })
            return
        }

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

        try {
            const aiResponse = await mockApi.getAIResponse(inputValue)
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: aiResponse,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (error) {
            console.error("Error getting AI response:", error)
            toast({
                title: "Error",
                description: "Failed to get response from AI",
                variant: "destructive",
            })
        } finally {
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
        <div className="space-y-6 flex flex-col h-[calc(100vh-200px)]">
            <div>
                <h1 className="text-3xl font-bold mb-2">AI Assistant</h1>
                <p className="text-muted-foreground">Get instant help with your studies using our intelligent AI assistant.</p>
            </div>

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span>Chat with AI</span>
                    </CardTitle>
                    <CardDescription>Ask questions and get personalized learning assistance</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted text-foreground rounded-bl-none"
                                    }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center space-x-2">
                                    <Loader className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">AI is thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Ask me anything about your studies..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} size="icon">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardAIAssistant
