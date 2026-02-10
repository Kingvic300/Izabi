"use client"

import React, { type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("[ErrorBoundary] Caught error:", error, errorInfo)
        import("sonner").then(({ toast }) => {
            toast.error("Critical System Fault", {
                description: "An unexpected error occurred in the neural interface.",
            });
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="min-h-screen bg-background flex items-center justify-center p-4">
                        <div className="w-full max-w-md">
                            <div className="bg-card border border-border rounded-lg p-8 text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center">
                                        <AlertCircle className="w-8 h-8 text-destructive" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-foreground">Oops! Something went wrong</h2>
                                    <p className="text-sm text-muted-foreground">
                                        We encountered an unexpected error. Please try again or return to the home page.
                                    </p>
                                </div>

                                {process.env.NODE_ENV === "development" && this.state.error && (
                                    <div className="bg-muted/50 rounded p-3 text-left">
                                        <p className="text-xs font-mono text-muted-foreground break-words">{this.state.error.message}</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        onClick={() => this.setState({ hasError: false, error: null })}
                                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        Try Again
                                    </Button>
                                    <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
                                        Go Home
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
