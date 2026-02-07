"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
    Heart, 
    Share2, 
    Key, 
    HelpCircle, 
    CheckCircle2, 
    ExternalLink, 
    AlertCircle,
    Copy,
    Sparkles,
    Shield,
    User
} from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { api } from "@/lib/apiClient"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function SupportUs() {
    const containerRef = useRef<HTMLDivElement>(null)
    const appToast = useAppToast()
    const [apiKey, setApiKey] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    useGSAP(() => {
        const tl = gsap.timeline()
        tl.from(".support-header", { opacity: 0, y: -20, duration: 0.8, ease: "expo.out" })
          .from(".support-card", { 
              opacity: 0, 
              y: 30, 
              stagger: 0.2, 
              duration: 1, 
              ease: "expo.out" 
          }, "-=0.4")
    }, { scope: containerRef })

    /*
     * How: Validates the input format and sends the API key to the backend for secure storage via the submitGroqKey endpoint.
     * Why: Allows users to securely contribute their own Groq API keys to help sustain the platform's AI features.
     */
    const handleSubmitKey = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!apiKey.trim() || apiKey.length < 20) {
            appToast.error({
                title: "Invalid API Key",
                description: "Please enter a valid Groq API key to continue."
            })
            return
        }

        setIsLoading(true)
        try {
            const userId = localStorage.getItem("userId")
            if (!userId) throw new Error("User not found")
            
            await api.submitGroqKey(userId, apiKey.trim())
            
            setIsSubmitted(true)
            appToast.success({
                title: "Contribution Received",
                description: "Thank you for supporting Izabi! Your API key has been secured."
            })
        } catch (err: any) {
            console.error("Failed to submit API key:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div ref={containerRef} className="space-y-6 md:space-y-12 w-full pb-20 px-0 md:px-8 lg:px-12 pt-6 md:pt-12">
            {/* Header section */}
            <div className="support-header space-y-4 text-center">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-[30px] bg-primary/10 flex items-center justify-center animate-pulse">
                        <Heart size={40} className="text-primary fill-primary/20" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-7xl font-bold tracking-tighter leading-none">
                    Support <span className="text-gradient">Izabi</span>
                </h1>
                <p className="text-muted-foreground font-medium text-xl max-w-2xl mx-auto">
                    Help us keep Izabi free and powerful for everyone by contributing your own AI resources.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left Column: The Form */}
                <div className="space-y-8 animate-in fade-in slide-in-from-left-5">
                    <Card className="support-card glass shadow-2xl border-white/5 rounded-2xl overflow-hidden group">
                        <CardHeader className="p-6 md:p-10 pb-4 md:pb-6">
                            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                                <Key className="text-primary" />
                                <span>Contribute AI Key</span>
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Submitting your Groq API key helps reduce our operational costs, allowing us to serve more students.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-10 pt-0 space-y-6 md:space-y-8">
                            {isSubmitted ? (
                                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-primary">Submission Successful</h3>
                                        <p className="opacity-60 font-medium">Your contribution has been logged. Thank you for being a part of the Izabi family!</p>
                                    </div>
                                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-2xl h-12 px-8">
                                        Submit Another Key
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitKey} className="space-y-6">
                                    <div className="space-y-4">
                                        <Label htmlFor="apiKey" className="text-xs uppercase tracking-[0.2em] font-bold opacity-40">Groq API Key</Label>
                                        <div className="relative">
                                            <Input
                                                id="apiKey"
                                                type="password"
                                                placeholder="gsk-..."
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                className="h-16 rounded-2xl glass border-white/10 px-6 font-mono text-lg focus:ring-primary/20"
                                                autoComplete="off"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Shield size={20} className="opacity-20" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                                        <AlertCircle className="text-primary shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm font-medium opacity-80 leading-relaxed">
                                            Your key is encrypted and stored securely. We only use it to power AI requests on the platform when needed.
                                        </p>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={isLoading || !apiKey.trim()} 
                                        className="w-full h-20 rounded-2xl bg-primary hover:bg-primary-glow text-white font-bold text-2xl shadow-glow transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? (
                                            <div className="animate-spin h-6 w-6 border-2 border-white/30 border-t-white rounded-2xl" />
                                        ) : (
                                            <>
                                                <Sparkles />
                                                Confirm Gift
                                            </>
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    <div className="support-card grid grid-cols-2 gap-6">
                        <Card className="glass border-white/5 p-8 rounded-2xl space-y-4 hover-lift">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit"><Share2 size={24} /></div>
                            <div>
                                <h4 className="font-bold text-lg">Spread the Word</h4>
                                <p className="text-sm opacity-60 font-medium leading-normal">Tell your classmates about Izabi. Growth is support.</p>
                            </div>
                        </Card>
                        <Card className="glass border-white/5 p-8 rounded-2xl space-y-4 hover-lift">
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary w-fit"><Shield size={24} /></div>
                            <div>
                                <h4 className="font-bold text-lg">Safe & Secure</h4>
                                <p className="text-sm opacity-60 font-medium leading-normal">Top-tier encryption for all contributed keys.</p>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Guidance */}
                <div className="space-y-8 animate-in fade-in slide-in-from-right-5">
                    <div className="support-card space-y-6 lg:pl-6">
                        <h2 className="text-3xl font-bold tracking-tight mb-8 flex items-center gap-3">
                            <HelpCircle className="text-primary" />
                            How to get your key
                        </h2>

                        <div className="space-y-12 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            {[
                                {
                                    step: 1,
                                    title: "Visit Groq Console",
                                    desc: "Go to the official Groq Console platform where API keys are managed.",
                                    link: "https://console.groq.com/keys",
                                    icon: <ExternalLink size={20} />
                                },
                                {
                                    step: 2,
                                    title: "Sign in with Github/Google",
                                    desc: "Use your standard developer accounts. Groq offers high-speed AI access.",
                                    icon: <User size={20} />
                                },
                                {
                                    step: 3,
                                    title: "Generate API Key",
                                    desc: "Click on the 'Create API Key' button. Choose a descriptive name.",
                                    icon: <PlusStep />
                                },
                                {
                                    step: 4,
                                    title: "Copy and Paste",
                                    desc: "Copy your new key (starts with gsk...) and paste it into the submission form here.",
                                    icon: <Copy size={20} />
                                }
                            ].map((item, i) => (
                                <div key={i} className="relative flex items-start gap-8 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg shrink-0 z-10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                        {item.step}
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            {item.link && (
                                                <a 
                                                    href={item.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-colors"
                                                >
                                                    {item.icon}
                                                </a>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .shadow-glow {
                    box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
                }
                .hover-lift {
                    transition: transform 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    )
}

function PlusStep() {
    return (
        <div className="w-5 h-5 flex items-center justify-center">
            <div className="absolute w-4 h-0.5 bg-current rounded-2xl" />
            <div className="absolute w-0.5 h-4 bg-current rounded-2xl" />
        </div>
    )
}
