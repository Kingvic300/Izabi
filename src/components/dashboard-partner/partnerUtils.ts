import type { PartnerProfile } from './partnerTypes';

export const PENDING_INVITE_CODE_KEY = 'pendingPartnerInviteCode';

export const getPartnerDisplayName = (partner: PartnerProfile | null): string => {
    if (!partner) return 'Your partner';
    const first = (partner.firstName || '').trim();
    const last = (partner.lastName || '').trim();
    if (first && last) return `${first} ${last}`;
    if (first) return first;
    return 'Your partner';
};

export const getPartnerInitial = (partner: PartnerProfile | null): string => {
    const name = getPartnerDisplayName(partner);
    return name.charAt(0).toUpperCase() || 'P';
};

export const formatMinutes = (minutes: number): string => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours}h ${rest}m` : `${hours}h`;
};

export const formatRelativeTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.round(diffMs / 60000);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
};

export const NUDGE_PRESETS = [
    "👋 Let's go!",
    "🔥 Don't break the streak",
    '📚 Study together now?',
    '💪 You got this!',
];
