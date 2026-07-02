export interface PartnerProfile {
    userId: string;
    firstName?: string;
    lastName?: string;
    profilePicturePath?: string;
    level?: number;
}

export type PartnershipStatus =
    | 'pending'
    | 'active'
    | 'declined'
    | 'ended'
    | 'expired';

export interface Partnership {
    id: string;
    status: PartnershipStatus;
    isInitiator: boolean;
    createdAt: string;
    partner: PartnerProfile | null;
    awaitingYourResponse: boolean;
}

export interface Goal {
    id: string;
    title: string;
    description?: string;
    cadence: 'daily' | 'weekly';
    deadline?: string;
    isActive: boolean;
}

export interface CheckInStatus {
    youCheckedInToday: boolean;
    partnerCheckedInToday: boolean;
}

export interface StreakSummary {
    yourStreak: number;
    partnerStreak: number;
    sharedStreak: number;
}

export interface StudySession {
    topic?: string;
    type?: string;
    duration?: number;
    createdAt: string;
}

export interface StudySummary {
    todayMinutes: number;
    currentStreak: number;
    recentSessions: StudySession[];
}

export interface PartnerMessage {
    id: string;
    _id?: string;
    partnershipId: string;
    senderId: string;
    recipientId: string;
    type: 'message' | 'nudge';
    content: string;
    read: boolean;
    createdAt: string;
}

export interface AccountabilityEvent {
    partnershipId: string;
    kind: 'message' | 'nudge' | 'checkin' | 'goal' | 'partnership';
    at: string;
}
