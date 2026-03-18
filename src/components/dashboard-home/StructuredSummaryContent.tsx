'use client';

import { StructuredSummary } from '@/lib/summaryUtils';
import { cn } from '@/lib/utils';

interface StructuredSummaryContentProps {
    summary: StructuredSummary;
    className?: string;
    showQuiz?: boolean;
}

export const StructuredSummaryContent = ({
    summary,
    className,
    showQuiz = true,
}: StructuredSummaryContentProps) => {
    return (
        <div className={cn('space-y-6 text-sm md:text-base', className)}>
            <section className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                    Summary
                </h4>
                <p className="text-foreground/90 leading-relaxed">
                    {summary.summary || 'No summary provided.'}
                </p>
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                    Key Concepts
                </h4>
                {summary.keyConcepts?.length ? (
                    <div className="flex flex-wrap gap-2">
                        {summary.keyConcepts.map((concept, index) => (
                            <span
                                key={`${concept}-${index}`}
                                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                            >
                                {concept}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">
                        No key concepts extracted.
                    </p>
                )}
            </section>

            <section className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                    Definitions
                </h4>
                {summary.definitions?.length ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {summary.definitions.map((item, index) => (
                            <div
                                key={`${item.term}-${index}`}
                                className="rounded-2xl border border-foreground/10 bg-background/60 p-4"
                            >
                                <p className="text-sm font-bold text-primary">
                                    {item.term}
                                </p>
                                <p className="text-sm text-foreground/80 mt-1">
                                    {item.definition}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-sm">
                        No definitions extracted.
                    </p>
                )}
            </section>

            <section className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                    Simplified Explanation
                </h4>
                <p className="text-foreground/90 leading-relaxed">
                    {summary.simplifiedExplanation ||
                        'No simplified explanation provided.'}
                </p>
            </section>

            {showQuiz && (
                <section className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                        Quick Quiz
                    </h4>
                    {summary.quiz?.length ? (
                        <div className="space-y-4">
                            {summary.quiz.map((question, index) => (
                                <div
                                    key={`${question.question}-${index}`}
                                    className="rounded-2xl border border-foreground/10 bg-card/40 p-4"
                                >
                                    <p className="text-sm font-semibold">
                                        {index + 1}. {question.question}
                                    </p>
                                    {question.type === 'multiple_choice' &&
                                        question.options?.length && (
                                            <div className="mt-2 grid gap-2 text-sm text-foreground/80">
                                                {question.options.map(
                                                    (option, optIdx) => (
                                                        <div
                                                            key={`${option}-${optIdx}`}
                                                            className="flex gap-2"
                                                        >
                                                            <span className="font-semibold text-primary">
                                                                {String.fromCharCode(
                                                                    65 + optIdx,
                                                                )}
                                                                .
                                                            </span>
                                                            <span>{option}</span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        Answer
                                    </p>
                                    <p className="text-sm text-foreground/90">
                                        {question.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">
                            No quiz questions generated.
                        </p>
                    )}
                </section>
            )}
        </div>
    );
};
