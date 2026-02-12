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

                    <div className="flex-1 flex flex-col relative z-10">
                        {/* Modern Header */}
                        <header className="h-20 border-b border-foreground/5 bg-background/50 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-6">
                                <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors scale-125" />
                                <Separator
                                    orientation="vertical"
                                    className="h-8 bg-card/10"
                                />
                                <div className="flex flex-col">
                                    <h1 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                                        System Node
                                    </h1>
                                    <p className="text-lg font-bold tracking-tight">
                                        Izabi Workspace
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end mr-2">
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                                        Aura Sync Active
                                    </span>
                                    <span className="text-[10px] font-mono opacity-20">
                                        EST-992-BETA
                                    </span>
                                </div>
                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent p-[1px] border border-foreground/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                                    <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-primary/40 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Main Content Area */}
                        <main
                            className={cn(
                                'flex-1',
                                isAIAssistantRoute
                                    ? 'overflow-hidden p-0'
                                    : 'overflow-y-auto p-0 md:p-12',
                            )}
                        >
                            <div className="w-full h-full">
                                <Outlet />
                            </div>
                        </main>
                    </div>

                    {/* Background Jobs Progress Container - Moved to Top Right below header */}
                    <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
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
                        />
                    )}
                </div>
            </SidebarProvider>
        </ErrorBoundary>
    );
};

export default Dashboard;
