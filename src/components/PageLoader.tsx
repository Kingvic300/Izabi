import type React from "react"
import { LoadingSpinner, SkeletonLoader } from "@/components/ui/loading"
import { Card, CardContent } from "@/components/ui/card"

interface PageLoaderProps {
    variant?: "spinner" | "skeleton-cards" | "skeleton-list"
    itemCount?: number
    text?: string
}

export const PageLoader: React.FC<PageLoaderProps> = ({
                                                          variant = "skeleton-cards",
                                                          itemCount = 3,
                                                          text = "Loading...",
                                                      }) => {
    if (variant === "spinner") {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                <div className="bg-card/50 p-12 rounded-[40px] border border-white/5 shadow-2xl scale-110">
                    <LoadingSpinner size="lg" text={text} />
                </div>
            </div>
        )
    }

    if (variant === "skeleton-list") {
        return (
            <div className="space-y-4">
                {Array.from({ length: itemCount }).map((_, i) => (
                    <SkeletonLoader key={i} variant="list-item" />
                ))}
            </div>
        )
    }

    // skeleton-cards (default)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: itemCount }).map((_, i) => (
                <SkeletonLoader key={i} variant="card" className="stagger-card" />
            ))}
        </div>
    )
}
