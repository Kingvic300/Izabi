"use client"

import { History, User, LogOut, Brain, LayoutDashboard, FileText, Zap, TrendingUp, Settings, GraduationCap } from "lucide-react"
import axios from "axios"
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
import { BASE_URL } from "@/contants/contants.ts"
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
        description: "JAMB and Past Questions",
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

    const isActive = (path: string) => currentPath === path

    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/users/logout`, {}, {
                headers: {Authorization: `Bearer ${localStorage.getItem('authToken')}`}
            })
            // Clear local storage
            localStorage.removeItem("userId")
            localStorage.removeItem("authToken")
            localStorage.removeItem("userEmail")

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
        <Sidebar collapsible="icon">
            {/* Header */}
            <SidebarHeader className="border-b border-border p-4">
                <div className="flex items-center space-x-3 px-2">
                    <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center shadow-glow animate-pulse">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-2xl font-black bg-gradient-hero bg-clip-text text-transparent leading-none">Izabi</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Learning AI</span>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="flex-1 px-3 py-4">
                {/* Main Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase font-black tracking-widest mb-4 px-4 opacity-30">The Lab</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {navigationItems.map((item) => {
                                const active = isActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={active}
                                            className={`h-12 rounded-xl transition-all duration-300 px-4 group
                                                ${active ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_hsla(var(--primary)/0.1)]" : "hover:bg-foreground/5"}
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
                                                <item.icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${active ? "text-primary shadow-glow" : "opacity-60"}`} />
                                                {!collapsed && (
                                                    <span className={`font-bold text-sm tracking-tight ${active ? "text-gradient" : "opacity-80"}`}>
                                                        {item.title}
                                                    </span>
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
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[10px] uppercase font-black tracking-widest mb-4 px-4 opacity-30">Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {settingsItems.map((item) => {
                                const active = isActive(item.url)
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton 
                                            asChild 
                                            isActive={active}
                                            className={`h-12 rounded-xl transition-all duration-300 px-4 group
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
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer / Logout */}
            <SidebarFooter className="p-4 border-t border-white/5">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full h-12 flex items-center justify-start gap-4 px-4 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-bold group"
                >
                    <LogOut className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    {!collapsed && <span>Sign Out</span>}
                </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
