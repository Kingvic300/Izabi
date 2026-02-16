import { useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText, Loader2, Upload } from 'lucide-react';

type ImportMode = 'import' | 'scan';
type ImportStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

type ImportNoteDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    importMode: ImportMode;
    importFile: File | null;
    importTitle: string;
    importSubject: string;
    importStatus: ImportStatus;
    importError: string | null;
    isBusy: boolean;
    acceptTypes: string;
    onFileSelected: (file: File | null) => void;
    onTitleChange: (value: string) => void;
    onSubjectChange: (value: string) => void;
    onPreview: () => void;
    onSave: () => void;
};

export default function ImportNoteDialog({
    open,
    onOpenChange,
    importMode,
    importFile,
    importTitle,
    importSubject,
    importStatus,
    importError,
    isBusy,
    acceptTypes,
    onFileSelected,
    onTitleChange,
    onSubjectChange,
    onPreview,
    onSave,
}: ImportNoteDialogProps) {
    const importInputRef = useRef<HTMLInputElement>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-foreground/10 rounded-2xl sm:rounded-3xl sm:max-w-2xl w-[95vw] p-0 overflow-hidden">
                <DialogHeader className="p-5 sm:p-6 border-b border-foreground/10 bg-card/5">
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                        {importMode === 'scan'
                            ? 'Scan Note (Image)'
                            : 'Import Note'}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {importMode === 'scan'
                            ? 'Upload a clear image and we will extract the text.'
                            : 'Upload a document to turn it into a note.'}
                    </DialogDescription>
                </DialogHeader>
                <div className="p-5 sm:p-6 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold opacity-60">
                            File Upload
                        </Label>
                        <div
                            className="border-2 border-dashed border-foreground/10 rounded-[20px] p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all cursor-pointer relative bg-background/50"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                onFileSelected(
                                    e.dataTransfer.files?.[0] || null,
                                );
                            }}
                            onClick={() => importInputRef.current?.click()}
                        >
                            <input
                                ref={importInputRef}
                                type="file"
                                accept={acceptTypes}
                                onChange={(e) =>
                                    onFileSelected(
                                        e.target.files?.[0] || null,
                                    )
                                }
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {importFile ? (
                                <div className="text-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                                        <FileText size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-primary truncate max-w-[220px]">
                                        {importFile.name}
                                    </p>
                                    <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">
                                        Click to change
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center">
                                        <Upload
                                            size={24}
                                            className="text-muted-foreground"
                                        />
                                    </div>
                                    <p className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] text-center">
                                        Drag & drop or browse
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest opacity-40 text-center">
                                        {importMode === 'scan'
                                            ? 'JPG, JPEG, PNG'
                                            : 'TXT, PDF, DOCX, JPG, JPEG, PNG'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="import-title"
                                className="text-xs uppercase tracking-widest font-bold opacity-60"
                            >
                                Title (optional)
                            </Label>
                            <Input
                                id="import-title"
                                value={importTitle}
                                onChange={(e) => onTitleChange(e.target.value)}
                                placeholder="Auto-generate if left blank"
                                className="rounded-2xl h-11 bg-card/5 border-foreground/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="import-subject"
                                className="text-xs uppercase tracking-widest font-bold opacity-60"
                            >
                                Subject (optional)
                            </Label>
                            <Input
                                id="import-subject"
                                value={importSubject}
                                onChange={(e) =>
                                    onSubjectChange(e.target.value)
                                }
                                placeholder="e.g., Biology"
                                className="rounded-2xl h-11 bg-card/5 border-foreground/10"
                            />
                        </div>
                    </div>

                    {importError && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {importError}
                        </p>
                    )}

                    {importStatus !== 'idle' && !importError && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {importStatus === 'uploading' ||
                            importStatus === 'processing' ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : null}
                            <span>
                                {importStatus === 'uploading' &&
                                    'Uploading...'}
                                {importStatus === 'processing' &&
                                    'Processing...'}
                                {importStatus === 'success' &&
                                    'Ready to save.'}
                                {importStatus === 'error' &&
                                    'Something went wrong.'}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-2xl h-11 px-4 w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!importFile || isBusy}
                            onClick={onPreview}
                            className="rounded-2xl h-11 px-4 w-full sm:w-auto"
                        >
                            Preview
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={!importFile || isBusy}
                            className="rounded-2xl h-11 px-6 shadow-glow w-full sm:w-auto"
                        >
                            {importMode === 'scan'
                                ? 'Scan & Save'
                                : 'Import Note'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
