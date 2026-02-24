'use client';

import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useAppToast } from '@/hooks/useAppToast';

interface ProfileData {
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profilePicturePath?: string;
    institution?: string;
    bio?: string;
    totalPoints?: number;
    studyStreak?: number;
    rank?: {
        xp?: number;
        streak?: number;
    };
    achievements?: Array<{
        id: string;
        name: string;
        icon?: string;
    }>;
}

interface UseProfileShareReturn {
    isSharing: boolean;
    isShareModalOpen: boolean;
    shareProfile: (userId: string, profileData?: ProfileData) => Promise<void>;
    setIsShareModalOpen: (open: boolean) => void;
    profileData: ProfileData | null;
    shareUrl: string;
    shareText: string;
}

export const useProfileShare = (): UseProfileShareReturn => {
    const [isSharing, setIsSharing] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [shareUrl, setShareUrl] = useState('');
    const [shareText, setShareText] = useState('');
    const toast = useAppToast();

    const buildProfileShareText = (data: ProfileData): string => {
        const baseUrl =
            typeof window !== 'undefined'
                ? window.location.origin
                : 'https://izabi.halixe.com';
        const url = `${baseUrl}/leaderboard?userId=${data.userId}`;

        return (
            `Check out ${data.firstName || 'my'} leaderboard profile on Izabi! 🚀\n\n` +
            `${data.firstName || 'Scholar'} ${data.lastName || ''}\n` +
            `${data.institution ? `📚 ${data.institution}\n` : ''}` +
            `🏆 ${data.totalPoints || 0} XP • 🔥 ${data.studyStreak || 0} day streak\n\n` +
            `View profile: ${url}`
        );
    };

    const shareProfile = async (userId: string, providedData?: ProfileData) => {
        if (isSharing) return;

        setIsSharing(true);
        try {
            let data: ProfileData;
            
            if (providedData) {
                data = providedData;
            } else {
                // Fetch profile data if not provided
                const res = await api.getUserProfile();
                if (!res.success || !res.data) {
                    throw new Error('Failed to fetch profile data');
                }
                const resolvedUserId =
                    res.data.id || res.data._id || userId;
                data = {
                    userId: resolvedUserId,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    profilePicturePath: res.data.profilePicturePath,
                    institution: res.data.institution,
                    bio: res.data.bio,
                    totalPoints: res.data.totalPoints ?? res.data.points,
                    studyStreak:
                        res.data.studyStreak ??
                        res.data.liveStreak ??
                        res.data.streak,
                    achievements: res.data.achievements,
                };
            }

            const baseUrl =
                typeof window !== 'undefined'
                    ? window.location.origin
                    : 'https://izabi.halixe.com';
            const url = `${baseUrl}/leaderboard?userId=${data.userId}`;
            const text = buildProfileShareText(data);

            setProfileData(data);
            setShareUrl(url);
            setShareText(text);
            setIsShareModalOpen(true);

            // Try native share first if available
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `${data.firstName || 'Scholar'}'s Profile | Izabi`,
                        text: text.split('\n\n')[0], // First line as preview
                        url: url,
                    });
                    // If share was successful, close modal
                    setIsShareModalOpen(false);
                } catch (error: any) {
                    if (error?.name !== 'AbortError') {
                        // Keep modal open for manual copy
                        console.log('Native share failed, showing copy dialog');
                    }
                }
            }
        } catch (error) {
            toast.apiError(error, 'Failed to share profile');
        } finally {
            setIsSharing(false);
        }
    };

    return {
        isSharing,
        isShareModalOpen,
        shareProfile,
        setIsShareModalOpen,
        profileData,
        shareUrl,
        shareText,
    };
};
