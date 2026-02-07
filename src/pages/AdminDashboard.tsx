"use client"

import { useState, useEffect, useRef } from "react"
import { 
    Users, 
    ShieldCheck, 
    Database, 
    Key, 
    Trash2, 
    UserPlus, 
    Activity, 
    TrendingUp, 
    MoreVertical, 
    Search, 
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ShieldAlert,
    Clock
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { api } from "@/lib/apiClient"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useAppToast } from "@/hooks/useAppToast"
import { Loader2 } from "lucide-react"

// Mock data for initial state visualization if API fails or backend is incomplete
const MOCK_STATS = {
    totalUsers: 1254,
    activeNow: 42,
    totalNotes: 8432,
    contributedKeys: 156,
    growth: 12.5
}

const MOCK_CHART_DATA = [
    { name: "Mon", users: 400, requests: 2400 },
    { name: "Tue", users: 600, requests: 3500 },
    { name: "Wed", users: 550, requests: 3100 },
    { name: "Thu", users: 800, requests: 4800 },
    { name: "Fri", users: 950, requests: 5200 },
    { name: "Sat", users: 1100, requests: 6100 },
    { name: "Sun", users: 1254, requests: 6800 },
]

export default function AdminDashboard() {
    const containerRef = useRef<HTMLDivElement>(null)
    const appToast = useAppToast()
    const [stats, setStats] = useState(MOCK_STATS)
    const [users, setUsers] = useState<any[]>([])
    const [keys, setKeys] = useState<any[]>([])
    const [chartData, setChartData] = useState<any[]>(MOCK_CHART_DATA)
    const [activityData, setActivityData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [statsResponse, usersResponse, keysResponse] = await Promise.allSettled([
                    api.getAdminStats(),
                    api.getAllUsers(),
                    api.getContributedKeys()
                ])

                // Handle stats data
                if (statsResponse.status === "fulfilled" && statsResponse.value?.data) {
                    const data = statsResponse.value.data
                    setStats({
                        totalUsers: data.totalUsers || 0,
                        activeNow: data.activeNow || 0,
                        totalNotes: data.totalNotes || 0,
                        contributedKeys: data.contributedKeys || 0,
                        growth: data.growth || 0
                    })
                    
                    // Set chart data
                    if (data.userGrowthChart && data.userGrowthChart.length > 0) {
                        setChartData(data.userGrowthChart)
                    }
                    if (data.activityChart && data.activityChart.length > 0) {
                        setActivityData(data.activityChart)
                    }
                } else {
                    console.warn("Failed to fetch admin stats, using defaults")
                }

                // Handle users data
                if (usersResponse.status === "fulfilled" && usersResponse.value?.data) {
                    setUsers(Array.isArray(usersResponse.value.data) ? usersResponse.value.data : [])
                } else {
                    console.warn("Failed to fetch users data")
                }

                // Handle keys data
                if (keysResponse.status === "fulfilled" && keysResponse.value?.data) {
                    setKeys(Array.isArray(keysResponse.value.data) ? keysResponse.value.data : [])
                } else {
                    console.warn("Failed to fetch contributed keys")
                }
                
                setIsLoading(false)
            } catch (error) {
                console.error("Failed to fetch admin data", error)
                setIsLoading(false)
            }
        }

        fetchAdminData()
    }, [])

    useGSAP(() => {
        if (!isLoading) {
            gsap.from(".admin-card", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power4.out"
            })
        }
    }, [isLoading])

    const handleDeleteUser = async (id: string) => {
        if (window.confirm("Are you sure you want to terminate this user access?")) {
            try {
                await api.deleteUser(id)
                setUsers(users.filter(u => u.id !== id))
                appToast.success({ title: "Success", description: "User access terminated successfully" })
            } catch (error) {
                appToast.error({ title: "Failed", description: "Could not delete user" })
            }
        }
    }

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-bold uppercase tracking-[0.2em] text-xs opacity-40">Decrypting Admin Secure Layer...</p>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="space-y-10 w-full pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold text-[10px] tracking-widest uppercase">
                            Admin Command Center
                        </Badge>
                    </div>
                    <h1 className="text-5xl font-bold tracking-tighter leading-none">
                        System <span className="text-gradient">Intelligence</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="outline" className="glass h-12 rounded-2xl border-white/10 hover:bg-white/5 transition-all">
                        <RefreshCw className="mr-2 h-4 w-4" /> Sync Registry
                    </Button>
                    <Button className="h-12 rounded-2xl bg-primary shadow-glow hover:bg-primary-glow font-bold px-8">
                        System Export
                    </Button>
                </div>
            </header>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Fleet Population", value: stats.totalUsers, sub: "+12% this month", icon: Users, color: "text-primary", trend: "up" },
                    { label: "Active Neurons", value: stats.activeNow, sub: "Live connected users", icon: Activity, color: "text-primary", trend: "up" },
                    { label: "Knowledge Base", value: stats.totalNotes, sub: "Student notes indexed", icon: Database, color: "text-primary", trend: "up" },
                    { label: "AI Fuel Level", value: stats.contributedKeys, sub: "Active Groq keys", icon: Key, color: "text-primary", trend: "down" },
                ].map((stat, i) => (
                    <Card key={i} className="admin-card glass border-white/5 shadow-xl hover-lift group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest opacity-40">{stat.label}</CardTitle>
                            <stat.icon size={18} className={cn(stat.color, "group-hover:scale-110 transition-transform")} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tighter mb-1">{stat.value.toLocaleString()}</div>
                            <div className="flex items-center gap-2">
                                {stat.trend === "up" ? <ArrowUpRight size={14} className="text-primary" /> : <ArrowDownRight size={14} className="text-destructive" />}
                                <p className="text-xs font-medium text-muted-foreground">
                                    {stat.sub}
                                </p>
                            </div>
                        </CardContent>
                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent`} />
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="h-14 bg-white/5 border border-white/10 p-1.5 rounded-2xl mb-8">
                    <TabsTrigger value="overview" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Overview</TabsTrigger>
                    <TabsTrigger value="users" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">User Registry</TabsTrigger>
                    <TabsTrigger value="keys" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">API Inventory</TabsTrigger>
                    <TabsTrigger value="logs" className="rounded-2xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Security Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <Card className="lg:col-span-8 glass border-white/5 p-8 rounded-2xl shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight">System Utilization</h3>
                                    <p className="text-muted-foreground font-medium">Network activity over the last 7 cycles</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-primary/20 text-primary border-none">Live Monitoring</Badge>
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
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
                                                backgroundColor: "rgba(255, 255, 255, 0.8)", 
                                                borderRadius: "12px", 
                                                border: "none", 
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" 
                                            }} 
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
                            <Card className="glass border-white/5 p-8 rounded-2xl shadow-2xl">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-primary" size={20} />
                                    Activity Stream
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { user: "User #842", act: "Generated Bio Summary", time: "2m ago" },
                                        { user: "User #105", act: "Submitted Groq Key", time: "15m ago" },
                                        { user: "User #931", act: "Started JAMB Simulation", time: "1h ago" },
                                        { user: "User #442", act: "Updated Study Notes", time: "3h ago" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-xs group-hover:bg-primary/20 transition-all">U</div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{item.user}</p>
                                                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">{item.act}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold opacity-30 italic">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-8 rounded-2xl font-bold opacity-40 hover:opacity-100 h-12">View All Transmission</Button>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-5">
                    <Card className="glass border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-3xl font-bold">Account Registry</h3>
                                <p className="text-muted-foreground font-medium">Monitor and manage access across the platform</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <Input 
                                        placeholder="Search by ID or email..." 
                                        className="pl-12 rounded-2xl glass border-white/10 h-14 font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 p-0 text-white hover:bg-white/10">
                                    <Filter size={20} />
                                </Button>
                            </div>
                        </div>

                        <div className="p-8 pt-4 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent uppercase tracking-widest text-[10px] font-bold opacity-40">
                                        <TableHead>User Identification</TableHead>
                                        <TableHead>Account Status</TableHead>
                                        <TableHead>Engagement</TableHead>
                                        <TableHead>Registry Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.filter(u => u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || u.id?.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                                        <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors py-4">
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center font-bold text-lg text-primary uppercase">{user.email?.[0] || 'U'}</div>
                                                    <div>
                                                        <p className="font-bold text-lg leading-tight tracking-tight">{user.firstName} {user.lastName}</p>
                                                        <p className="text-sm opacity-40 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-primary/10 text-primary border-none px-3 py-1 font-bold">Verified</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold">{user.studyStreak || 0} Streak</p>
                                                    <div className="w-24 h-1 bg-white/5 rounded-2xl overflow-hidden">
                                                        <div className="h-full bg-primary" style={{width: `${Math.min((user.studyStreak || 0) * 10, 100)}%`}} />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs opacity-60">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-2xl hover:bg-white/5">
                                                            <MoreVertical size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="glass border-white/10 rounded-2xl p-2 w-48 shadow-2xl">
                                                        <DropdownMenuItem className="rounded-2xl px-4 py-3 font-bold cursor-pointer">View Intelligence</DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-2xl px-4 py-3 font-bold cursor-pointer">Adjust Tier</DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="rounded-2xl px-4 py-3 font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                                                            onClick={() => handleDeleteUser(user.id)}
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
                                            <TableCell colSpan={5} className="py-20 text-center opacity-30 font-bold text-xl italic uppercase tracking-widest">No Active Records Found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="keys" className="animate-in fade-in slide-in-from-bottom-5">
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="glass border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                            <CardHeader className="p-10 pb-6 border-b border-white/5 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-bold">AI Inventory</CardTitle>
                                    <CardDescription className="text-lg">Monitoring donated Groq API resources for student compute</CardDescription>
                                </div>
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                                    <Key size={32} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 pt-6">
                                <div className="space-y-6">
                                    {keys.length > 0 ? keys.map((key, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                            <div className="flex gap-6 items-center">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Database size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-bold text-lg">Key ending in ...{key.apiKey?.slice(-6)}</p>
                                                        <Badge className="bg-primary/10 text-primary border-none font-bold text-[10px] uppercase">Active</Badge>
                                                    </div>
                                                    <p className="text-sm opacity-40 font-medium">Contributed by User ID: <span className="font-mono text-xs">{key.userId}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-right hidden md:block mr-8">
                                                    <p className="text-xs font-bold uppercase tracking-widest opacity-30 mb-1">Last Validated</p>
                                                    <p className="font-bold text-sm">{new Date(key.createdAt || Date.now()).toLocaleDateString()}</p>
                                                </div>
                                                <Button variant="ghost" className="h-12 w-12 rounded-2xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 flex flex-col items-center justify-center opacity-30 grayscale">
                                            <ShieldAlert size={64} className="mb-4" />
                                            <p className="text-2xl font-bold italic tracking-widest uppercase">No API Contributions Found</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="logs" className="animate-in fade-in slide-in-from-bottom-5">
                    <Card className="glass border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 overflow-x-auto">
                            <h3 className="text-2xl font-bold mb-6">Critical Transmissions</h3>
                            <div className="space-y-4">
                                {[
                                    { level: "Security", msg: "Unauthorized access attempt blocked from IP 192.168.1.1", time: "14:22:15", status: "blocked" },
                                    { level: "Registry", msg: "Bulk database backup completed successfully", time: "12:00:00", status: "success" },
                                    { level: "Compute", msg: "API Rate limit approaching threshold for Groq Key ...XY2z", time: "11:45:32", status: "warning" },
                                    { level: "User", msg: "Administrative reset performed on account #290", time: "09:12:08", status: "info" },
                                ].map((log, i) => (
                                    <div key={i} className="font-mono text-xs flex gap-6 p-4 rounded-2xl hover:bg-white/[0.03] transition-all cursor-default group">
                                        <span className="opacity-30">[{log.time}]</span>
                                        <span className={cn(
                                            "font-bold uppercase w-20",
                                            log.status === 'blocked' && 'text-destructive',
                                            log.status === 'warning' && 'text-primary/70',
                                            log.status === 'success' && 'text-primary',
                                            log.status === 'info' && 'text-primary/50'
                                        )}>
                                            [{log.level}]
                                        </span>
                                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <style>{`
                .glass {
                    /* Defined globally */
                }
            `}</style>
        </div>
    )
}
