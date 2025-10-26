"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, BarChart3, Calendar } from "lucide-react"
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
    const [progressData] = useState({
        totalQuizzes: 12,
        averageScore: 82,
        studyStreak: 7,
        totalStudyHours: 24.5,
    })

    const [chartData] = useState([
        { date: "Mon", score: 75, quizzes: 2 },
        { date: "Tue", score: 82, quizzes: 3 },
        { date: "Wed", score: 78, quizzes: 2 },
        { date: "Thu", score: 88, quizzes: 4 },
        { date: "Fri", score: 85, quizzes: 3 },
        { date: "Sat", score: 90, quizzes: 2 },
        { date: "Sun", score: 87, quizzes: 1 },
    ])

    const [subjectData] = useState([
        { subject: "Biology", score: 85, quizzes: 5 },
        { subject: "Chemistry", score: 78, quizzes: 4 },
        { subject: "Physics", score: 88, quizzes: 3 },
        { subject: "Math", score: 82, quizzes: 4 },
        { subject: "History", score: 80, quizzes: 2 },
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Learning Progress</h1>
                <p className="text-muted-foreground">Track your learning journey and see your improvement over time.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.totalQuizzes}</div>
                        <p className="text-xs text-muted-foreground mt-1">Completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.averageScore}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Out of 100</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.studyStreak}</div>
                        <p className="text-xs text-muted-foreground mt-1">Days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{progressData.totalStudyHours}</div>
                        <p className="text-xs text-muted-foreground mt-1">This week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span>Weekly Progress</span>
                    </CardTitle>
                    <CardDescription>Your quiz scores and activity this week</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="score" stroke="#3b82f6" name="Average Score" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Subject Performance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <span>Performance by Subject</span>
                    </CardTitle>
                    <CardDescription>Your scores across different subjects</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="score" fill="#3b82f6" name="Average Score" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>Recent Achievements</span>
                    </CardTitle>
                    <CardDescription>Milestones you've reached</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">7-Day Study Streak</p>
                                <p className="text-sm text-muted-foreground">Studied for 7 consecutive days</p>
                            </div>
                            <span className="text-2xl">🔥</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">Quiz Master</p>
                                <p className="text-sm text-muted-foreground">Completed 10 quizzes</p>
                            </div>
                            <span className="text-2xl">🎯</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">Perfect Score</p>
                                <p className="text-sm text-muted-foreground">Scored 100% on a quiz</p>
                            </div>
                            <span className="text-2xl">⭐</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardProgress
