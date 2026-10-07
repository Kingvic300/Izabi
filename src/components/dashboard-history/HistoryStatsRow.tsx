import type { LucideIcon } from 'lucide-react';
import { StatStrip } from '@/components/dashboard/StatStrip';

type HistoryStat = {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    color?: string;
};

type HistoryStatsRowProps = {
    stats: HistoryStat[];
};

export default function HistoryStatsRow({ stats }: HistoryStatsRowProps) {
    return (
        <StatStrip
            items={stats.map((stat) => ({ label: stat.label, value: stat.value }))}
        />
    );
}
