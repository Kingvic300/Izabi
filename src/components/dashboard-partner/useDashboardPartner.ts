import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/apiClient';
import { getPartnerSocket } from '@/lib/partnerSocket';
import { useAppToast } from '@/hooks/useAppToast';
import { useLanguage } from '@/contexts/LanguageContext';
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
    const { t } = useLanguage();
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
            appToast.success({ title: t('partner.toast_invite_accepted') });
        } catch (error: any) {
            appToast.error({
                title: t('partner.toast_could_not_accept_invite_title'),
                description: getErrorMessage(
                    error,
                    t('partner.toast_invite_invalid_fallback'),
                ),
            });
        } finally {
            sessionStorage.removeItem(PENDING_INVITE_CODE_KEY);
        }
    }, [appToast, t]);

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
                appToast.success({
                    title: t('partner.toast_invite_sent_title'),
                    description: `${t('partner.toast_invite_sent_desc_prefix')} ${email} ${t('partner.toast_invite_sent_desc_suffix')}`,
                });
                return true;
            } catch (error: any) {
                appToast.error({
                    title: t('partner.toast_could_not_send_invite_title'),
                    description: getErrorMessage(
                        error,
                        t('partner.generic_retry_fallback'),
                    ),
                });
                return false;
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchPartnership, t],
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
                    title: t('partner.toast_could_not_respond_title'),
                    description: getErrorMessage(
                        error,
                        t('partner.generic_retry_fallback'),
                    ),
                });
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchPartnership, partnership, t],
    );

    const endPartnership = useCallback(async () => {
        if (!partnership) return;
        setIsActionLoading(true);
        try {
            await api.endPartnership(partnership.id);
            await fetchPartnership();
            appToast.success({ title: t('partner.toast_partnership_ended') });
        } catch (error: any) {
            appToast.error({
                title: t('partner.toast_could_not_end_title'),
                description: getErrorMessage(
                    error,
                    t('partner.generic_retry_fallback'),
                ),
            });
        } finally {
            setIsActionLoading(false);
        }
    }, [appToast, fetchPartnership, partnership, t]);

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
                appToast.success({ title: t('partner.toast_goal_set') });
                return true;
            } catch (error: any) {
                appToast.error({
                    title: t('partner.toast_could_not_save_goal_title'),
                    description: getErrorMessage(
                        error,
                        t('partner.generic_retry_fallback'),
                    ),
                });
                return false;
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchActivity, t],
    );

    const checkIn = useCallback(
        async (note?: string) => {
            if (!goal) return;
            setIsActionLoading(true);
            try {
                await api.checkInPartnerGoal(goal.id, note);
                await fetchActivity();
                appToast.success({ title: t('partner.toast_checked_in') });
            } catch (error: any) {
                appToast.error({
                    title: t('partner.toast_could_not_check_in_title'),
                    description: getErrorMessage(
                        error,
                        t('partner.toast_already_checked_in_fallback'),
                    ),
                });
            } finally {
                setIsActionLoading(false);
            }
        },
        [appToast, fetchActivity, goal, t],
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
                    title: t('partner.toast_could_not_send_message_title'),
                    description: getErrorMessage(
                        error,
                        t('partner.generic_retry_fallback'),
                    ),
                });
            }
        },
        [appToast, fetchActivity, t],
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
