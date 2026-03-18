import { Button } from '@/components/ui/button';
import { Edit, Loader2, Save } from 'lucide-react';

type ProfileHeaderProps = {
    isEditing: boolean;
    isSaving: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
};

export default function ProfileHeader({
    isEditing,
    isSaving,
    onToggleEdit,
    onSave,
}: ProfileHeaderProps) {
    return (
        <div className="profile-header flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter leading-none mb-2">
                    Your <span className="text-gradient">scholar profile</span>
                </h1>
                <p className="text-muted-foreground font-medium text-base sm:text-lg">
                    Manage your digital scholar identity
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                <Button
                    variant="outline"
                    onClick={onToggleEdit}
                    className={`
                            h-11 sm:h-12 rounded-2xl border-foreground/10 px-4 sm:px-6 font-bold transition-all w-full sm:w-auto
                            ${isEditing ? 'bg-card/10 text-foreground' : 'glass hover:bg-card/5'}
                        `}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
                {isEditing && (
                    <Button
                        onClick={onSave}
                        disabled={isSaving}
                        className="h-11 sm:h-12 rounded-2xl bg-primary  hover:bg-primary-glow font-bold px-4 sm:px-8 shadow-glow w-full sm:w-auto"
                    >
                        {isSaving ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                )}
            </div>
        </div>
    );
}
