import { Activity, ArrowDownRight, ArrowUpRight, Database, Key, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { AdminStats } from './adminTypes';

type AdminQuickStatsProps = {
    stats: AdminStats;
};

const STAT_CONFIG: Array<{
    key: keyof AdminStats;
    label: string;
    sub: (stats: AdminStats) => string;
    icon: typeof Users;
    color: string;
    trend: 'up' | 'down';
}> = [
    {
        key: 'totalUsers',
        label: 'Fleet Population',
        sub: (stats: AdminStats) => `+${stats.growth}% this month`,
        icon: Users,
        color: 'text-primary',
        trend: 'up',
    },
    {
        key: 'activeNow',
        label: 'Active Neurons',
        sub: () => 'Live connected users',
        icon: Activity,
        color: 'text-primary',
        trend: 'up',
    },
    {
        key: 'totalNotes',
        label: 'Knowledge Base',
        sub: () => 'Student notes indexed',
        icon: Database,
        color: 'text-primary',
        trend: 'up',
    },
    {
        key: 'contributedKeys',
        label: 'AI Fuel Level',
        sub: () => 'Active Groq keys',
        icon: Key,
        color: 'text-primary',
        trend: 'down',
    },
] as const;

export default function AdminQuickStats({ stats }: AdminQuickStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {STAT_CONFIG.map((stat) => {
                const Icon = stat.icon;
                const value = stats[stat.key];
                return (
                    <Card
                        key={stat.key}
                        className="admin-card glass border-foreground/5 shadow-xl hover-lift group overflow-hidden"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-40">
                                {stat.label}
                            </CardTitle>
                            <Icon
                                size={18}
                                className={cn(
                                    stat.color,
                                    'group-hover:scale-110 transition-transform',
                                )}
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">
                                {Number(value).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight
                                        size={14}
                                        className="text-primary"
                                    />
                                ) : (
                                    <ArrowDownRight
                                        size={14}
                                        className="text-destructive"
                                    />
                                )}
                                <p className="text-xs font-medium text-muted-foreground">
                                    {stat.sub(stats)}
                                </p>
                            </div>
                        </CardContent>
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-primary/20" />
                    </Card>
                );
            })}
        </div>
    );
}
