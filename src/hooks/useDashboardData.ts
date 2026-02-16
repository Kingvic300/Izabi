import { useState, useEffect } from 'react';
import apiClient, { api } from '@/lib/apiClient';
import { UserStats } from '@/components/dashboard-home/types';

export const useDashboardData = () => {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [brainDropQuestion, setBrainDropQuestion] = useState<any>(null);
    const [isBrainDropCompleted, setIsBrainDropCompleted] = useState(false);
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    const fetchStats = async () => {
        try {
            // Daily Check-in to update streak
            await apiClient.post('/api/user/check-in');

            const [statsRes, profileRes] = await Promise.all([
                api.getUserStats(),
                api.getUserProfile(),
            ]);

            setUserStats(statsRes);

            if (profileRes.data?.pet) {
                setUserStats((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev?.data,
                        pet: profileRes.data.pet,
                    },
                }));
            }
        } catch (err) {
            console.error('Failed to fetch user stats:', err);
        }
    };

    const loadBrainDrop = async () => {
        try {
            const lastCompleted = localStorage.getItem(
                `braindrop_complete_${new Date().toDateString()}`,
            );
            if (lastCompleted) {
                setIsBrainDropCompleted(true);
            }

            const res = await api.getDailyChallenge();
            if (res.success && res.data) {
                if (
                    res.data.question &&
                    res.data.options &&
                    Array.isArray(res.data.options) &&
                    res.data.options.length > 0
                ) {
                    setBrainDropQuestion(res.data);
                } else {
                    setBrainDropQuestion(null);
                }
            }
        } catch (err) {
            console.error('Failed to load Brain Drop', err);
        }
    };

    const handleBrainDropAnswer = async (answer: string, isCorrect: boolean) => {
        try {
            await api.submitQuizResult({
                score: isCorrect ? 100 : 0,
                totalQuestions: 1,
                correctAnswers: isCorrect ? 1 : 0,
                subject: 'Brain Drop',
                date: new Date().toISOString(),
            });

            setIsBrainDropCompleted(true);
            localStorage.setItem(
                `braindrop_complete_${new Date().toDateString()}`,
                'true',
            );

            fetchStats();
            return true;
        } catch (err) {
            console.error('Failed to submit Brain Drop', err);
            return false;
        }
    };

    useEffect(() => {
        fetchStats();
        loadBrainDrop();
    }, []);

    return {
        userStats,
        brainDropQuestion,
        isBrainDropCompleted,
        handleBrainDropAnswer,
        fetchStats,
        userId,
    };
};