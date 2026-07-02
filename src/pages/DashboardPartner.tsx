import { PageLoader } from '@/components/PageLoader';
import { useDashboardPartner } from '@/components/dashboard-partner/useDashboardPartner';
import PartnerHeader from '@/components/dashboard-partner/PartnerHeader';
import NoPartnerState from '@/components/dashboard-partner/NoPartnerState';
import PendingInviteCard from '@/components/dashboard-partner/PendingInviteCard';
import PartnerStatCards from '@/components/dashboard-partner/PartnerStatCards';
import GoalPanel from '@/components/dashboard-partner/GoalPanel';
import PartnerStudyActivity from '@/components/dashboard-partner/PartnerStudyActivity';
import PartnerChat from '@/components/dashboard-partner/PartnerChat';
import { Card, CardContent } from '@/components/ui/card';
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
            <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                    Accountability Partner
                </h1>
                <PageLoader
                    variant="skeleton-cards"
                    itemCount={3}
                    text="Loading your partnership..."
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12">
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
                <Card className="glass-card border-foreground/10 rounded-[28px]">
                    <CardContent className="p-8 text-center space-y-3">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-sm text-muted-foreground">
                            Waiting for {getPartnerDisplayName(partnership.partner)}{' '}
                            to accept your invite...
                        </p>
                    </CardContent>
                </Card>
            )}

            {partnership?.status === 'active' && (
                <>
                    <section className="space-y-4">
                        <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Streaks
                        </div>
                        <PartnerStatCards streaks={streaks} />
                    </section>

                    <section className="space-y-4">
                        <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Shared Goal
                        </div>
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
                            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                Study Activity
                            </div>
                            <PartnerStudyActivity
                                partner={partnership.partner}
                                studySummary={studySummary}
                            />
                        </section>

                        <section className="space-y-4">
                            <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                                Chat
                            </div>
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
