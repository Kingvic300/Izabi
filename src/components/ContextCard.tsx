import React from 'react';
import { motion } from 'framer-motion';
import { Info, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContextCardProps {
    onSelect: (examType: string) => void;
    onDismiss: () => void;
}

const ContextCard: React.FC<ContextCardProps> = ({ onSelect, onDismiss }) => {
    const examTypes = [
        { id: 'waec', label: 'WAEC' },
        { id: 'jamb', label: 'JAMB' },
        { id: 'university', label: 'University' },
        { id: 'learning', label: 'Just Learning' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 p-6 md:p-8 shadow-lg"
        >
            {/* Dismiss button */}
            <button
                onClick={onDismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-card/10 dark:bg-card/10 hover:bg-card/20 dark:hover:bg-card/20 flex items-center justify-center transition-colors"
                aria-label="Dismiss"
            >
                <X size={16} className="text-foreground/60 dark:text-foreground/60" />
            </button>

            {/* Content */}
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4 pr-8">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <GraduationCap size={24} className="text-primary" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight text-foreground">
                            What are you studying for?
                        </h3>
                        <p className="text-sm font-medium text-foreground/60 dark:text-foreground/70">
                            (Helps us customize your experience)
                        </p>
                    </div>
                </div>

                {/* Options */}
                <div className="flex flex-wrap gap-3">
                    {examTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className="px-6 py-3 rounded-xl bg-card/10 dark:bg-card/10 hover:bg-primary/20 border border-foreground/20 dark:border-foreground/20 hover:border-primary/40 font-bold text-sm text-primary-foreground transition-all hover:scale-105 active:scale-95"
                        >
                            {type.label}
                        </button>
                    ))}
                    <button
                        onClick={onDismiss}
                        className="px-6 py-3 rounded-xl bg-transparent border border-foreground/10 dark:border-foreground/10 hover:border-foreground/30 dark:hover:border-foreground/30 font-bold text-sm text-foreground/50 dark:text-foreground/60 hover:text-foreground dark:hover:text-foreground/80 transition-all"
                    >
                        Skip
                    </button>
                </div>
            </div>

            {/* Decorative element */}
            <div className="absolute bottom-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none">
                <Info size={120} />
            </div>
        </motion.div>
    );
};

export default ContextCard;
