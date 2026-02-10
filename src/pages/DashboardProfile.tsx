"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Lock, Camera, Save, Edit, KeyRound, Shield, Mail, MapPin, Building, GraduationCap, Loader2 } from "lucide-react"
import ChangePassword from "@/pages/ChangePassword.tsx"
import apiClient from "@/lib/apiClient"
import { useAppToast } from "@/hooks/useAppToast"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Badge } from "@/components/ui/badge"

const DashboardProfile = () => {
    const containerRef = useRef<HTMLDivElement>(null)
    const appToast = useAppToast()
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [profileData, setProfileData] = useState({
        id: localStorage.getItem("userId") || "",
        firstName: "",
        lastName: "",
        email: localStorage.getItem("userEmail") || "",
        phoneNumber: "",
        institution: "",
        major: "",
        location: "",
        profilePicturePath: "",
    })

    // Load profile on mount
    useEffect(() => {
        /*
         * How: Fetches user profile data from the backend using the stored userId.
         * Why: To populate the form with existing user data for viewing or editing.
         */
        const loadProfile = async () => {
            try {
                const response = await apiClient.get(`/api/user/profile`)
                const userData = response.data.data
                setProfileData((prev) => ({
                    ...prev,
                    ...userData,
                    email: localStorage.getItem("userEmail") || userData.email,
                }))
                if (userData.firstName) localStorage.setItem("userFirstName", userData.firstName)
                if (userData.lastName) localStorage.setItem("userLastName", userData.lastName)
                window.dispatchEvent(new Event("storage"))
            } catch (err) {
                console.error("Error loading profile:", err)
            }
        }

        loadProfile()
    }, [appToast])

    useGSAP(() => {
        const tl = gsap.timeline()
        tl.from(".profile-header", { 
            y: -20, 
            opacity: 0, 
            duration: 0.8, 
            ease: "expo.out" 
        })
        .from(".profile-card", {
            y: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "expo.out"
        }, "-=0.4")
    }, { scope: containerRef })

    const handleInputChange = (field: string, value: string) => {
        const updatedData = { ...profileData, [field]: value }
        setProfileData(updatedData)
    }

    /*
     * How: Sends updated profile data to the backend via PUT request and updates local storage.
     * Why: Users need to be able to modify their personal information and have it persist.
     */
    const handleSaveProfile = async () => {
        setLoading(true)
        try {
            const updatedProfileData = {
                ...profileData,
                email: localStorage.getItem("userEmail") || profileData.email,
            }

            const response = await apiClient.put(`/api/user/profile`, updatedProfileData)
            const updatedProfile = response.data.data

            setProfileData((prev) => ({
                ...prev,
                ...updatedProfile,
                email: localStorage.getItem("userEmail") || updatedProfile.email,
            }))
            if (updatedProfile.firstName) localStorage.setItem("userFirstName", updatedProfile.firstName)
            if (updatedProfile.lastName) localStorage.setItem("userLastName", updatedProfile.lastName)
            window.dispatchEvent(new Event("storage"))
            
            setIsEditing(false)

            appToast.profileUpdated()
        } catch (err) {
            console.error("Error updating profile:", err)
            appToast.error({
                title: "Update Failed",
                description: "Could not save your profile changes.",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            const updatedData = { ...profileData, profilePicturePath: e.target?.result as string }
            setProfileData(updatedData)
            localStorage.setItem("userProfile", JSON.stringify(updatedData))
            // In a real app, you'd verify upload to backend here or in handleSaveProfile
        }
        reader.readAsDataURL(file)
    }

    return (
        <div ref={containerRef} className="space-y-6 md:space-y-8 w-full pb-20 px-0 md:px-8 lg:px-12 pt-6 md:pt-12">
            <div className="profile-header flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter leading-none mb-2">
                        My <span className="text-gradient">Profile</span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg">
                        Manage your digital scholar identity
                    </p>
                </div>
                <div className="flex gap-4">
                     <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`
                            h-12 rounded-2xl border-foreground/10 px-6 font-bold transition-all
                            ${isEditing ? 'bg-card/10 text-foreground' : 'glass hover:bg-card/5'}
                        `}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </Button>
                    {isEditing && (
                        <Button 
                            onClick={handleSaveProfile} 
                            disabled={loading}
                            className="h-12 rounded-2xl bg-primary shadow-glow hover:bg-primary-glow font-bold px-8 shadow-glow"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Changes
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="profile-card glass border-foreground/5 rounded-2xl overflow-hidden shadow-2xl h-full">
                        <div className="h-32 bg-gradient-to-br from-primary/20 via-purple-500/10 to-background/0 relative">
                             <div className="absolute top-4 right-4">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 rounded-2xl">
                                    Scholar
                                </Badge>
                             </div>
                        </div>
                        <div className="px-8 pb-8 -mt-16 flex flex-col items-center text-center">
                            <div className="relative mb-6 group">
                                <Avatar className="w-32 h-32 border-4 border-background relative z-10 shadow-xl">
                                    <AvatarImage src={profileData.profilePicturePath || "/placeholder.svg"} className="object-cover" />
                                    <AvatarFallback className="text-4xl font-bold bg-muted">
                                        {profileData.firstName?.[0] || "U"}
                                        {profileData.lastName?.[0] || "N"}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center cursor-pointer hover:bg-primary-glow shadow-lg z-20 transition-transform active:scale-95">
                                        <Camera className="h-5 w-5" />
                                        <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                                    </label>
                                )}
                            </div>
                            
                            <h2 className="text-2xl font-bold tracking-tight mb-1">
                                {profileData.firstName || "New"} {profileData.lastName || "Scholar"}
                            </h2>
                            <div className="flex items-center gap-2 text-muted-foreground font-medium text-sm mb-6">
                                <Mail size={14} />
                                {profileData.email}
                            </div>

                            <div className="w-full space-y-4">
                                <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 w-full flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                       <Shield size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs uppercase tracking-widest font-bold opacity-40">Role</p>
                                        <p className="font-bold">Standard User</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 w-full flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                       <MapPin size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs uppercase tracking-widest font-bold opacity-40">Location</p>
                                        <p className="font-bold">{profileData.location || "Earth"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Settings Form */}
                <div className="md:col-span-8 space-y-6">
                    <Card className="profile-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
                        <CardHeader className="px-6 py-4 md:px-8 md:py-6 border-b border-foreground/5">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <User className="text-primary" />
                                Personal Details
                            </CardTitle>
                            <CardDescription>
                                Information visible to your instructors and peers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput 
                                    icon={<User size={16} />}
                                    label="First Name" 
                                    id="firstName"
                                    value={profileData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    disabled={!isEditing}
                                />
                                <FormInput 
                                    icon={<User size={16} />}
                                    label="Last Name" 
                                    id="lastName"
                                    value={profileData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    disabled={!isEditing}
                                />
                                <FormInput 
                                    icon={<Building size={16} />}
                                    label="Institution" 
                                    id="institution"
                                    value={profileData.institution}
                                    onChange={(e) => handleInputChange("institution", e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="e.g. University of Lagos"
                                />
                                <FormInput 
                                    icon={<GraduationCap size={16} />}
                                    label="Major / Course" 
                                    id="major"
                                    value={profileData.major}
                                    onChange={(e) => handleInputChange("major", e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="e.g. Computer Science"
                                />
                                <FormInput 
                                    icon={<MapPin size={16} />}
                                    label="Location" 
                                    id="location"
                                    value={profileData.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="City, Country"
                                />
                             </div>
                        </CardContent>
                    </Card>

                    <Card className="profile-card glass border-foreground/5 rounded-2xl shadow-2xl overflow-hidden">
                        <CardHeader className="px-8 py-6 border-b border-foreground/5">
                            <CardTitle className="flex items-center gap-3 text-xl font-bold">
                                <Lock className="text-primary" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>
                                Manage your password and access credentials
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-card/[0.02] border border-foreground/5 hover:bg-card/[0.04] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <KeyRound size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Change Password</h3>
                                        <p className="text-sm opacity-60">Update your password regularly for better security</p>
                                    </div>
                                </div>
                                <ChangePassword />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    )
}

function FormInput({ label, icon, ...props }: any) {
    return (
        <div className="space-y-3">
            <Label htmlFor={props.id} className="text-xs uppercase font-bold tracking-widest opacity-40 flex items-center gap-2">
                {icon}
                {label}
            </Label>
            <Input
                {...props}
                className="h-14 rounded-2xl glass border-foreground/10 px-4 font-medium transition-all focus:border-primary/50 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed text-foreground"
            />
        </div>
    )
}

export default function DashboardProfilePage() {
    return (
        <ErrorBoundary>
            <DashboardProfile />
        </ErrorBoundary>
    )
}
