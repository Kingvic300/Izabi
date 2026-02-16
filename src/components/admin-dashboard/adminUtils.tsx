import type { ReactNode } from 'react';
import { Activity, BrainCircuit, FileText, UserCircle } from 'lucide-react';

export const processChartData = (users: any[]) => {
    const last7Days: Record<string, number> = {};
    const today = new Date();

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i -= 1) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        last7Days[dateStr] = 0;
    }

    // Sort users into dates
    users.forEach((u) => {
        if (u.createdAt) {
            const d = new Date(u.createdAt);
            const dateStr = d.toLocaleDateString('en-US', {
                weekday: 'short',
            });
            if (last7Days[dateStr] !== undefined) {
                last7Days[dateStr] += 1;
            }
        }
    });

    return Object.keys(last7Days).map((key) => ({
        name: key,
        users: last7Days[key] * 5,
        requests: last7Days[key] * 25,
    }));
};

export const getActivityIcon = (type: string): ReactNode => {
    switch (type) {
        case 'NOTE_CREATED':
            return <FileText size={14} className="text-blue-400" />;
        case 'QUIZ_COMPLETED':
            return <BrainCircuit size={14} className="text-purple-400" />;
        case 'ACCOUNT_CREATED':
            return <UserCircle size={14} className="text-green-400" />;
        default:
            return <Activity size={14} className="text-gray-400" />;
    }
};

export const getActivityText = (act: any) => {
    switch (act.type) {
        case 'NOTE_CREATED':
            return `Created note: ${act.title || 'Untitled'}`;
        case 'QUIZ_COMPLETED':
            return `Completed quiz: ${act.title} (${act.score}%)`;
        case 'ACCOUNT_CREATED':
            return 'Account registered';
        default:
            return 'Unknown activity';
    }
};

export const formatTimeAgo = (dateIdx: string | Date) => {
    const date = new Date(dateIdx);
    const now = new Date();
    const diffInSeconds = Math.floor(
        (now.getTime() - date.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};
