import { Activity, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { formatTimeAgo, getActivityIcon, getActivityText } from './adminUtils';

type AdminOverviewTabProps = {
    chartData: any[];
    recentActivities: any[];
    onViewUser: (userId: string) => void;
};

export default function AdminOverviewTab({
    chartData,
    recentActivities,
    onViewUser,
}: AdminOverviewTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-8 glass border-foreground/5 p-3 sm:p-4 md:p-8 rounded-2xl shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4">
                        <div>
                            <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                                System Utilization
                            </h3>
                            <p className="text-muted-foreground font-medium">
                                Network activity over the last 7 cycles
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge className="bg-primary/20 text-primary border-none">
                                Live Monitoring
                            </Badge>
                        </div>
                    </div>
                    <div className="h-[260px] sm:h-[300px] md:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient
                                        id="colorUsers"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-muted"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="date"
                                    className="text-xs font-medium"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    className="text-xs font-medium"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            'rgba(20, 20, 20, 0.9)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        boxShadow:
                                            '0 4px 12px rgba(0, 0, 0, 0.5)',
                                    }}
                                    labelStyle={{ color: '#aaa' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#8b5cf6"
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                    strokeWidth={3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="lg:col-span-4 space-y-6">
                    <Card className="glass border-foreground/5 p-4 md:p-8 rounded-2xl shadow-2xl h-full flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="text-primary" size={20} />
                            Live Activity Stream
                        </h3>
                        <ScrollArea className="flex-1 pr-4 -mr-4 h-[280px] sm:h-[340px] md:h-[400px]">
                            <div className="space-y-6">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 group cursor-pointer hover:bg-card/5 p-2 rounded-lg transition-all"
                                            onClick={() =>
                                                item.user &&
                                                onViewUser(
                                                    item.user._id || item.user,
                                                )
                                            }
                                        >
                                            <div className="flex gap-4 items-start">
                                                <div className="w-10 h-10 rounded-2xl bg-card/5 flex items-center justify-center font-bold text-xs group-hover:bg-primary/20 transition-all shrink-0">
                                                    {getActivityIcon(item.type)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">
                                                        {item.user?.firstName
                                                            ? `${item.user.firstName} ${item.user.lastName}`
                                                            : item.user?._id ||
                                                              'Unknown'}
                                                    </p>
                                                    <p className="text-[11px] font-medium opacity-60 line-clamp-1">
                                                        {getActivityText(item)}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold opacity-30 italic whitespace-nowrap ml-2 sm:ml-0">
                                                {formatTimeAgo(item.date)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center opacity-40 py-10">
                                        <Activity className="mb-2" size={32} />
                                        <p className="text-xs uppercase font-bold tracking-widest">
                                            No Recent Signals
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </Card>
                </div>
            </div>
        </div>
    );
}
