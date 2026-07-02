import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock } from 'lucide-react';
import type { PartnerProfile, StudySummary } from './partnerTypes';
import { formatMinutes, formatRelativeTime, getPartnerDisplayName } from './partnerUtils';

type PartnerStudyActivityProps = {
    partner: PartnerProfile | null;
    studySummary: StudySummary | null;
};

export default function PartnerStudyActivity({
    partner,
    studySummary,
}: PartnerStudyActivityProps) {
    const name = getPartnerDisplayName(partner);
    const sessions = studySummary?.recentSessions || [];

    return (
        <Card className="glass-card border-foreground/10 rounded-[28px]">
            <CardContent className="p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <h3 className="text-lg font-bold">{name}'s Study Activity</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {formatMinutes(studySummary?.todayMinutes || 0)} today
                    </div>
                </div>

                {sessions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No recent study sessions yet.
                    </p>
                ) : (
                    <div className="space-y-2">
                        {sessions.map((session, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 rounded-xl border border-foreground/10 p-3"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                    <BookOpen className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {session.topic || session.type || 'Study session'}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                        {formatRelativeTime(session.createdAt)}
                                        {session.duration
                                            ? ` · ${formatMinutes(session.duration)}`
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
