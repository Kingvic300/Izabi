import { Bot, Clock, Edit2, Eye, FileText, Loader2, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import RichTextEditor from '@/components/RichTextEditor';
import type { Note, NoteGroup } from './noteTypes';

type NotesGridProps = {
    notes: Note[];
    groups: NoteGroup[];
    groupMap: Map<string, string>;
    groupFilter: string;
    activeGroupLabel: string;
    editingId: string | null;
    savingId: string | null;
    deleteConfirm: string | null;
    sendingToAIId: string | null;
    onEditNote: (id: string | null) => void;
    onReadNote: (note: Note) => void;
    onDeleteConfirmChange: (id: string | null) => void;
    onDeleteNote: (id: string) => void;
    onSaveNote: (id: string, title: string, content: string, groupId?: string | null) => void;
    onUpdateDraft: (id: string, updates: Partial<Note>) => void;
    onSendToAI: (note: Note) => void;
    onCreateNote: () => void;
};

export default function NotesGrid({
    notes,
    groups,
    groupMap,
    groupFilter,
    activeGroupLabel,
    editingId,
    savingId,
    deleteConfirm,
    sendingToAIId,
    onEditNote,
    onReadNote,
    onDeleteConfirmChange,
    onDeleteNote,
    onSaveNote,
    onUpdateDraft,
    onSendToAI,
    onCreateNote,
}: NotesGridProps) {
    const editingNote = editingId ? notes.find((n) => n.id === editingId) : null;

    if (notes.length === 0) {
        return (
            <div className="flex flex-col items-start gap-5 rounded-lg border border-dashed border-sheet/45 px-6 py-12 sm:px-10">
                <div className="space-y-1">
                    <h3 className="text-2xl">
                        {groupFilter === 'all'
                            ? 'No notes yet'
                            : `No notes in ${activeGroupLabel}`}
                    </h3>
                    <p className="text-muted-foreground">
                        {groupFilter === 'all'
                            ? 'Your notes will appear here. Create your first note.'
                            : 'Switch groups or import a note into this group.'}
                    </p>
                </div>
                <Button onClick={onCreateNote}>
                    <FileText /> Write your first note
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {notes.map((note) => {
                    const noteId = note.id;
                    const groupName = note.groupId
                        ? groupMap.get(note.groupId)
                        : null;
                    return (
                        <Card
                            key={noteId}
                            className="group flex h-[320px] flex-col break-words shadow-none transition-colors hover:border-foreground/30"
                        >
                            <CardContent className="relative flex h-full flex-col p-0">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between gap-3 border-b border-sheet/35 px-5 pb-3 pt-4">
                                        <div className="min-w-0 space-y-0.5">
                                            <p className="truncate text-sm text-muted-foreground">
                                                {note.subject || 'General'}
                                                {groupName && `, ${groupName}`}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => onReadNote(note)}
                                                className="line-clamp-1 text-left font-display text-xl hover:underline hover:decoration-sheet hover:decoration-2 hover:underline-offset-4"
                                            >
                                                {note.title}
                                            </button>
                                        </div>
                                        <div className="-mr-2 flex shrink-0 gap-0.5 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label={`Read ${note.title}`}
                                                onClick={() => onReadNote(note)}
                                            >
                                                <Eye size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                aria-label={`Edit ${note.title}`}
                                                onClick={() => onEditNote(noteId)}
                                            >
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={sendingToAIId === noteId}
                                                onClick={() => onSendToAI(note)}
                                                aria-label={`Ask the assistant about ${note.title}`}
                                                title="Ask the assistant about this note"
                                            >
                                                {sendingToAIId === noteId ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Bot size={14} />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                                                aria-label={`Delete ${note.title}`}
                                                onClick={() => onDeleteConfirmChange(noteId)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div
                                        className="prose prose-sm max-w-none flex-1 overflow-hidden px-5 pt-3 text-[15px] leading-relaxed text-muted-foreground [mask-image:linear-gradient(to_bottom,black_70%,transparent)] dark:prose-invert"
                                        dangerouslySetInnerHTML={{
                                            __html: note.content,
                                        }}
                                    />

                                    <div className="flex items-center gap-2 border-t border-border px-5 py-3 text-sm text-muted-foreground">
                                        <Clock size={13} />
                                        <span className="tabular">
                                            {new Date(
                                                note.updatedAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {deleteConfirm === noteId && (
                                        <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center p-6 space-y-4 z-20">
                                            <p className="text-center font-bold">
                                                Delete this note? You cannot undo this.
                                            </p>
                                            <div className="flex gap-2 w-full">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onDeleteConfirmChange(null)}
                                                    className="flex-1"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() => onDeleteNote(noteId)}
                                                >
                                                    Delete note
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Dialog
                open={Boolean(editingNote)}
                onOpenChange={(open) => {
                    if (!open) onEditNote(null);
                }}
            >
                <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                        <DialogTitle>
                            Edit note
                        </DialogTitle>
                    </DialogHeader>

                    {editingNote && (
                        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto flex-1">
                            <Input
                                value={editingNote.title}
                                placeholder="Note title"
                                aria-label="Note title"
                                onChange={(e) =>
                                    onUpdateDraft(editingNote.id, {
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Select
                                value={editingNote.groupId || 'none'}
                                onValueChange={(value) =>
                                    onUpdateDraft(editingNote.id, {
                                        groupId: value === 'none' ? null : value,
                                    })
                                }
                            >
                                <SelectTrigger className="h-10" aria-label="Folder">
                                    <SelectValue placeholder="No folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No folder</SelectItem>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id}>
                                            {group.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <RichTextEditor
                                content={editingNote.content}
                                onChange={(val) =>
                                    onUpdateDraft(editingNote.id, { content: val })
                                }
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
                        <Button
                            variant="ghost"
                            onClick={() => onEditNote(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={!!editingNote && savingId === editingNote.id}
                            onClick={() => {
                                if (!editingNote) return;
                                onSaveNote(
                                    editingNote.id,
                                    editingNote.title,
                                    editingNote.content,
                                    editingNote.groupId,
                                );
                            }}
                        >
                            <Save />
                            {editingNote && savingId === editingNote.id
                                ? 'Saving…'
                                : 'Save changes'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
