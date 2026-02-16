import type React from 'react';

import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Camera, Mail, MapPin, Shield, Trash2 } from 'lucide-react';
import type { ProfileData } from './profileTypes';
import { defaultAvatar } from './profileUtils';

type ProfileSidebarProps = {
    profileData: ProfileData;
    isEditing: boolean;
    isCustomAvatar: boolean;
    onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveAvatar: () => void;
};

export default function ProfileSidebar({
    profileData,
    isEditing,
    isCustomAvatar,
    onAvatarUpload,
    onRemoveAvatar,
}: ProfileSidebarProps) {
    return (
        <Card className="profile-card glass border-foreground/5 rounded-2xl overflow-hidden shadow-2xl h-full">
            <div className="h-32 bg-primary/10 relative">
                <div className="absolute top-4 right-4">
                    <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 rounded-2xl"
                    >
                        Scholar
                    </Badge>
                </div>
            </div>
            <div className="px-5 sm:px-8 pb-8 -mt-16 flex flex-col items-center text-center">
                <div className="relative mb-6 group">
                    <Avatar className="w-32 h-32 border-4 border-background relative z-10 shadow-xl">
                        <AvatarImage
                            src={
                                profileData.profilePicturePath ||
                                defaultAvatar(profileData.email)
                            }
                            className="object-cover"
                        />
                        <AvatarFallback className="text-4xl font-bold bg-muted">
                            {profileData.firstName?.[0] || 'U'}
                            {profileData.lastName?.[0] || 'N'}
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <>
                            <button
                                type="button"
                                onClick={onRemoveAvatar}
                                disabled={!isCustomAvatar}
                                aria-label="Remove profile photo"
                                title="Remove profile photo"
                                className="absolute top-0 right-0 w-9 h-9 bg-destructive/90 text-destructive-foreground rounded-2xl flex items-center justify-center shadow-lg z-20 transition-transform active:scale-95 hover:bg-destructive disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center cursor-pointer hover:bg-primary-glow shadow-lg z-20 transition-transform active:scale-95">
                                <Camera className="h-5 w-5" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onAvatarUpload}
                                    className="hidden"
                                />
                            </label>
                        </>
                    )}
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-1">
                    {profileData.firstName || 'New'}{' '}
                    {profileData.lastName || 'Scholar'}
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
                            <p className="text-xs uppercase tracking-widest font-bold opacity-40">
                                Role
                            </p>
                            <p className="font-bold">Standard User</p>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/5 border border-foreground/5 w-full flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                            <MapPin size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-xs uppercase tracking-widest font-bold opacity-40">
                                Location
                            </p>
                            <p className="font-bold">
                                {profileData.location || 'Earth'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
