import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowRight, Upload, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
    target: string // ID of the target element
    title: string
    description: string
    placement?: "top" | "bottom" | "left" | "right" | "center"
}

const STEPS: Step[] = [
    {
        target: "onboarding-welcome-card", // We'll add this ID to the welcome/upload card
        title: "Start Here",
        description: "Upload your PDFs or notes to begin. Izabi will analyze them instantly.",
        placement: "bottom"
    },
    {
        target: "onboarding-feature-summary", // ID for summary card
        title: "Smart Summaries",
        description: "Get concise, easy-to-understand summaries of your documents.",
        placement: "top"
    },
    {
        target: "onboarding-feature-quiz", // ID for quiz card
        title: "Practice Quizzes",
        description: "Test your knowledge with auto-generated questions.",
        placement: "top"
    },
    {
        target: "onboarding-study-tools", // ID for the tools section container
        title: "Your Toolkit",
        description: "Access all your study tools here once a document is uploaded.",
        placement: "top"
    }
]

export function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem("izabi_onboarding_completed")
        if (!hasSeenOnboarding) {
            // Small delay to ensure elements are rendered
            const timer = setTimeout(() => {
                setIsVisible(true)
                updateTarget()
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    useEffect(() => {
        if (isVisible) {
            updateTarget()
            window.addEventListener("resize", updateTarget)
            window.addEventListener("scroll", updateTarget)
            return () => {
                window.removeEventListener("resize", updateTarget)
                window.removeEventListener("scroll", updateTarget)
            }
        }
    }, [currentStep, isVisible])

    const updateTarget = () => {
        const step = STEPS[currentStep]
        if (!step) return

        const element = document.getElementById(step.target)
        if (element) {
            const rect = element.getBoundingClientRect()
            setTargetRect(rect)
            
            // Scroll into view if needed
            element.scrollIntoView({ behavior: "smooth", block: "center" })
        } else {
             // If target not found, skip to next or finish if it's critical, 
             // but let's just try next step for robustness
             if (currentStep < STEPS.length - 1) {
                 setCurrentStep(prev => prev + 1)
             } else {
                 handleComplete()
             }
        }
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handleComplete = () => {
        setIsVisible(false)
        localStorage.setItem("izabi_onboarding_completed", "true")
    }

    const handleSkip = () => {
        handleComplete()
    }

    if (!isVisible || !targetRect) return null

    const step = STEPS[currentStep]
    const isLast = currentStep === STEPS.length - 1

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    {/* Backdrop with hole */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 pointer-events-auto"
                        style={{
                            clipPath: `polygon(
                                0% 0%, 
                                0% 100%, 
                                ${targetRect.left}px 100%, 
                                ${targetRect.left}px ${targetRect.top}px, 
                                ${targetRect.right}px ${targetRect.top}px, 
                                ${targetRect.right}px ${targetRect.bottom}px, 
                                ${targetRect.left}px ${targetRect.bottom}px, 
                                ${targetRect.left}px 100%, 
                                100% 100%, 
                                100% 0%
                            )`
                        }}
                    />

                    {/* Spotlight Border */}
                    <motion.div
                        className="absolute rounded-xl border-2 border-primary shadow-[0_0_30px_rgba(var(--primary),0.5)] pointer-events-none"
                        layoutId="spotlight"
                        initial={false}
                        animate={{
                            top: targetRect.top - 4,
                            left: targetRect.left - 4,
                            width: targetRect.width + 8,
                            height: targetRect.height + 8,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />

                    {/* Tooltip Card */}
                    <motion.div
                        className="absolute pointer-events-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            top: step.placement === 'bottom' ? targetRect.bottom + 20 : targetRect.top - 180,
                            left: targetRect.left + (targetRect.width / 2) - 160 // Center the card (320px width)
                        }}
                         transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="w-[320px] bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                             {/* Decorative gradients */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Sparkles size={18} />
                                    </div>
                                    <button onClick={handleSkip} className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest transition-colors">
                                        Skip
                                    </button>
                                </div>
                                
                                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                    {step.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {STEPS.map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={cn(
                                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                                    i === currentStep ? "bg-primary" : "bg-primary/20"
                                                )} 
                                            />
                                        ))}
                                    </div>
                                    <Button 
                                        onClick={handleNext}
                                        size="sm"
                                        className="rounded-xl px-6 font-bold shadow-glow"
                                    >
                                        {isLast ? "Get Started" : "Next"}
                                        {!isLast && <ArrowRight size={14} className="ml-2" />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
