import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Outlet } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const Dashboard = () => {
    return (
        <ErrorBoundary>
            <SidebarProvider>
                <div className="min-h-screen flex w-full bg-background relative overflow-hidden">
                    {/* Background Blobs - Fixed in place */}
                    <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
                    <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full pointer-events-none z-0" />
                    
                    <AppSidebar />
                    
                    <div className="flex-1 flex flex-col relative z-10">
                        {/* Modern Header */}
                        <header className="h-20 flex items-center px-4 md:px-8 justify-between sticky top-0 z-40 bg-background/20 backdrop-blur-xl border-b border-white/5">
                            <div className="flex items-center space-x-6">
                                <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors scale-125" />
                                <Separator orientation="vertical" className="h-8 bg-white/10" />
                                <div className="flex flex-col">
                                    <h1 className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Workspace</h1>
                                    <p className="text-lg font-bold">Scholar Environment</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="hidden md:flex flex-col items-end mr-2">
                                    <span className="text-xs font-bold opacity-60">Session active</span>
                                    <span className="text-[10px] font-mono opacity-40">EST-992-102</span>
                                </div>
                                <div className="h-10 w-10 rounded-xl bg-gradient-hero p-[1px]">
                                    <div className="w-full h-full rounded-[11px] bg-background flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </header>
 
                        {/* Main Content Area */}
                        {/* Main Content Area */}
                        <main className="flex-1 p-0 md:p-12 overflow-y-auto">
                            <div className="w-full h-full">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </ErrorBoundary>
    )
}

export default Dashboard
