"use client"

import { useState, useEffect, useRef } from "react"
import { 
    Trophy, 
    Flame, 
    Medal, 
    TrendingUp, 
    Crown, 
    Star, 
    MapPin, 
    Zap,
    Target
} from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/lib/apiClient"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Loader2 } from "lucide-react"

export default function DashboardLeaderboard() {
    const [leaderboardData, setLeaderboardData] = useState<{ 
        topStudents: any[], 
        topStreaks: any[],
        userRank?: { xp: string, streak: string }
    }>({ topStudents: [], topStreaks: [] })
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("xp")
    const containerRef = useRef(null)
    const currentUserId = localStorage.getItem("userId")

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.getLeaderboard()
                if (res.success && res.data) {
                    setLeaderboardData(res.data)
                }
                setIsLoading(false)
            } catch (error) {
                console.error("Failed to fetch leaderboard", error)
                setIsLoading(false)
            }
        }
        fetchLeaderboard()
    }, [])

    useGSAP(() => {
        if (!isLoading) {
            gsap.from(".leaderboard-item", {
                y: 30,
                opacity: 0,
                duration: 0.5,
                stagger: 0.03,
                ease: "power3.out"
            })

            gsap.from(".podium-card", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)",
                delay: 0.2
            })
        }
    }, [isLoading, activeTab])

    const getMedalColor = (index: number) => {
        switch (index) {
            case 0: return "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]"
            case 1: return "text-gray-300 drop-shadow-[0_0_10px_rgba(209,213,219,0.5)]"
            case 2: return "text-amber-600 drop-shadow-[0_0_10px_rgba(217,119,6,0.5)]"
            default: return "text-primary/50"
        }
    }



    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-40">Calculating Global Ranks...</p>
            </div>
        )
    }



    return (
        <div ref={containerRef} className="space-y-6 md:space-y-8 pb-20 w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 pb-6 border-b border-white/5">
                <div className="space-y-2">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold text-[10px] tracking-widest uppercase mb-1">
                        Global Rankings
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-none">
                        Hall of <span className="text-gradient">Fame</span>
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base font-medium max-w-lg">
                        See where you stand among the top scholars. Compete for XP or maintain your daily study consistency.
                    </p>
                </div>
                
                <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 sm:gap-4 w-full md:w-auto md:min-w-[200px]">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Target size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">Your Rank</p>
                        <p className="text-lg sm:text-xl font-black">
                            {activeTab === 'xp' 
                                ? `#${leaderboardData.userRank?.xp || '...'}` 
                                : `#${leaderboardData.userRank?.streak || '...'}`
                            }
                        </p>
                    </div>
                </div>
            </header>

            <Tabs defaultValue="xp" className="w-full" onValueChange={setActiveTab}>
                <div className="flex justify-center mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
                    <TabsList className="bg-white/5 border border-white/10 p-1 rounded-full h-12 sm:h-14">
                        <TabsTrigger value="xp" className="rounded-full px-4 sm:px-8 h-full font-bold uppercase text-[10px] sm:text-xs tracking-wider data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-1.5 sm:gap-2 whitespace-nowrap">
                            <Zap size={14} className="sm:w-4 sm:h-4" /> Total XP
                        </TabsTrigger>
                        <TabsTrigger value="streak" className="rounded-full px-4 sm:px-8 h-full font-bold uppercase text-[10px] sm:text-xs tracking-wider data-[state=active]:bg-orange-500 data-[state=active]:text-white transition-all gap-1.5 sm:gap-2 whitespace-nowrap">
                            <Flame size={14} className="sm:w-4 sm:h-4" /> Top Streaks
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="xp" className="space-y-6 sm:space-y-10">
                    <Podium users={leaderboardData.topStudents || []} type="xp" currentUserId={currentUserId} />
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-md">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                                <Trophy className="text-primary sm:w-5 sm:h-5" size={18} />
                                Leaderboard Standings
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2">
                                {(leaderboardData.topStudents || []).slice(3).map((user, i) => (
                                    <div 
                                        key={user._id} 
                                        className={cn(
                                            "leaderboard-item flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-transparent transition-all hover:bg-white/5",
                                            user._id === currentUserId ? "bg-primary/10 border-primary/30" : "bg-white/[0.02]"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
                                            <span className="font-mono font-bold text-sm sm:text-lg opacity-60 w-6 sm:w-8 text-center shrink-0">{i + 4}</span>
                                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-white/10 shrink-0">
                                                <AvatarImage src={user.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} />
                                                <AvatarFallback className="bg-primary/30 text-primary font-bold text-sm sm:text-base">{(user.firstName || 'U')[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 overflow-hidden">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <h4 className="font-bold text-sm sm:text-base truncate">{user.firstName || 'Anonymous'} {user.lastName || ''}</h4>
                                                    {user._id === currentUserId && <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0 shrink-0">You</Badge>}
                                                </div>
                                                <p className="text-[10px] sm:text-xs opacity-60 font-medium truncate">{user.institution || "Scholar"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="font-black text-base sm:text-xl tracking-tight">{user.points.toLocaleString()}</span>
                                            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-50 leading-none">XP</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="streak" className="space-y-6 sm:space-y-10">
                    <Podium users={leaderboardData.topStreaks || []} type="streak" currentUserId={currentUserId} />
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden backdrop-blur-md">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                                <Flame className="text-orange-500 sm:w-5 sm:h-5" size={18} />
                                Persistence Rankings
                            </h3>
                            <div className="space-y-1.5 sm:space-y-2">
                                {(leaderboardData.topStreaks || []).slice(3).map((user, i) => (
                                    <div 
                                        key={user._id} 
                                        className={cn(
                                            "leaderboard-item flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-transparent transition-all hover:bg-white/5",
                                            user._id === currentUserId ? "bg-primary/10 border-primary/30" : "bg-white/[0.02]"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
                                            <span className="font-mono font-bold text-sm sm:text-lg opacity-60 w-6 sm:w-8 text-center shrink-0">{i + 4}</span>
                                            <Avatar className="w-10 h-10 sm:w-12 sm:h-12 border border-white/10 shrink-0">
                                                <AvatarImage src={user.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`} />
                                                <AvatarFallback className="bg-orange-500/30 text-orange-500 font-bold text-sm sm:text-base">{(user.firstName || 'U')[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 overflow-hidden">
                                                <div className="flex items-center gap-1.5 sm:gap-2">
                                                    <h4 className="font-bold text-sm sm:text-base truncate">{user.firstName || 'Anonymous'} {user.lastName || ''}</h4>
                                                    {user._id === currentUserId && <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0 shrink-0">You</Badge>}
                                                </div>
                                                <p className="text-[10px] sm:text-xs opacity-60 font-medium truncate">{user.pet ? `${user.pet.name} (Lvl ${user.pet.level})` : "Scholar"}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="flex items-center justify-end gap-1">
                                                <Flame size={12} className="text-orange-500 fill-orange-500 sm:w-3.5 sm:h-3.5" />
                                                <span className="font-black text-base sm:text-xl tracking-tight">{user.streak}</span>
                                            </div>
                                            <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-50 leading-none">Days</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

const Podium = ({ users, type, currentUserId }: { users: any[], type: 'xp' | 'streak', currentUserId: string | null }) => {
    if (!users || users.length === 0) return null;
    
    const first = users[0];
    const second = users[1];
    const third = users[2];

    return (
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 min-h-[300px] px-2 sm:px-4">
            {/* Second Place */}
            {second && (
                <div className="podium-card order-2 md:order-1 flex flex-col items-center w-full md:w-1/3 max-w-[200px] sm:max-w-[240px]">
                    <div className="relative mb-3 sm:mb-4">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-gray-300 shadow-[0_0_15px_rgba(209,213,219,0.3)]">
                            <AvatarImage src={second.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${second.email}`} />
                            <AvatarFallback className="bg-gray-300 text-gray-900 font-bold text-lg sm:text-xl">{(second.firstName || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-gray-900 font-bold px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs shadow-lg">#2</div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl w-full backdrop-blur-md relative overflow-hidden group hover:border-gray-300/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-bold text-sm sm:text-lg truncate leading-tight">
                                {(second.firstName || '') + ' ' + (second.lastName || '') || 'Scholar'}
                            </h3>
                            {second._id === currentUserId && <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">You</Badge>}
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate mb-2 sm:mb-3 font-medium uppercase tracking-wider">{second.institution || "Scholar"}</p>
                        <Badge variant="outline" className="border-gray-300/30 text-gray-300 bg-gray-300/10 px-2 sm:px-3 py-0.5 sm:py-1 text-sm sm:text-lg font-bold">
                            {type === 'xp' ? second.points.toLocaleString() : second.streak}
                        </Badge>
                    </div>
                </div>
            )}

            {/* First Place */}
            <div className="podium-card order-1 md:order-2 flex flex-col items-center w-full md:w-1/3 max-w-[240px] sm:max-w-[280px] mb-4 md:mb-0 z-10">
                <div className="relative mb-4 sm:mb-6">
                    <Crown className="absolute -top-8 sm:-top-12 left-1/2 -translate-x-1/2 text-yellow-400 w-8 h-8 sm:w-10 sm:h-10 animate-bounce drop-shadow-glow" />
                    <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 sm:border-4 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                        <AvatarImage src={first.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${first.email}`} />
                        <AvatarFallback className="bg-yellow-400 text-yellow-900 font-bold text-2xl sm:text-3xl">{(first.firstName || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-300 to-yellow-500 text-yellow-950 font-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm shadow-xl border sm:border-2 border-yellow-200">#1</div>
                </div>
                <div className="text-center p-6 sm:p-8 bg-gradient-to-b from-yellow-400/10 to-transparent border border-yellow-400/30 rounded-[1.5rem] sm:rounded-[2rem] w-full backdrop-blur-xl relative overflow-hidden shadow-[0_0_40px_rgba(250,204,21,0.1)] group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/10 via-transparent to-transparent opacity-50" />
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <h3 className="font-bold text-xl sm:text-2xl truncate text-foreground leading-tight">
                            {(first.firstName || '') + ' ' + (first.lastName || '') || 'Scholar'}
                        </h3>
                        {first._id === currentUserId && <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/20 text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">You</Badge>}
                    </div>
                    <p className="text-[10px] sm:text-xs text-yellow-600 dark:text-yellow-500/80 truncate mb-3 sm:mb-4 font-bold tracking-wide uppercase">{(first.institution || "Izabi Champion").substring(0, 20)}</p>
                    <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">
                        {type === 'xp' ? first.points.toLocaleString() : first.streak}
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 mt-1 sm:mt-2">{type === 'xp' ? 'Experience Points' : 'Consecutive Days'}</p>
                </div>
            </div>

            {/* Third Place */}
            {third && (
                <div className="podium-card order-3 md:order-3 flex flex-col items-center w-full md:w-1/3 max-w-[200px] sm:max-w-[240px]">
                    <div className="relative mb-3 sm:mb-4">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 sm:border-4 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                            <AvatarImage src={third.profilePicturePath || `https://api.dicebear.com/7.x/notionists/svg?seed=${third.email}`} />
                            <AvatarFallback className="bg-amber-600 text-white font-bold text-lg sm:text-xl">{(third.firstName || 'U')[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white font-bold px-2 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs shadow-lg">#3</div>
                    </div>
                    <div className="text-center p-4 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl w-full backdrop-blur-md relative overflow-hidden group hover:border-amber-600/30 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                            <h3 className="font-bold text-sm sm:text-lg truncate leading-tight">
                                {(third.firstName || '') + ' ' + (third.lastName || '') || 'Scholar'}
                            </h3>
                            {third._id === currentUserId && <Badge className="bg-primary/20 text-primary border-none text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0">You</Badge>}
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate mb-2 sm:mb-3 font-medium uppercase tracking-wider">{third.institution || "Scholar"}</p>
                        <Badge variant="outline" className="border-amber-600/30 text-amber-500 bg-amber-600/10 px-2 sm:px-3 py-0.5 sm:py-1 text-sm sm:text-lg font-bold">
                            {type === 'xp' ? third.points.toLocaleString() : third.streak}
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    )
}
