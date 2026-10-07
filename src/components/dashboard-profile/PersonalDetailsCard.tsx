import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, GraduationCap, MapPin, User } from 'lucide-react';
import type { ProfileData } from './profileTypes';
import ProfileFormInput from './ProfileFormInput';

type PersonalDetailsCardProps = {
    profileData: ProfileData;
    isEditing: boolean;
    onFieldChange: (field: keyof ProfileData, value: string) => void;
};

export default function PersonalDetailsCard({
    profileData,
    isEditing,
    onFieldChange,
}: PersonalDetailsCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="border-b border-border px-6 py-4">
                <CardTitle className="text-xl">Your details</CardTitle>
                <CardDescription>
                    Other students see your name and school on the leaderboard.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <ProfileFormInput
                        icon={<User size={16} />}
                        label="First name"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                            onFieldChange('firstName', e.target.value)
                        }
                        disabled={!isEditing}
                    />
                    <ProfileFormInput
                        icon={<User size={16} />}
                        label="Last name"
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                            onFieldChange('lastName', e.target.value)
                        }
                        disabled={!isEditing}
                    />
                    <ProfileFormInput
                        icon={<Building size={16} />}
                        label="Institution"
                        id="institution"
                        value={profileData.institution}
                        onChange={(e) =>
                            onFieldChange('institution', e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="e.g. University of Lagos"
                    />
                    <ProfileFormInput
                        icon={<GraduationCap size={16} />}
                        label="Major / Course"
                        id="major"
                        value={profileData.major}
                        onChange={(e) =>
                            onFieldChange('major', e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="e.g. Computer Science"
                    />
                    <ProfileFormInput
                        icon={<MapPin size={16} />}
                        label="Location"
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                            onFieldChange('location', e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="City, Country"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
