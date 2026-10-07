import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import {
    AppSidebar,
    navigationItems,
    settingsItems,
} from '@/components/AppSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import StreakPet from '@/components/StreakPet';
import { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP, MOTION_OK } from '@/lib/motion';
import { api } from '@/lib/apiClient';
import { useStudy } from '@/contexts/StudyContext';
import { cn } from '@/lib/utils';
import JobStatusToast from '@/components/JobStatusToast';
import { AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

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
    const pageTitle =
        [...navigationItems, ...settingsItems].find(
            (item) => item.url === location.pathname,
        )?.title ??
        (location.pathname.startsWith('/dashboard/admin') ? 'Admin' : '');

    const outletRef = useRef<HTMLDivElement>(null);
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MOTION_OK, () => {
                if (outletRef.current)
                    gsap.from(outletRef.current, { autoAlpha: 0, y: 12, duration: 0.45, ease: 'power2.out', clearProps: 'all' });
            });
            return () => mm.revert();
        },
        { dependencies: [location.pathname], revertOnUpdate: true },
    );

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
                <div className="relative flex min-h-screen w-full overflow-hidden bg-background text-foreground">
                    <AppSidebar />
                    <div className="flex-1 min-w-0 flex flex-col relative z-10">
                        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-3 supports-[backdrop-filter]:bg-background/85 supports-[backdrop-filter]:backdrop-blur-md sm:px-5">
                            <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground" />
                            <Separator orientation="vertical" className="h-5" />
                            <h1 className="truncate font-display text-lg">
                                {pageTitle}
                            </h1>
                            <div className="ml-auto flex items-center gap-1">
                                <LanguageToggle />
                                <ThemeToggle />
                            </div>
                        </header>


                        {/* Main Content Area */}
                        <main
                            className={cn(
                                'flex-1 min-w-0',
                                isAIAssistantRoute
                                    ? 'overflow-hidden p-0'
                                    : 'overflow-y-auto px-4 pb-10 pt-6 sm:px-6 lg:px-10 lg:pt-8',
                            )}
                        >
                            <div ref={outletRef} className="w-full h-full min-w-0">
                                <Outlet />
                            </div>
                        </main>
                    </div>

                    {/* Background Jobs Progress Container - Moved to Top Right below header */}
                    <div className="fixed top-16 sm:top-20 left-3 right-3 sm:left-auto sm:right-6 z-[100] flex flex-col gap-3 sm:gap-4 pointer-events-none">
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
