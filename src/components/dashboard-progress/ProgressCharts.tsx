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
import type { ChartPoint, SubjectPoint } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type ProgressChartsProps = {
    chartData: ChartPoint[];
    subjectData: SubjectPoint[];
};

const axisTick = { fill: 'hsl(var(--muted-foreground))', fontSize: 12 };
const tooltipStyle = {
    backgroundColor: 'hsl(var(--popover))',
    border: '1px solid hsl(var(--border))',
    borderRadius: 8,
    boxShadow: 'var(--shadow-float)',
    color: 'hsl(var(--popover-foreground))',
    fontSize: 13,
};
const tooltipLabel = { color: 'hsl(var(--muted-foreground))', marginBottom: 2 };
const tooltipItem = { color: 'hsl(var(--foreground))', fontWeight: 700 };

function ChartFrame({
    title,
    description,
    empty,
    children,
}: {
    title: string;
    description: string;
    empty: boolean;
    children: React.ReactNode;
}) {
    return (
        <figure className="rounded-lg border border-border bg-card">
            <figcaption className="border-b border-border px-5 py-4 sm:px-6">
                <span className="block font-display text-lg">{title}</span>
                <span className="block text-sm text-muted-foreground">
                    {description}
                </span>
            </figcaption>
            <div className="px-2 pb-4 pt-6 sm:px-4">
                {empty ? (
                    <p className="flex h-[260px] items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        Finish a quiz to see this chart.
                    </p>
                ) : (
                    children
                )}
            </div>
        </figure>
    );
}

export default function ProgressCharts({
    chartData,
    subjectData,
}: ProgressChartsProps) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartFrame
                title={t('progress.growth_trend')}
                description={t('progress.growth_trend_desc')}
                empty={chartData.length === 0}
            >
                <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                        data={chartData}
                        margin={{ top: 8, right: 16, bottom: 0, left: -8 }}
                    >
                        <CartesianGrid
                            stroke="hsl(var(--border))"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={axisTick}
                            tickMargin={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={axisTick}
                            width={40}
                        />
                        <Tooltip
                            cursor={{
                                stroke: 'hsl(var(--muted-foreground))',
                                strokeDasharray: '3 3',
                            }}
                            contentStyle={tooltipStyle}
                            labelStyle={tooltipLabel}
                            itemStyle={tooltipItem}
                        />
                        <Line
                            type="monotone"
                            dataKey="score"
                            stroke="hsl(var(--foreground))"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: 'hsl(var(--foreground))',
                                strokeWidth: 2,
                                stroke: 'hsl(var(--card))',
                            }}
                            activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                stroke: 'hsl(var(--card))',
                            }}
                            name={t('quiz.score_label')}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartFrame>

            <ChartFrame
                title={t('progress.subject_specialization')}
                description={t('progress.subject_specialization_desc')}
                empty={subjectData.length === 0}
            >
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                        data={subjectData}
                        margin={{ top: 8, right: 16, bottom: 0, left: -8 }}
                        barCategoryGap="30%"
                    >
                        <CartesianGrid
                            stroke="hsl(var(--border))"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="subject"
                            axisLine={false}
                            tickLine={false}
                            tick={axisTick}
                            tickMargin={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={axisTick}
                            width={40}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={tooltipStyle}
                            labelStyle={tooltipLabel}
                            itemStyle={tooltipItem}
                        />
                        <Bar
                            dataKey="score"
                            fill="hsl(var(--foreground))"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={36}
                            name={t('progress.average_score')}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </ChartFrame>
        </div>
    );
}
