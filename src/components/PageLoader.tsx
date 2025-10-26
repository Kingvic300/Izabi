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
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text={text} />
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
        <div className="space-y-4">
            {Array.from({ length: itemCount }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="p-6">
                        <SkeletonLoader variant="card" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
