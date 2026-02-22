export type AdminUser = {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    streak?: number;
    isVerified?: boolean;
    createdAt?: string;
    lastStudyDate?: string;
};

export type AdminStats = {
    totalUsers: number;
    activeNow: number;
    totalNotes: number;
    growth: number;
};
