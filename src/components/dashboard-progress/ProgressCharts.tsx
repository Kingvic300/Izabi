import { BarChart3, TrendingUp } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartPoint, SubjectPoint } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type ProgressChartsProps = {
    chartData: ChartPoint[];
    subjectData: SubjectPoint[];
};

export default function ProgressCharts({
    chartData,
    subjectData,
}: ProgressChartsProps) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="chart-card glass-card border-foreground/10 shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-foreground/10 bg-card/5">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/20 text-primary">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <span>{t('progress.growth_trend')}</span>
                    </CardTitle>
                    <CardDescription>
                        {t('progress.growth_trend_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 5,
                                right: 20,
                                bottom: 5,
                                left: 0,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--foreground)/0.05)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'hsl(var(--muted-foreground))',
                                    fontSize: 12,
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'hsl(var(--muted-foreground))',
                                    fontSize: 12,
                                }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '16px',
                                    boxShadow: 'var(--shadow-float)',
                                }}
                                itemStyle={{
                                    color: 'hsl(var(--primary))',
                                    fontWeight: 'bold',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="hsl(var(--primary))"
                                strokeWidth={4}
                                dot={{
                                    r: 6,
                                    fill: 'hsl(var(--primary))',
                                    strokeWidth: 2,
                                    stroke: 'hsl(var(--background))',
                                }}
                                activeDot={{ r: 8, strokeWidth: 0 }}
                                name={t('quiz.score_label')}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="chart-card glass-card border-foreground/10 shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-foreground/10 bg-card/5">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-accent/20 text-accent">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <span>{t('progress.subject_specialization')}</span>
                    </CardTitle>
                    <CardDescription>
                        {t('progress.subject_specialization_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="hsl(var(--foreground)/0.05)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="subject"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'hsl(var(--muted-foreground))',
                                    fontSize: 12,
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fill: 'hsl(var(--muted-foreground))',
                                    fontSize: 12,
                                }}
                            />
                            <Tooltip
                                cursor={{
                                    fill: 'hsl(var(--foreground)/0.05)',
                                }}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '16px',
                                    boxShadow: 'var(--shadow-float)',
                                }}
                            />
                            <Bar
                                dataKey="score"
                                fill="hsl(var(--primary))"
                                radius={[8, 8, 0, 0]}
                                name={t('progress.average_score')}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
