"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Calendar, Trophy, BookOpen, Target, Clock, Zap } from "lucide-react"
import { api } from "@/lib/apiClient"
import { useEffect, useState, useRef } from "react"
import { PageLoader } from "@/components/PageLoader"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"

const DashboardProgress = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [progressData, setProgressData] = useState({
        totalQuizzes: 0,
        averageScore: 0,
        studyStreak: 0,
        totalStudyHours: 0,
    })
    const [isLoading, setIsLoading] = useState(true)

    const [chartData, setChartData] = useState([])
    const [subjectData, setSubjectData] = useState([])

    useGSAP(() => {
        if (!isLoading) {
            gsap.from(".prog-header", { opacity: 0, y: -20, duration: 0.6 })
            gsap.from(".stat-card", { 
                opacity: 0, 
                scale: 0.9, 
                stagger: 0.1, 
                duration: 0.5, 
                ease: "back.out(1.7)" 
            })
            gsap.from(".chart-card", { 
                opacity: 0, 
                y: 30, 
                stagger: 0.2, 
                duration: 0.8, 
                ease: "power2.out" 
            })
        }
    }, { scope: containerRef, dependencies: [isLoading] })

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await api.getUserStats()
                if (res.success && res.data) {
                    setProgressData({
                        totalQuizzes: res.data.studyStats?.quizzes || 0,
                        averageScore: 0, // Calculate this if backend provides it
                        studyStreak: res.data.studyStreak || 0,
                        totalStudyHours: 0, // Placeholder for now
                    })
                }
            } catch (error) {
                console.error("Failed to fetch user stats:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProgress()
    }, [])

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">Learning Progress</h1>
                <p className="text-muted-foreground">Track your learning journey and see your improvement over time.</p>
                <PageLoader variant="skeleton-cards" itemCount={4} text="Calculating your progress..." />
            </div>
        )
    }

    return (
        <div ref={containerRef} className="space-y-8 w-full pb-12">
            <div className="prog-header flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter mb-2">
                        Your <span className="text-gradient">Performance</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">Real-time analytics of your academic growth.</p>
                </div>
                {progressData.studyStreak > 10 && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl text-emerald-500 font-bold">
                        <Trophy size={18} />
                        <span>Top 5% of class</span>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <BookOpen size={14} className="text-blue-500" />
                            Total Quizzes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{progressData.totalQuizzes}</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Completed Sessions</p>
                    </CardContent>
                </Card>

                <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 blur-2xl group-hover:bg-green-500/20 transition-all" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Target size={14} className="text-green-500" />
                            Average Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-green-400">{progressData.averageScore}%</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Mastery Level</p>
                    </CardContent>
                </Card>

                <Card className="stat-card glass-card group hover-lift relative overflow-hidden border-primary/30">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-2xl group-hover:bg-primary/30 transition-all" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                            <Zap size={14} className="fill-current" />
                            Study Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-gradient">{progressData.studyStreak} Days</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Consistent Growth</p>
                    </CardContent>
                </Card>

                <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                            <Clock size={14} className="text-emerald-500" />
                            Study Hours
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{progressData.totalStudyHours}h</div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Time Invested</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Progress Chart */}
                <Card className="chart-card glass-card border-foreground/10 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-foreground/10 bg-foreground/5">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/20 text-primary">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <span>Growth Trend</span>
                        </CardTitle>
                        <CardDescription>Daily mastery score variation</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--foreground)/0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                                />
                                <Tooltip 
                                    contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', boxShadow: 'var(--shadow-float)'}}
                                    itemStyle={{color: 'hsl(var(--primary))', fontWeight: 'bold'}}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="hsl(var(--primary))" 
                                    strokeWidth={4} 
                                    dot={{r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))'}}
                                    activeDot={{r: 8, strokeWidth: 0}}
                                    name="Score"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card className="chart-card glass-card border-foreground/10 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-foreground/10 bg-foreground/5">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-accent/20 text-accent">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <span>Subject Specialization</span>
                        </CardTitle>
                        <CardDescription>Mastery across different disciplines</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={subjectData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--white)/0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="subject" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                                />
                                <Tooltip 
                                    cursor={{fill: 'hsl(var(--foreground)/0.05)'}}
                                    contentStyle={{backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '16px', boxShadow: 'var(--shadow-float)'}}
                                />
                                <Bar 
                                    dataKey="score" 
                                    fill="hsl(var(--primary))" 
                                    radius={[8, 8, 0, 0]} 
                                    name="Average Score" 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Achievements Section */}
            <Card className="chart-card glass-card border-foreground/10 shadow-2xl overflow-hidden">
                <CardHeader className="border-b border-foreground/10 bg-foreground/5">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-500">
                            <Calendar className="h-5 w-5" />
                        </div>
                        <span>Hall of Fame</span>
                    </CardTitle>
                    <CardDescription>Milestones you've conquered in your quest for knowledge</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
                        {[
                            { 
                                title: "7-Day Study Streak", 
                                desc: "Bulletproof consistency", 
                                icon: "🔥", 
                                color: "text-emerald-500",
                                isUnlocked: progressData.studyStreak >= 7
                            },
                            { 
                                title: "Quiz Master", 
                                desc: "Completed 50 sessions", 
                                icon: "🎯", 
                                color: "text-blue-500",
                                isUnlocked: progressData.totalQuizzes >= 50
                            },
                            { 
                                title: "Perfect Score", 
                                desc: "Absolute subject mastery", 
                                icon: "⭐", 
                                color: "text-blue-400",
                                isUnlocked: false 
                            }
                        ].map((ach, i) => (
                            <div key={i} className={`flex items-center gap-6 p-8 transition-colors group ${ach.isUnlocked ? 'hover:bg-foreground/[0.02]' : 'opacity-30 grayscale'}`}>
                                <span className={`text-5xl ${ach.isUnlocked ? 'group-hover:scale-125' : ''} transition-transform duration-500`}>{ach.icon}</span>
                                <div>
                                    <p className="font-bold text-lg">{ach.title}</p>
                                    <p className="text-sm text-muted-foreground">{ach.isUnlocked ? ach.desc : 'Locked Milestone'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardProgress
