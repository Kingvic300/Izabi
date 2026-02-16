import { useState } from 'react';

export const useFlashcards = (totalCards: number) => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const nextCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev < totalCards - 1 ? prev + 1 : 0));
    };

    const prevCard = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : totalCards - 1));
    };

    const resetCards = () => {
        setCurrentCardIndex(0);
        setIsFlipped(false);
    };

    const flipCard = () => setIsFlipped(!isFlipped);

    return {
        currentCardIndex,
        isFlipped,
        nextCard,
        prevCard,
        resetCards,
        flipCard,
    };
};