import { useEffect, useState } from 'react';
import { api } from '@/lib/apiClient';
import type {
    ChartPoint,
    ProgressData,
    QuizResult,
    SubjectPoint,
    Subscription,
    Usage,
} from './progressTypes';
import {
    buildChartData,
    buildSubjectData,
    computeAverageScore,
    demoChartData,
    demoSubjectData,
    hasMeaningfulQuizData,
} from './progressUtils';

const initialProgressData: ProgressData = {
    totalQuizzes: 0,
    averageScore: 0,
    studyStreak: 0,
    activityStreaks: {},
    totalStudyHours: 0,
    perfectScore: false,
};

export const useDashboardProgress = () => {
    const [progressData, setProgressData] = useState<ProgressData>(
        initialProgressData,
    );
    const [isLoading, setIsLoading] = useState(true);
    const [usage, setUsage] = useState<Usage | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [chartData, setChartData] = useState<ChartPoint[]>([]);
    const [subjectData, setSubjectData] = useState<SubjectPoint[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchProgress = async () => {
            try {
                const [res, results] = await Promise.all([
                    api.getUserStats(),
                    api.getQuizResults(),
                ]);

                if (res.success && res.data) {
                    if (!isMounted) return;

                    setSubscription({
                        status: res.data.subscriptionStatus,
                        expiry: res.data.subscriptionExpiry,
                    });
                    setUsage(res.data.usage || null);

                    const quizData: QuizResult[] = results?.data || [];
                    const avgScore = computeAverageScore(quizData);

                    setProgressData({
                        totalQuizzes:
                            res.data.studyStats?.quizzes || quizData.length,
                        averageScore: avgScore,
                        studyStreak: res.data.streakData?.academicStreak || 0,
                        activityStreaks:
                            res.data.streakData?.activityStreaks || {},
                        totalStudyHours: Math.round(
                            (res.data.totalStudyMinutes || 0) / 60,
                        ),
                        perfectScore: quizData.some((q) => q.score === 100),
                    });

                    if (hasMeaningfulQuizData(quizData)) {
                        setChartData(buildChartData(quizData));
                        setSubjectData(buildSubjectData(quizData));
                    } else {
                        setChartData(demoChartData);
                        setSubjectData(demoSubjectData);
                    }
                } else {
                    if (!isMounted) return;
                    setChartData(demoChartData);
                    setSubjectData(demoSubjectData);
                }
            } catch (error) {
                console.error('Failed to fetch user stats:', error);
                if (!isMounted) return;
                setChartData(demoChartData);
                setSubjectData(demoSubjectData);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProgress();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        progressData,
        isLoading,
        usage,
        subscription,
        chartData,
        subjectData,
    };
};
