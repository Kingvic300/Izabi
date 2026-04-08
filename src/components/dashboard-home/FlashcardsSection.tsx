'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Layers, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useFlashcards } from '@/hooks/useFlashcards';
import { cn } from '@/lib/utils';

interface FlashcardsSectionProps {
    flashcards: Array<{ front: string; back: string }>;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const FlashcardsSection = ({ flashcards, isOpen, onOpenChange }: FlashcardsSectionProps) => {
    const {
        currentCardIndex,
        isFlipped,
        nextCard,
        prevCard,
        resetCards,
        flipCard,
    } = useFlashcards(flashcards.length);

    return (
        <div id="flashcards-result-section">
            <Collapsible open={isOpen} onOpenChange={onOpenChange}>
                <Card className="relative glass border-foreground/5 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl bg-gradient-to-br from-card/70 via-card/40 to-background/90">
                    <CollapsibleTrigger asChild>
                        <button className="w-full text-left p-4 sm:p-6 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                            <div className="min-w-0 flex items-center gap-4 sm:gap-5">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Layers className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight break-words">
                                            Flashcards
                                        </h3>
                                        <div className="px-2.5 py-1 rounded-full bg-foreground/5 text-[9px] font-black uppercase tracking-[0.18em] opacity-60">
                                            {flashcards.length} cards
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-40">
                                        Tap to flip and master quick facts
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.18em]">
                                    Active
                                </div>
                                <div className="w-10 h-10 rounded-3xl glass flex items-center justify-center group-hover:bg-card/5 transition-all">
                                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center space-y-5 sm:space-y-8">
                            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-card/5 border border-foreground/5 px-4 py-3">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                                    Flip to reveal answers
                                </div>
                                <div className="text-xs font-bold">
                                    {currentCardIndex + 1} / {flashcards.length} cards
                                </div>
                            </div>
                            
                            <div
                                className="relative w-full max-w-sm sm:max-w-md h-[240px] sm:h-64 cursor-pointer perspective-1000 touch-manipulation"
                                onClick={flipCard}
                            >
                                <div
                                    className={cn(
                                        'relative w-full h-full transition-all duration-500 preserve-3d',
                                        isFlipped && 'rotate-y-180'
                                    )}
                                >
                                    <div className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-5 sm:p-8 rounded-3xl glass bg-card/[0.02] border-2 border-primary/20 shadow-xl overflow-hidden">
                                        <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-30">
                                            Front
                                        </div>
                                        <p className="text-base sm:text-lg md:text-xl font-bold text-center text-foreground break-words leading-normal whitespace-pre-wrap">
                                            {flashcards[currentCardIndex]?.front}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex items-center justify-center p-5 sm:p-8 rounded-3xl glass bg-primary/10 border-2 border-primary/40 shadow-xl overflow-hidden">
                                        <div className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest opacity-30 text-primary">
                                            Back
                                        </div>
                                        <p className="text-sm sm:text-base md:text-lg font-bold text-center text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
                                            {flashcards[currentCardIndex]?.back}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6">
                                <Button
                                    variant="outline"
                                    className="h-10 sm:h-12 px-4 sm:px-0 sm:w-12 rounded-3xl glass hover:bg-card/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevCard();
                                    }}
                                >
                                    <ChevronDown className="rotate-90" />
                                    <span className="ml-1 text-[10px] font-bold uppercase tracking-widest sm:hidden">
                                        Prev
                                    </span>
                                </Button>
                                <span className="text-sm sm:text-lg font-bold tracking-tighter whitespace-nowrap">
                                    {currentCardIndex + 1} / {flashcards.length}
                                </span>
                                <Button
                                    variant="outline"
                                    className="h-10 sm:h-12 px-4 sm:px-0 sm:w-12 rounded-3xl glass hover:bg-card/10"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextCard();
                                    }}
                                >
                                    <ChevronDown className="-rotate-90" />
                                    <span className="ml-1 text-[10px] font-bold uppercase tracking-widest sm:hidden">
                                        Next
                                    </span>
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                className="w-full sm:w-auto text-[10px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity gap-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetCards();
                                }}
                            >
                                <RotateCcw size={14} />
                                Reset Flashcards
                            </Button>
                        </div>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        </div>
    );
};