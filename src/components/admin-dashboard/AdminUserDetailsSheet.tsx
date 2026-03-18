import {
    Activity,
    Award,
    BrainCircuit,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    FileText,
    Key,
    ShieldCheck,
    StopCircle,
    TrendingUp,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getActivityIcon, getActivityText } from './adminUtils';
import { Loader2 } from 'lucide-react';

type AdminUserDetailsSheetProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userDetails: any;
    isDetailsLoading: boolean;
    onImpersonate?: (userId: string) => void;
    isImpersonating?: boolean;
    impersonationTargetId?: string | null;
};

export default function AdminUserDetailsSheet({
    open,
    onOpenChange,
    userDetails,
    isDetailsLoading,
    onImpersonate,
    isImpersonating,
    impersonationTargetId,
}: AdminUserDetailsSheetProps) {
    const currentUserId =
        typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    const currentUserRole =
        typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    const normalizedRole = (currentUserRole || '').trim().toLowerCase();
    const isAdmin = normalizedRole === 'admin' || normalizedRole === 'super_admin';
    const selectedUserName = userDetails
        ? `${userDetails.user?.firstName || ''} ${userDetails.user?.lastName || ''}`.trim() ||
          userDetails.user?.email ||
          'User'
        : 'User';
    const selectedUserInitial =
        userDetails?.user?.firstName?.[0] ||
        userDetails?.user?.lastName?.[0] ||
        userDetails?.user?.email?.[0] ||
        'U';
    const selectedUserEmail = userDetails?.user?.email || 'No email on file';
    const selectedUserRole =
        (userDetails?.user?.role || 'USER').toString().toUpperCase();
    const isVerified = Boolean(userDetails?.user?.isVerified);
    const subscriptionStatus = userDetails?.user?.subscriptionStatus;
    const joinedLabel = userDetails?.user?.createdAt
        ? new Date(userDetails.user.createdAt).toLocaleDateString()
        : '—';
    const lastActivityLabel = userDetails?.history?.[0]?.date
        ? new Date(userDetails.history[0].date).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short',
          })
        : 'No activity yet';
    const studyStats = userDetails?.user?.studyStats || {};
    const petProfile = userDetails?.user?.pet;
    const totalStudyMinutes = userDetails?.user?.totalStudyMinutes || 0;
    const dailyPoints = userDetails?.user?.dailyPoints || 0;
    const studyLevel = userDetails?.user?.level || 0;
    const streakFreezes = userDetails?.user?.streakFreezes || 0;
    const signalCount = userDetails?.missingActions?.length || 0;
    const hasSignals = signalCount > 0;
    const targetUserId = userDetails?.user?.id;
    const targetRole = (userDetails?.user?.role || '').trim().toLowerCase();
    const isTargetAdmin = targetRole === 'admin' || targetRole === 'super_admin';
    const canImpersonate =
        Boolean(onImpersonate) &&
        Boolean(targetUserId) &&
        isAdmin &&
        !isTargetAdmin &&
        (!currentUserId || currentUserId !== targetUserId);
    const formattedMinutes =
        totalStudyMinutes >= 60
            ? `${(totalStudyMinutes / 60).toFixed(1)} hrs`
            : `${totalStudyMinutes} mins`;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-2xl lg:max-w-3xl p-0 glass border-l border-foreground/10 gap-0 overflow-hidden flex flex-col h-[100svh]"
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>User details</SheetTitle>
                    <SheetDescription>
                        Admin view of the selected user profile, activity, and
                        history.
                    </SheetDescription>
                </SheetHeader>
                {userDetails ? (
                    <>
                        <div className="relative overflow-hidden border-b border-foreground/10">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.22),_transparent_58%)] opacity-80 pointer-events-none" />
                            <div className="absolute -top-28 -right-16 h-64 w-64 rounded-full bg-primary/25 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
                            <div className="relative z-10 p-5 md:p-8 space-y-6">
                                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                    <div className="flex items-start gap-4 md:gap-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-card/10 border border-foreground/10 shadow-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-foreground/70">
                                                {selectedUserInitial.toUpperCase()}
                                            </div>
                                            <div
                                                className={cn(
                                                    'absolute -bottom-2 -right-2 h-8 w-8 rounded-2xl border border-foreground/10 flex items-center justify-center shadow-lg',
                                                    hasSignals
                                                        ? 'bg-destructive/20 text-destructive'
                                                        : 'bg-emerald-500/20 text-emerald-300',
                                                )}
                                            >
                                                {hasSignals ? (
                                                    <XCircle size={14} />
                                                ) : (
                                                    <CheckCircle2 size={14} />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-foreground/40 font-semibold">
                                                User Dossier
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                                                    {selectedUserName}
                                                </h2>
                                                {canImpersonate && (
                                                    <Button
                                                        variant={impersonationTargetId === userDetails.user.id ? "destructive" : "outline"}
                                                        size="sm"
                                                        className={cn(
                                                            "rounded-xl text-[10px] font-bold uppercase tracking-wider",
                                                            impersonationTargetId === userDetails.user.id 
                                                                ? "bg-destructive/20 hover:bg-destructive/30 border-destructive/50"
                                                                : "border-foreground/10 bg-card/5 hover:bg-card/10"
                                                        )}
                                                        onClick={() => {
                                                            if (impersonationTargetId === userDetails.user.id) {
                                                                // Already impersonating this user - stop impersonation
                                                                onImpersonate('STOP');
                                                            } else {
                                                                onImpersonate(userDetails.user.id);
                                                            }
                                                        }}
                                                    >
                                                        {impersonationTargetId === userDetails.user.id ? (
                                                            <>
                                                                <StopCircle size={14} className="mr-1" />
                                                                Stop
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye size={14} className="mr-1" />
                                                                view as user
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="border-foreground/10 bg-card/5 text-[11px] font-medium"
                                                >
                                                    {selectedUserEmail}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="border-foreground/10 bg-card/5 text-[11px] font-bold uppercase tracking-widest"
                                                >
                                                    {selectedUserRole}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-[11px] font-semibold',
                                                        isVerified
                                                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                                            : 'border-amber-500/30 bg-amber-500/10 text-amber-200',
                                                    )}
                                                >
                                                    {isVerified
                                                        ? 'Verified'
                                                        : 'Unverified'}
                                                </Badge>
                                                {subscriptionStatus ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="border-foreground/10 bg-card/5 text-[11px] font-semibold capitalize"
                                                    >
                                                        {subscriptionStatus}
                                                    </Badge>
                                                ) : null}
                                                <Badge className="bg-primary text-primary-foreground hover:bg-primary/80 border-none text-[11px] font-bold">
                                                    {userDetails.user.points ||
                                                        0}{' '}
                                                    XP
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-[10px] uppercase tracking-widest font-bold',
                                                        hasSignals
                                                            ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                                                    )}
                                                >
                                                    {hasSignals
                                                        ? `${signalCount} signals`
                                                        : 'All clear'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                        <Badge
                                            variant="outline"
                                            className="border-foreground/10 bg-card/5 text-[10px] uppercase tracking-widest font-bold"
                                        >
                                            ID:{' '}
                                            <span className="font-mono">
                                                {userDetails.user.id
                                                    ?.slice(0, 8)
                                                    ?.toUpperCase() || '—'}
                                            </span>
                                        </Badge>
                                        <Badge
                                            variant="outline"
                                            className="border-foreground/10 bg-card/5 text-[10px] uppercase tracking-widest font-bold"
                                        >
                                            Login Streak:{' '}
                                            {userDetails.user.streaks?.login ||
                                                0}
                                            d
                                        </Badge>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="p-3 md:p-4 rounded-2xl bg-card/10 border border-foreground/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                                        <div className="flex items-center gap-2 mb-2 text-foreground/60">
                                            <Calendar size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                Joined
                                            </span>
                                        </div>
                                        <p className="font-mono font-bold text-sm">
                                            {joinedLabel}
                                        </p>
                                    </div>
                                    <div className="p-3 md:p-4 rounded-2xl bg-card/10 border border-foreground/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                                        <div className="flex items-center gap-2 mb-2 text-foreground/60">
                                            <Activity size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                Last Activity
                                            </span>
                                        </div>
                                        <p className="font-mono font-bold text-sm">
                                            {lastActivityLabel}
                                        </p>
                                    </div>
                                    <div className="p-3 md:p-4 rounded-2xl bg-card/10 border border-foreground/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                                        <div className="flex items-center gap-2 mb-2 text-foreground/60">
                                            <Award size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                Global Streak
                                            </span>
                                        </div>
                                        <p className="font-mono font-bold text-sm">
                                            {userDetails.user.streaks?.global ||
                                                0}{' '}
                                            days
                                        </p>
                                    </div>
                                    <div className="p-3 md:p-4 rounded-2xl bg-card/10 border border-foreground/10 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                                        <div className="flex items-center gap-2 mb-2 text-foreground/60">
                                            <ShieldCheck size={14} />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">
                                                Longest Streak
                                            </span>
                                        </div>
                                        <p className="font-mono font-bold text-sm">
                                            {userDetails.user.streaks
                                                ?.longest || 0}{' '}
                                            days
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                                <div className="grid xl:grid-cols-[1fr_1.2fr] gap-6 md:gap-8">
                                    <div className="space-y-6">
                                        <div className="rounded-3xl border border-foreground/10 bg-[linear-gradient(135deg,_rgba(15,23,42,0.4),_rgba(59,130,246,0.06))] p-5 md:p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/50 flex items-center gap-2">
                                                    <ShieldCheck
                                                        size={14}
                                                        className="text-primary"
                                                    />
                                                    Account Snapshot
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className="border-foreground/10 bg-card/10 text-[10px] uppercase tracking-widest"
                                                >
                                                    Profile
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        Level
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {studyLevel}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        Daily XP
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {dailyPoints}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        Study Time
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {formattedMinutes}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <p className="text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        Streak Freezes
                                                    </p>
                                                    <p className="text-2xl font-bold">
                                                        {streakFreezes}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-foreground/10 bg-[linear-gradient(135deg,_rgba(239,68,68,0.05),_rgba(15,23,42,0.2))] p-5 md:p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/50 flex items-center gap-2">
                                                    <XCircle
                                                        size={14}
                                                        className="text-destructive"
                                                    />
                                                    Risk Signals
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-[10px] uppercase tracking-widest',
                                                        hasSignals
                                                            ? 'border-destructive/30 bg-destructive/10 text-destructive'
                                                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
                                                    )}
                                                >
                                                    {signalCount} flags
                                                </Badge>
                                            </div>
                                            {userDetails.missingActions &&
                                            userDetails.missingActions.length >
                                                0 ? (
                                                <div className="grid grid-cols-1 gap-3">
                                                    {userDetails.missingActions.map(
                                                        (
                                                            action: string,
                                                            i: number,
                                                        ) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10"
                                                            >
                                                                <div className="w-2 h-2 rounded-full bg-destructive/60" />
                                                                <span className="text-sm font-medium text-destructive/80">
                                                                    {action}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
                                                    <CheckCircle2
                                                        size={16}
                                                        className="text-emerald-400"
                                                    />
                                                    <p className="text-sm font-medium text-emerald-200/80">
                                                        All clear. No
                                                        outstanding actions
                                                        detected.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="rounded-3xl border border-foreground/10 bg-[linear-gradient(135deg,_rgba(59,130,246,0.08),_rgba(15,23,42,0.3))] p-5 md:p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/50">
                                                    Study Mix
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className="border-foreground/10 bg-card/10 text-[10px] uppercase tracking-widest"
                                                >
                                                    Totals
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        <FileText size={12} />
                                                        Summaries
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {studyStats.summaries ||
                                                            0}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        <BrainCircuit
                                                            size={12}
                                                        />
                                                        Quizzes
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {studyStats.quizzes ||
                                                            0}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        <TrendingUp
                                                            size={12}
                                                        />
                                                        Guides
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {studyStats.guides ||
                                                            0}
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-foreground/10 bg-card/10 p-3">
                                                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-2">
                                                        <Key size={12} />
                                                        Flashcards
                                                    </div>
                                                    <p className="text-2xl font-bold">
                                                        {studyStats
                                                            .flashcards || 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-3xl border border-foreground/10 bg-[linear-gradient(135deg,_rgba(16,185,129,0.08),_rgba(15,23,42,0.3))] p-5 md:p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/50">
                                                    Companion
                                                </h3>
                                                <Badge
                                                    variant="outline"
                                                    className="border-foreground/10 bg-card/10 text-[10px] uppercase tracking-widest"
                                                >
                                                    {petProfile?.level
                                                        ? `Level ${petProfile.level}`
                                                        : 'Unbonded'}
                                                </Badge>
                                            </div>
                                            {petProfile ? (
                                                <div className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card/10 px-4 py-3">
                                                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-300">
                                                        <ShieldCheck
                                                            size={16}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">
                                                            {petProfile.name ||
                                                                'Izabi Pet'}
                                                        </p>
                                                        <p className="text-xs uppercase tracking-widest text-foreground/50">
                                                            {petProfile.type ||
                                                                'companion'}{' '}
                                                            ·{' '}
                                                            {petProfile.mood ||
                                                                'neutral'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm opacity-50">
                                                    No companion data is linked
                                                    to this account yet.
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-3xl border border-foreground/10 bg-[linear-gradient(135deg,_rgba(59,130,246,0.05),_rgba(15,23,42,0.35))] p-5 md:p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xs font-bold uppercase tracking-[0.35em] text-foreground/50 flex items-center gap-2">
                                                <Clock size={14} />
                                                Intelligence Timeline
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className="border-foreground/10 bg-card/10 text-[10px] uppercase tracking-widest"
                                            >
                                                {userDetails.history?.length ||
                                                    0}{' '}
                                                Events
                                            </Badge>
                                        </div>
                                        <div className="relative pl-4 space-y-6 border-l border-foreground/10 ml-2">
                                            {userDetails.history &&
                                            userDetails.history.length > 0 ? (
                                                userDetails.history.map(
                                                    (
                                                        event: any,
                                                        i: number,
                                                    ) => (
                                                        <div
                                                            key={i}
                                                            className="relative pl-6"
                                                        >
                                                            <div className="absolute -left-[6px] top-2 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                                                            <div className="space-y-2">
                                                                <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.3em]">
                                                                    {new Date(
                                                                        event.date,
                                                                    ).toLocaleString(
                                                                        [],
                                                                        {
                                                                            dateStyle:
                                                                                'medium',
                                                                            timeStyle:
                                                                                'short',
                                                                        },
                                                                    )}
                                                                </p>
                                                                <div className="rounded-2xl bg-card/10 border border-foreground/10 p-4 hover:bg-card/20 transition-colors">
                                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                        {getActivityIcon(
                                                                            event.type,
                                                                        )}
                                                                        <span className="font-bold text-sm">
                                                                            {getActivityText(
                                                                                event.details
                                                                                    ? {
                                                                                          ...event.details,
                                                                                          type: event.type,
                                                                                      }
                                                                                    : {
                                                                                          type: event.type,
                                                                                      },
                                                                            )}
                                                                        </span>
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="border-foreground/10 bg-card/5 text-[9px] uppercase tracking-[0.25em]"
                                                                        >
                                                                            {String(
                                                                                event.type,
                                                                            ).replace(
                                                                                /_/g,
                                                                                ' ',
                                                                            )}
                                                                        </Badge>
                                                                    </div>
                                                                    {event.details &&
                                                                        event
                                                                            .details
                                                                            .score !==
                                                                            undefined && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="bg-card/10"
                                                                            >
                                                                                Score:{' '}
                                                                                {
                                                                                    event
                                                                                        .details
                                                                                        .score
                                                                                }
                                                                                %
                                                                            </Badge>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                <div className="pl-6 text-sm opacity-40 italic">
                                                    No recorded history
                                                    available.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        {isDetailsLoading && (
                            <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        )}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
