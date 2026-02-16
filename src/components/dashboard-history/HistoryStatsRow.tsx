import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type HistoryStat = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
};

type HistoryStatsRowProps = {
    stats: HistoryStat[];
};

export default function HistoryStatsRow({ stats }: HistoryStatsRowProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <Card
                    key={index}
                    className="glass border-foreground/5 overflow-hidden group"
                >
                    <CardContent className="p-4 flex items-center gap-4">
                        <div
                            className={cn(
                                'w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform',
                                stat.color,
                            )}
                        >
                            <stat.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
                                {stat.label}
                            </p>
                            <p className="text-xl font-bold">
                                {stat.value}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
