import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bubble } from '@/components/ui/bubble';
import { Logo } from '@/components/Logo';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error('404: no route for', location.pathname);
    }, [location.pathname]);

    return (
        <ErrorBoundary>
            <div className="flex min-h-screen flex-col bg-background">
                <header className="page-gutter flex h-16 items-center">
                    <Link to="/" className="rounded-md" aria-label="Izabi home">
                        <Logo height={28} />
                    </Link>
                </header>
                <main className="page-gutter flex flex-1 items-center py-16">
                    <div className="max-w-xl">
                        <div className="flex gap-2" aria-hidden>
                            <Bubble label="A" size="md" />
                            <Bubble label="B" size="md" />
                            <Bubble label="C" size="md" />
                            <Bubble label="D" size="md" />
                        </div>
                        <h1 className="mt-8 text-[2.5rem] leading-tight sm:text-5xl">
                            This page is not on the paper.
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We could not find{' '}
                            <code className="break-all rounded bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground">
                                {location.pathname}
                            </code>
                            . The link may be old or mistyped.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button asChild>
                                <Link to="/">Go to the home page</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link to="/dashboard">Open your dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </ErrorBoundary>
    );
};

export default NotFound;
