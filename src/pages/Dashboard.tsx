import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Outlet } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import StreakPet from "@/components/StreakPet"
import { useState, useEffect } from "react"
import { api } from "@/lib/apiClient"
import { useStudy } from "@/contexts/StudyContext"
import { cn } from "@/lib/utils"

const Dashboard = () => {
    const { activeJobs } = useStudy()
    const [userStats, setUserStats] = useState<any>(null)
    const userId = localStorage.getItem("userId")

    const activeProcessingJobs = activeJobs.filter(j => j.status === 'PENDING' || j.status === 'PROCESSING')
    const hasActiveJobs = activeProcessingJobs.length > 0
    const progress = hasActiveJobs 
        ? activeProcessingJobs.reduce((acc, j) => acc + j.progress, 0) / activeProcessingJobs.length 
        : 0

    const fetchStats = async () => {
        if (!userId) return
        try {
            const res = await api.getUserStats()
            setUserStats(res)
        } catch (err) {
            console.error("Failed to fetch global stats", err)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [userId])

    const handleFeedPet = async () => {
        if (!userId) return
        try {
            const res = await api.feedPet()
            if (res.success) {
                // Optimistic update
                setUserStats((prev: any) => ({
                    ...prev,
                    data: {
                        ...prev.data,
                        totalPoints: res.data.points,
                        pet: res.data.pet
                    }
                }))
            }
        } catch (err) {
            console.error("Failed to feed pet", err)
        }
    }

    return (
        <ErrorBoundary>
            <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
                    
                    {/* Global Tiny Progress Bar */}
                    <div className={cn(
                        "fixed top-0 left-0 right-0 z-[100] h-1.5 transition-all duration-500 ease-out",
                        hasActiveJobs ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}>
                        <div className="absolute inset-0 bg-primary/20" />
                        <div 
                            className="h-full bg-primary shadow-[0_0_15px_theme(colors.primary.DEFAULT)] transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 animate-pulse" />
                        </div>
                    </div>

                    <AppSidebar />
                    
                    <div className="flex-1 flex flex-col relative z-10">
                        {/* Modern Header */}
                        <header className="h-20 border-b border-foreground/5 bg-card/50 backdrop-blur-xl px-6 md:px-12 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-6">
                                <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors scale-125" />
                                <Separator orientation="vertical" className="h-8 bg-white/10" />
                                <div className="flex flex-col">
                                    <h1 className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">Workspace</h1>
                                    <p className="text-lg font-bold">Scholar Environment</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold opacity-60">Session active</span>
                                    <span className="text-[10px] font-mono opacity-40">EST-992-102</span>
                                </div>
                                <div className="h-10 w-10 rounded-3xl bg-gradient-hero p-[1px]">
                                    <div className="w-full h-full rounded-[11px] bg-background flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-3xl bg-primary/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </header>
 
                        {/* Main Content Area */}
                        <main className="flex-1 p-0 md:p-12 overflow-y-auto">
                            <div className="w-full h-full">
                                <Outlet />
                            </div>
                        </main>
                    </div>

                    {userStats?.data && (
                        <StreakPet 
                            streak={userStats.data.streakData?.academicStreak || userStats.data.studyStreak || 0} 
                            petData={userStats.data.pet} 
                            userPoints={userStats.data.totalPoints || 0}
                            streakFreezes={userStats.data.streakData?.streakFreezes || 0}
                            onFeed={handleFeedPet}
                        />
                    )}
                </div>
            </SidebarProvider>
        </ErrorBoundary>
    )
}

export default Dashboard
