'use client';

import { useState, useEffect } from 'react';
import {
    History,
    User,
    LogOut,
    House,
    FileText,
    MessagesSquare,
    TrendingUp,
    Settings,
    ClipboardCheck,
    ShieldCheck,
    ChevronUp,
    Trophy,
    MessageCircle,
    Crown,
    Users2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { api, clearApiCache } from '@/lib/apiClient';
import {
    endImpersonationSession,
    isImpersonationActive,
} from '@/lib/impersonation';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppToast } from '@/hooks/useAppToast';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import {
    ACCOUNTABILITY_PARTNER_ENABLED,
    SUBSCRIPTIONS_ENABLED,
} from '@/config/featureFlags';

export const navigationItems = [
    {
        title: 'Home',
        url: '/dashboard',
        icon: House,
        description: 'Overview and quick access',
    },
    {
        title: 'Notes',
        url: '/dashboard/notes',
        icon: FileText,
        description: 'Manage your notes',
    },
    {
        title: 'Assistant',
        url: '/dashboard/ai-assistant',
        icon: MessagesSquare,
        description: 'Interactive learning with AI',
    },
    {
        title: 'Progress',
        url: '/dashboard/progress',
        icon: TrendingUp,
        description: 'Track your learning journey',
    },
    {
        title: 'History',
        url: '/dashboard/history',
        icon: History,
        description: 'View uploaded files',
    },
    {
        title: 'Exams',
        url: '/dashboard/exams',
        icon: ClipboardCheck,
        description: 'Practice past questions',
    },
    {
        title: 'Leaderboard',
        url: '/dashboard/leaderboard',
        icon: Trophy,
        description: 'See top scholars',
    },
    ...(ACCOUNTABILITY_PARTNER_ENABLED
        ? [
              {
                  title: 'Study partner',
                  url: '/dashboard/partner',
                  icon: Users2,
                  description: 'Study together, stay consistent',
              },
          ]
        : []),
];

export const settingsItems = [
    {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: User,
        description: 'Manage your account',
    },
    ...(SUBSCRIPTIONS_ENABLED
        ? [
              {
                  title: 'Subscription',
                  url: '/dashboard/subscription',
                  icon: Crown,
                  description: 'Manage your plan',
              },
          ]
        : []),
    {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings,
        description: 'Preferences and configuration',
    },
    {
        title: 'Help',
        url: '/dashboard/contact',
        icon: MessageCircle,
        description: 'Get help',
    },
];

export function AppSidebar() {
    const { state } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const appToast = useAppToast();
    const { t } = useLanguage();
    const currentPath = location.pathname;
    const collapsed = state === 'collapsed';
    const getDefaultAvatar = (email: string) =>
        `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(email || 'scholar@izabi.ai')}`;
    const normalizeRole = (role?: string | null) =>
        role?.trim().toUpperCase() || 'USER';
    const [userInfo, setUserInfo] = useState({
        name: localStorage.getItem('userFirstName')
            ? `${localStorage.getItem('userFirstName')} ${localStorage.getItem('userLastName') || ''}`.trim()
            : 'Scholar',
        email: localStorage.getItem('userEmail') || 'scholar@izabi.ai',
        role: normalizeRole(localStorage.getItem('userRole')),
        avatar:
            localStorage.getItem('userProfilePicturePath') ||
            getDefaultAvatar(localStorage.getItem('userEmail') || ''),
        initial: (
            localStorage.getItem('userFirstName')?.[0] ||
            localStorage.getItem('userEmail')?.[0] ||
            'S'
        ).toUpperCase(),
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const firstName = localStorage.getItem('userFirstName');
            const lastName = localStorage.getItem('userLastName');
            const email =
                localStorage.getItem('userEmail') || 'scholar@izabi.ai';

            setUserInfo({
                name: firstName
                    ? `${firstName} ${lastName || ''}`.trim()
                    : 'Scholar',
                email: email,
                role: normalizeRole(localStorage.getItem('userRole')),
                avatar:
                    localStorage.getItem('userProfilePicturePath') ||
                    getDefaultAvatar(email),
                initial: (firstName?.[0] || email?.[0] || 'S').toUpperCase(),
            });
        };

        window.addEventListener('storage', handleStorageChange);
        // Initial sync
        handleStorageChange();

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const isActive = (path: string) => currentPath === path;

    const handleLogout = async () => {
        try {
            await api.logout();
        } catch (error) {
            appToast.error({
                title: t('sidebar.toast_logout_issue_title'),
                description: t('sidebar.toast_logout_issue_desc'),
            });
        } finally {
            clearApiCache();
            localStorage.clear();
            navigate('/login', { replace: true });
        }
    };

    const [impersonating, setImpersonating] = useState(
        isImpersonationActive(),
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setImpersonating(isImpersonationActive());
        };
        window.addEventListener('storage', handleStorageChange);
        handleStorageChange();

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleStopImpersonation = async () => {
        try {
            const result = await api.stopImpersonation();
            if (result?.success) {
                endImpersonationSession();
                appToast.success({
                    title: t('sidebar.toast_impersonation_ended_title'),
                    description: t('sidebar.toast_impersonation_ended_desc'),
                });
                window.location.href = '/dashboard/admin';
                return;
            }
            appToast.error({
                title: t('sidebar.toast_could_not_stop_title'),
                description:
                    result?.message ||
                    t('sidebar.toast_failed_end_impersonation'),
            });
        } catch (error) {
            appToast.apiError(
                error,
                t('sidebar.toast_failed_end_impersonation'),
            );
        }
    };

    const itemClass = (active: boolean) =>
        cn(
            'relative h-10 rounded-md px-3 transition-colors',
            active
                ? 'bg-card font-bold text-foreground shadow-soft ring-1 ring-sidebar-border hover:bg-card'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
        );

    const renderItem = (item: (typeof navigationItems)[number], withId = false) => {
        const active = isActive(item.url);
        return (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={itemClass(active)}
                >
                    <Link
                        to={item.url}
                        id={
                            withId
                                ? `nav-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`
                                : undefined
                        }
                        aria-current={active ? 'page' : undefined}
                        className="flex items-center gap-3"
                    >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && (
                            <span className="truncate text-[15px]">
                                {item.title}
                            </span>
                        )}
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-sidebar-border bg-sidebar"
        >
            <SidebarHeader
                className={cn(
                    'flex h-14 justify-center border-b border-sidebar-border',
                    collapsed ? 'items-center px-2' : 'px-5',
                )}
            >
                <Link to="/dashboard" aria-label="Izabi dashboard" className="rounded-md">
                    <Logo variant={collapsed ? 'mark' : 'full'} height={collapsed ? 26 : 26} />
                </Link>
            </SidebarHeader>

            <SidebarContent className="flex-1 px-3 py-4">
                <SidebarGroup className="p-0">
                    <SidebarGroupLabel className="mb-1 px-3 text-xs font-normal text-muted-foreground">
                        Study
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {navigationItems.map((item) => renderItem(item, true))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-auto p-0 pt-4">
                    <SidebarGroupLabel className="mb-1 px-3 text-xs font-normal text-muted-foreground">
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {settingsItems.map((item) => renderItem(item))}
                            {normalizeRole(userInfo.role) === 'ADMIN' &&
                                renderItem({
                                    title: 'Admin',
                                    url: '/dashboard/admin',
                                    icon: ShieldCheck,
                                    description: 'Admin tools',
                                })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border p-3">
                {impersonating && (
                    <div className="mb-2 rounded-md border border-urgent/40 bg-urgent/10 p-3">
                        <p className="mb-2 text-sm font-bold text-urgent">
                            You are viewing as another user
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleStopImpersonation}
                        >
                            Stop viewing as user
                        </Button>
                    </div>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="h-12 rounded-md data-[state=open]:bg-sidebar-accent"
                        >
                            <Avatar className="h-8 w-8 border border-sidebar-border">
                                <AvatarImage src={userInfo.avatar} alt="" />
                                <AvatarFallback className="text-sm font-bold">
                                    {userInfo.initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-sm font-bold">
                                    {userInfo.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {userInfo.email}
                                </span>
                            </div>
                            <ChevronUp className="ml-auto size-4 text-muted-foreground" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width] p-1"
                    >
                        <DropdownMenuItem asChild className="cursor-pointer">
                            <Link to="/dashboard/profile">
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
