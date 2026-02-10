"use client"

import type React from "react"
import { useState } from "react"
import { AlertTriangle, X, Wifi, Server, AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { ErrorType } from "@/types/pdf"

interface ErrorDisplayProps {
    error: ErrorType
    onDismiss?: () => void
    onRetry?: () => void
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss, onRetry }) => {
    const [showDetails, setShowDetails] = useState(false)

    const getErrorIcon = () => {
        switch (error.type) {
            case "validation":
                return <AlertTriangle className="h-6 w-6 text-yellow-400" />
            case "network":
                return <Wifi className="h-6 w-6 text-orange-400" />
            case "backend":
                return <Server className="h-6 w-6 text-rose-400" />
            default:
                return <AlertCircle className="h-6 w-6 text-primary" />
        }
    }

    const getErrorBg = () => {
        switch (error.type) {
            case "validation":
                return "from-yellow-500/10 to-transparent"
            case "network":
                return "from-primary/10 to-transparent"
            case "backend":
                return "from-rose-500/10 to-transparent"
            default:
                return "from-primary/10 to-transparent"
        }
    }

    const getGlowColor = () => {
        switch (error.type) {
            case "validation": return "shadow-yellow-500/20"
            case "network": return "shadow-primary/20"
            case "backend": return "shadow-rose-500/20"
            default: return "shadow-primary/20"
        }
    }

    return (
        <Card className={cn(
            "relative overflow-hidden glass border-foreground/5 rounded-2xl shadow-2xl transition-all duration-500 group",
            getGlowColor()
        )}>
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", getErrorBg())} />
            
            <CardContent className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5 flex-1">
                        <div className="mt-1">
                            {getErrorIcon()}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg tracking-tight uppercase opacity-40 text-[10px] mb-1">
                                {error.type || 'System'} Signal
                            </h4>
                            <p className="font-bold text-foreground/90 leading-tight">{error.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest px-2 py-0.5 rounded-2xl bg-card/5">
                                    {new Date(error.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                        {onRetry && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={onRetry} 
                                className="h-10 w-10 p-0 rounded-2xl hover:bg-card/10 transition-colors"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        )}
                        {onDismiss && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={onDismiss} 
                                className="h-10 w-10 p-0 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {error.details && (
                    <div className="mt-4 pt-4 border-t border-foreground/5">
                        <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                            <CollapsibleTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 hover:bg-card/5 transition-all"
                                >
                                    {showDetails ? "Encrypt Terminal" : "Decrypt Terminal"}
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                    <pre className="text-[11px] font-mono text-primary/80 overflow-auto max-h-40 foregroundspace-pre-wrap leading-relaxed">
                                        {error.details}
                                    </pre>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

interface ErrorListProps {
    errors: ErrorType[]
    onDismiss?: (id: string) => void
    onRetry?: () => void
}

export const ErrorList: React.FC<ErrorListProps> = ({ errors, onDismiss, onRetry }) => {
    if (errors.length === 0) return null

    return (
        <div className="space-y-2">
            {errors.map((error) => (
                <ErrorDisplay
                    key={error.id}
                    error={error}
                    onDismiss={onDismiss ? () => onDismiss(error.id) : undefined}
                    onRetry={onRetry}
                />
            ))}
        </div>
    )
}

export default ErrorDisplay
