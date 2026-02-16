'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAppToast } from '@/hooks/useAppToast';
import { Loader2 } from 'lucide-react';
import AdminDashboardHeader from '@/components/admin-dashboard/AdminDashboardHeader';
import AdminQuickStats from '@/components/admin-dashboard/AdminQuickStats';
import AdminOverviewTab from '@/components/admin-dashboard/AdminOverviewTab';
import AdminUsersTab from '@/components/admin-dashboard/AdminUsersTab';
import AdminUserDetailsSheet from '@/components/admin-dashboard/AdminUserDetailsSheet';
import AdminAnnouncementDialog from '@/components/admin-dashboard/AdminAnnouncementDialog';
import AdminTerminateDialog from '@/components/admin-dashboard/AdminTerminateDialog';
import { processChartData } from '@/components/admin-dashboard/adminUtils';
import type { AdminStats, AdminUser } from '@/components/admin-dashboard/adminTypes';

// Initial empty state
const INITIAL_STATS: AdminStats = {
    totalUsers: 0,
    activeNow: 0,
    totalNotes: 0,
    contributedKeys: 0,
    growth: 0,
};

export default function AdminDashboard() {
    const containerRef = useRef<HTMLDivElement>(null);
    const appToast = useAppToast();
    const [stats, setStats] = useState(INITIAL_STATS);
    const [users, setUsers] = useState<any[]>([]);
    const [keys, setKeys] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);
    const [activityChartData, setActivityChartData] = useState<any[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncingRegistry, setIsSyncingRegistry] = useState(false);
    const [isExportingReport, setIsExportingReport] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [userToTerminate, setUserToTerminate] = useState<AdminUser | null>(
        null,
    );
    const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
    const [isTerminatingAccess, setIsTerminatingAccess] = useState(false);
    const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] =
        useState(false);
    const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false);

    // User Details Sheet State
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const fetchAdminData = useCallback(
        async (setPageLoading = false): Promise<boolean> => {
            if (setPageLoading) {
                setIsLoading(true);
            }

            try {
                const [statsResponse, usersResponse, keysResponse] =
                    await Promise.allSettled([
                        api.getAdminStats(),
                        api.getAllUsers(),
                        api.getContributedKeys(),
                    ]);

                const hasAnySuccess = [
                    statsResponse,
                    usersResponse,
                    keysResponse,
                ].some((result) => result.status === 'fulfilled');

                if (!hasAnySuccess) {
                    throw new Error('Failed to refresh admin data from server');
                }

                if (
                    statsResponse.status === 'fulfilled' &&
                    statsResponse.value?.data
                ) {
                    const data = statsResponse.value.data;
                    setStats({
                        totalUsers: data.totalUsers || 0,
                        activeNow: data.activeNow || 0,
                        totalNotes: data.totalNotes || 0,
                        contributedKeys: data.contributedKeys || 0,
                        growth: data.growth || 0,
                    });

                    if (data.userGrowthChart && data.userGrowthChart.length > 0) {
                        setChartData(data.userGrowthChart);
                    }
                    if (data.activityChart && data.activityChart.length > 0) {
                        setActivityChartData(data.activityChart);
                    }
                    if (
                        data.recentActivities &&
                        data.recentActivities.length > 0
                    ) {
                        setRecentActivities(data.recentActivities);
                    }
                }

                let userList: any[] = [];
                if (
                    usersResponse.status === 'fulfilled' &&
                    usersResponse.value?.data
                ) {
                    userList = Array.isArray(usersResponse.value.data)
                        ? usersResponse.value.data
                        : [];
                    setUsers(userList);

                    const statsData =
                        statsResponse.status === 'fulfilled'
                            ? statsResponse.value.data
                            : null;
                    const hasChartData =
                        statsData?.userGrowthChart &&
                        statsData.userGrowthChart.length > 0;

                    if (!hasChartData && userList.length > 0) {
                        const processedChart = processChartData(userList);
                        setChartData(processedChart);
                    }
                }

                const keysData =
                    keysResponse.status === 'fulfilled'
                        ? keysResponse.value.data
                        : null;
                if (keysData) {
                    setKeys(Array.isArray(keysData) ? keysData : []);
                }

                return true;
            } catch (error) {
                console.error('Failed to fetch admin data', error);
                appToast.apiError(error, 'Could not refresh admin data');
                return false;
            } finally {
                if (setPageLoading) {
                    setIsLoading(false);
                }
            }
        },
        [appToast],
    );

    useEffect(() => {
        void fetchAdminData(true);
    }, [fetchAdminData]);

    useGSAP(() => {
        if (!isLoading) {
            gsap.from('.admin-card', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power4.out',
            });
        }
    }, [isLoading]);

    const handleDeleteUser = (user: AdminUser, event: React.MouseEvent) => {
        event.stopPropagation();
        setUserToTerminate(user);
        setIsTerminateDialogOpen(true);
    };

    const handleSyncRegistry = async () => {
        if (isSyncingRegistry) return;
        setIsSyncingRegistry(true);
        appToast.info({
            title: 'Sync in progress',
            description: 'Refreshing user, stats, and key data...',
        });

        const ok = await fetchAdminData(false);
        if (ok) {
            appToast.success({
                title: 'Registry Synced',
                description: 'System data has been refreshed.',
            });
        }
        setIsSyncingRegistry(false);
    };

    const handleExportReport = async () => {
        if (isExportingReport) return;
        setIsExportingReport(true);
        try {
            const report = {
                generatedAt: new Date().toISOString(),
                stats,
                users,
                contributedKeys: keys,
                activity: recentActivities,
                charts: {
                    users: chartData,
                    activity: activityChartData,
                },
            };

            const blob = new Blob([JSON.stringify(report, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const stamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.href = url;
            link.download = `izabi-system-report-${stamp}.json`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);

            appToast.success({
                title: 'System Report Downloaded',
                description: 'The latest admin report is now on your device.',
            });
        } catch (error) {
            appToast.apiError(error, 'System Report Failed');
        } finally {
            setIsExportingReport(false);
        }
    };

    const handleSendAnnouncement = async () => {
        if (isSendingAnnouncement) return;
        setIsSendingAnnouncement(true);
        try {
            const result = await api.sendLiveAnnouncement();
            if (result?.success) {
                appToast.success({
                    title: 'Announcement Sent',
                    description: `Sent to ${result.sent || 0} of ${result.total || 0} users.`,
                });
            } else {
                appToast.error({
                    title: 'Announcement Failed',
                    description:
                        result?.message ||
                        'Could not send the live announcement.',
                });
            }
        } catch (error) {
            appToast.apiError(error, 'Announcement Failed');
        } finally {
            setIsSendingAnnouncement(false);
            setIsAnnouncementDialogOpen(false);
        }
    };

    const handleFilterAction = () => {
        const hasFilters = searchQuery.trim().length > 0 || showActiveOnly;
        if (hasFilters) {
            setSearchQuery('');
            setShowActiveOnly(false);
            appToast.info({
                title: 'Filters Cleared',
                description: 'Showing all users again.',
            });
            return;
        }

        setShowActiveOnly(true);
        appToast.info({
            title: 'Filter Applied',
            description: 'Now showing active users only.',
        });
    };

    const handleConfirmTerminateUser = async () => {
        if (!userToTerminate || isTerminatingAccess) return;

        try {
            setIsTerminatingAccess(true);
            await api.deleteUser(userToTerminate.id);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== userToTerminate.id),
            );
            appToast.success({
                title: 'Success',
                description: 'User access terminated successfully',
            });
            setIsTerminateDialogOpen(false);
            setUserToTerminate(null);
        } catch (error) {
            appToast.error({
                title: 'Failed',
                description: 'Could not delete user',
            });
        } finally {
            setIsTerminatingAccess(false);
        }
    };

    const handleViewUser = async (userId: string) => {
        setSelectedUserId(userId);
        setIsSheetOpen(true);
        setIsDetailsLoading(true);
        try {
            const response = await api.getUserHistory(userId);
            if (response.success) {
                setUserDetails(response.data);
            }
        } catch (error) {
            const status = (error as any)?.response?.status;
            if (status === 404) {
                appToast.info({
                    title: 'User not found',
                    description:
                        'This user may have been removed. Refreshing the registry.',
                });
                void fetchAdminData(false);
            } else {
                appToast.error({
                    title: 'Error',
                    description: 'Failed to load user details',
                });
            }
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const handleAnnouncementOpenChange = (open: boolean) => {
        if (isSendingAnnouncement) return;
        setIsAnnouncementDialogOpen(open);
    };

    const handleTerminateOpenChange = (open: boolean) => {
        if (isTerminatingAccess) return;
        setIsTerminateDialogOpen(open);
        if (!open) {
            setUserToTerminate(null);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-40">
                    Decrypting Admin Secure Layer...
                </p>
            </div>
        );
    }

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

        if (showActiveOnly) {
            if (!user.lastStudyDate) return false;
            const lastActive = new Date(user.lastStudyDate);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return matchesSearch && lastActive > sevenDaysAgo;
        }

        return matchesSearch;
    });

    const userDisplayName = userToTerminate
        ? `${userToTerminate.firstName || ''} ${userToTerminate.lastName || ''}`.trim() ||
          userToTerminate.email ||
          'this user'
        : 'this user';

    return (
        <div
            ref={containerRef}
            className="space-y-6 md:space-y-10 w-full pb-6 md:pb-20 px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 pt-4 md:pt-8 max-w-[1700px] mx-auto"
        >
            <AdminDashboardHeader
                onOpenAnnouncement={() => setIsAnnouncementDialogOpen(true)}
                onSyncRegistry={handleSyncRegistry}
                onExportReport={handleExportReport}
                isSendingAnnouncement={isSendingAnnouncement}
                isSyncingRegistry={isSyncingRegistry}
                isExportingReport={isExportingReport}
            />

            <AdminQuickStats stats={stats} />

            <Tabs defaultValue="overview" className="w-full">
                <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                    <TabsList className="h-14 bg-card/5 border border-foreground/10 p-1.5 rounded-2xl mb-4 w-full md:w-auto inline-flex min-w-max">
                        <TabsTrigger
                            value="overview"
                            className="flex-1 md:flex-none rounded-xl px-6 md:px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                        >
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="flex-1 md:flex-none rounded-xl px-6 md:px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                        >
                            User Registry
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview">
                    <AdminOverviewTab
                        chartData={chartData}
                        recentActivities={recentActivities}
                        onViewUser={handleViewUser}
                    />
                </TabsContent>

                <TabsContent value="users">
                    <AdminUsersTab
                        filteredUsers={filteredUsers}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        showActiveOnly={showActiveOnly}
                        onToggleActiveOnly={() =>
                            setShowActiveOnly(!showActiveOnly)
                        }
                        onFilterAction={handleFilterAction}
                        onViewUser={handleViewUser}
                        onDeleteUser={handleDeleteUser}
                    />
                </TabsContent>
            </Tabs>

            <AdminUserDetailsSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                userDetails={userDetails}
                isDetailsLoading={isDetailsLoading}
            />

            <AdminAnnouncementDialog
                open={isAnnouncementDialogOpen}
                onOpenChange={handleAnnouncementOpenChange}
                onSend={handleSendAnnouncement}
                isSending={isSendingAnnouncement}
            />

            <AdminTerminateDialog
                open={isTerminateDialogOpen}
                onOpenChange={handleTerminateOpenChange}
                onConfirm={handleConfirmTerminateUser}
                isTerminating={isTerminatingAccess}
                userDisplayName={userDisplayName}
                userEmail={userToTerminate?.email}
            />
        </div>
    );
}
