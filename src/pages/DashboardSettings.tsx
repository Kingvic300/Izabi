"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Bell, Shield, Palette, Download, Moon, Sun, Monitor, Radio, Check, Smartphone, DownloadCloud, ChevronRight, Mail } from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"
import { Switch } from "@/components/ui/switch"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Badge } from "@/components/ui/badge"

const DashboardSettings = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const appToast = useAppToast()
    const { theme, setTheme: setGlobalTheme } = useTheme()
    
    const [settings, setSettings] = useState({
        emailNotifications: true,
        studyReminders: true,
        theme: theme,
        publicProfile: false,
    })
    const [isSaving, setIsSaving] = useState(false)

    useGSAP(() => {
        const tl = gsap.timeline()
        tl.from(".settings-header", { 
            y: -20, 
            opacity: 0, 
            duration: 0.8, 
            ease: "expo.out" 
        })
        .from(".settings-card", {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "expo.out"
        }, "-=0.4")
    }, { scope: containerRef })

    useEffect(() => {
        /*
         * How: Reads the 'userSettings' object from localStorage on component mount.
         * Why: To restore the user's previously saved preferences.
         */
        const savedSettings = localStorage.getItem("userSettings")
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings)
                setSettings(prev => ({ ...prev, ...parsed, theme: theme as any }))
            } catch (error) {
                console.error("Error loading settings:", error)
            }
        }
    }, [theme])

    /*
     * How: Toggles a boolean setting, updates state and localStorage, and shows a feedback toast.
     * Why: Provides immediate feedback and persistence for user preference changes.
     */
    const handleToggle = (key: keyof typeof settings) => {
        const newValue = typeof settings[key] === "boolean" ? !settings[key] : settings[key]
        const updatedSettings = { ...settings, [key]: newValue }
        setSettings(updatedSettings)
        localStorage.setItem("userSettings", JSON.stringify(updatedSettings))

        const settingNames: Record<string, string> = {
            emailNotifications: "Email notifications",
            studyReminders: "Study reminders",
            publicProfile: "Profile visibility",
        }

        const settingName = settingNames[key] || key
        const status = newValue ? "enabled" : "disabled"

        appToast.success({
            title: `${settingName} ${status}`,
            description: `Your preference has been saved successfully.`,
        })
    }

    /*
     * How: Updates the global theme context and saves the specific preference to state.
     * Why: Allows users to override the system theme with their preferred visual mode.
     */
    const handleThemeChange = (value: string) => {
        const themeValue = value === "auto" ? "system" : value as any
        setGlobalTheme(themeValue)
        
        setSettings((prev) => ({
            ...prev,
            theme: themeValue,
        }))

        appToast.success({
            title: "Theme updated",
            description: `Your theme has been changed to ${value} mode.`,
        })
    }

    const handleDownloadData = async () => {
        setIsSaving(true)
        appToast.info({
            title: "Preparing Archive",
            description: "Encrypting and packaging your data...",
        })

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))

            appToast.success({
                title: "Download Ready",
                description: "Your data archive has been securely generated.",
            })
        } catch (error) {
            appToast.error({
                title: "Export Failed",
                description: "Could not generate data archive.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div ref={containerRef} className="space-y-6 md:space-y-12 w-full pb-20 px-0 md:px-8 lg:px-12 pt-6 md:pt-12">
            <div className="settings-header">
                <h1 className="text-4xl font-black tracking-tighter leading-none mb-2">
                    System <span className="text-gradient">Preferences</span>
                </h1>
                <p className="text-muted-foreground font-medium text-lg">
                    Customize your neural interface and alerts
                </p>
            </div>

            {/* Appearance Section */}
            <Card className="settings-card glass border-foreground/5 rounded-[40px] shadow-2xl overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-foreground/5">
                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                        <Palette className="text-primary" />
                        Visual Interface
                    </CardTitle>
                    <CardDescription>Adjust the workspace aesthetics</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ThemeOption 
                            value="light" 
                            current={settings.theme} 
                            onClick={() => handleThemeChange("light")} 
                            icon={<Sun size={24} />}
                            title="Light Mode"
                        />
                        <ThemeOption 
                            value="dark" 
                            current={settings.theme} 
                            onClick={() => handleThemeChange("dark")} 
                            icon={<Moon size={24} />}
                            title="Dark Mode"
                        />
                        <ThemeOption 
                            value="system" 
                            current={settings.theme === "system" ? "system" : "auto"} 
                            onClick={() => handleThemeChange("auto")} 
                            icon={<Monitor size={24} />}
                            title="System Sync"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Notifications Section */}
            <Card className="settings-card glass border-foreground/5 rounded-[40px] shadow-2xl overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-foreground/5">
                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                        <Bell className="text-primary" />
                        Alert Signals
                    </CardTitle>
                    <CardDescription>Manage how usage data propagates to you</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <SettingRow 
                        title="Email Notifications" 
                        description="Receive weekly summaries and major updates"
                        isChecked={settings.emailNotifications}
                        onToggle={() => handleToggle("emailNotifications")}
                        icon={<Mail size={20} />}
                    />
                    <div className="h-[1px] w-full bg-foreground/5 mx-8" />
                    <SettingRow 
                        title="Study Reminders" 
                        description="Nudges to maintain your learning streak"
                        isChecked={settings.studyReminders}
                        onToggle={() => handleToggle("studyReminders")}
                        icon={<Smartphone size={20} />}
                    />
                </CardContent>
            </Card>

            {/* Privacy Section */}
            <Card className="settings-card glass border-foreground/5 rounded-[40px] shadow-2xl overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-foreground/5">
                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                        <Shield className="text-primary" />
                        Data & Privacy
                    </CardTitle>
                    <CardDescription>Control your digital footprint visibility</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <SettingRow 
                        title="Public Scholar Profile" 
                        description="Allow other students to view your achievements"
                        isChecked={settings.publicProfile}
                        onToggle={() => handleToggle("publicProfile")}
                        icon={<Radio size={20} />}
                        badge="Beta"
                    />
                    
                    <div className="p-8 bg-foreground/[0.02]">
                        <div className="rounded-[24px] border border-foreground/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-background/20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <DownloadCloud size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Export Data Archive</h3>
                                    <p className="text-sm opacity-60">Download all your notes and history</p>
                                </div>
                            </div>
                            <Button 
                                onClick={handleDownloadData} 
                                disabled={isSaving}
                                className="h-12 rounded-xl bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 font-bold px-6 min-w-[180px]"
                            >
                                {isSaving ? (
                                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" /> Packaging...</span>
                                ) : (
                                    <span className="flex items-center gap-2">Download <Download size={16} /></span>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style>{`
                .text-gradient {
                    background: linear-gradient(to right, #3b82f6, #60a5fa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .shadow-glow {
                     box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
                }
            `}</style>
        </div>
    )
}

function ThemeOption({ value, current, onClick, icon, title }: any) {
    const isActive = current === value
    return (
        <button 
            onClick={onClick}
            className={`
                group relative p-6 rounded-[24px] border transition-all duration-300 flex flex-col items-center gap-4
                ${isActive 
                    ? 'bg-primary/20 border-primary text-primary shadow-glow' 
                    : 'bg-foreground/5 border-foreground/5 hover:bg-foreground/10 opacity-60 hover:opacity-100'}
            `}
        >
            {isActive && (
                <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={4} />
                    </div>
                </div>
            )}
            <div className={`p-4 rounded-full ${isActive ? 'bg-primary text-white' : 'bg-foreground/10'}`}>
                {icon}
            </div>
            <span className="font-bold tracking-tight">{title}</span>
        </button>
    )
}

function SettingRow({ title, description, isChecked, onToggle, icon, badge }: any) {
    return (
        <div 
            onClick={onToggle}
            className="flex items-center justify-between p-8 hover:bg-foreground/[0.02] transition-colors cursor-pointer group"
        >
            <div className="flex items-center gap-6">
                <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                    ${isChecked ? 'bg-primary/20 text-primary' : 'bg-foreground/5 text-muted-foreground group-hover:bg-foreground/10'}
                `}>
                    {icon}
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">{title}</h3>
                        {badge && <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">{badge}</Badge>}
                    </div>
                    <p className="text-sm font-medium opacity-60">{description}</p>
                </div>
            </div>
            <Switch checked={isChecked} onCheckedChange={onToggle} className="scale-125 data-[state=checked]:bg-primary" />
        </div>
    )
}

export default DashboardSettings
