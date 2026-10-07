import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

const dotSize = { sm: 'h-2 w-2', md: 'h-3 w-3', lg: 'h-4 w-4' };

// Four answer bubbles shading in turn.
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'sm',
    text,
    className,
}) => (
    <div
        role="status"
        className={cn('flex flex-col items-center justify-center gap-3', className)}
    >
        <span className="flex gap-1.5" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
                <span
                    key={i}
                    className={cn(
                        'animate-pulse rounded-full border border-foreground/60 bg-foreground',
                        dotSize[size],
                    )}
                    style={{ animationDelay: `${i * 0.18}s` }}
                />
            ))}
        </span>
        {text ? (
            <p className="max-w-[16rem] text-center text-sm text-muted-foreground">
                {text}
            </p>
        ) : (
            <span className="sr-only">Loading</span>
        )}
    </div>
);

interface SkeletonLoaderProps {
    variant?: 'card' | 'list-item' | 'text-block' | 'image';
    className?: string;
}

const bar = 'rounded bg-muted';

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'card',
    className,
}) => {
    const shell = 'animate-pulse rounded-lg border border-border bg-card';

    const variants = {
        card: (
            <div className={cn('space-y-4 p-5', shell)}>
                <div className={cn('h-5 w-2/3', bar)} />
                <div className={cn('h-4 w-full', bar)} />
                <div className={cn('h-4 w-5/6', bar)} />
                <div className={cn('h-4 w-1/2', bar)} />
            </div>
        ),
        'list-item': (
            <div className={cn('flex items-center gap-4 p-4', shell)}>
                <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                    <div className={cn('h-4 w-1/3', bar)} />
                    <div className={cn('h-3 w-3/4', bar)} />
                </div>
            </div>
        ),
        'text-block': (
            <div className="animate-pulse space-y-3">
                <div className={cn('h-4 w-full', bar)} />
                <div className={cn('h-4 w-full', bar)} />
                <div className={cn('h-4 w-4/5', bar)} />
            </div>
        ),
        image: <div className={cn('h-64', shell)} />,
    };

    return (
        <div className={cn('overflow-hidden', className)} aria-hidden>
            {variants[variant]}
        </div>
    );
};
