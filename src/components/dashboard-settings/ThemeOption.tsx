import type React from 'react';
import { Bubble } from '@/components/ui/bubble';
import { cn } from '@/lib/utils';

type ThemeOptionProps = {
    value: string;
    current: string;
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
};

export default function ThemeOption({
    value,
    current,
    onClick,
    icon,
    title,
}: ThemeOptionProps) {
    const isActive = current === value;

    return (
        <button
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 rounded-md border bg-card px-4 py-3.5 text-left transition-colors',
                isActive
                    ? 'border-foreground'
                    : 'border-border hover:border-foreground/40',
            )}
        >
            <Bubble size="sm" state={isActive ? 'filled' : 'empty'} />
            <span className="flex-1 font-bold">{title}</span>
            <span className="text-muted-foreground [&>svg]:h-[18px] [&>svg]:w-[18px]">
                {icon}
            </span>
        </button>
    );
}
