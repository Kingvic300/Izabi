'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankTrendProps {
    change?: number;
}

export const RankTrend = ({ change }: RankTrendProps) => {
    if (!change || change === 0) return null;
    const isPositive = change > 0;
    return (
        <div
            className={cn(
                'tabular flex items-center gap-0.5 text-[11px] font-bold',
                isPositive ? 'text-reward' : 'text-destructive',
            )}
        >
            {isPositive ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            {Math.abs(change)}
        </div>
    );
};