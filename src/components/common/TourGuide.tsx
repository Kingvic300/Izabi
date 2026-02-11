'use client';

import { useEffect, useState, useRef } from 'react';
import { useTour } from '@/contexts/TourContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, X, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TourOverlay() {
    const {
        isActive,
        currentStep,
        nextStep,
        prevStep,
        endTour,
        currentStepIndex,
        totalSteps,
    } = useTour();
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [tooltipStyles, setTooltipStyles] = useState<React.CSSProperties>({});

    // Update position when step changes or window resizes
    useEffect(() => {
        if (!isActive || !currentStep) return;

        const updatePosition = () => {
            // Handle Center Modal (Intro) Step
            if (currentStep.position === 'center') {
                setTargetRect(null);
                setTooltipStyles({
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    maxWidth: '500px',
                    width: '90%',
                });
                return;
            }

            // Handle Target-based Steps
            const element = document.getElementById(currentStep.targetId);

            if (element) {
                // Scroll element into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                const rect = element.getBoundingClientRect();
                setTargetRect(rect);

                // Calculate tooltip position
                // Default gap
                const gap = 16;
                let styles: React.CSSProperties = {};

                switch (currentStep.position) {
                    case 'top':
                        styles = {
                            bottom: window.innerHeight - rect.top + gap,
                            left: rect.left + rect.width / 2,
                            transform: 'translateX(-50%)',
                        };
                        break;
                    case 'bottom':
                        styles = {
                            top: rect.bottom + gap,
                            left: rect.left + rect.width / 2,
                            transform: 'translateX(-50%)',
                        };
                        break;
                    case 'left':
                        styles = {
                            top: rect.top + rect.height / 2,
                            right: window.innerWidth - rect.left + gap,
                            transform: 'translateY(-50%)',
                        };
                        break;
                    case 'right':
                        styles = {
                            top: rect.top + rect.height / 2,
                            left: rect.right + gap,
                            transform: 'translateY(-50%)',
                        };
                        break;
                    default: // automated fallback logic could go here
                        styles = {
                            top: rect.bottom + gap,
                            left: rect.left + rect.width / 2,
                            transform: 'translateX(-50%)',
                        };
                }

                // Boundary Check Logic
                const tooltipWidth = 320; // Approx max width
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Adjust "top" if off-screen top
                if (
                    styles.top &&
                    typeof styles.top === 'number' &&
                    styles.top < 0
                ) {
                    styles.top = gap;
                    // If it was supposed to be "bottom" based, we might need to flip, but simple clamping is safer for now
                }

                // Adjust "left" if off-screen right
                if (styles.left && typeof styles.left === 'number') {
                    if (styles.left + tooltipWidth / 2 > windowWidth) {
                        // Too far right, anchor to right side
                        delete styles.left;
                        delete styles.transform;
                        styles.right = gap;
                    } else if (styles.left - tooltipWidth / 2 < 0) {
                        // Too far left, anchor to left side
                        styles.left = gap;
                        delete styles.transform;
                    }
                }

                setTooltipStyles(styles);
            } else {
                console.warn(`Tour target #${currentStep.targetId} not found`);
                // If element not found, we could auto-skip, but for now we just show it centered or skip manually
                // Fallback to center if element missing
                setTooltipStyles({
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                });
            }
        };

        // Small timeout to allow for scroll/render/transition
        const timer = setTimeout(updatePosition, 100);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            clearTimeout(timer);
        };
    }, [isActive, currentStep, currentStepIndex]);

    if (!isActive || !currentStep) return null;

    // Render different card for "center" (Intro) vs normal tips
    const isCenter = currentStep.position === 'center';

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none">
            <AnimatePresence>
                {/* Backdrop - Transparent now as requested */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto"
                />

                {/* Highlight Box - Only if target exists and not centered */}
                {targetRect && !isCenter && (
                    <motion.div
                        layoutId="tour-highlight"
                        initial={false}
                        animate={{
                            top: targetRect.top - 8,
                            left: targetRect.left - 8,
                            width: targetRect.width + 16,
                            height: targetRect.height + 16,
                            opacity: 1,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="absolute rounded-2xl border-2 border-primary shadow-[0_0_30px_rgba(59,130,246,0.5)] pointer-events-none bg-primary/5 hidden md:block"
                    />
                )}
            </AnimatePresence>

            {/* Tooltip Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep.title} // Key change triggers animation
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    style={{ position: 'fixed', ...tooltipStyles }} // Fixed position based on calc
                    className={cn(
                        'pointer-events-auto z-[10001]',
                        isCenter
                            ? 'w-[90vw] max-w-[420px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center'
                            : 'w-[calc(100vw-2rem)] max-w-[320px]',
                    )}
                >
                    <div
                        className={cn(
                            'bg-card/95 backdrop-blur-3xl border border-foreground/10 shadow-2xl relative overflow-hidden',
                            isCenter
                                ? 'p-6 md:p-10 rounded-[32px] text-center'
                                : 'p-5 rounded-[24px]',
                        )}
                    >
                        {/* Background decoration for intro card */}
                        {isCenter && (
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        )}

                        <div className="relative z-10 flex flex-col h-full">
                            {isCenter && (
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary animate-pulse border border-primary/20">
                                        <Map className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <h3
                                        className={cn(
                                            'font-bold text-foreground leading-tight',
                                            isCenter
                                                ? 'text-xl md:text-2xl w-full'
                                                : 'text-base',
                                        )}
                                    >
                                        {currentStep.title}
                                    </h3>
                                    {!isCenter && (
                                        <button
                                            onClick={endTour}
                                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 -mt-1 -mr-1 p-2"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>

                                <p
                                    className={cn(
                                        'text-muted-foreground mt-2 leading-relaxed font-medium',
                                        isCenter
                                            ? 'text-sm md:text-base'
                                            : 'text-xs',
                                    )}
                                >
                                    {currentStep.content}
                                </p>
                            </div>

                            <div
                                className={cn(
                                    'flex items-center mt-auto pt-2',
                                    isCenter
                                        ? 'flex-col-reverse gap-3 w-full'
                                        : 'justify-between gap-4',
                                )}
                            >
                                {!isCenter && (
                                    <div className="flex gap-1.5 items-center">
                                        {Array.from({ length: totalSteps }).map(
                                            (_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        'h-1.5 rounded-full transition-all duration-300',
                                                        i === currentStepIndex
                                                            ? 'w-4 bg-primary'
                                                            : 'w-1.5 bg-foreground/10',
                                                    )}
                                                />
                                            ),
                                        )}
                                    </div>
                                )}

                                <div
                                    className={cn(
                                        'flex gap-3',
                                        isCenter
                                            ? 'w-full flex-col-reverse'
                                            : '',
                                    )}
                                >
                                    {/* Back / Skip Actions */}
                                    {(currentStepIndex > 0 || isCenter) && (
                                        <Button
                                            variant={
                                                isCenter ? 'outline' : 'ghost'
                                            }
                                            size="sm"
                                            onClick={
                                                isCenter ? endTour : prevStep
                                            }
                                            className={cn(
                                                'rounded-xl font-bold',
                                                isCenter
                                                    ? 'w-full h-11 border-foreground/10 text-muted-foreground hover:text-foreground'
                                                    : 'h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-transparent',
                                            )}
                                        >
                                            {isCenter ? 'Skip Tour' : 'Back'}
                                        </Button>
                                    )}

                                    {/* Next Action */}
                                    <Button
                                        size="sm"
                                        onClick={nextStep}
                                        className={cn(
                                            'rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow transition-all active:scale-95',
                                            isCenter
                                                ? 'w-full h-11 text-base'
                                                : 'h-8 px-4 text-xs ml-auto',
                                        )}
                                    >
                                        {currentStepIndex === totalSteps - 1
                                            ? 'Finish'
                                            : isCenter
                                              ? 'Start Tour'
                                              : 'Next'}
                                        {!isCenter && (
                                            <ChevronRight
                                                size={14}
                                                className="ml-1"
                                            />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
