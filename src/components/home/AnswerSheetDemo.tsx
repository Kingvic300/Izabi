import { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { Bubble } from '@/components/ui/bubble';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

const QUESTIONS = [
    {
        subject: 'Biology',
        prompt: 'Which organelle releases energy from food during respiration?',
        options: ['Ribosome', 'Nucleus', 'Mitochondrion', 'Chloroplast'],
        answer: 2,
        why: 'Mitochondria carry out aerobic respiration and release the energy as ATP.',
    },
    {
        subject: 'Mathematics',
        prompt: 'Simplify 2³ × 2².',
        options: ['2⁵', '2⁶', '4⁵', '4⁶'],
        answer: 0,
        why: 'The base is the same, so add the powers: 3 + 2 = 5.',
    },
    {
        subject: 'English',
        prompt: 'Choose the word opposite in meaning to “scarce”.',
        options: ['Rare', 'Plentiful', 'Costly', 'Small'],
        answer: 1,
        why: 'Scarce means in short supply. Plentiful means more than enough.',
    },
];

export function AnswerSheetDemo() {
    const { t } = useLanguage();
    const [picks, setPicks] = useState<(number | null)[]>(
        QUESTIONS.map(() => null),
    );

    const answered = picks.filter((p) => p !== null).length;
    const score = picks.filter((p, i) => p === QUESTIONS[i].answer).length;
    const finished = answered === QUESTIONS.length;

    const pick = (q: number, option: number) => {
        if (picks[q] !== null) return;
        setPicks((prev) => prev.map((p, i) => (i === q ? option : p)));
    };

    return (
        <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-elevated">
            <div
                className="timing-track absolute bottom-6 left-3 top-[4.25rem] opacity-80"
                aria-hidden
            />

            <div className="flex items-baseline justify-between gap-4 border-b border-sheet/35 py-4 pl-10 pr-5 sm:pl-12 sm:pr-6">
                <h2 className="font-display text-lg sm:text-xl">
                    {t('home.try.title')}
                </h2>
                <p className="tabular text-sm text-muted-foreground">
                    {t('home.try.score')}{' '}
                    <span className="font-bold text-foreground">
                        {score} / {QUESTIONS.length}
                    </span>
                </p>
            </div>

            <ol className="divide-y divide-sheet/25">
                {QUESTIONS.map((q, qi) => {
                    const chosen = picks[qi];
                    const isAnswered = chosen !== null;
                    const isRight = chosen === q.answer;
                    const labelId = `demo-q-${qi}`;

                    return (
                        <li
                            key={q.subject}
                            className="py-5 pl-10 pr-5 sm:py-6 sm:pl-12 sm:pr-6"
                        >
                            <div className="flex gap-3">
                                <span className="tabular w-5 shrink-0 pt-0.5 text-sm font-bold text-sheet">
                                    {qi + 1}.
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground">
                                        {q.subject}
                                    </p>
                                    <p
                                        id={labelId}
                                        className="mt-0.5 font-display text-[1.0625rem] leading-snug sm:text-lg"
                                    >
                                        {q.prompt}
                                    </p>

                                    <div
                                        role="radiogroup"
                                        aria-labelledby={labelId}
                                        className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 min-[420px]:grid-cols-2"
                                    >
                                        {q.options.map((opt, oi) => {
                                            let state:
                                                | 'empty'
                                                | 'filled'
                                                | 'correct'
                                                | 'wrong'
                                                | 'missed' = 'empty';
                                            if (isAnswered) {
                                                if (oi === chosen)
                                                    state = isRight
                                                        ? 'correct'
                                                        : 'wrong';
                                                else if (oi === q.answer)
                                                    state = 'missed';
                                            }
                                            return (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    role="radio"
                                                    aria-checked={chosen === oi}
                                                    aria-disabled={isAnswered}
                                                    onClick={() => pick(qi, oi)}
                                                    className={cn(
                                                        'group -mx-2 flex min-h-11 items-center gap-3 rounded-md px-2 text-left text-[15px] transition-colors',
                                                        !isAnswered &&
                                                            'hover:bg-muted/70',
                                                        isAnswered &&
                                                            state === 'empty' &&
                                                            'text-muted-foreground',
                                                        isAnswered &&
                                                            'cursor-default',
                                                    )}
                                                >
                                                    <Bubble
                                                        label={LETTERS[oi]}
                                                        state={state}
                                                        size="sm"
                                                        className={cn(
                                                            !isAnswered &&
                                                                'group-hover:border-foreground group-hover:text-foreground',
                                                        )}
                                                    />
                                                    <span>{opt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div aria-live="polite">
                                        {isAnswered && (
                                            <p className="mt-3 flex gap-2 text-sm leading-relaxed">
                                                {isRight ? (
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-reward" />
                                                ) : (
                                                    <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                                )}
                                                <span>
                                                    <span className="font-bold">
                                                        {isRight
                                                            ? 'Correct.'
                                                            : `The answer is ${LETTERS[q.answer]}.`}
                                                    </span>{' '}
                                                    <span className="text-muted-foreground">
                                                        {q.why}
                                                    </span>
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-sheet/35 py-3 pl-10 pr-5 sm:pl-12 sm:pr-6">
                <p className="text-sm text-muted-foreground">
                    {finished
                        ? t('home.try.result').replace('{score}', String(score))
                        : t('home.try.note')}
                </p>
                {answered > 0 && (
                    <button
                        type="button"
                        onClick={() => setPicks(QUESTIONS.map(() => null))}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-sm font-bold text-foreground hover:bg-muted"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        {t('home.try.reset')}
                    </button>
                )}
            </div>
        </div>
    );
}
