import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// The answer-sheet bubble: Izabi's one recurring mark.
// empty = printed red outline, filled = pencil shading,
// correct / wrong = marked after checking, missed = the answer you should have shaded.
const bubbleVariants = cva(
    'relative inline-flex shrink-0 select-none items-center justify-center rounded-full border-[1.5px] font-sans font-bold leading-none tabular',
    {
        variants: {
            state: {
                empty: 'border-sheet/70 text-sheet',
                filled: 'border-foreground text-background',
                correct: 'border-reward text-reward-foreground',
                wrong: 'border-destructive text-background',
                missed: 'border-2 border-reward text-reward',
            },
            size: {
                xs: 'h-4 w-4 text-[9px]',
                sm: 'h-6 w-6 text-[11px]',
                md: 'h-8 w-8 text-xs',
                lg: 'h-10 w-10 text-sm',
            },
        },
        defaultVariants: {
            state: 'empty',
            size: 'md',
        },
    },
);

const fillClass: Record<string, string> = {
    filled: 'bg-foreground',
    correct: 'bg-reward',
    wrong: 'bg-foreground',
};

export interface BubbleProps
    extends
        React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof bubbleVariants> {
    label?: React.ReactNode;
}

export function Bubble({
    className,
    state = 'empty',
    size,
    label,
    ...props
}: BubbleProps) {
    const fill = state ? fillClass[state] : undefined;
    return (
        <span
            aria-hidden="true"
            className={cn(bubbleVariants({ state, size }), className)}
            {...props}
        >
            {fill && (
                <span
                    key={state}
                    className={cn(
                        'absolute inset-0 rounded-full motion-safe:animate-pencil-fill',
                        fill,
                    )}
                />
            )}
            {label !== undefined && <span className="relative">{label}</span>}
        </span>
    );
}

export { bubbleVariants };
