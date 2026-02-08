import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, BookOpen, Upload, Clock, Target, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    onUploadDocument
}) => {
    const cards: IntentCard[] = [
        {
            id: 'practice',
            icon: Brain,
            label: 'Practice Skills',
            description: 'Build critical thinking',
            color: 'from-primary/40 to-primary/30 border-primary/50',
            onClick: onPracticeSkills
        },
        {
            id: 'test',
            icon: Zap,
            label: 'Quick Test',
            description: 'Timed challenge',
            badge: '5 min',
            color: 'from-accent/40 to-accent/30 border-accent/50',
            onClick: onQuickTest
        },
        {
            id: 'tricks',
            icon: Lightbulb,
            label: 'Study Tricks',
            description: 'Learn smarter',
            color: 'from-primary/35 to-accent/25 border-primary/40',
            onClick: onLearnTricks
        },
        {
            id: 'upload',
            icon: Upload,
            label: 'Help w/ Notes',
            description: 'Upload document',
            color: 'from-accent/35 to-primary/25 border-accent/40',
            onClick: onUploadDocument
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-0">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    What do you want to do?
                </h2>
                <Target size={24} className="text-primary opacity-30" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <motion.button
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={card.onClick}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-300",
                                "border-2 bg-gradient-to-br hover:scale-[1.02] active:scale-[0.98]",
                                "shadow-lg hover:shadow-2xl backdrop-blur-sm",
                                card.color
                            )}
                        >
                            {/* Icon */}
                            <div className="mb-4 relative">
                                <div className="w-14 h-14 rounded-2xl bg-primary/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/20">
                                    <Icon size={28} className="text-primary" />
                                </div>
                                {card.badge && (
                                    <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-sm text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/30">
                                        {card.badge}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="space-y-1">
                                <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">
                                    {card.label}
                                </h3>
                                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                                    {card.description}
                                </p>
                            </div>

                            {/* Hover gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default IntentCards;
