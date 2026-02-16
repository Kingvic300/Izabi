export type ActivityStreaks = {
    quizzes?: {
        current?: number;
    };
    summaries?: {
        current?: number;
    };
    login?: {
        current?: number;
    };
};

export type ProgressData = {
    totalQuizzes: number;
    averageScore: number;
    studyStreak: number;
    activityStreaks: ActivityStreaks;
    totalStudyHours: number;
    perfectScore: boolean;
};

export type UsageLimits = {
    dailyDocs: number;
    dailyMessages: number;
};

export type Usage = {
    dailyDocs: number;
    dailyMessages: number;
    limits?: UsageLimits;
};

export type Subscription = {
    status?: string;
    expiry?: string | number | Date;
};

export type ChartPoint = {
    date: string;
    score: number;
};

export type SubjectPoint = {
    subject: string;
    score: number;
};

export type QuizResult = {
    score: number;
    createdAt?: string;
    date?: string;
    subject?: string;
    quizTitle?: string;
};
