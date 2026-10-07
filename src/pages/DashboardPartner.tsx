import { PageLoader } from '@/components/PageLoader';
import { useDashboardPartner } from '@/components/dashboard-partner/useDashboardPartner';
import PartnerHeader from '@/components/dashboard-partner/PartnerHeader';
import NoPartnerState from '@/components/dashboard-partner/NoPartnerState';
import PendingInviteCard from '@/components/dashboard-partner/PendingInviteCard';
import PartnerStatCards from '@/components/dashboard-partner/PartnerStatCards';
import GoalPanel from '@/components/dashboard-partner/GoalPanel';
import PartnerStudyActivity from '@/components/dashboard-partner/PartnerStudyActivity';
import PartnerChat from '@/components/dashboard-partner/PartnerChat';
import { AccountabilityPartnerView } from '@/components/dashboard-partner/AccountabilityPartnerView';
import { Loader2 } from 'lucide-react';
import { getPartnerDisplayName } from '@/components/dashboard-partner/partnerUtils';

const DashboardPartner = () => {
    const {
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
    } = useDashboardPartner();

    const currentUserId = localStorage.getItem('userId') || '';

    if (isLoading) {
        return (
            <div className="space-y-8">
                <PartnerHeader />
                <PageLoader
                    variant="skeleton-cards"
                    itemCount={3}
                    text="Loading your partnership..."
                />
            </div>
        );
    }

    return (
        <div className="w-full space-y-12 pb-16">
            <PartnerHeader />

            {!partnership && (
                <NoPartnerState onInvite={invitePartner} isLoading={isActionLoading} />
            )}

            {partnership?.status === 'pending' && partnership.awaitingYourResponse && (
                <PendingInviteCard
                    partnership={partnership}
                    onRespond={respondToInvite}
                    isLoading={isActionLoading}
                />
            )}

            {partnership?.status === 'pending' && !partnership.awaitingYourResponse && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-5">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <p>
                        Waiting for {getPartnerDisplayName(partnership.partner)} to
                        accept your invite.
                    </p>
                </div>
            )}

            {partnership?.status === 'active' && (
                <>
                    <section className="space-y-4">
                        <h3 className="text-2xl">Today</h3>
                        <AccountabilityPartnerView
                            partnership={partnership}
                            streaks={streaks}
                            goal={goal}
                            checkInStatus={checkInStatus}
                            onLaunchStudy={() => {
                                window.location.href = '/dashboard';
                            }}
                        />
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-2xl">Streaks</h3>
                        <PartnerStatCards streaks={streaks} />
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-2xl">Shared goal</h3>
                        <GoalPanel
                            goal={goal}
                            checkInStatus={checkInStatus}
                            partner={partnership.partner}
                            onSaveGoal={saveGoal}
                            onCheckIn={checkIn}
                            isLoading={isActionLoading}
                        />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="space-y-4">
                            <h3 className="text-2xl">Their study activity</h3>
                            <PartnerStudyActivity
                                partner={partnership.partner}
                                studySummary={studySummary}
                            />
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-2xl">Chat</h3>
                            <PartnerChat
                                partner={partnership.partner}
                                messages={messages}
                                currentUserId={currentUserId}
                                onSend={sendMessage}
                                onEndPartnership={endPartnership}
                            />
                        </section>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPartner;
