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
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type PreviewImportDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    previewTitle: string;
    previewSubject: string;
    previewText: string;
    previewSaving: boolean;
    onTitleChange: (value: string) => void;
    onSubjectChange: (value: string) => void;
    onSave: () => void;
};

export default function PreviewImportDialog({
    open,
    onOpenChange,
    previewTitle,
    previewSubject,
    previewText,
    previewSaving,
    onTitleChange,
    onSubjectChange,
    onSave,
}: PreviewImportDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-foreground/10 rounded-2xl sm:rounded-3xl sm:max-w-3xl w-[95vw] max-h-[85vh] p-0 overflow-hidden">
                <DialogHeader className="p-5 sm:p-6 border-b border-foreground/10 bg-card/5">
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                        Preview Import
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Review the extracted text before saving.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="preview-title"
                                className="text-xs uppercase tracking-widest font-bold opacity-60"
                            >
                                Title
                            </Label>
                            <Input
                                id="preview-title"
                                value={previewTitle}
                                onChange={(e) => onTitleChange(e.target.value)}
                                className="rounded-2xl h-11 bg-card/5 border-foreground/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="preview-subject"
                                className="text-xs uppercase tracking-widest font-bold opacity-60"
                            >
                                Subject
                            </Label>
                            <Input
                                id="preview-subject"
                                value={previewSubject}
                                onChange={(e) =>
                                    onSubjectChange(e.target.value)
                                }
                                placeholder="Optional"
                                className="rounded-2xl h-11 bg-card/5 border-foreground/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-widest font-bold opacity-60">
                            Extracted Text
                        </Label>
                        <Textarea
                            value={previewText}
                            readOnly
                            className="min-h-[220px] bg-card/5 border-foreground/10"
                        />
                    </div>
                </div>
                <div className="p-5 sm:p-6 border-t border-foreground/10 bg-card/5 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="rounded-2xl h-11 px-4 w-full sm:w-auto"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={previewSaving}
                        className="rounded-2xl h-11 px-6 shadow-glow w-full sm:w-auto"
                    >
                        {previewSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            'Save Note'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
