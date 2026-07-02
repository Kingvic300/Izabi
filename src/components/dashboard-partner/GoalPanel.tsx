import type React from 'react';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Circle, Loader, Target } from 'lucide-react';
import type { CheckInStatus, Goal } from './partnerTypes';
import { getPartnerDisplayName } from './partnerUtils';
import type { PartnerProfile } from './partnerTypes';

type GoalPanelProps = {
    goal: Goal | null;
    checkInStatus: CheckInStatus | null;
    partner: PartnerProfile | null;
    onSaveGoal: (dto: {
        title: string;
        description?: string;
        cadence?: 'daily' | 'weekly';
    }) => Promise<boolean>;
    onCheckIn: () => Promise<void>;
    isLoading: boolean;
};

export default function GoalPanel({
    goal,
    checkInStatus,
    partner,
    onSaveGoal,
    onCheckIn,
    isLoading,
}: GoalPanelProps) {
    const [title, setTitle] = useState('');
    const [cadence, setCadence] = useState<'daily' | 'weekly'>('daily');

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title.trim()) return;
        const saved = await onSaveGoal({ title: title.trim(), cadence });
        if (saved) setTitle('');
    };

    if (!goal) {
        return (
            <Card className="glass-card border-foreground/10 rounded-[28px]">
                <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold">Set a Shared Goal</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Agree on something you'll both check in on. You can
                        change this any time.
                    </p>
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="e.g. Study for 30 minutes"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Select
                            value={cadence}
                            onValueChange={(v) => setCadence(v as 'daily' | 'weekly')}
                        >
                            <SelectTrigger className="w-full sm:w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" disabled={isLoading || !title.trim()}>
                            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : 'Set Goal'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-card border-foreground/10 rounded-[28px]">
            <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                        <Badge variant="outline" className="uppercase text-[10px] tracking-widest">
                            {goal.cadence} goal
                        </Badge>
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                        {goal.description && (
                            <p className="text-sm text-muted-foreground">
                                {goal.description}
                            </p>
                        )}
                    </div>
                    <Button
                        onClick={onCheckIn}
                        disabled={isLoading || checkInStatus?.youCheckedInToday}
                        className="shrink-0"
                    >
                        {isLoading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : checkInStatus?.youCheckedInToday ? (
                            'Checked In'
                        ) : (
                            'Check In Today'
                        )}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 rounded-xl border border-foreground/10 p-3">
                        {checkInStatus?.youCheckedInToday ? (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm font-medium">
                            You {checkInStatus?.youCheckedInToday ? 'checked in' : "haven't checked in"} today
                        </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-foreground/10 p-3">
                        {checkInStatus?.partnerCheckedInToday ? (
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                            <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <span className="text-sm font-medium">
                            {getPartnerDisplayName(partner)}{' '}
                            {checkInStatus?.partnerCheckedInToday ? 'checked in' : "hasn't checked in"} today
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
