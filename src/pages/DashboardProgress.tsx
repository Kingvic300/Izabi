'use client';

import { useRef } from 'react';
import { PageLoader } from '@/components/PageLoader';
import { PageHeader, SectionTitle } from '@/components/dashboard/PageHeader';
import { useDashboardProgress } from '@/components/dashboard-progress/useDashboardProgress';
import UsageBanner from '@/components/dashboard-progress/UsageBanner';
import ProgressStatCards from '@/components/dashboard-progress/ProgressStatCards';
import ActivityStreaks from '@/components/dashboard-progress/ActivityStreaks';
import ProgressCharts from '@/components/dashboard-progress/ProgressCharts';
import AchievementsSection from '@/components/dashboard-progress/AchievementsSection';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardProgress = () => {
    const { t } = useLanguage();
    const containerRef = useRef<HTMLDivElement>(null);
    const {
        progressData,
        isLoading,
        usage,
        subscription,
        chartData,
        subjectData,
    } = useDashboardProgress();


    if (isLoading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title={t('progress.title')}
                    description={t('progress.loading_subtitle')}
                />
                <PageLoader
                    variant="skeleton-cards"
                    itemCount={4}
                    text={t('progress.calculating')}
                />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="w-full space-y-12 pb-16">
            <PageHeader
                title={t('progress.title')}
                description={t('progress.main_subtitle')}
            />

            {usage && (
                <div className="rounded-lg border border-border bg-card p-5 sm:p-6">
                    <UsageBanner usage={usage} subscription={subscription} />
                </div>
            )}

            <section>
                <SectionTitle title={t('progress.snapshot_label')} />
                <ProgressStatCards progressData={progressData} />
            </section>

            <section>
                <SectionTitle title={t('progress.streaks_label')} />
                <ActivityStreaks activityStreaks={progressData.activityStreaks} />
            </section>

            <section>
                <SectionTitle title={t('progress.insights_label')} />
                <ProgressCharts chartData={chartData} subjectData={subjectData} />
            </section>

            <section>
                <SectionTitle title={t('progress.achievements_label')} />
                <AchievementsSection progressData={progressData} />
            </section>
        </div>
    );
};

export default DashboardProgress;
