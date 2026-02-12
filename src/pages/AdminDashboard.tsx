'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Users,
    ShieldCheck,
    Database,
    Key,
    Trash2,
    Activity,
    TrendingUp,
    MoreVertical,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ShieldAlert,
    Clock,
    FileText,
    BrainCircuit,
    UserCircle,
    CheckCircle2,
    XCircle,
    Calendar,
    Award,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { api } from '@/lib/apiClient';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAppToast } from '@/hooks/useAppToast';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type AdminUser = {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    streak?: number;
    isVerified?: boolean;
    createdAt?: string;
    lastStudyDate?: string;
};

// Initial empty state
const INITIAL_STATS = {
    totalUsers: 0,
    activeNow: 0,
    totalNotes: 0,
    contributedKeys: 0,
    growth: 0,
};

const processChartData = (users: any[]) => {
    const last7Days: Record<string, number> = {};
    const today = new Date();

    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        last7Days[dateStr] = 0;
    }

    // Sort users into dates
    users.forEach((u) => {
        if (u.createdAt) {
            const d = new Date(u.createdAt);
            const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
            if (last7Days[dateStr] !== undefined) {
                last7Days[dateStr]++;
            }
        }
    });

    return Object.keys(last7Days).map((key) => ({
        name: key,
        users: last7Days[key] * 5,
        requests: last7Days[key] * 25,
    }));
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
    const [searchQuery, setSearchQuery] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(false);
    const [userToTerminate, setUserToTerminate] = useState<AdminUser | null>(
        null,
    );
    const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
    const [isTerminatingAccess, setIsTerminatingAccess] = useState(false);

    // User Details Sheet State
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsResponse, usersResponse, keysResponse] =
                    await Promise.allSettled([
                        api.getAdminStats(),
                        api.getAllUsers(),
                        api.getContributedKeys(),
                    ]);

                // Handle stats data
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

                    if (
                        data.userGrowthChart &&
                        data.userGrowthChart.length > 0
                    ) {
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

                // Handle users data
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

                // Handle keys data
                const keysData =
                    keysResponse.status === 'fulfilled'
                        ? keysResponse.value.data
                        : null;
                if (keysData) {
                    setKeys(Array.isArray(keysData) ? keysData : []);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch admin data', error);
                setIsLoading(false);
            }
        };

        fetchAdminData();
    }, []);

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

    const handleDeleteUser = (user: AdminUser, e: React.MouseEvent) => {
        e.stopPropagation();
        setUserToTerminate(user);
        setIsTerminateDialogOpen(true);
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
            appToast.error({
                title: 'Error',
                description: 'Failed to load user details',
            });
        } finally {
            setIsDetailsLoading(false);
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'NOTE_CREATED':
                return <FileText size={14} className="text-blue-400" />;
            case 'QUIZ_COMPLETED':
                return <BrainCircuit size={14} className="text-purple-400" />;
            case 'ACCOUNT_CREATED':
                return <UserCircle size={14} className="text-green-400" />;
            default:
                return <Activity size={14} className="text-gray-400" />;
        }
    };

    const getActivityText = (act: any) => {
        switch (act.type) {
            case 'NOTE_CREATED':
                return `Created note: ${act.title || 'Untitled'}`;
            case 'QUIZ_COMPLETED':
                return `Completed quiz: ${act.title} (${act.score}%)`;
            case 'ACCOUNT_CREATED':
                return `Account registered`;
            default:
                return 'Unknown activity';
        }
    };

    const formatTimeAgo = (dateIdx: string | Date) => {
        const date = new Date(dateIdx);
        const now = new Date();
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000,
        );

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
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

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

        if (showActiveOnly) {
            if (!u.lastStudyDate) return false;
            const lastActive = new Date(u.lastStudyDate);
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
            className="space-y-6 md:space-y-10 w-full pb-6 md:pb-20 px-3 md:px-6 lg:px-12 pt-4 md:pt-8 max-w-[1700px] mx-auto"
        >
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 pb-3 border-b border-foreground/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge
                            variant="outline"
                            className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold text-[10px] tracking-widest uppercase"
                        >
                            Admin Command Center
                        </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter leading-none">
                        System{' '}
                        <span className="text-gradient">Intelligence</span>
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                    <Button
                        variant="outline"
                        className="glass h-11 md:h-12 rounded-2xl border-foreground/10 hover:bg-card/5 transition-all w-full lg:w-auto"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Sync Registry
                    </Button>
                    <Button className="h-11 md:h-12 rounded-2xl bg-primary shadow-glow hover:bg-primary-glow font-bold px-6 md:px-8 w-full lg:w-auto">
                        System Export
                    </Button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    {
                        label: 'Fleet Population',
                        value: stats.totalUsers,
                        sub: `+${stats.growth}% this month`,
                        icon: Users,
                        color: 'text-primary',
                        trend: 'up',
                    },
                    {
                        label: 'Active Neurons',
                        value: stats.activeNow,
                        sub: 'Live connected users',
                        icon: Activity,
                        color: 'text-primary',
                        trend: 'up',
                    },
                    {
                        label: 'Knowledge Base',
                        value: stats.totalNotes,
                        sub: 'Student notes indexed',
                        icon: Database,
                        color: 'text-primary',
                        trend: 'up',
                    },
                    {
                        label: 'AI Fuel Level',
                        value: stats.contributedKeys,
                        sub: 'Active Groq keys',
                        icon: Key,
                        color: 'text-primary',
                        trend: 'down',
                    },
                ].map((stat, i) => (
                    <Card
                        key={i}
                        className="admin-card glass border-foreground/5 shadow-xl hover-lift group overflow-hidden"
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-40">
                                {stat.label}
                            </CardTitle>
                            <stat.icon
                                size={18}
                                className={cn(
                                    stat.color,
                                    'group-hover:scale-110 transition-transform',
                                )}
                            />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl md:text-3xl font-bold tracking-tighter mb-1">
                                {stat.value.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                {stat.trend === 'up' ? (
                                    <ArrowUpRight
                                        size={14}
                                        className="text-primary"
                                    />
                                ) : (
                                    <ArrowDownRight
                                        size={14}
                                        className="text-destructive"
                                    />
                                )}
                                <p className="text-xs font-medium text-muted-foreground">
                                    {stat.sub}
                                </p>
                            </div>
                        </CardContent>
                        <div
                            className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent`}
                        />
                    </Card>
                ))}
            </div>

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
                        <TabsTrigger
                            value="keys"
                            className="flex-1 md:flex-none rounded-xl px-6 md:px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                        >
                            API Inventory
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent
                    value="overview"
                    className="space-y-8 animate-in fade-in slide-in-from-bottom-5"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <Card className="lg:col-span-8 glass border-foreground/5 p-3 sm:p-4 md:p-8 rounded-2xl shadow-2xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-10 gap-4">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                                        System Utilization
                                    </h3>
                                    <p className="text-muted-foreground font-medium">
                                        Network activity over the last 7 cycles
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-primary/20 text-primary border-none">
                                        Live Monitoring
                                    </Badge>
                                </div>
                            </div>
                            <div className="h-[260px] sm:h-[300px] md:h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient
                                                id="colorUsers"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#8b5cf6"
                                                    stopOpacity={0.8}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#8b5cf6"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-muted"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            className="text-xs font-medium"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            className="text-xs font-medium"
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'rgba(20, 20, 20, 0.9)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                boxShadow:
                                                    '0 4px 12px rgba(0, 0, 0, 0.5)',
                                            }}
                                            labelStyle={{ color: '#aaa' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#8b5cf6"
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <div className="lg:col-span-4 space-y-6">
                            <Card className="glass border-foreground/5 p-4 md:p-8 rounded-2xl shadow-2xl h-full flex flex-col">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp
                                        className="text-primary"
                                        size={20}
                                    />
                                    Live Activity Stream
                                </h3>
                                <ScrollArea className="flex-1 pr-4 -mr-4 h-[400px]">
                                    <div className="space-y-6">
                                        {recentActivities.length > 0 ? (
                                            recentActivities.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 group cursor-pointer hover:bg-card/5 p-2 rounded-lg transition-all"
                                                    onClick={() =>
                                                        item.user &&
                                                        handleViewUser(
                                                            item.user._id ||
                                                                item.user,
                                                        )
                                                    }
                                                >
                                                    <div className="flex gap-4 items-start">
                                                        <div className="w-10 h-10 rounded-2xl bg-card/5 flex items-center justify-center font-bold text-xs group-hover:bg-primary/20 transition-all shrink-0">
                                                            {getActivityIcon(
                                                                item.type,
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm tracking-tight">
                                                                {item.user
                                                                    ?.firstName
                                                                    ? `${item.user.firstName} ${item.user.lastName}`
                                                                    : item.user
                                                                          ?._id ||
                                                                      'Unknown'}
                                                            </p>
                                                            <p className="text-[11px] font-medium opacity-60 line-clamp-1">
                                                                {getActivityText(
                                                                    item,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold opacity-30 italic whitespace-nowrap ml-2 sm:ml-0">
                                                        {formatTimeAgo(
                                                            item.date,
                                                        )}
                                                    </span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="flex flex-col items-center justify-center opacity-40 py-10">
                                                <Activity
                                                    className="mb-2"
                                                    size={32}
                                                />
                                                <p className="text-xs uppercase font-bold tracking-widest">
                                                    No Recent Signals
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent
                    value="users"
                    className="animate-in fade-in slide-in-from-bottom-5"
                >
                    <Card className="glass border-foreground/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-3 sm:p-4 md:p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold">
                                    Account Registry
                                </h3>
                                <p className="text-muted-foreground font-medium">
                                    Monitor and manage access across the
                                    platform
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                                <div className="flex items-center space-x-2">
                                    <Badge
                                        variant={
                                            showActiveOnly
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="cursor-pointer select-none bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                                        onClick={() =>
                                            setShowActiveOnly(!showActiveOnly)
                                        }
                                    >
                                        Active Only
                                    </Badge>
                                </div>
                                <div className="relative w-full sm:w-72">
                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        size={20}
                                    />
                                    <Input
                                        placeholder="Search by ID or email..."
                                        className="pl-12 rounded-2xl glass border-foreground/10 h-11 md:h-14 font-medium w-full"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>
                                <Button className="h-11 w-full sm:w-11 md:h-14 md:w-14 rounded-2xl bg-card/5 border border-foreground/10 p-0 text-foreground hover:bg-card/10 shrink-0">
                                    <Filter size={20} />
                                </Button>
                            </div>
                        </div>

                        <div className="p-3 sm:p-4 md:p-8 pt-4">
                            <div className="md:hidden space-y-3">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="rounded-2xl border border-foreground/10 bg-card/5 p-3 space-y-3"
                                            onClick={() =>
                                                handleViewUser(user.id)
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center font-bold text-primary uppercase shrink-0">
                                                    {user.email?.[0] || 'U'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold leading-tight tracking-tight truncate">
                                                        {user.firstName}{' '}
                                                        {user.lastName}
                                                    </p>
                                                    <p className="text-xs opacity-50 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {user.isVerified ? (
                                                    <Badge className="bg-green-500/10 text-green-500 border-none px-2 py-1 font-bold">
                                                        Verified
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-500/10 text-yellow-500 border-none px-2 py-1 font-bold">
                                                        Pending
                                                    </Badge>
                                                )}
                                                <Badge className="bg-primary/10 text-primary border-none px-2 py-1 font-bold">
                                                    {user.streak || 0} Streak
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-[11px] opacity-50">
                                                    Joined{' '}
                                                    {new Date(
                                                        user.createdAt ||
                                                            Date.now(),
                                                    ).toLocaleDateString(
                                                        'en-GB',
                                                    )}
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-xl"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewUser(user.id);
                                                    }}
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center opacity-30 font-bold italic uppercase tracking-widest">
                                        No Active Records Found
                                    </div>
                                )}
                            </div>

                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                <TableHeader>
                                    <TableRow className="border-foreground/5 hover:bg-transparent uppercase tracking-widest text-[10px] font-bold opacity-40">
                                        <TableHead>
                                            User Identification
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Account Status
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Engagement
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Registry Date
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <TableRow
                                                key={user.id}
                                                className="border-foreground/5 hover:bg-card/5 transition-colors py-4 cursor-pointer"
                                                onClick={() =>
                                                    handleViewUser(user.id)
                                                }
                                            >
                                                <TableCell className="py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center font-bold text-lg text-primary uppercase shrink-0">
                                                            {user.email?.[0] ||
                                                                'U'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg leading-tight tracking-tight">
                                                                {user.firstName}{' '}
                                                                {user.lastName}
                                                            </p>
                                                            <p className="text-sm opacity-40 font-medium">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {user.isVerified ? (
                                                        <Badge className="bg-green-500/10 text-green-500 border-none px-3 py-1 font-bold">
                                                            Verified
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-yellow-500/10 text-yellow-500 border-none px-3 py-1 font-bold">
                                                            Pending
                                                        </Badge>
                                                    )}
                                                    {user.lastStudyDate &&
                                                        new Date(
                                                            user.lastStudyDate,
                                                        ) >
                                                            new Date(
                                                                Date.now() -
                                                                    7 *
                                                                        24 *
                                                                        60 *
                                                                        60 *
                                                                        1000,
                                                            ) && (
                                                            <Badge className="ml-2 bg-blue-500/10 text-blue-500 border-none px-3 py-1 font-bold">
                                                                Active
                                                            </Badge>
                                                        )}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold">
                                                            {user.streak || 0}{' '}
                                                            Streak
                                                        </p>
                                                        <div className="w-24 h-1 bg-card/5 rounded-2xl overflow-hidden">
                                                            <div
                                                                className="h-full bg-primary"
                                                                style={{
                                                                    width: `${Math.min((user.streak || 0) * 10, 100)}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs opacity-60 hidden lg:table-cell">
                                                    {new Date(
                                                        user.createdAt ||
                                                            Date.now(),
                                                    ).toLocaleDateString(
                                                        'en-GB',
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                className="h-10 w-10 p-0 rounded-2xl hover:bg-card/5"
                                                            >
                                                                <MoreVertical
                                                                    size={18}
                                                                />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="glass border-foreground/10 rounded-2xl p-2 w-48 shadow-2xl"
                                                        >
                                                            <DropdownMenuItem
                                                                className="rounded-2xl px-4 py-3 font-bold cursor-pointer"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleViewUser(
                                                                        user.id,
                                                                    );
                                                                }}
                                                            >
                                                                View
                                                                Intelligence
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="rounded-2xl px-4 py-3 font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                                                                onClick={(e) =>
                                                                    handleDeleteUser(
                                                                        user,
                                                                        e,
                                                                    )
                                                                }
                                                            >
                                                                Terminate Access
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="py-20 text-center opacity-30 font-bold text-xl italic uppercase tracking-widest"
                                            >
                                                No Active Records Found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                </Table>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent
                    value="keys"
                    className="animate-in fade-in slide-in-from-bottom-5"
                >
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="glass border-foreground/5 rounded-2xl overflow-hidden shadow-2xl">
                            <CardHeader className="p-4 md:p-10 pb-4 md:pb-6 border-b border-foreground/5 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl font-bold">
                                        AI Inventory
                                    </CardTitle>
                                    <CardDescription className="text-sm md:text-lg">
                                        Monitoring donated Groq API resources
                                        for student compute
                                    </CardDescription>
                                </div>
                                <div className="p-3 md:p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                                    <Key size={24} className="md:w-8 md:h-8" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 sm:p-4 md:p-10 pt-4 md:pt-6">
                                <div className="space-y-6">
                                    {keys.length > 0 ? (
                                        keys.map((key, i) => (
                                            <div
                                                key={i}
                                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 rounded-2xl bg-card/5 border border-foreground/5 hover:bg-card/10 transition-all group gap-4"
                                            >
                                                <div className="flex gap-4 md:gap-6 items-center">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                        <Database size={24} />
                                                    </div>
                                                    <div className="break-all">
                                                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                                                            <p className="font-bold text-base md:text-lg">
                                                                Key ending in
                                                                ...
                                                                {key.apiKey?.slice(
                                                                    -6,
                                                                )}
                                                            </p>
                                                            <Badge className="w-fit bg-primary/10 text-primary border-none font-bold text-[10px] uppercase">
                                                                Active
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm opacity-40 font-medium">
                                                            Contributed by User
                                                            ID:{' '}
                                                            <span className="font-mono text-xs">
                                                                {key.userId}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4 items-center w-full sm:w-auto justify-end">
                                                    <div className="text-right hidden md:block mr-4">
                                                        <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-1">
                                                            Last Validated
                                                        </p>
                                                        <p className="font-bold text-sm">
                                                            {new Date(
                                                                key.createdAt ||
                                                                    Date.now(),
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-10 w-10 md:h-12 md:w-12 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                                                    >
                                                        <Trash2 size={20} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 flex flex-col items-center justify-center opacity-30 grayscale">
                                            <ShieldAlert
                                                size={64}
                                                className="mb-4"
                                            />
                                            <p className="text-2xl font-bold italic tracking-widest uppercase">
                                                No API Contributions Found
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent
                    side="right"
                    className="w-full sm:max-w-xl p-0 glass border-l border-foreground/10 gap-0 overflow-hidden flex flex-col"
                >
                    {userDetails ? (
                        <>
                            <div className="p-4 md:p-8 border-b border-foreground/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
                                <div className="relative z-10 flex items-center gap-4 md:gap-6">
                                    <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-card/5 border border-foreground/10 shadow-lg flex items-center justify-center text-2xl md:text-3xl font-bold text-foreground/60">
                                        {userDetails.user.email?.[0]?.toUpperCase() ||
                                            'U'}
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-3xl font-bold tracking-tight">
                                            {userDetails.user.firstName}{' '}
                                            {userDetails.user.lastName}
                                        </h2>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <Badge
                                                variant="outline"
                                                className="border-foreground/10 bg-card/5 text-xs font-medium"
                                            >
                                                {userDetails.user.email}
                                            </Badge>
                                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/80 border-none">
                                                {userDetails.user.points} XP
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-1">
                                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                                    {/* Missing Actions Section */}
                                    {userDetails.missingActions &&
                                        userDetails.missingActions.length >
                                            0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                                                    <XCircle
                                                        size={14}
                                                        className="text-destructive"
                                                    />{' '}
                                                    Needs Attention
                                                </h3>
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
                                                                <div className="w-2 h-2 rounded-full bg-destructive/50" />
                                                                <span className="text-sm font-medium text-destructive/80">
                                                                    {action}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5">
                                            <div className="flex items-center gap-2 mb-2 opacity-50">
                                                <Calendar size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">
                                                    Joined
                                                </span>
                                            </div>
                                            <p className="font-mono font-bold">
                                                {new Date(
                                                    userDetails.user.createdAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5">
                                            <div className="flex items-center gap-2 mb-2 opacity-50">
                                                <Award size={14} />
                                                <span className="text-xs font-bold uppercase tracking-wider">
                                                    Streak
                                                </span>
                                            </div>
                                            <p className="font-mono font-bold">
                                                {userDetails.user.streaks
                                                    ?.global || 0}{' '}
                                                Days
                                            </p>
                                        </div>
                                    </div>

                                    {/* History Timeline */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest opacity-40 flex items-center gap-2">
                                            <Clock size={14} /> Intelligence
                                            Timeline
                                        </h3>
                                        <div className="relative pl-4 space-y-8 border-l border-foreground/10 ml-2">
                                            {userDetails.history &&
                                            userDetails.history.length > 0 ? (
                                                userDetails.history.map(
                                                    (event: any, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="relative pl-6"
                                                        >
                                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-background" />
                                                            <div className="space-y-1">
                                                                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mb-1">
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
                                                                <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 hover:bg-card/10 transition-colors">
                                                                    <div className="flex items-center gap-3 mb-2">
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
                                                                    </div>
                                                                    {event.details &&
                                                                        event
                                                                            .details
                                                                            .score !==
                                                                            undefined && (
                                                                            <Badge
                                                                                variant="secondary"
                                                                                className="bg-card/10 mt-1"
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

            <AlertDialog
                open={isTerminateDialogOpen}
                onOpenChange={(open) => {
                    if (isTerminatingAccess) return;
                    setIsTerminateDialogOpen(open);
                    if (!open) {
                        setUserToTerminate(null);
                    }
                }}
            >
                <AlertDialogContent className="glass border-red-500/20 rounded-3xl p-0 overflow-hidden max-w-[92vw] sm:max-w-md">
                    <div className="border-b border-red-500/20 bg-red-500/5 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                                <ShieldAlert size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] font-bold text-red-300/70">
                                    Security Action
                                </p>
                                <h3 className="font-bold text-base text-red-100">
                                    Terminate User Access
                                </h3>
                            </div>
                        </div>
                    </div>

                    <AlertDialogHeader className="px-5 pt-5 pb-0 text-left space-y-2">
                        <AlertDialogTitle className="text-xl font-extrabold tracking-tight">
                            Confirm account termination
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed text-foreground/70">
                            You are about to revoke platform access for{' '}
                            <span className="font-bold text-foreground">
                                {userDisplayName}
                            </span>
                            . This user will lose access immediately and must be
                            re-authorized to sign in again.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {userToTerminate?.email && (
                        <div className="mx-5 mt-4 rounded-2xl border border-foreground/10 bg-card/30 px-4 py-3">
                            <p className="text-[11px] uppercase tracking-[0.12em] font-bold opacity-50 mb-1">
                                Account Email
                            </p>
                            <p className="font-medium break-all">
                                {userToTerminate.email}
                            </p>
                        </div>
                    )}

                    <AlertDialogFooter className="px-5 pb-5 pt-5 gap-2">
                        <AlertDialogCancel
                            disabled={isTerminatingAccess}
                            className="rounded-xl border-foreground/10"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            type="button"
                            onClick={handleConfirmTerminateUser}
                            disabled={isTerminatingAccess}
                            className="rounded-xl bg-red-600 hover:bg-red-600/90 text-white font-bold min-w-40"
                        >
                            {isTerminatingAccess ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Terminating...
                                </>
                            ) : (
                                'Terminate Access'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
