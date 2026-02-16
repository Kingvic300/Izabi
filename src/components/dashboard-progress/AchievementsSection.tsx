import { Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProgressData } from './progressTypes';

type AchievementsSectionProps = {
    progressData: ProgressData;
};

const achievements = [
    {
        title: '7-Day Study Streak',
        desc: 'Bulletproof consistency',
        icon: '🔥',
        color: 'text-primary',
        isUnlocked: (data: ProgressData) => data.studyStreak >= 7,
    },
    {
        title: 'Quiz Master',
        desc: 'Completed 50 sessions',
        icon: '🎯',
        color: 'text-primary',
        isUnlocked: (data: ProgressData) => data.totalQuizzes >= 50,
    },
    {
        title: 'Perfect Score',
        desc: 'Absolute subject mastery',
        icon: '⭐',
        color: 'text-primary',
        isUnlocked: (data: ProgressData) => data.perfectScore,
    },
];

export default function AchievementsSection({
    progressData,
}: AchievementsSectionProps) {
    return (
        <Card className="chart-card glass-card border-foreground/10 shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-foreground/10 bg-card/5">
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-500">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <span>Hall of Fame</span>
                </CardTitle>
                <CardDescription>
                    Milestones you've conquered in your quest for knowledge
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-foreground/10">
                    {achievements.map((ach) => {
                        const isUnlocked = ach.isUnlocked(progressData);
                        return (
                            <div
                                key={ach.title}
                                className={`flex items-center gap-4 sm:gap-6 p-4 sm:p-8 transition-colors group ${isUnlocked ? 'hover:bg-card/[0.02]' : 'opacity-30 grayscale'}`}
                            >
                                <span
                                    className={`text-4xl sm:text-5xl ${isUnlocked ? 'group-hover:scale-125' : ''} transition-transform duration-500`}
                                >
                                    {ach.icon}
                                </span>
                                <div>
                                    <p className="font-bold text-lg">
                                        {ach.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {isUnlocked
                                            ? ach.desc
                                            : 'Locked Milestone'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
