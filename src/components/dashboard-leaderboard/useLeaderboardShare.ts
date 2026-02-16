import { useState } from 'react';
import { api } from '@/lib/apiClient';
import { useAppToast } from '@/hooks/useAppToast';
import { SharePayload, LeaderboardType } from './types';

export const useLeaderboardShare = () => {
    const [isSharing, setIsSharing] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [sharePayload, setSharePayload] = useState<SharePayload | null>(null);
    const toast = useAppToast();

    const baseUrl =
        typeof window !== 'undefined'
            ? window.location.origin
            : 'https://izabi.halixe.com';

    const normalizeShareUrl = (rawUrl: string | undefined) => {
        const userId =
            typeof window !== 'undefined'
                ? localStorage.getItem('userId')
                : null;
        let resolvedUrl: URL;

        try {
            resolvedUrl = new URL(rawUrl || '/dashboard/leaderboard', baseUrl);
        } catch {
            resolvedUrl = new URL('/dashboard/leaderboard', baseUrl);
        }

        if (resolvedUrl.pathname === '/leaderboard') {
            resolvedUrl.pathname = '/dashboard/leaderboard';
        }

        if (userId && !resolvedUrl.searchParams.has('userId')) {
            resolvedUrl.searchParams.set('userId', userId);
        }

        return resolvedUrl.toString();
    };

    const resolveShareBody = (data: any) => {
        if (typeof data?.shareBody === 'string' && data.shareBody.trim()) {
            return data.shareBody.trim();
        }
        if (typeof data?.shareText === 'string' && data.shareText.trim()) {
            return data.shareText.split('Check it out:')[0].trim();
        }
        return 'I’m on the Izabi leaderboard 🚀 Can you beat me?';
    };

    const resolveShareText = (
        shareBody: string,
        shareUrl: string,
        shareText?: string,
    ) => {
        if (typeof shareText === 'string' && shareText.trim()) {
            if (shareText.includes('Check it out:')) {
                return shareText.replace(
                    /Check it out:\s*\S+/i,
                    `Check it out: ${shareUrl}`,
                );
            }
            return shareText.replace(/https?:\/\/\S+/g, shareUrl);
        }
        return `${shareBody}\nCheck it out: ${shareUrl}`;
    };

    const buildFallbackShare = (data: any): SharePayload => {
        const shareUrl = normalizeShareUrl(data?.shareUrl);
        const shareBody = resolveShareBody(data);
        const shareText = resolveShareText(
            shareBody,
            shareUrl,
            data?.shareText,
        );
        return { shareText, shareBody, shareUrl };
    };

    const openManualShare = async (payload: SharePayload) => {
        setSharePayload(payload);
        setIsShareModalOpen(true);

        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(payload.shareText);
                toast.success({
                    title: 'Link copied',
                    description: 'Share text copied to your clipboard.',
                });
            } catch {
                toast.info({
                    title: 'Copy to share',
                    description: 'Tap copy to share your rank.',
                });
            }
        }
    };

    const handleShare = async (type: LeaderboardType) => {
        if (isSharing) return;
        setIsSharing(true);
        try {
            const res = await api.getLeaderboardShare(type);
            const payload = buildFallbackShare(res?.data);
            const shareTitle = 'Izabi Leaderboard';

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: shareTitle,
                        text: payload.shareBody,
                        url: payload.shareUrl,
                    });
                } catch (error: any) {
                    if (error?.name !== 'AbortError') {
                        await openManualShare(payload);
                    }
                }
            } else {
                await openManualShare(payload);
            }
        } catch (error) {
            toast.apiError(error, 'Failed to share rank');
        } finally {
            setIsSharing(false);
        }
    };

    const handleCopyShare = async () => {
        if (!sharePayload?.shareText) return;
        if (!navigator.clipboard?.writeText) {
            toast.info({
                title: 'Copy unavailable',
                description: 'Your browser does not support copy.',
            });
            return;
        }
        try {
            await navigator.clipboard.writeText(sharePayload.shareText);
            toast.success({
                title: 'Link copied',
                description: 'Share text copied to your clipboard.',
            });
        } catch (error) {
            toast.apiError(error, 'Copy failed');
        }
    };

    return {
        isSharing,
        isShareModalOpen,
        sharePayload,
        setIsShareModalOpen,
        handleShare,
        handleCopyShare,
    };
};
