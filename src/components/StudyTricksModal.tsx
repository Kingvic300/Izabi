import React from 'react';
import { motion } from 'framer-motion';
import {
    X,
    Lightbulb,
    Brain,
    Clock,
    Target,
    Zap,
    BookOpen,
    Coffee,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudyTricksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const studyTricks = [
    {
        id: 1,
        icon: Brain,
        title: 'Active Recall',
        description:
            'Test yourself frequently instead of re-reading. Close your notes and try to explain the concept from memory.',
        color: 'from-blue-500/20 to-blue-600/10',
        iconColor: 'text-blue-500',
    },
    {
        id: 2,
        icon: Clock,
        title: 'Pomodoro Technique',
        description:
            'Study for 25 minutes, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break.',
        color: 'from-red-500/20 to-red-600/10',
        iconColor: 'text-red-500',
    },
    {
        id: 3,
        icon: Target,
        title: 'Spaced Repetition',
        description:
            'Review material at increasing intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month. This fights the forgetting curve.',
        color: 'from-green-500/20 to-green-600/10',
        iconColor: 'text-green-500',
    },
    {
        id: 4,
        icon: Lightbulb,
        title: 'Feynman Technique',
        description:
            'Explain the concept in simple terms as if teaching a child. Identify gaps in your understanding and review them.',
        color: 'from-yellow-500/20 to-yellow-600/10',
        iconColor: 'text-yellow-500',
    },
    {
        id: 5,
        icon: Zap,
        title: 'Interleaving',
        description:
            'Mix different subjects or topics in one study session instead of focusing on just one. This improves retention.',
        color: 'from-purple-500/20 to-purple-600/10',
        iconColor: 'text-purple-500',
    },
    {
        id: 6,
        icon: BookOpen,
        title: 'SQ3R Method',
        description:
            'Survey, Question, Read, Recite, Review. A systematic approach to reading and understanding textbooks.',
        color: 'from-indigo-500/20 to-indigo-600/10',
        iconColor: 'text-indigo-500',
    },
    {
        id: 7,
        icon: Coffee,
        title: 'Mind Palace',
        description:
            'Associate information with specific locations in a familiar place. Walk through mentally to recall information.',
        color: 'from-orange-500/20 to-orange-600/10',
        iconColor: 'text-orange-500',
    },
    {
        id: 8,
        icon: Brain,
        title: 'Elaborative Interrogation',
        description:
            'Ask yourself "why" and "how" questions about the material. Connect new information to what you already know.',
        color: 'from-pink-500/20 to-pink-600/10',
        iconColor: 'text-pink-500',
    },
];

const StudyTricksModal: React.FC<StudyTricksModalProps> = ({
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-card/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-[32px] shadow-2xl border border-primary/20"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-foreground/10 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <Lightbulb size={24} className="text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Study Tricks
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Evidence-based techniques to supercharge
                                    your learning
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-card/10 flex items-center justify-center transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {studyTricks.map((trick, index) => {
                            const Icon = trick.icon;
                            return (
                                <motion.div
                                    key={trick.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`p-6 rounded-2xl bg-gradient-to-br ${trick.color} border border-foreground/10 hover:border-foreground/20 transition-all group`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`w-12 h-12 rounded-xl bg-background/50 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${trick.iconColor}`}
                                        >
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold mb-2">
                                                {trick.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {trick.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Footer Tip */}
                    <div className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-3">
                            <Zap
                                size={20}
                                className="text-primary flex-shrink-0 mt-1"
                            />
                            <div>
                                <h4 className="font-bold text-primary mb-1">
                                    Pro Tip
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Combine multiple techniques for maximum
                                    effectiveness! For example, use Pomodoro for
                                    time management, Active Recall during study
                                    sessions, and Spaced Repetition to schedule
                                    your reviews.
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full h-12 rounded-2xl font-bold mt-6"
                    >
                        Got it, let's study!
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default StudyTricksModal;
