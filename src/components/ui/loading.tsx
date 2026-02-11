import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'sm',
    text,
    className,
}) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4',
                className,
            )}
        >
            <div
                className={cn(
                    'animate-spin rounded-full border-2 border-primary/20 border-t-primary',
                    sizeClasses[size],
                )}
            />

            {text && (
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 text-center max-w-[200px]">
                        {text}
                    </p>
                </div>
            )}
        </div>
    );
};

interface SkeletonLoaderProps {
    variant?: 'card' | 'list-item' | 'text-block' | 'image';
    className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'card',
    className,
}) => {
    const baseClasses =
        'animate-pulse rounded-2xl bg-card/[0.03] dark:bg-card/[0.03] border border-foreground/5';

    const variants = {
        card: (
            <div className={cn('p-8', baseClasses)}>
                <div className="space-y-6">
                    <div className="h-44 bg-card/[0.05] dark:bg-card/[0.05] rounded-xl"></div>
                    <div className="space-y-3">
                        <div className="h-6 bg-card/[0.05] dark:bg-card/[0.05] rounded-xl w-2/3"></div>
                        <div className="h-4 bg-card/[0.05] dark:bg-card/[0.05] rounded-xl w-full opacity-60"></div>
                    </div>
                </div>
            </div>
        ),
        'list-item': (
            <div className={cn('flex items-center gap-6 p-6', baseClasses)}>
                <div className="rounded-xl bg-card/[0.05] dark:bg-card/[0.05] h-14 w-14 shrink-0"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-5 bg-card/[0.05] dark:bg-card/[0.05] rounded-xl w-1/3"></div>
                    <div className="h-4 bg-card/[0.05] dark:bg-card/[0.05] rounded-xl w-3/4 opacity-60"></div>
                </div>
            </div>
        ),
        'text-block': (
            <div className="space-y-4">
                <div className="h-5 bg-card/[0.03] dark:bg-card/[0.03] rounded-xl w-full"></div>
                <div className="h-5 bg-card/[0.03] dark:bg-card/[0.03] rounded-xl w-full"></div>
                <div className="h-5 bg-card/[0.03] dark:bg-card/[0.03] rounded-xl w-4/5"></div>
            </div>
        ),
        image: <div className={cn('h-64', baseClasses)}></div>,
    };

    return (
        <div className={cn('overflow-hidden', className)}>
            {variants[variant]}
        </div>
    );
};
