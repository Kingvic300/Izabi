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
                    <ProfileFormInput
                        icon={<User size={16} />}
                        label="First Name"
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                            onFieldChange('firstName', e.target.value)
                        }
                        disabled={!isEditing}
                    />
                    <ProfileFormInput
                        icon={<User size={16} />}
                        label="Last Name"
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
