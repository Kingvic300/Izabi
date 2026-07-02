import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/apiClient';
import { getPartnerSocket } from '@/lib/partnerSocket';
import { useAppToast } from '@/hooks/useAppToast';
import type {
    AccountabilityEvent,
    CheckInStatus,
    Goal,
    Partnership,
    PartnerMessage,
    StreakSummary,
    StudySummary,
} from './partnerTypes';
import { PENDING_INVITE_CODE_KEY } from './partnerUtils';

const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.message || fallback;

export const useDashboardPartner = () => {
    const [partnership, setPartnership] = useState<Partnership | null>(null);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [checkInStatus, setCheckInStatus] = useState<CheckInStatus | null>(
        null,
    );
    const [streaks, setStreaks] = useState<StreakSummary | null>(null);
    const [studySummary, setStudySummary] = useState<StudySummary | null>(
        null,
    );
    const [messages, setMessages] = useState<PartnerMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const appToast = useAppToast();
    const partnershipRef = useRef<Partnership | null>(null);
    partnershipRef.current = partnership;

    const fetchActivity = useCallback(async () => {
        const [goalRes, streakRes, studyRes, messagesRes] = await Promise.all([
            api.getActivePartnerGoal(),
            api.getPartnerStreak(),
            api.getPartnerStudySummary(),
            api.getPartnerMessages(),
        ]);
        setGoal(goalRes.goal);
        setCheckInStatus(goalRes.checkInStatus);
        setStreaks(streakRes);
        setStudySummary(studyRes);
        setMessages(messagesRes);
    }, []);

    const fetchPartnership = useCallback(async () => {
        const current = await api.getPartnership();
        setPartnership(current);
        if (current?.status === 'active') {
            await fetchActivity();
        } else {
            setGoal(null);
            setCheckInStatus(null);
            setStreaks(null);
            setStudySummary(null);
            setMessages([]);
        }
        return current;
    }, [fetchActivity]);

    const redeemPendingInviteCode = useCallback(async () => {
        const url = new URL(window.location.href);
        const codeFromUrl = url.searchParams.get('code');
        if (codeFromUrl) {
            sessionStorage.setItem(PENDING_INVITE_CODE_KEY, codeFromUrl);
            url.searchParams.delete('code');
            window.history.replaceState({}, '', url.toString());
        }

        const code = sessionStorage.getItem(PENDING_INVITE_CODE_KEY);
        if (!code) return;

        try {
            await api.redeemPartnerInvite(code);
            appToast.success({ title: 'Invite accepted! You have a new accountability partner.' });
        } catch (error: any) {
            appToast.error({
                title: 'Could not accept invite',
                description: getErrorMessage(error, 'That invite link is no longer valid.'),
            });
        } finally {
            sessionStorage.removeItem(PENDING_INVITE_CODE_KEY);
        }
    }, [appToast]);

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            try {
                await redeemPendingInviteCode();
                if (!isMounted) return;
                await fetchPartnership();
            } catch (error) {
                console.error('Failed to load partner dashboard:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        load();

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const socket = getPartnerSocket();
        const handleEvent = (event: AccountabilityEvent) => {
            const current = partnershipRef.current;
            if (current && event.partnershipId === current.id) {
                fetchActivity().catch((error) =>
                    console.error('Failed to refresh partner activity:', error),
                );
            } else if (event.kind === 'partnership') {
                fetchPartnership().catch((error) =>
                    console.error('Failed to refresh partnership:', error),
                );
            }
        };

        socket.on('accountability:event', handleEvent);

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchPartnership().catch((error) =>
                    console.error('Failed to refresh partnership:', error),
                );
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            socket.off('accountability:event', handleEvent);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [fetchActivity, fetchPartnership]);

    const invitePartner = useCallback(
        async (email: string) => {
            setIsActionLoading(true);
            try {
                await api.invitePartner(email);
                await fetchPartnership();
                appToast.success({ title: 'Invite sent!', description: `We emailed ${email} an invite.` });
                return true;
            } catch (error: any) {
                appToast.error({
                    title: 'Could not send invite',
                    description: getErrorMessage(error, 'Please try again.'),
                });
                return false;
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchPartnership],
    );

    const respondToInvite = useCallback(
        async (accept: boolean) => {
            if (!partnership) return;
            setIsActionLoading(true);
            try {
                await api.respondToPartnerInvite(partnership.id, accept);
                await fetchPartnership();
            } catch (error: any) {
                appToast.error({
                    title: 'Could not respond to invite',
                    description: getErrorMessage(error, 'Please try again.'),
                });
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchPartnership, partnership],
    );

    const endPartnership = useCallback(async () => {
        if (!partnership) return;
        setIsActionLoading(true);
        try {
            await api.endPartnership(partnership.id);
            await fetchPartnership();
            appToast.success({ title: 'Partnership ended' });
        } catch (error: any) {
            appToast.error({
                title: 'Could not end partnership',
                description: getErrorMessage(error, 'Please try again.'),
            });
        } finally {
            setIsActionLoading(false);
        }
    }, [appToast, fetchPartnership, partnership]);

    const saveGoal = useCallback(
        async (dto: {
            title: string;
            description?: string;
            cadence?: 'daily' | 'weekly';
            deadline?: string;
        }) => {
            setIsActionLoading(true);
            try {
                await api.savePartnerGoal(dto);
                await fetchActivity();
                appToast.success({ title: 'Goal set!' });
                return true;
            } catch (error: any) {
                appToast.error({
                    title: 'Could not save goal',
                    description: getErrorMessage(error, 'Please try again.'),
                });
                return false;
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchActivity],
    );

    const checkIn = useCallback(
        async (note?: string) => {
            if (!goal) return;
            setIsActionLoading(true);
            try {
                await api.checkInPartnerGoal(goal.id, note);
                await fetchActivity();
                appToast.success({ title: "Checked in! Keep the streak alive." });
            } catch (error: any) {
                appToast.error({
                    title: 'Could not check in',
                    description: getErrorMessage(
                        error,
                        "You've already checked in today.",
                    ),
                });
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchActivity, goal],
    );

    const sendMessage = useCallback(
        async (content: string, type: 'message' | 'nudge' = 'message') => {
            const trimmed = content.trim();
            if (!trimmed) return;
            try {
                await api.sendPartnerMessage(trimmed, type);
                await fetchActivity();
            } catch (error: any) {
                appToast.error({
                    title: 'Could not send message',
                    description: getErrorMessage(error, 'Please try again.'),
                });
            }
        },
        [appToast, fetchActivity],
    );

    const sendNudge = useCallback(
        (preset: string) => sendMessage(preset, 'nudge'),
        [sendMessage],
    );

    return {
        partnership,
        goal,
        checkInStatus,
        streaks,
        studySummary,
        messages,
        isLoading,
        isActionLoading,
        invitePartner,
        respondToInvite,
        endPartnership,
        saveGoal,
        checkIn,
        sendMessage,
        sendNudge,
        refetchPartnerActivity: fetchActivity,
    };
};
