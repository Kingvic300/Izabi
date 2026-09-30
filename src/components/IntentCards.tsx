import React from 'react';
import { Brain, Zap, Upload, Lightbulb } from 'lucide-react';
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
            icon: Zap,
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
        <div className="grid grid-cols-2 gap-2">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <button
                        key={card.id}
                        id={`intent-card-${card.id}`}
                        onClick={card.onClick}
                        className="flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                    >
                        <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium flex items-center gap-2">
                                {card.label}
                                {card.badge && (
                                    <span className="text-[11px] font-normal text-muted-foreground">
                                        {card.badge}
                                    </span>
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {card.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default IntentCards;
