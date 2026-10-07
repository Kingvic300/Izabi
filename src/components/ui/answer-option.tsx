import * as React from 'react';
import { Check, X } from 'lucide-react';
import { Bubble } from '@/components/ui/bubble';
import { cn } from '@/lib/utils';

export type AnswerOptionState =
    | 'idle'
    | 'selected'
    | 'correct'
    | 'wrong'
    | 'missed'
    | 'dimmed';

interface AnswerOptionProps
    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
    letter: string;
    state?: AnswerOptionState;
    children: React.ReactNode;
}

const bubbleState: Record<AnswerOptionState, 'empty' | 'filled' | 'correct' | 'wrong' | 'missed'> = {
    idle: 'empty',
    selected: 'filled',
    correct: 'correct',
    wrong: 'wrong',
    missed: 'missed',
    dimmed: 'empty',
};

export const AnswerOption = React.forwardRef<HTMLButtonElement, AnswerOptionProps>(
    ({ letter, state = 'idle', className, children, disabled, ...props }, ref) => {
        const interactive = !disabled && (state === 'idle' || state === 'selected');
        return (
            <button
                ref={ref}
                type="button"
                role="radio"
                aria-checked={state === 'selected' || state === 'correct' || state === 'wrong'}
                disabled={disabled}
                className={cn(
                    'group flex min-h-12 w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left text-[15px] transition-colors disabled:cursor-default',
                    state === 'idle' && 'border-border bg-card',
                    interactive && 'hover:border-foreground/40 hover:bg-muted/50',
                    state === 'selected' && 'border-foreground bg-card',
                    state === 'correct' && 'border-reward bg-reward/10',
                    state === 'wrong' && 'border-destructive bg-destructive/5',
                    state === 'missed' && 'border-reward/60 border-dashed bg-card',
                    state === 'dimmed' && 'border-border bg-card text-muted-foreground',
                    className,
                )}
                {...props}
            >
                <Bubble
                    label={letter}
                    state={bubbleState[state]}
                    size="sm"
                    className={cn(
                        interactive &&
                            state === 'idle' &&
                            'group-hover:border-foreground group-hover:text-foreground',
                    )}
                />
                <span className="min-w-0 flex-1">{children}</span>
                {state === 'correct' && <Check className="h-4 w-4 shrink-0 text-reward" />}
                {state === 'wrong' && <X className="h-4 w-4 shrink-0 text-destructive" />}
            </button>
        );
    },
);
AnswerOption.displayName = 'AnswerOption';
