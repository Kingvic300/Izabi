import type React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Trash2 } from 'lucide-react';
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
    const fullName =
        [profileData.firstName, profileData.lastName].filter(Boolean).join(' ') ||
        'Your name';
    return (
        <section className="rounded-lg border border-border bg-card p-6">
            <div className="relative w-fit">
                <Avatar className="h-24 w-24 border border-border">
                    <AvatarImage
                        src={profileData.profilePicturePath || defaultAvatar(profileData.email)}
                        className="object-cover"
                        alt=""
                    />
                    <AvatarFallback className="font-display text-3xl">
                        {profileData.firstName?.[0] || 'S'}
                    </AvatarFallback>
                </Avatar>
            </div>
            {isEditing && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                        <label className="cursor-pointer">
                            <Camera />
                            Change photo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onAvatarUpload}
                                className="sr-only"
                            />
                        </label>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRemoveAvatar}
                        disabled={!isCustomAvatar}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <Trash2 />
                        Remove
                    </Button>
                </div>
            )}

            <h2 className="mt-5 text-2xl leading-tight">{fullName}</h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">
                {profileData.email}
            </p>

            <dl className="mt-6 divide-y divide-border border-t border-border text-sm">
                <div className="flex justify-between gap-4 py-3">
                    <dt className="text-muted-foreground">Account</dt>
                    <dd className="font-bold">Student</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="text-right font-bold">
                        {profileData.location || 'Not set'}
                    </dd>
                </div>
            </dl>
        </section>
    );
}
