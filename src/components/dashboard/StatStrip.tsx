import { CountUp } from '@/components/ui/count-up';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type StatItem = {
    label: ReactNode;
    value: ReactNode;
    unit?: ReactNode;
    note?: ReactNode;
};

const COLS: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
};

export function StatStrip({
    items,
    className,
}: {
    items: StatItem[];
    className?: string;
}) {
    return (
        <dl
            className={cn(
                'grid gap-px overflow-hidden rounded-lg border border-border bg-border',
                COLS[items.length] ?? 'grid-cols-2 lg:grid-cols-4',
                className,
            )}
        >
            {items.map((item, i) => (
                <div key={i} className="bg-card px-5 py-4 sm:px-6 sm:py-5">
                    <dt className="truncate text-sm text-muted-foreground">
                        {item.label}
                    </dt>
                    <dd className="mt-1 flex items-baseline gap-1.5">
                        <span className="tabular font-display text-[1.75rem] leading-none sm:text-[2rem]">
                            {typeof item.value === 'string' || typeof item.value === 'number' ? (
                                <CountUp value={item.value} />
                            ) : (
                                item.value
                            )}
                        </span>
                        {item.unit && (
                            <span className="text-sm text-muted-foreground">
                                {item.unit}
                            </span>
                        )}
                    </dd>
                    {item.note && (
                        <p className="mt-1.5 text-sm text-muted-foreground">
                            {item.note}
                        </p>
                    )}
                </div>
            ))}
        </dl>
    );
}
