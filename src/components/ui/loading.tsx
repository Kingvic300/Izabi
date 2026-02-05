import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text,
  className 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-20 w-20'
  };

  const ringSizes = {
    sm: 'border-2',
    md: 'border-3',
    lg: 'border-4'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center p-4', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Outer glowing ring */}
        <div className={cn(
          'absolute inset-0 rounded-full animate-pulse blur-xl opacity-20 bg-primary',
          sizeClasses[size]
        )} />
        
        {/* Secondary spinning base */}
        <div className={cn(
          'absolute inset-0 rounded-full border-white/5',
          ringSizes[size],
          sizeClasses[size]
        )} />
        
        {/* Primary animated spinner */}
        <div
          className={cn(
            'absolute inset-0 animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent',
            ringSizes[size],
            sizeClasses[size]
          )}
        />
        
        {/* Center accent */}
        <div className="absolute inset-4 rounded-full bg-primary/5 backdrop-blur-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsla(var(--primary)/0.8)]" />
        </div>
      </div>

      {text && (
        <div className="mt-6 flex flex-col items-center gap-1">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80 animate-pulse">{text}</p>
          <div className="h-[1px] w-8 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
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
  className 
}) => {
  const baseClasses = "animate-pulse rounded-[32px] bg-foreground/[0.03] dark:bg-white/[0.03] border border-white/5";

  const variants = {
    card: (
      <div className={cn("p-8", baseClasses)}>
        <div className="space-y-6">
          <div className="h-44 bg-foreground/[0.05] dark:bg-white/[0.05] rounded-[24px]"></div>
          <div className="space-y-3">
             <div className="h-6 bg-foreground/[0.05] dark:bg-white/[0.05] rounded-full w-2/3"></div>
             <div className="h-4 bg-foreground/[0.05] dark:bg-white/[0.05] rounded-full w-full opacity-60"></div>
          </div>
        </div>
      </div>
    ),
    'list-item': (
      <div className={cn("flex items-center gap-6 p-6", baseClasses)}>
        <div className="rounded-2xl bg-foreground/[0.05] dark:bg-white/[0.05] h-14 w-14 shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-foreground/[0.05] dark:bg-white/[0.05] rounded-full w-1/3"></div>
          <div className="h-4 bg-foreground/[0.05] dark:bg-white/[0.05] rounded-full w-3/4 opacity-60"></div>
        </div>
      </div>
    ),
    'text-block': (
      <div className="space-y-4">
        <div className="h-5 bg-foreground/[0.03] dark:bg-white/[0.03] rounded-full w-full"></div>
        <div className="h-5 bg-foreground/[0.03] dark:bg-white/[0.03] rounded-full w-full"></div>
        <div className="h-5 bg-foreground/[0.03] dark:bg-white/[0.03] rounded-full w-4/5"></div>
      </div>
    ),
    image: (
      <div className={cn("h-64", baseClasses)}></div>
    )
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      {variants[variant]}
    </div>
  );
};