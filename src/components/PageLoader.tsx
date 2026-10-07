import type React from 'react';
import { LoadingSpinner, SkeletonLoader } from '@/components/ui/loading';

interface PageLoaderProps {
    variant?: 'spinner' | 'skeleton-cards' | 'skeleton-list';
    itemCount?: number;
    text?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
    variant = 'skeleton-cards',
    itemCount = 3,
    text = 'Loading…',
}) => {
    if (variant === 'spinner') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80">
                <LoadingSpinner size="md" text={text} />
            </div>
        );
    }

    if (variant === 'skeleton-list') {
        return (
            <div className="space-y-4">
                {Array.from({ length: itemCount }).map((_, i) => (
                    <SkeletonLoader key={i} variant="list-item" />
                ))}
            </div>
        );
    }

    // skeleton-cards (default)
    return (
        <div className="space-y-4" role="status">
            <span className="sr-only">{text}</span>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: itemCount }).map((_, i) => (
                    <SkeletonLoader key={i} variant="card" />
                ))}
            </div>
        </div>
    );
};
