"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Bell, Shield, Palette, Download } from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const DashboardSettings = () => {
    const appToast = useAppToast()
    const [settings, setSettings] = useState({
        emailNotifications: true,
        studyReminders: true,
        theme: "dark",
        publicProfile: false,
    })
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const savedSettings = localStorage.getItem("userSettings")
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings))
            } catch (error) {
                console.error("Error loading settings:", error)
                appToast.error({
                    title: "Failed to load settings",
                    description: "We couldn't retrieve your settings. Using defaults.",
                })
            }
        }
    }, [appToast])

    const handleToggle = (key: keyof typeof settings) => {
        const newValue = typeof settings[key] === "boolean" ? !settings[key] : settings[key]
        setSettings((prev) => ({
            ...prev,
            [key]: newValue,
        }))

        const updatedSettings = { ...settings, [key]: newValue }
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

    const handleThemeChange = (value: string) => {
        setSettings((prev) => ({
            ...prev,
            theme: value,
        }))

        const updatedSettings = { ...settings, theme: value }
        localStorage.setItem("userSettings", JSON.stringify(updatedSettings))

        appToast.success({
            title: "Theme updated",
            description: `Your theme has been changed to ${value} mode.`,
        })
    }

    const handleDownloadData = async () => {
        setIsSaving(true)
        appToast.info({
            title: "Preparing your data",
            description: "This may take a moment. Please don't close this page.",
        })

        try {
            // Simulate download
            await new Promise((resolve) => setTimeout(resolve, 2000))

            appToast.success({
                title: "Download complete!",
                description: "Your data has been downloaded successfully. Check your downloads folder.",
            })
        } catch (error) {
            appToast.error({
                title: "Download failed",
                description: "We couldn't download your data. Please try again.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Customize your learning experience and manage your preferences.</p>
            </div>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <span>Notifications</span>
                    </CardTitle>
                    <CardDescription>Manage how and when you receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                            <Label className="cursor-pointer font-medium">Email notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive updates about your learning progress</p>
                        </div>
                        <button
                            onClick={() => handleToggle("emailNotifications")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.emailNotifications ? "bg-primary" : "bg-muted"
                            }`}
                            aria-label="Toggle email notifications"
                        >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? "translate-x-6" : "translate-x-1"
                  }`}
              />
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                            <Label className="cursor-pointer font-medium">Study reminders</Label>
                            <p className="text-sm text-muted-foreground">Get reminded to continue your learning sessions</p>
                        </div>
                        <button
                            onClick={() => handleToggle("studyReminders")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.studyReminders ? "bg-primary" : "bg-muted"
                            }`}
                            aria-label="Toggle study reminders"
                        >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.studyReminders ? "translate-x-6" : "translate-x-1"
                  }`}
              />
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Palette className="h-5 w-5 text-primary" />
                        <span>Appearance</span>
                    </CardTitle>
                    <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                            <Label htmlFor="theme" className="font-medium">
                                Theme
                            </Label>
                            <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                        </div>
                        <Select value={settings.theme} onValueChange={handleThemeChange}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="auto">Auto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Privacy & Security</span>
                    </CardTitle>
                    <CardDescription>Manage your privacy settings and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                            <Label className="cursor-pointer font-medium">Make profile public</Label>
                            <p className="text-sm text-muted-foreground">Allow other users to view your learning profile</p>
                        </div>
                        <button
                            onClick={() => handleToggle("publicProfile")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings.publicProfile ? "bg-primary" : "bg-muted"
                            }`}
                            aria-label="Toggle public profile"
                        >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.publicProfile ? "translate-x-6" : "translate-x-1"
                  }`}
              />
                        </button>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full bg-transparent hover:bg-muted"
                        onClick={handleDownloadData}
                        disabled={isSaving}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isSaving ? "Downloading..." : "Download Your Data"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Download a copy of all your data including notes, progress, and settings in a portable format.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardSettings
