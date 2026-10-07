import React from 'react';
import { Brain, Timer, Upload, Lightbulb, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface IntentCard {
    id: string;
    icon: React.ElementType;
    label: string;
    description: string;
    badge?: string;
    color: string;
    onClick: () => void;
}

interface IntentCardsProps {
    onPracticeSkills: () => void;
    onQuickTest: () => void;
    onLearnTricks: () => void;
    onUploadDocument: () => void;
}

const IntentCards: React.FC<IntentCardsProps> = ({
    onPracticeSkills,
    onQuickTest,
    onLearnTricks,
    onUploadDocument,
}) => {
    const { t } = useLanguage();
    const cards: IntentCard[] = [
        {
            id: 'practice',
            icon: Brain,
            label: t('intent.practice_label'),
            description: t('intent.practice_desc'),
            color: 'bg-primary/20 border-primary/50',
            onClick: onPracticeSkills,
        },
        {
            id: 'test',
            icon: Timer,
            label: t('intent.test_label'),
            description: t('intent.test_desc'),
            badge: t('intent.test_badge'),
            color: 'bg-accent/20 border-accent/50',
            onClick: onQuickTest,
        },
        {
            id: 'tricks',
            icon: Lightbulb,
            label: t('intent.tricks_label'),
            description: t('intent.tricks_desc'),
            color: 'bg-primary/15 border-primary/40',
            onClick: onLearnTricks,
        },
        {
            id: 'upload',
            icon: Upload,
            label: t('intent.upload_label'),
            description: t('intent.upload_desc'),
            color: 'bg-accent/15 border-accent/40',
            onClick: onUploadDocument,
        },
    ];

    return (
        <ul className="divide-y divide-border">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <li key={card.id}>
                        <button
                            id={`intent-card-${card.id}`}
                            onClick={card.onClick}
                            className="group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/60 sm:px-5"
                        >
                            <Icon className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                            <span className="min-w-0 flex-1">
                                <span className="flex items-baseline gap-2 font-bold">
                                    {card.label}
                                    {card.badge && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            {card.badge}
                                        </span>
                                    )}
                                </span>
                                <span className="block text-sm text-muted-foreground">
                                    {card.description}
                                </span>
                            </span>
                            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default IntentCards;
