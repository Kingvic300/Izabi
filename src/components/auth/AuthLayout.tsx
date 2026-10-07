import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function AuthLayout({
    title,
    subtitle,
    children,
    aside,
    backTo = '/',
    backLabel = 'Home',
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    children: ReactNode;
    aside?: ReactNode;
    backTo?: string;
    backLabel?: string;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <div className="flex w-full flex-col lg:w-[55%]">
                <header className="page-gutter flex h-16 items-center justify-between">
                    <Link to="/" className="rounded-md" aria-label="Izabi home">
                        <Logo height={28} />
                    </Link>
                    <Link
                        to={backTo}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {backLabel}
                    </Link>
                </header>
                <main className="page-gutter flex flex-1 items-center py-10 sm:py-14">
                    <div className="mx-auto w-full max-w-[26rem]">
                        <h1 className="text-[2rem] leading-tight sm:text-[2.5rem]">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mt-2 text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                        <div className="mt-8">{children}</div>
                    </div>
                </main>
            </div>
            {aside && (
                <aside className="hidden border-l border-border bg-card lg:flex lg:w-[45%] lg:flex-col lg:justify-center lg:px-14 xl:px-20">
                    {aside}
                </aside>
            )}
        </div>
    );
}

export function AuthField({
    id,
    label,
    error,
    hint,
    action,
    children,
}: {
    id: string;
    label: ReactNode;
    error?: string | null;
    hint?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-baseline justify-between gap-4">
                <Label htmlFor={id} className="text-sm font-bold">
                    {label}
                </Label>
                {action}
            </div>
            {children}
            {error ? (
                <p id={`${id}-error`} className="text-sm text-destructive">
                    {error}
                </p>
            ) : (
                hint && (
                    <p className="text-sm text-muted-foreground">{hint}</p>
                )
            )}
        </div>
    );
}

export function AuthDivider({ children }: { children: ReactNode }) {
    return (
        <div className="relative my-6 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {children}
            <span className="h-px flex-1 bg-border" />
        </div>
    );
}

export const authInputClass = (hasError?: boolean) =>
    cn('h-12 text-base', hasError && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive');
