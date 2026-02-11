'use client';

import { useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Brain, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const NotFound = () => {
    const location = useLocation();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.fade-in', {
                opacity: 0,
                y: 20,
                duration: 1,
                stagger: 0.1,
                ease: 'expo.out',
            });
        },
        { scope: containerRef },
    );

    useEffect(() => {
        console.error(
            '404 Error: User attempted to access non-existent route:',
            location.pathname,
        );
    }, [location.pathname]);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-6"
        >
            <Link to="/" className="absolute top-8 left-8 group fade-in">
                <div className="flex items-center gap-2 text-sm font-bold opacity-60 group-hover:opacity-100 transition-all">
                    <ArrowLeft
                        size={16}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span>Return to Portal</span>
                </div>
            </Link>

            <div className="text-center space-y-8 relative z-10">
                <div className="fade-in">
                    <div className="w-24 h-24 bg-card/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-foreground/10 shadow-2xl relative overflow-hidden group">
                        <AlertTriangle className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                    <h1 className="text-9xl font-bold tracking-tighter text-foreground opacity-20 leading-none">
                        404
                    </h1>
                </div>

                <div className="space-y-4 fade-in">
                    <h2 className="text-4xl font-bold text-foreground">
                        Neural <span className="text-gradient">Void</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto">
                        The resource you requested resides in an unmapped sector
                        of the learning network.
                    </p>
                </div>

                <div className="fade-in">
                    <Link to="/">
                        <Button className="h-16 px-10 rounded-xl bg-card text-black font-bold text-lg shadow-glow hover:bg-card/5 active:scale-95 transition-all flex items-center gap-3 mx-auto">
                            <Sparkles size={20} />
                            <span>Return to Station</span>
                        </Button>
                    </Link>
                </div>

                <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-20 fade-in pt-12">
                    Izabi Intelligence Protocol v1.0.4
                </p>
            </div>
        </div>
    );
};

export default function NotFoundPage() {
    return (
        <ErrorBoundary>
            <NotFound />
        </ErrorBoundary>
    );
}
