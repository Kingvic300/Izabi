import { Image, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/dashboard/PageHeader';

type NotesHeaderProps = {
    isAddingNote: boolean;
    onImport: () => void;
    onScan: () => void;
    onCreate: () => void;
};

export default function NotesHeader({
    isAddingNote,
    onImport,
    onScan,
    onCreate,
}: NotesHeaderProps) {
    return (
        <PageHeader
            title="Notes"
            description="Everything you have written or imported, sorted into folders."
            actions={
                !isAddingNote && (
                    <>
                        <Button variant="outline" onClick={onImport}>
                            <Upload />
                            Import
                        </Button>
                        <Button variant="outline" onClick={onScan}>
                            <Image />
                            Scan a photo
                        </Button>
                        <Button onClick={onCreate}>
                            <Plus />
                            New note
                        </Button>
                    </>
                )
            }
        />
    );
}
