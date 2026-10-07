'use client';

import { Button } from '@/components/ui/button';
import { Layers, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ResultPanel } from './ResultPanel';
import { useFlashcards } from '@/hooks/useFlashcards';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FlashcardsSectionProps {
    flashcards: Array<{ front: string; back: string }>;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export const FlashcardsSection = ({ flashcards, isOpen, onOpenChange }: FlashcardsSectionProps) => {
    const { t } = useLanguage();
    const {
        currentCardIndex,
        isFlipped,
        nextCard,
        prevCard,
        resetCards,
        flipCard,
    } = useFlashcards(flashcards.length);

    const card = flashcards[currentCardIndex];

    return (
        <ResultPanel
            id="flashcards-result-section"
            title={t('flashcards.title')}
            meta={`${flashcards.length} ${t('flashcards.cards_suffix')}`}
            icon={Layers}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <div className="flex flex-col items-center gap-6">
                <button
                    type="button"
                    className="perspective-1000 relative h-[240px] w-full max-w-md cursor-pointer touch-manipulation rounded-lg text-left sm:h-64"
                    onClick={flipCard}
                    aria-label={isFlipped ? 'Show the front of the card' : 'Show the back of the card'}
                >
                    <div
                        className={cn(
                            'preserve-3d relative h-full w-full transition-transform duration-500 motion-reduce:transition-none',
                            isFlipped && 'rotate-y-180',
                        )}
                    >
                        <div className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-elevated">
                            <div className="flex items-center justify-between border-b border-sheet/40 px-4 py-2 text-sm text-muted-foreground">
                                {t('flashcards.front')}
                                <span className="tabular">
                                    {currentCardIndex + 1} / {flashcards.length}
                                </span>
                            </div>
                            <p className="flex flex-1 items-center justify-center whitespace-pre-wrap break-words p-6 text-center font-display text-xl leading-snug sm:text-2xl">
                                {card?.front}
                            </p>
                        </div>
                        <div className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-foreground/30 bg-muted shadow-elevated">
                            <div className="flex items-center justify-between border-b border-sheet/40 px-4 py-2 text-sm text-muted-foreground">
                                {t('flashcards.back')}
                                <span className="tabular">
                                    {currentCardIndex + 1} / {flashcards.length}
                                </span>
                            </div>
                            <p className="flex flex-1 items-center justify-center whitespace-pre-wrap break-words p-6 text-center text-base leading-relaxed sm:text-lg">
                                {card?.back}
                            </p>
                        </div>
                    </div>
                </button>
                <p className="text-sm text-muted-foreground">
                    {t('flashcards.tap_to_flip')}
                </p>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevCard}
                        aria-label={t('flashcards.prev')}
                    >
                        <ChevronLeft />
                    </Button>
                    <span className="tabular min-w-[4rem] text-center font-bold">
                        {currentCardIndex + 1} / {flashcards.length}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextCard}
                        aria-label={t('flashcards.next')}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 text-muted-foreground"
                        onClick={resetCards}
                    >
                        <RotateCcw />
                        {t('flashcards.reset')}
                    </Button>
                </div>
            </div>
        </ResultPanel>
    );
};
