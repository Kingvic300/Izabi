import { AnimatePresence, motion } from 'framer-motion';
import { Brain, X, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AIMarkdown } from '@/components/ui/ai-markdown';
import {
    getSummaryText,
    parseStructuredSummary,
} from '@/lib/summaryUtils';
import { StructuredSummaryContent } from '@/components/dashboard-home/StructuredSummaryContent';

type HistoryDetailModalProps = {
    item: any | null;
    onClose: () => void;
    onContinue: () => void;
};

export default function HistoryDetailModal({
    item,
    onClose,
    onContinue,
}: HistoryDetailModalProps) {
    return (
        <AnimatePresence>
            {item && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-card glass border border-foreground/10 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[24px] sm:rounded-[40px] shadow-2xl relative z-10 flex flex-col"
                    >
                        <div className="p-4 sm:p-8 border-b border-foreground/5 flex justify-between items-start sm:items-center gap-3 sm:gap-4 bg-primary/5">
                            <div className="min-w-0">
                                <Badge className="mb-2 bg-primary text-primary-foreground font-black uppercase tracking-tighter">
                                    {item.hType}
                                </Badge>
                                <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight break-words pr-2">
                                    {item.fileName ||
                                        item.title ||
                                        item.subject ||
                                        'Detailed View'}
                                </h2>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={onClose}
                                className="rounded-2xl hover:bg-foreground/5"
                            >
                                <X size={24} />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
                            <div className="space-y-8">
                                {item.hType === 'generation' && (
                                    <div className="space-y-6">
                                        <div className="bg-primary/5 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] border border-primary/10">
                                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary mb-3">
                                                <Brain size={14} /> AI Summary
                                            </h4>
                                            {(() => {
                                                const structured =
                                                    parseStructuredSummary(
                                                        item.summary,
                                                    );
                                                if (structured) {
                                                    return (
                                                        <StructuredSummaryContent
                                                            summary={structured}
                                                            showQuiz={false}
                                                            className="text-base sm:text-lg"
                                                        />
                                                    );
                                                }
                                                return (
                                                    <AIMarkdown
                                                        content={getSummaryText(
                                                            item.summary,
                                                        )}
                                                        className="text-base sm:text-lg"
                                                    />
                                                );
                                            })()}
                                        </div>

                                        {item.keyPoints?.length > 0 && (
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black uppercase tracking-widest opacity-40">
                                                    Key Insights
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                    {item.keyPoints.map(
                                                        (
                                                            p: string,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={i}
                                                                className="p-4 bg-card/50 border border-foreground/5 rounded-2xl flex gap-3 italic"
                                                            >
                                                                <Zap
                                                                    size={16}
                                                                    className="text-yellow-500 shrink-0 mt-1"
                                                                />
                                                                <p className="text-sm font-medium">
                                                                    {p}
                                                                </p>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {item.hType === 'note' && (
                                    <div className="prose prose-invert max-w-none">
                                        <div className="p-4 sm:p-8 bg-card/50 border border-foreground/5 rounded-[24px] sm:rounded-[32px]">
                                            <p className="whitespace-pre-wrap text-lg leading-relaxed font-medium">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {item.hType === 'quiz' && (
                                    <div className="space-y-6 text-center py-10">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20 shadow-glow mb-4">
                                            <span className="text-3xl sm:text-4xl font-black text-primary">
                                                {Math.round(item.score)}%
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold">
                                                Quiz Performance
                                            </h3>
                                            <p className="text-muted-foreground mt-2">
                                                You got {item.correctAnswers}{' '}
                                                out of {item.totalQuestions}{' '}
                                                questions right.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                                            <div className="px-4 sm:px-6 py-3 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-500 font-bold text-sm sm:text-base">
                                                {item.correctAnswers} Correct
                                            </div>
                                            <div className="px-4 sm:px-6 py-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-500 font-bold text-sm sm:text-base">
                                                {item.totalQuestions -
                                                    item.correctAnswers}{' '}
                                                Wrong
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {item.hType === 'chat' && (
                                    <div className="space-y-6">
                                        <div className="p-6 bg-card/50 border border-foreground/5 rounded-2xl italic">
                                            <p className="text-muted-foreground text-sm font-bold uppercase mb-2">
                                                You asked:
                                            </p>
                                            <p className="text-xl font-medium">
                                                "{item.message}"
                                            </p>
                                        </div>
                                        <div className="p-4 sm:p-6 bg-primary/5 border border-primary/10 rounded-[24px] sm:rounded-[32px]">
                                            <p className="text-primary text-sm font-bold uppercase mb-2">
                                                Izabi AI replied:
                                            </p>
                                            <AIMarkdown
                                                content={item.response}
                                                className="text-base sm:text-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        <div className="p-4 sm:p-6 border-t border-foreground/5 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-card/50">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="rounded-xl font-bold w-full sm:w-auto"
                            >
                                Close View
                            </Button>
                            <Button
                                className="rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 w-full sm:w-auto"
                                onClick={onContinue}
                            >
                                Continue Learning
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
