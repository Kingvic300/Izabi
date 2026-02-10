"use client"

import { useState, useEffect } from "react"
import { History, User, LogOut, Brain, LayoutDashboard, FileText, Zap, TrendingUp, Settings, GraduationCap, Heart, ShieldCheck, ChevronUp, Trophy } from "lucide-react"
import { Logo } from "@/components/Logo"
import apiClient, { api } from "@/lib/apiClient"
import { useLocation, useNavigate } from "react-router-dom"
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BASE_URL } from "@/constants"
import { useAppToast } from "@/hooks/useAppToast"

const navigationItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview and quick access",
    },
    {
        title: "Notes",
        url: "/dashboard/notes",
        icon: FileText,
        description: "Manage your notes",
    },
    {
        title: "AI Assistant",
        url: "/dashboard/ai-assistant",
        icon: Zap,
        description: "Interactive learning with AI",
    },
    {
        title: "Learning Progress",
        url: "/dashboard/progress",
        icon: TrendingUp,
        description: "Track your learning journey",
    },
    {
        title: "History",
        url: "/dashboard/history",
        icon: History,
        description: "View uploaded files",
    },
    {
        title: "Exam Center",
        url: "/dashboard/exams",
        icon: GraduationCap,
        description: "Practice past questions",
    },
    {
        title: "Leaderboard",
        url: "/dashboard/leaderboard",
        icon: Trophy,
        description: "See top scholars",
    },
    {
        title: "Support Us",
        url: "/dashboard/support",
        icon: Heart,
        description: "Contribute AI resources",
    },
]

const settingsItems = [
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
        description: "Manage your account",
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
        description: "Preferences and configuration",
    },
]

export function AppSidebar() {
    const { state } = useSidebar()
    const location = useLocation()
    const navigate = useNavigate()
    const appToast = useAppToast()
    const currentPath = location.pathname
    const collapsed = state === "collapsed"
    const [userInfo, setUserInfo] = useState({
        name: localStorage.getItem("userFirstName") 
            ? `${localStorage.getItem("userFirstName")} ${localStorage.getItem("userLastName") || ""}`.trim()
            : "Scholar",
        email: localStorage.getItem("userEmail") || "scholar@izabi.ai",
        role: localStorage.getItem("userRole"),
        initial: (localStorage.getItem("userFirstName")?.[0] || localStorage.getItem("userEmail")?.[0] || "S").toUpperCase()
    })

    useEffect(() => {
        const handleStorageChange = () => {
            const firstName = localStorage.getItem("userFirstName")
            const lastName = localStorage.getItem("userLastName")
            const email = localStorage.getItem("userEmail") || "scholar@izabi.ai"
            
            setUserInfo({
                name: firstName ? `${firstName} ${lastName || ""}`.trim() : "Scholar",
                email: email,
                role: localStorage.getItem("userRole"),
                initial: (firstName?.[0] || email?.[0] || "S").toUpperCase()
            })
        }

        window.addEventListener("storage", handleStorageChange)
        // Initial sync
        handleStorageChange()
        
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [])

    const isActive = (path: string) => currentPath === path

    /*
     * How: Clears stored auth tokens and user data via apiClient (backend) and localStorage, then redirects to home.
     * Why: Ensures the session is completely terminated on both server and client.
     */
    const handleLogout = async () => {
        try {
            await api.logout()
            // Clear local storage
            localStorage.removeItem("userId")
            localStorage.removeItem("authToken")
            localStorage.removeItem("userEmail")
            localStorage.removeItem("userFirstName")
            localStorage.removeItem("userLastName")
            localStorage.removeItem("userRole")

            appToast.success({
                title: "Logged out",
                description: "You have been successfully logged out.",
            })

            navigate("/")
        } catch (error) {
            appToast.error({
                title: "Logout failed",
                description: "There was an error logging out. Please try again.",
            })
            console.error("Error logging out:", error)
        }
    }

    return (
        <Sidebar collapsible="icon" className="bg-card/50 backdrop-blur-xl border-r border-foreground/5 data-[variant=inset]:bg-transparent">
            {/* Header */}
            <SidebarHeader className="border-b border-border p-4">
                <Logo showText={!collapsed} size={40} className="px-2" />
            </SidebarHeader>


            {/* Navigation */}
            <SidebarContent className="flex-1 px-3 py-4">
                {/* Main Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest mb-4 px-4 opacity-50 text-foreground">The Lab</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {navigationItems.map((item) => {
                                const active = isActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={active}
                                            className={`h-12 rounded-3xl transition-all duration-300 px-4 group
                                                ${active ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_hsla(var(--primary)/0.1)]" : "hover:bg-foreground/5"}
                                            `}
                                        >
                                            <a
                                                href={item.url}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    if ((item as any).status === "unavailable") return
                                                    navigate(item.url)
                                                }}
                                                className="flex items-center gap-4"
                                            >
                                                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? "text-primary shadow-glow" : "opacity-60"}`} />
                                                {!collapsed && (
                                                    <div className="flex flex-1 items-center justify-between">
                                                        <span className={`font-bold text-sm tracking-tight ${active ? "text-gradient" : "opacity-80"}`}>
                                                            {item.title}
                                                        </span>
                                                        {(item as any).status === "unavailable" && (
                                                            <span className="text-[12px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-2xl bg-rose-500/20 text-rose-500 border border-rose-500/10">
                                                                Soon
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Settings Group */}
                <SidebarGroup className="mt-auto">
                    <SidebarGroupLabel className="text-[10px] uppercase font-bold tracking-widest mb-4 px-4 opacity-50 text-foreground">Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {settingsItems.map((item) => {
                                const active = isActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={active}
                                            className={`h-12 rounded-3xl transition-all duration-300 px-4 group
                                                ${active ? "bg-foreground/10 text-foreground shadow-xl" : "hover:bg-foreground/5"}
                                            `}
                                        >
                                            <a
                                                href={item.url}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    navigate(item.url)
                                                }}
                                                className="flex items-center gap-4"
                                            >
                                                <item.icon className="h-5 w-5 opacity-60 group-hover:opacity-100" />
                                                {!collapsed && <span className="font-bold text-sm tracking-tight opacity-80 group-hover:opacity-100">{item.title}</span>}
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                            
                            {userInfo.role === "ADMIN" && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton 
                                        isActive={isActive("/dashboard/admin")}
                                        className={`h-12 rounded-3xl transition-all duration-300 px-4 group
                                            ${isActive("/dashboard/admin") ? "bg-primary/20 text-primary shadow-glow" : "hover:bg-primary/5"}
                                        `}
                                        onClick={() => navigate("/dashboard/admin")}
                                    >
                                        <div className="flex items-center gap-4">
                                            <ShieldCheck className={`h-5 w-5 ${isActive("/dashboard/admin") ? "text-primary shadow-glow" : "text-primary/60"}`} />
                                            {!collapsed && <span className="font-bold text-sm tracking-tight text-primary">Admin Center</span>}
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-14 rounded-3xl transition-all"
                        >
                            <Avatar className="h-9 w-9 rounded-lg border border-white/10 shadow-sm">
                                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userInfo.email}`} alt={userInfo.email} />
                                <AvatarFallback className="rounded-lg font-bold bg-primary/20 text-primary">{userInfo.initial}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-bold mb-0.5">{userInfo.name}</span>
                                <span className="truncate text-xs opacity-60 font-medium">{userInfo.email}</span>
                            </div>
                            <ChevronUp className="ml-auto size-4 opacity-50" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className="w-[--radix-popper-anchor-width] rounded-3xl glass border-foreground/10 p-2 shadow-2xl"
                    >
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-bold rounded-lg p-3">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
