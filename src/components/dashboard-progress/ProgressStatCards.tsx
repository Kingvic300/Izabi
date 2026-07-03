import { BookOpen, Clock, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProgressData } from './progressTypes';
import { useLanguage } from '@/contexts/LanguageContext';

type ProgressStatCardsProps = {
    progressData: ProgressData;
};

export default function ProgressStatCards({
    progressData,
}: ProgressStatCardsProps) {
    const { t } = useLanguage();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <BookOpen size={14} className="text-primary" />
                        {t('progress.total_quizzes')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {progressData.totalQuizzes}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        {t('progress.completed_sessions')}
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Target size={14} className="text-blue-500" />
                        {t('progress.average_score')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-blue-400">
                        {progressData.averageScore}%
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        {t('progress.mastery_level')}
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden border-primary/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                        <Zap size={14} className="fill-current" />
                        {t('progress.study_streak')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gradient">
                        {progressData.studyStreak} {t('progress.days_suffix')}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        {t('progress.consistent_growth')}
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Clock size={14} className="text-primary" />
                        {t('progress.study_hours')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {progressData.totalStudyHours}h
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        {t('progress.time_invested')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
