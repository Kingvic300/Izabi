'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, Sparkles, Target, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ExamReviewProps = {
    result: any;
    onBack: () => void;
};

export default function ExamReview({ result, onBack }: ExamReviewProps) {
    if (!result) return null;

    return (
        <div className="w-full space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="mb-4 h-10 px-4 rounded-xl font-bold hover:bg-card/50 gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Lobby
                    </Button>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tighter mb-2 italic">
                        Exam{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                            Review
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium">
                        {result.subject} •{' '}
                        {new Date(result.date).toLocaleDateString()}
                    </p>
                </div>

                <div className="text-center shrink-0">
                    <div
                        className={cn(
                            'w-24 h-24 sm:w-32 sm:h-32 rounded-[20px] sm:rounded-[28px] flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl mb-2',
                            result.score >= 70
                                ? 'bg-blue-500/10 text-blue-500 border-2 border-blue-500/20'
                                : result.score >= 45
                                  ? 'bg-blue-400/10 text-blue-400 border-2 border-blue-400/20'
                                  : 'bg-destructive/10 text-destructive border-2 border-destructive/20',
                        )}
                    >
                        {Math.round(result.score)}
                        <span className="text-lg opacity-60">%</span>
                    </div>
                    <p className="text-sm font-bold opacity-40 uppercase tracking-widest">
                        Final Score
                    </p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 bg-blue-500/5 border-blue-500/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {result.correctAnswers}
                            </p>
                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                                Correct
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-destructive/5 border-destructive/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center text-destructive">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {result.totalQuestions - result.correctAnswers}
                            </p>
                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                                Incorrect
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 bg-primary/5 border-primary/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-2xl font-black">
                                {result.totalQuestions}
                            </p>
                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                                Total Questions
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tighter">
                    Question Breakdown
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                    Detailed review is coming soon. Full question-by-question
                    analysis will be available in the next update.
                </p>

                <Card className="p-8 bg-card/40 border-foreground/5 rounded-2xl">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mx-auto mb-4">
                            <Sparkles
                                size={32}
                                className="text-muted-foreground opacity-30"
                            />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-widest opacity-20 mb-2">
                            Feature In Development
                        </h4>
                        <p className="text-sm opacity-40 max-w-md mx-auto font-medium">
                            Detailed question-by-question review with
                            explanations and learning insights is being built.
                        </p>
                    </div>
                </Card>
            </div>

            <div className="flex gap-4 justify-center pt-8">
                <Button
                    onClick={onBack}
                    className="h-14 px-8 rounded-2xl font-black uppercase tracking-[0.2em] text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                    Back to Lobby
                </Button>
            </div>
        </div>
    );
}
