'use client';

import { useRef } from 'react';
import { PageLoader } from '@/components/PageLoader';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDashboardProgress } from '@/components/dashboard-progress/useDashboardProgress';
import ProgressHeader from '@/components/dashboard-progress/ProgressHeader';
import UsageBanner from '@/components/dashboard-progress/UsageBanner';
import ProgressStatCards from '@/components/dashboard-progress/ProgressStatCards';
import ActivityStreaks from '@/components/dashboard-progress/ActivityStreaks';
import ProgressCharts from '@/components/dashboard-progress/ProgressCharts';
import AchievementsSection from '@/components/dashboard-progress/AchievementsSection';

const DashboardProgress = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        progressData,
        isLoading,
        usage,
        subscription,
        chartData,
        subjectData,
    } = useDashboardProgress();

    useGSAP(
        () => {
            if (!isLoading) {
                gsap.from('.prog-header', {
                    opacity: 0,
                    y: -20,
                    duration: 0.6,
                });
                gsap.from('.stat-card', {
                    opacity: 0,
                    scale: 0.9,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                });
                gsap.from('.chart-card', {
                    opacity: 0,
                    y: 30,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            }
        },
        { scope: containerRef, dependencies: [isLoading] },
    );

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                    Your Performance
                </h1>
                <p className="text-muted-foreground">
                    Track your learning journey and see your improvement over
                    time.
                </p>
                <PageLoader
                    variant="skeleton-cards"
                    itemCount={4}
                    text="Calculating your progress..."
                />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="space-y-8 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12"
        >
            <div className="prog-header space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                        Progress
                    </span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                            Your Performance
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium max-w-2xl">
                            Visualize your study momentum, streaks, and weekly
                            growth at a glance.
                        </p>
                    </div>
                </div>
                <div className="glass-card border-foreground/10 rounded-[28px] p-5 sm:p-6">
                    <ProgressHeader studyStreak={progressData.studyStreak} />
                </div>
            </div>

            {/* Usage & Subscription Banner */}
            {usage && (
                <div className="glass-card border-foreground/10 rounded-[28px] p-4 sm:p-6">
                    <UsageBanner usage={usage} subscription={subscription} />
                </div>
            )}

            <section className="space-y-4">
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Performance Snapshot
                </div>
                <ProgressStatCards progressData={progressData} />
            </section>

            <section className="space-y-4">
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Streaks
                </div>
                <ActivityStreaks
                    activityStreaks={progressData.activityStreaks}
                />
            </section>

            <section className="space-y-4">
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Insights
                </div>
                <ProgressCharts
                    chartData={chartData}
                    subjectData={subjectData}
                />
            </section>

            <section className="space-y-4">
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">
                    Achievements
                </div>
                <AchievementsSection progressData={progressData} />
            </section>
        </div>
    );
};

export default DashboardProgress;
