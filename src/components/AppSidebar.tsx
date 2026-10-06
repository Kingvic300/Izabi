'use client';

import { useState, useEffect } from 'react';
import {
    History,
    User,
    LogOut,
    Brain,
    LayoutDashboard,
    FileText,
    Zap,
    TrendingUp,
    Settings,
    GraduationCap,
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
import {
    ACCOUNTABILITY_PARTNER_ENABLED,
    SUBSCRIPTIONS_ENABLED,
} from '@/config/featureFlags';

export const navigationItems = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and quick access',
    },
    {
        title: 'Notes',
        url: '/dashboard/notes',
        icon: FileText,
        description: 'Manage your notes',
    },
    {
        title: 'AI Assistant',
        url: '/dashboard/ai-assistant',
        icon: Zap,
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
        icon: GraduationCap,
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
                  title: 'Accountability Partner',
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
        title: 'Help & Support',
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

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-sidebar-border bg-sidebar"
        >
            {/* Header */}
            <SidebarHeader
                className={`border-b border-sidebar-border ${collapsed ? 'p-3' : 'p-5'}`}
            >
                <Logo
                    size={collapsed ? 40 : 136}
                    height={collapsed ? 40 : 40}
                    className={collapsed ? 'justify-center' : ''}
                />
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="flex-1 px-3 py-5">
                {/* Main Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide mb-2 px-3 text-muted-foreground/70">
                        Study
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {navigationItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            className={`relative h-10 rounded-md px-3 transition-colors
                                                ${active ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60'}
                                            `}
                                        >
                                            <Link
                                                to={item.url}
                                                id={`nav-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                                                onClick={(e) => {
                                                    if (
                                                        (item as any).status ===
                                                        'unavailable'
                                                    ) {
                                                        e.preventDefault();
                                                        return;
                                                    }
                                                }}
                                                className="flex items-center gap-3"
                                            >
                                                {active && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                                                    />
                                                )}
                                                <item.icon
                                                    className="h-[18px] w-[18px] shrink-0"
                                                />
                                                {!collapsed && (
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <span
                                                            className="text-sm font-medium"
                                                        >
                                                            {item.title}
                                                        </span>
                                                        {(item as any)
                                                            .status ===
                                                            'unavailable' && (
                                                            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-urgent/15 text-urgent">
                                                                Soon
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings Group */}
                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel className="text-[11px] font-semibold tracking-wide mb-2 px-3 text-muted-foreground/70">
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            {settingsItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            className={`relative h-10 rounded-md px-3 transition-colors
                                                ${active ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60'}
                                            `}
                                        >
                                            <Link
                                                to={item.url}
                                                className="flex items-center gap-3"
                                            >
                                                {active && (
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                                                    />
                                                )}
                                                <item.icon className="h-[18px] w-[18px] shrink-0" />
                                                {!collapsed && (
                                                    <span className="text-sm font-medium">
                                                        {item.title}
                                                    </span>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}

                            {normalizeRole(userInfo.role) === 'ADMIN' && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        isActive={isActive('/dashboard/admin')}
                                        className={`relative h-10 rounded-md px-3 transition-colors
                                            ${isActive('/dashboard/admin') ? 'bg-sidebar-accent text-primary' : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60'}
                                        `}
                                        onClick={() =>
                                            navigate('/dashboard/admin')
                                        }
                                    >
                                        <div className="flex items-center gap-3">
                                            {isActive('/dashboard/admin') && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary"
                                                />
                                            )}
                                            <ShieldCheck className="h-[18px] w-[18px] shrink-0" />
                                            {!collapsed && (
                                                <span className="text-sm font-medium">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer / User Profile */}
            <SidebarFooter className="p-3 border-t border-sidebar-border">
                {impersonating && (
                    <div className="mb-3 rounded-lg border border-urgent/30 bg-urgent/10 p-3">
                        <p className="text-xs font-medium text-urgent mb-2">
                            Impersonating
                        </p>
                        <Button
                            variant="outline"
                            className="w-full rounded-md border-urgent/30 bg-urgent/10 text-urgent hover:bg-urgent/20"
                            onClick={handleStopImpersonation}
                        >
                            Stop Impersonation
                        </Button>
                    </div>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-12 rounded-md"
                        >
                            <Avatar className="h-9 w-9 rounded-md border border-sidebar-border">
                                <AvatarImage
                                    src={userInfo.avatar}
                                    alt={userInfo.email}
                                />
                                <AvatarFallback className="rounded-md font-semibold bg-primary/15 text-primary">
                                    {userInfo.initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {userInfo.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {userInfo.email}
                                </span>
                            </div>
                            <ChevronUp className="ml-auto size-4 opacity-50" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width] rounded-md p-1"
                    >
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 rounded-md"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
