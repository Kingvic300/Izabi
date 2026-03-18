import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import StreakPet from '@/components/StreakPet';
import { useState, useEffect } from 'react';
import { api } from '@/lib/apiClient';
import { useStudy } from '@/contexts/StudyContext';
import { cn } from '@/lib/utils';
import JobStatusToast from '@/components/JobStatusToast';
import { AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const location = useLocation();
    const { activeJobs, removeJob } = useStudy();
    const [userStats, setUserStats] = useState<any>(null);
    const userId = localStorage.getItem('userId');

    const activeProcessingJobs = activeJobs.filter(
        (j) => j.status === 'PENDING' || j.status === 'PROCESSING',
    );
    const hasActiveJobs = activeProcessingJobs.length > 0;
    const isAIAssistantRoute = location.pathname === '/dashboard/ai-assistant';

    const fetchStats = async () => {
        if (!userId) return;
        try {
            const res = await api.getUserStats();
            setUserStats(res);
        } catch (err) {
            console.error('Failed to fetch global stats', err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [userId]);

    const handleFeedPet = async () => {
        if (!userId) return;
        try {
            const res = await api.feedPet();
            if (res.success) {
                // Optimistic update
                setUserStats((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        totalPoints: res.data.points,
                        pet: res.data.pet,
                    },
                }));
            }
        } catch (err) {
            console.error('Failed to feed pet', err);
        }
    };

    return (
        <ErrorBoundary>
            <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background relative overflow-hidden text-foreground">
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <AppSidebar />
                    <div className="flex-1 min-w-0 flex flex-col relative z-10">
                        {/* Modern Header */}
                        <header className="h-20 border-b border-foreground/5 bg-background/50 backdrop-blur-xl px-4 sm:px-8 md:px-12 flex items-center justify-between shrink-0 relative z-20">
                            <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors scale-125" />
                            <div />
                        </header>


                        {/* Main Content Area */}
                        <main
                            className={cn(
                                'flex-1 min-w-0',
                                isAIAssistantRoute
                                    ? 'overflow-hidden p-0'
                                    : 'overflow-y-auto p-0 md:px-6 md:py-8 xl:px-8 xl:py-10',
                            )}
                        >
                            <div className="w-full h-full min-w-0">
                                <Outlet />
                            </div>
                        </main>
                    </div>

                    {/* Background Jobs Progress Container - Moved to Top Right below header */}
                    <div className="fixed top-20 sm:top-24 left-3 right-3 sm:left-auto sm:right-6 z-[100] flex flex-col gap-3 sm:gap-4 pointer-events-none">
                        <AnimatePresence mode="popLayout">
                            {activeJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="pointer-events-auto"
                                >
                                    <JobStatusToast
                                        job={job}
                                        onClose={(id) => removeJob(id)}
                                    />
                                </div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {userStats?.data && (
                        <StreakPet
                            streak={
                                userStats.data.streakData?.academicStreak ||
                                userStats.data.studyStreak ||
                                0
                            }
                            petData={userStats.data.pet}
                            userPoints={userStats.data.totalPoints || 0}
                            streakFreezes={
                                userStats.data.streakData?.streakFreezes || 0
                            }
                            onFeed={handleFeedPet}
                            className={
                                isAIAssistantRoute
                                    ? 'top-1/2 right-2 sm:right-4 left-auto bottom-auto -translate-y-1/2'
                                    : undefined
                            }
                        />
                    )}
                </div>
            </SidebarProvider>
        </ErrorBoundary>
    );
};

export default Dashboard;
