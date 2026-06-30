import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Note } from './noteTypes';

type NoteReaderDialogProps = {
    note: Note | null;
    groupMap: Map<string, string>;
    open: boolean;
    isSendingToAI: boolean;
    onSendToAI: () => void;
    onOpenChange: (open: boolean) => void;
};

export default function NoteReaderDialog({
    note,
    groupMap,
    open,
    isSendingToAI,
    onSendToAI,
    onOpenChange,
}: NoteReaderDialogProps) {
    if (!note) return null;

    const groupName = note.groupId ? groupMap.get(note.groupId) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass border-foreground/10 rounded-2xl sm:rounded-3xl sm:max-w-3xl w-[95vw] max-h-[85vh] p-0 overflow-hidden flex flex-col">
                <DialogHeader className="p-5 sm:p-6 border-b border-foreground/10 bg-card/5 shrink-0">
                    <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight leading-tight break-words">
                        {note.title}
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm flex items-center gap-2">
                        <span className="text-primary font-semibold">
                            {note.subject || 'General'}
                        </span>
                        {groupName && (
                            <>
                                <span>•</span>
                                <span className="text-foreground/70 font-semibold">
                                    {groupName}
                                </span>
                            </>
                        )}
                        <span>•</span>
                        <span>
                            Updated{' '}
                            {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                    <div
                        className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-foreground/90 break-words"
                        dangerouslySetInnerHTML={{
                            __html: note.content,
                        }}
                    />
                </div>

                <div className="px-5 sm:px-6 py-4 border-t border-foreground/10 shrink-0 flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 gap-2"
                        disabled={isSendingToAI}
                        onClick={onSendToAI}
                    >
                        {isSendingToAI ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <Bot size={14} />
                        )}
                        {isSendingToAI ? 'Sending to AI...' : 'Ask AI about this note'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
