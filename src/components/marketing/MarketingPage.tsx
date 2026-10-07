import type { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

export function MarketingPage({
    title,
    intro,
    aside,
    children,
}: {
    title: ReactNode;
    intro?: ReactNode;
    aside?: ReactNode;
    children: ReactNode;
}) {
    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-background">
                <Header />
                <main>
                    <header className="page-gutter border-b border-border pb-12 pt-28 sm:pb-16 sm:pt-36">
                        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-10">
                            <div className="lg:col-span-7">
                                <h1 className="max-w-[16ch] text-[2.5rem] leading-[1.05] sm:text-6xl">
                                    {title}
                                </h1>
                                {intro && (
                                    <p className="mt-5 max-w-[38rem] text-lg leading-relaxed text-muted-foreground">
                                        {intro}
                                    </p>
                                )}
                            </div>
                            {aside && (
                                <div className="lg:col-span-5">{aside}</div>
                            )}
                        </div>
                    </header>
                    {children}
                </main>
                <Footer />
            </div>
        </ErrorBoundary>
    );
}

export function MarketingSection({
    title,
    intro,
    children,
    className,
    id,
}: {
    title?: ReactNode;
    intro?: ReactNode;
    children: ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section
            id={id}
            className={cn(
                'page-gutter border-b border-border py-16 sm:py-20',
                className,
            )}
        >
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
                {(title || intro) && (
                    <div className="lg:col-span-4">
                        {title && (
                            <h2 className="text-[1.75rem] leading-tight sm:text-[2rem]">
                                {title}
                            </h2>
                        )}
                        {intro && (
                            <p className="mt-3 max-w-[28rem] text-muted-foreground">
                                {intro}
                            </p>
                        )}
                    </div>
                )}
                <div className={title || intro ? 'lg:col-span-8' : 'lg:col-span-12'}>
                    {children}
                </div>
            </div>
        </section>
    );
}

export function DefinitionRows({
    items,
}: {
    items: { term: ReactNode; detail: ReactNode }[];
}) {
    return (
        <dl className="divide-y divide-border border-y border-border">
            {items.map((item, i) => (
                <div
                    key={i}
                    className="grid grid-cols-1 gap-x-8 gap-y-1.5 py-5 sm:grid-cols-[14rem_1fr]"
                >
                    <dt className="font-display text-lg leading-snug">
                        {item.term}
                    </dt>
                    <dd className="text-muted-foreground">{item.detail}</dd>
                </div>
            ))}
        </dl>
    );
}
