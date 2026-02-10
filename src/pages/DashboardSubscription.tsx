"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { api } from "@/lib/apiClient"
import { useAppToast } from "@/hooks/useAppToast"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const DashboardSubscription = () => {
    const [loading, setLoading] = useState(false)
    const [currentTier, setCurrentTier] = useState<'free' | 'pro' | 'premium'>('free')
    const [stats, setStats] = useState<any>(null)
    const appToast = useAppToast()

    useEffect(() => {
        fetchUserStats()
    }, [])

    const fetchUserStats = async () => {
        try {
            const res = await api.getUserStats()
            setStats(res.data)
            setCurrentTier(res.data.subscriptionStatus || 'free')
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpgrade = async (plan: 'pro_monthly' | 'premium_monthly') => {
        setLoading(true)
        try {
            const res = await api.startPayment(plan)
            
            if (res.authorization_url) {
                // Open Paystack payment page
                window.location.href = res.authorization_url
            }
        } catch (err: any) {
            appToast.error({ 
                title: "Payment Error", 
                description: err.message || "Could not initialize payment" 
            })
        } finally {
            setLoading(false)
        }
    }

    const plans = [
        {
            id: 'free',
            name: "Free Scholar",
            price: "0",
            description: "Start your learning journey",
            icon: Sparkles,
            color: "text-blue-400",
            features: [
                "5 Documents per day",
                "20 AI Messages per day",
                "Basic Summaries & Quizzes",
                "English Interface",
            ],
            cta: "Current Plan",
            plan: null,
        },
        {
            id: 'pro',
            name: "Pro Scholar",
            price: "1,999",
            description: "For serious learners",
            icon: Zap,
            color: "text-primary",
            features: [
                "15 Documents per day",
                "30 AI Messages per day",
                "Advanced Summaries",
                "Unlimited Quizzes & Flashcards",
                "Multi-Language Support",
                "Audio Summaries (TTS)",
                "Priority Support",
            ],
            cta: "Upgrade to Pro",
            plan: 'pro_monthly' as const,
        },
        {
            id: 'premium',
            name: "Premium Scholar",
            price: "2,999",
            description: "Maximum productivity",
            icon: Crown,
            color: "text-yellow-500",
            features: [
                "30 Documents per day",
                "45 AI Messages per day",
                "Everything in Pro",
                "JAMB/WAEC Simulations",
                "Performance Analytics",
                "Cloud Storage (5GB)",
                "Custom Study Plans",
            ],
            cta: "Upgrade to Premium",
            plan: 'premium_monthly' as const,
        },
    ]

    return (
        <div className="min-h-screen w-full px-4 md:px-12 py-10 pb-32">
            <ErrorBoundary>
                <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-bold tracking-tighter">
                            Subscription <span className="text-gradient">Plans</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Choose the plan that fits your learning needs
                        </p>
                    </div>

                    {/* Current Usage Stats */}
                    {stats && (
                        <Card className="glass border-primary/20 max-w-4xl mx-auto">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <div className="w-3 h-6 bg-primary rounded-full" />
                                    Your Current Usage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-card/5 border border-foreground/5">
                                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">Documents</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black">{stats.usage.dailyDocs}</span>
                                            <span className="text-sm opacity-40">/ {stats.usage.limits.dailyDocs} per day</span>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-card/5 border border-foreground/5">
                                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">AI Messages</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-black">{stats.usage.dailyMessages}</span>
                                            <span className="text-sm opacity-40">/ {stats.usage.limits.dailyMessages} per day</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {plans.map((plan, idx) => {
                            const Icon = plan.icon
                            const isCurrent = plan.id === currentTier
                            const isUpgrade = (plan.id === 'pro' && currentTier === 'free') || 
                                            (plan.id === 'premium' && (currentTier === 'free' || currentTier === 'pro'))

                            return (
                                <motion.div
                                    key={plan.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Card className={cn(
                                        "glass relative overflow-hidden transition-all h-full flex flex-col",
                                        plan.id === 'pro' && "border-primary/40 shadow-[0_0_30px_rgba(59,130,246,0.1)] scale-105 z-10",
                                        isCurrent && "ring-2 ring-primary"
                                    )}>
                                        {plan.id === 'pro' && (
                                            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase animate-pulse">
                                                Popular
                                            </div>
                                        )}

                                        <CardHeader className="pb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10`}>
                                                    <Icon className={plan.color} size={24} />
                                                </div>
                                                {isCurrent && (
                                                    <Badge className="bg-primary/20 text-primary border-0">Active</Badge>
                                                )}
                                            </div>
                                            <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
                                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">{plan.description}</p>
                                            <div className="flex items-baseline gap-2 mt-4">
                                                <span className="text-xl font-bold opacity-40">₦</span>
                                                <span className="text-4xl font-black">{plan.price}</span>
                                                <span className="text-xs font-bold opacity-40 uppercase">/month</span>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="flex-1 flex flex-col">
                                            <ul className="space-y-3 mb-6 flex-1">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm font-medium">
                                                        <Check size={16} className="text-primary shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <Button
                                                onClick={() => plan.plan && handleUpgrade(plan.plan)}
                                                disabled={isCurrent || loading || !isUpgrade}
                                                className={cn(
                                                    "w-full h-12 font-bold rounded-xl transition-all",
                                                    plan.id === 'pro' 
                                                        ? "bg-primary hover:bg-primary/90 shadow-glow" 
                                                        : "bg-card/5 hover:bg-card/10 border border-foreground/10"
                                                )}
                                            >
                                                {loading ? (
                                                    <Loader2 className="animate-spin" size={20} />
                                                ) : isCurrent ? (
                                                    "Current Plan"
                                                ) : isUpgrade ? (
                                                    <>
                                                        {plan.cta}
                                                        <ArrowRight size={16} className="ml-2" />
                                                    </>
                                                ) : (
                                                    "Downgrade Not Available"
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Footer Note */}
                    <div className="text-center text-sm text-muted-foreground max-w-2xl mx-auto">
                        <p>All plans automatically renew monthly. You can cancel anytime from your account settings.</p>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    )
}

export default function DashboardSubscriptionPage() {
    return (
        <ErrorBoundary>
            <DashboardSubscription />
        </ErrorBoundary>
    )
}
