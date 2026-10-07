import { Button } from '@/components/ui/button';
import { Loader2, Pencil } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';

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
        <PageHeader
            title="Profile"
            description="Your name, school and photo, as other students see them."
            actions={
                isEditing ? (
                    <>
                        <Button variant="ghost" onClick={onToggleEdit}>
                            Cancel
                        </Button>
                        <Button onClick={onSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="animate-spin" />}
                            Save changes
                        </Button>
                    </>
                ) : (
                    <Button variant="outline" onClick={onToggleEdit}>
                        <Pencil />
                        Edit profile
                    </Button>
                )
            }
        />
    );
}
