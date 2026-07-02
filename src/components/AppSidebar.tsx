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
import {
    ACCOUNTABILITY_PARTNER_ENABLED,
    SUBSCRIPTIONS_ENABLED,
} from '@/config/featureFlags';

const navigationItems = [
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
        title: 'Learning Progress',
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
        title: 'Exam Center',
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

const settingsItems = [
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
                title: 'Logout issue',
                description:
                    'We could not reach the server, but you have been signed out on this device.',
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
                    title: 'Impersonation Ended',
                    description: 'You are now viewing as yourself.',
                });
                window.location.href = '/dashboard/admin';
                return;
            }
            appToast.error({
                title: 'Could not stop',
                description: result?.message || 'Failed to end impersonation.',
            });
        } catch (error) {
            appToast.apiError(error, 'Failed to end impersonation');
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            className="bg-card/50 backdrop-blur-xl border-r border-foreground/5 data-[variant=inset]:bg-transparent"
        >
            {/* Header */}
            <SidebarHeader className="border-b border-border p-4">
                <Logo
                    size={collapsed ? 44 : 160}
                    height={collapsed ? 44 : 90}
                    className={`px-2 ${collapsed ? 'justify-center' : ''}`}
                />
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="flex-1 px-3 py-4">
                {/* Main Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest mb-4 px-4 opacity-50 text-foreground">
                        The Lab
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {navigationItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            className={`h-12 rounded-3xl transition-all duration-300 px-4 group
                                                ${active ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_hsla(var(--primary)/0.1)]' : 'hover:bg-card/5'}
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
                                                className="flex items-center gap-4"
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? 'text-primary shadow-glow' : 'opacity-60'}`}
                                                />
                                                {!collapsed && (
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <span
                                                            className={`font-bold text-sm tracking-tight ${active ? 'text-gradient' : 'opacity-80'}`}
                                                        >
                                                            {item.title}
                                                        </span>
                                                        {(item as any)
                                                            .status ===
                                                            'unavailable' && (
                                                            <span className="text-[12px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/10">
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
                    <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest mb-4 px-4 opacity-50 text-foreground">
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {settingsItems.map((item) => {
                                const active = isActive(item.url);
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            className={`h-12 rounded-3xl transition-all duration-300 px-4 group
                                                ${active ? 'bg-card/10 text-foreground shadow-xl' : 'hover:bg-card/5'}
                                            `}
                                        >
                                            <Link
                                                to={item.url}
                                                className="flex items-center gap-4"
                                            >
                                                <item.icon className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                                                {!collapsed && (
                                                    <span className="font-bold text-sm tracking-tight opacity-80 group-hover:opacity-100">
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
                                        className={`h-12 rounded-3xl transition-all duration-300 px-4 group
                                            ${isActive('/dashboard/admin') ? 'bg-primary/20 text-primary shadow-glow' : 'hover:bg-primary/5'}
                                        `}
                                        onClick={() =>
                                            navigate('/dashboard/admin')
                                        }
                                    >
                                        <div className="flex items-center gap-4">
                                            <ShieldCheck
                                                className={`h-5 w-5 ${isActive('/dashboard/admin') ? 'text-primary shadow-glow' : 'text-primary/60'}`}
                                            />
                                            {!collapsed && (
                                                <span className="font-bold text-sm tracking-tight text-primary">
                                                    Admin Center
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
            <SidebarFooter className="p-4 border-t border-foreground/5">
                {impersonating && (
                    <div className="mb-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-amber-300 mb-2">
                            Impersonating
                        </p>
                        <Button
                            variant="outline"
                            className="w-full rounded-xl border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
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
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 rounded-3xl transition-all"
                        >
                            <Avatar className="h-9 w-9 rounded-lg border border-foreground/10 shadow-sm">
                                <AvatarImage
                                    src={userInfo.avatar}
                                    alt={userInfo.email}
                                />
                                <AvatarFallback className="rounded-lg font-bold bg-primary/20 text-primary">
                                    {userInfo.initial}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold mb-0.5">
                                    {userInfo.name}
                                </span>
                                <span className="truncate text-xs opacity-60 font-medium">
                                    {userInfo.email}
                                </span>
                            </div>
                            <ChevronUp className="ml-auto size-4 opacity-50" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width] rounded-3xl glass border-foreground/10 p-2 shadow-2xl"
                    >
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-bold rounded-lg p-3"
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
