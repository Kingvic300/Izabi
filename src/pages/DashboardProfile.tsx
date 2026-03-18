'use client';

import { useState, useEffect, useRef } from 'react';
import apiClient from '@/lib/apiClient';
import { useAppToast } from '@/hooks/useAppToast';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ProfileHeader from '@/components/dashboard-profile/ProfileHeader';
import ProfileSidebar from '@/components/dashboard-profile/ProfileSidebar';
import PersonalDetailsCard from '@/components/dashboard-profile/PersonalDetailsCard';
import SecuritySettingsCard from '@/components/dashboard-profile/SecuritySettingsCard';
import type { ProfileData } from '@/components/dashboard-profile/profileTypes';
import {
    defaultAvatar,
    syncAvatarInStorage,
} from '@/components/dashboard-profile/profileUtils';

const DashboardProfile = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appToast = useAppToast();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData>({
        id: localStorage.getItem('userId') || '',
        firstName: '',
        lastName: '',
        email: localStorage.getItem('userEmail') || '',
        phoneNumber: '',
        institution: '',
        major: '',
        location: '',
        profilePicturePath: '',
    });

    // Load profile on mount
    useEffect(() => {
        /*
         * How: Fetches user profile data from the backend using the stored userId.
         * Why: To populate the form with existing user data for viewing or editing.
         */
        const loadProfile = async () => {
            try {
                const response = await apiClient.get(`/api/user/profile`);
                const userData = response.data.data;
                setProfileData((prev) => ({
                    ...prev,
                    ...userData,
                    email: localStorage.getItem('userEmail') || userData.email,
                }));
                if (userData.firstName)
                    localStorage.setItem('userFirstName', userData.firstName);
                if (userData.lastName)
                    localStorage.setItem('userLastName', userData.lastName);
                syncAvatarInStorage(
                    userData.profilePicturePath || '',
                    userData.email || profileData.email,
                );
            } catch (err) {
                console.error('Error loading profile:', err);
            }
        };

        loadProfile();
    }, [appToast]);

    useGSAP(
        () => {
            const tl = gsap.timeline();
            tl.from('.profile-header', {
                y: -20,
                opacity: 0,
                duration: 0.8,
                ease: 'expo.out',
            }).from(
                '.profile-card',
                {
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'expo.out',
                },
                '-=0.4',
            );
        },
        { scope: containerRef },
    );

    const handleInputChange = (field: keyof ProfileData, value: string) => {
        const updatedData = { ...profileData, [field]: value };
        setProfileData(updatedData);
    };

    /*
     * How: Sends updated profile data to the backend via PUT request and updates local storage.
     * Why: Users need to be able to modify their personal information and have it persist.
     */
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const updatedProfileData = {
                ...profileData,
                email: localStorage.getItem('userEmail') || profileData.email,
            };

            const response = await apiClient.put(
                `/api/user/profile`,
                updatedProfileData,
            );
            const updatedProfile = response.data.data;

            setProfileData((prev) => ({
                ...prev,
                ...updatedProfile,
                email:
                    localStorage.getItem('userEmail') || updatedProfile.email,
            }));
            if (updatedProfile.firstName)
                localStorage.setItem('userFirstName', updatedProfile.firstName);
            if (updatedProfile.lastName)
                localStorage.setItem('userLastName', updatedProfile.lastName);
            syncAvatarInStorage(
                updatedProfile.profilePicturePath || '',
                updatedProfile.email || profileData.email,
            );

            setIsEditing(false);

            appToast.profileUpdated();
        } catch (err) {
            console.error('Error updating profile:', err);
            appToast.error({
                title: 'Update Failed',
                description: 'Could not save your profile changes.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const updatedData = {
                ...profileData,
                profilePicturePath: e.target?.result as string,
            };
            setProfileData(updatedData);
            syncAvatarInStorage(
                updatedData.profilePicturePath || '',
                updatedData.email,
            );
            // In a real app, you'd verify upload to backend here or in handleSaveProfile
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        const updatedData = {
            ...profileData,
            profilePicturePath: '',
        };
        setProfileData(updatedData);
        syncAvatarInStorage('', updatedData.email);
        appToast.info({
            title: 'Photo Removed',
            description: 'Profile photo removed. Click Save Changes to confirm.',
        });
    };

    const isCustomAvatar =
        Boolean(profileData.profilePicturePath) &&
        profileData.profilePicturePath !== defaultAvatar(profileData.email);

    return (
        <div
            ref={containerRef}
            className="space-y-8 md:space-y-12 w-full min-w-0 pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12"
        >
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-xl border border-foreground/10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                        Profile
                    </span>
                </div>
                <div className="glass-card border-foreground/10 rounded-[28px] p-5 sm:p-6">
                    <ProfileHeader
                        isEditing={isEditing}
                        isSaving={loading}
                        onToggleEdit={() => setIsEditing(!isEditing)}
                        onSave={handleSaveProfile}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-6">
                    <ProfileSidebar
                        profileData={profileData}
                        isEditing={isEditing}
                        isCustomAvatar={isCustomAvatar}
                        onAvatarUpload={handleAvatarUpload}
                        onRemoveAvatar={handleRemoveAvatar}
                    />
                </div>

                <div className="md:col-span-8 space-y-6">
                    <PersonalDetailsCard
                        profileData={profileData}
                        isEditing={isEditing}
                        onFieldChange={handleInputChange}
                    />
                    <SecuritySettingsCard />
                </div>
            </div>
        </div>
    );
};

export default function DashboardProfilePage() {
    return (
        <ErrorBoundary>
            <DashboardProfile />
        </ErrorBoundary>
    );
}
