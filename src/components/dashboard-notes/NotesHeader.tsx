import { Image, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <header className="notes-header flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-2 text-gradient">
                    My Notes
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                    Manage and organize all your study notes in one place.
                </p>
            </div>
            {!isAddingNote && (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        onClick={onImport}
                        className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl w-full sm:w-auto"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Note
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onScan}
                        className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl w-full sm:w-auto"
                    >
                        <Image className="h-4 w-4 mr-2" />
                        Scan Note (Image)
                    </Button>
                    <Button
                        onClick={onCreate}
                        className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl shadow-glow w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Create New Note
                    </Button>
                </div>
            )}
        </header>
    );
}
