import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Loader2, Bot } from "lucide-react";
import { api } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const FloatingAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { state } = useSidebar();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async () => {
        if (!message.trim() || loading) return;

        const userMsg = message;
        setMessage("");
        setChat(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await api.getAIResponse(userMsg);
            setChat(prev => [...prev, { role: 'ai', content: res }]);
        } catch (err) {
            console.error(err);
            setChat(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn(
            "fixed z-[200] flex flex-col items-start transition-all duration-500 ease-in-out",
            "bottom-8 left-4",
            state === "expanded" ? "md:left-72" : "md:left-20"
        )}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom left' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card/95 backdrop-blur-2xl border border-foreground/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-foreground/5 bg-primary/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                                    <Sparkles className="text-primary w-5 h-5 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Izabi AI Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Active Pulse</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full hover:bg-card/10">
                                <X size={18} />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {chat.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8">
                                    <Bot size={48} className="mb-4" />
                                    <p className="text-sm font-medium">I'm Izabi. Ask me anything about your current session or subjects!</p>
                                </div>
                            )}
                            {chat.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                                        msg.role === 'user' 
                                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                        : 'bg-card border border-foreground/5 rounded-tl-none shadow-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-card border border-foreground/5 p-4 rounded-3xl rounded-tl-none animate-pulse flex items-center gap-2">
                                        <Loader2 className="animate-spin w-4 h-4 text-primary" />
                                        <span className="text-xs font-bold opacity-40">Syncing Knowledge...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-foreground/5 bg-card">
                            <div className="relative">
                                <Input 
                                    placeholder="Type your message..." 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="pr-12 h-14 rounded-2xl bg-background border-foreground/10 focus:border-primary/50 transition-all font-medium"
                                />
                                <Button 
                                    onClick={handleSend}
                                    disabled={!message.trim() || loading}
                                    size="icon"
                                    className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary shadow-glow transition-transform active:scale-90"
                                >
                                    <Send size={18} className="text-primary-foreground" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                id="floating-ai-trigger"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    isOpen ? 'bg-card text-foreground rotate-90 border border-foreground/10' : 'bg-primary text-primary-foreground shadow-glow'
                }`}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={32} className="fill-current" />}
            </motion.button>
        </div>
    );
};

export default FloatingAI;
