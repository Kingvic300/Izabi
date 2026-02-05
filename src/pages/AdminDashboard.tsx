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
    Loader2,
    RefreshCw,
    ShieldAlert
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"
import { 
    LineChart, 
    Line, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts"
import { useAppToast } from "@/hooks/useAppToast"
import { api } from "@/lib/apiClient"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Badge } from "@/components/ui/badge"

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
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        /*
         * How: Fetches all necessary admin data (stats, users, keys) in parallel using Promise.allSettled.
         * Why: Ensures the dashboard populates as much data as possible, even if one service fails, for resilience.
         */
        const fetchAdminData = async () => {
            try {
                const role = localStorage.getItem("userRole")
                
                const [statsData, usersData, keysData] = await Promise.allSettled([
                    api.getAdminStats(),
                    api.getAllUsers(),
                    api.getContributedKeys()
                ])

                if (statsData.status === "fulfilled") setStats(statsData.value)
                if (usersData.status === "fulfilled") setUsers(usersData.value)
                if (keysData.status === "fulfilled") setKeys(keysData.value)
                
            } catch (err) {
                console.error("Admin Access Error:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchAdminData()
    }, [])

    useGSAP(() => {
        if (!isLoading) {
            gsap.from(".admin-card", {
                opacity: 0,
                y: 20,
                stagger: 0.1,
                duration: 0.8,
                ease: "expo.out"
            })
        }
    }, { scope: containerRef, dependencies: [isLoading] })

    /*
     * How: Prompts for confirmation before calling the delete API and filtering the local state.
     * Why: Prevents accidental deletions of user accounts.
     */
    const handleDeleteUser = async (id: string) => {
        if (confirm("Are you sure you want to delete this user? This action is irreversible.")) {
            try {
                await api.deleteUser(id)
                setUsers(users.filter(u => u.id !== id))
                appToast.success({ title: "User Deleted", description: "The account has been removed." })
            } catch (err) {
                appToast.error({ title: "Operation Failed", description: "Could not delete user." })
            }
        }
    }

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="font-black uppercase tracking-[0.2em] text-xs opacity-40">Decrypting Admin Secure Layer...</p>
            </div>
        )
    }

    return (
        <div ref={containerRef} className="space-y-10 w-full pb-20 px-6 lg:px-12 pt-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-black text-[10px] tracking-widest uppercase">
                            Admin Command Center
                        </Badge>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter leading-none">
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
                    { label: "Fleet Population", value: stats.totalUsers, sub: "+12% this month", icon: Users, color: "text-blue-500", trend: "up" },
                    { label: "Active Neurons", value: stats.activeNow, sub: "Live connected users", icon: Activity, color: "text-emerald-500", trend: "up" },
                    { label: "Knowledge Base", value: stats.totalNotes, sub: "Student notes indexed", icon: Database, color: "text-orange-500", trend: "up" },
                    { label: "AI Fuel Level", value: stats.contributedKeys, sub: "Active Gemini keys", icon: Key, color: "text-purple-500", trend: "down" },
                ].map((stat, i) => (
                    <Card key={i} className="admin-card glass border-white/5 shadow-xl hover-lift group overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-40">{stat.label}</CardTitle>
                            <stat.icon size={18} className={`${stat.color} group-hover:scale-110 transition-transform`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black tracking-tighter mb-1">{stat.value.toLocaleString()}</div>
                            <div className="flex items-center gap-2">
                                {stat.trend === "up" ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className="text-red-500" />}
                                <p className="text-xs font-medium text-muted-foreground">
                                    {stat.sub}
                                </p>
                            </div>
                        </CardContent>
                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-${stat.color.split('-')[1]}-500/20 to-transparent`} />
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="h-14 bg-white/5 border border-white/10 p-1.5 rounded-[20px] mb-8">
                    <TabsTrigger value="overview" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Overview</TabsTrigger>
                    <TabsTrigger value="users" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">User Registry</TabsTrigger>
                    <TabsTrigger value="keys" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">API Inventory</TabsTrigger>
                    <TabsTrigger value="logs" className="rounded-xl px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Security Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <Card className="lg:col-span-8 glass border-white/5 p-8 rounded-[40px] shadow-2xl">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">System Utilization</h3>
                                    <p className="text-muted-foreground font-medium">Network activity over the last 7 cycles</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge className="bg-primary/20 text-primary border-none">Live Monitoring</Badge>
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MOCK_CHART_DATA}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#ffffff40', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff40', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #ffffff10', borderRadius: '16px', color: '#fff'}}
                                            itemStyle={{color: '#3b82f6'}}
                                        />
                                        <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorUsers)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <div className="lg:col-span-4 space-y-6">
                            <Card className="glass border-white/5 p-8 rounded-[40px] shadow-2xl">
                                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                                    <TrendingUp className="text-primary" size={20} />
                                    Activity Stream
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { user: "User #842", act: "Generated Bio Summary", time: "2m ago" },
                                        { user: "User #105", act: "Submitted Gemini Key", time: "15m ago" },
                                        { user: "User #931", act: "Started JAMB Simulation", time: "1h ago" },
                                        { user: "User #442", act: "Updated Study Notes", time: "3h ago" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center group">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs group-hover:bg-primary/20 transition-all">U</div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{item.user}</p>
                                                    <p className="text-[10px] uppercase tracking-widest opacity-40 font-black">{item.act}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold opacity-30 italic">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full mt-8 rounded-xl font-bold opacity-40 hover:opacity-100 h-12">View All Transmission</Button>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="animate-in fade-in slide-in-from-bottom-5">
                    <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="p-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-3xl font-black">Account Registry</h3>
                                <p className="text-muted-foreground font-medium">Monitor and manage access across the platform</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative w-72">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                    <Input 
                                        placeholder="Search by ID or email..." 
                                        className="pl-12 rounded-[20px] glass border-white/10 h-14 font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button className="h-14 w-14 rounded-[20px] bg-white/5 border border-white/10 p-0 text-white hover:bg-white/10">
                                    <Filter size={20} />
                                </Button>
                            </div>
                        </div>

                        <div className="p-8 pt-4 overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent uppercase tracking-widest text-[10px] font-black opacity-40">
                                        <TableHead>User Identification</TableHead>
                                        <TableHead>Account Status</TableHead>
                                        <TableHead>Engagement</TableHead>
                                        <TableHead>Registry Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length > 0 ? (
                                        users.filter(u => u.email?.includes(searchQuery) || u.id?.includes(searchQuery)).map((user) => (
                                        <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors py-4">
                                            <TableCell className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center font-black text-lg text-primary uppercase">{user.email?.[0] || 'U'}</div>
                                                    <div>
                                                        <p className="font-bold text-lg leading-tight tracking-tight">{user.firstName} {user.lastName}</p>
                                                        <p className="text-sm opacity-40 font-medium">{user.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-3 py-1 font-bold">Verified</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold">{user.studyStreak || 0} Streak</p>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
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
                                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/5">
                                                            <MoreVertical size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="glass border-white/10 rounded-2xl p-2 w-48 shadow-2xl">
                                                        <DropdownMenuItem className="rounded-xl px-4 py-3 font-bold cursor-pointer">View Intelligence</DropdownMenuItem>
                                                        <DropdownMenuItem className="rounded-xl px-4 py-3 font-bold cursor-pointer">Adjust Tier</DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="rounded-xl px-4 py-3 font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
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
                                            <TableCell colSpan={5} className="py-20 text-center opacity-30 font-black text-xl italic uppercase tracking-widest">No Active Records Found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="keys" className="animate-in fade-in slide-in-from-bottom-5">
                    <div className="grid grid-cols-1 gap-6">
                        <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                            <CardHeader className="p-10 pb-6 border-b border-white/5 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-3xl font-black">AI Inventory</CardTitle>
                                    <CardDescription className="text-lg">Monitoring donated Gemini API resources for student compute</CardDescription>
                                </div>
                                <div className="p-4 bg-purple-500/10 rounded-[20px] text-purple-500 border border-purple-500/20">
                                    <Key size={32} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 pt-6">
                                <div className="space-y-6">
                                    {keys.length > 0 ? keys.map((key, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                                            <div className="flex gap-6 items-center">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Database size={24} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <p className="font-bold text-lg">Key ending in ...{key.apiKey?.slice(-6)}</p>
                                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase">Active</Badge>
                                                    </div>
                                                    <p className="text-sm opacity-40 font-medium">Contributed by User ID: <span className="font-mono text-xs">{key.userId}</span></p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-right hidden md:block mr-8">
                                                    <p className="text-xs font-black uppercase tracking-widest opacity-30 mb-1">Last Validated</p>
                                                    <p className="font-bold text-sm">{new Date(key.createdAt || Date.now()).toLocaleDateString()}</p>
                                                </div>
                                                <Button variant="ghost" className="h-12 w-12 rounded-xl text-red-500/60 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 size={20} />
                                                </Button>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="py-20 flex flex-col items-center justify-center opacity-30 grayscale">
                                            <ShieldAlert size={64} className="mb-4" />
                                            <p className="text-2xl font-black italic tracking-widest uppercase">No API Contributions Found</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                
                <TabsContent value="logs" className="animate-in fade-in slide-in-from-bottom-5">
                    <Card className="glass border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 overflow-x-auto">
                            <h3 className="text-2xl font-black mb-6">Critical Transmissions</h3>
                            <div className="space-y-4">
                                {[
                                    { level: "Security", msg: "Unauthorized access attempt blocked from IP 192.168.1.1", time: "14:22:15", status: "blocked" },
                                    { level: "Registry", msg: "Bulk database backup completed successfully", time: "12:00:00", status: "success" },
                                    { level: "Compute", msg: "API Rate limit approaching threshold for Gemini Key ...XY2z", time: "11:45:32", status: "warning" },
                                    { level: "User", msg: "Administrative reset performed on account #290", time: "09:12:08", status: "info" },
                                ].map((log, i) => (
                                    <div key={i} className="font-mono text-xs flex gap-6 p-4 rounded-xl hover:bg-white/[0.03] transition-all cursor-default group">
                                        <span className="opacity-30">[{log.time}]</span>
                                        <span className={`font-black uppercase w-20 
                                            ${log.status === 'blocked' ? 'text-red-500' : 
                                              log.status === 'warning' ? 'text-orange-500' : 
                                              log.status === 'success' ? 'text-emerald-500' : 'text-blue-500'}`}>
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
                .text-gradient {
                    background: linear-gradient(to right, #3b82f6, #60a5fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .glass {
                    background: rgba(12, 12, 14, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                .shadow-glow {
                    box-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
                }
                .hover-lift {
                    transition: transform 0.3s ease;
                }
                .hover-lift:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </div>
    )
}
