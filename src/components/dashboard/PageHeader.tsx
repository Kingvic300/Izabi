import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
    title,
    description,
    actions,
    className,
}: {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
}) {
    return (
        <header
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
                className,
            )}
        >
            <div className="min-w-0">
                <h2 className="text-[2rem] leading-tight sm:text-[2.5rem]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 max-w-[42rem] text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </header>
    );
}

export function SectionTitle({
    title,
    description,
    actions,
    className,
}: {
    title: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
                className,
            )}
        >
            <div className="min-w-0">
                <h3 className="text-2xl">{title}</h3>
                {description && (
                    <p className="mt-0.5 text-muted-foreground">{description}</p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
