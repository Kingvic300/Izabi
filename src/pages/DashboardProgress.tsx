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
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter italic bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
                    Learning Progress
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
            className="space-y-6 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12"
        >
            <ProgressHeader studyStreak={progressData.studyStreak} />

            {/* Usage & Subscription Banner */}
            {usage && (
                <UsageBanner usage={usage} subscription={subscription} />
            )}

            <ProgressStatCards progressData={progressData} />

            {/* Multi-Streak Tracks */}
            <ActivityStreaks
                activityStreaks={progressData.activityStreaks}
            />

            <ProgressCharts
                chartData={chartData}
                subjectData={subjectData}
            />

            <AchievementsSection progressData={progressData} />
        </div>
    );
};

export default DashboardProgress;
