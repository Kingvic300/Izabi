export interface LeaderboardUser {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    profilePicturePath?: string;
    institution?: string;
    points: number;
    streak: number;
    rankChange?: number;
    pet?: {
        name: string;
        level: number;
    };
}

export interface LeaderboardData {
    topStudents: LeaderboardUser[];
    topStreaks: LeaderboardUser[];
    userRank?: {
        xp: string;
        streak: string;
        xpChange?: number;
        streakChange?: number;
    };
}

export interface SharePayload {
    shareText: string;
    shareBody: string;
    shareUrl: string;
}

export type LeaderboardType = 'xp' | 'streak';