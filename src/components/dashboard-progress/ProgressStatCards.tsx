import { BookOpen, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProgressData } from './progressTypes';

type ProgressStatCardsProps = {
    progressData: ProgressData;
};

export default function ProgressStatCards({
    progressData,
}: ProgressStatCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <BookOpen size={14} className="text-primary" />
                        Total Quizzes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {progressData.totalQuizzes}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Completed Sessions
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Target size={14} className="text-blue-500" />
                        Average Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-blue-400">
                        {progressData.averageScore}%
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Mastery Level
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden border-primary/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                        <Zap size={14} className="fill-current" />
                        Study Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gradient">
                        {progressData.studyStreak} Days
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Consistent Growth
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        Study Hours
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {progressData.totalStudyHours}h
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Time Invested
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
