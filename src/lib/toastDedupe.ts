export type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'default';

const recentToasts = new Map<string, number>();
const MAX_ENTRIES = 200;
const CLEANUP_WINDOW_MS = 15000;

const normalize = (value?: string) =>
    (value || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ');

const buildKey = (
    kind: ToastKind,
    title?: string,
    description?: string,
) => `${kind}|${normalize(title)}|${normalize(description)}`;

const hash = (value: string) => {
    let h = 0;
    for (let i = 0; i < value.length; i += 1) {
        h = (h << 5) - h + value.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h).toString(36);
};

const prune = (now: number) => {
    if (recentToasts.size <= MAX_ENTRIES) return;
    for (const [key, ts] of recentToasts) {
        if (now - ts > CLEANUP_WINDOW_MS) recentToasts.delete(key);
    }
    if (recentToasts.size <= MAX_ENTRIES) return;
    const entries = [...recentToasts.entries()].sort((a, b) => a[1] - b[1]);
    const excess = entries.length - MAX_ENTRIES;
    if (excess > 0) {
        entries.slice(0, excess).forEach(([key]) => recentToasts.delete(key));
    }
};

export const getToastDedupe = (
    kind: ToastKind,
    title?: string,
    description?: string,
    windowMs = 4500,
) => {
    const key = buildKey(kind, title, description);
    const id = `toast:${hash(key)}`;
    const now = Date.now();
    const last = recentToasts.get(key);
    const suppressed = Boolean(last && now - last < windowMs);

    if (!suppressed) {
        recentToasts.set(key, now);
        prune(now);
    }

    return { id, suppressed };
};
