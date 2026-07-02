import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Users, Zap } from 'lucide-react';
import type { StreakSummary } from './partnerTypes';

type PartnerStatCardsProps = {
    streaks: StreakSummary | null;
};

export default function PartnerStatCards({ streaks }: PartnerStatCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Zap size={14} className="text-primary" />
                        Your Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        {streaks?.yourStreak ?? 0} Days
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Consistency
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Users size={14} className="text-blue-500" />
                        Partner Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-blue-400">
                        {streaks?.partnerStreak ?? 0} Days
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Their Consistency
                    </p>
                </CardContent>
            </Card>

            <Card className="stat-card glass-card group hover-lift relative overflow-hidden border-primary/30">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
                        <Flame size={14} className="fill-current" />
                        Shared Streak
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold text-gradient">
                        {streaks?.sharedStreak ?? 0} Days
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">
                        Together, Consistently
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
