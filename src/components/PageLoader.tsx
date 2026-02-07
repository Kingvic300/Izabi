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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
                <LoadingSpinner size="md" text={text} />
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
