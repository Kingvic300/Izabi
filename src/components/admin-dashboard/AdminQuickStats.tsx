import type { AdminStats } from './adminTypes';
import { StatStrip } from '@/components/dashboard/StatStrip';

type AdminQuickStatsProps = {
    stats: AdminStats;
};

export default function AdminQuickStats({ stats }: AdminQuickStatsProps) {
    return (
        <StatStrip
            items={[
                {
                    label: 'Users',
                    value: Number(stats.totalUsers).toLocaleString(),
                    note: `+${stats.growth}% this month`,
                },
                {
                    label: 'Active now',
                    value: Number(stats.activeNow).toLocaleString(),
                    note: 'Connected right now',
                },
                {
                    label: 'Notes',
                    value: Number(stats.totalNotes).toLocaleString(),
                    note: 'Saved by students',
                },
            ]}
        />
    );
}
