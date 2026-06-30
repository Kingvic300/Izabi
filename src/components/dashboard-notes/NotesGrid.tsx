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
            <div className="flex flex-col items-center justify-center py-24 glass rounded-2xl border-dashed space-y-6">
                <div className="w-24 h-24 rounded-2xl bg-card/5 flex items-center justify-center border border-foreground/10">
                    <FileText size={48} className="text-muted-foreground/30" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">
                        {groupFilter === 'all'
                            ? 'Your Slate is Clean'
                            : `No notes in ${activeGroupLabel}`}
                    </h3>
                    <p className="text-muted-foreground">
                        {groupFilter === 'all'
                            ? 'Your notes will appear here. Create your first note.'
                            : 'Switch groups or import a note into this group.'}
                    </p>
                </div>
                <Button
                    onClick={onCreateNote}
                    size="lg"
                    className="rounded-2xl h-12 sm:h-14 px-6 sm:px-10 shadow-glow font-bold text-base sm:text-lg w-full sm:w-auto"
                >
                    <FileText size={20} className="mr-2" /> Create First Note
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => {
                    const noteId = note.id;
                    const groupName = note.groupId
                        ? groupMap.get(note.groupId)
                        : null;
                    return (
                        <Card
                            key={noteId}
                            className="note-card glass shadow-lg hover-lift border-foreground/5 flex flex-col group h-[400px] break-words"
                        >
                            <CardContent className="p-6 flex flex-col h-full relative">
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                    {note.subject || 'General'}
                                                </span>
                                                {groupName && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 bg-foreground/10 px-2 py-0.5 rounded">
                                                        {groupName}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                {note.title}
                                            </h3>
                                        </div>
                                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg"
                                                onClick={() => onReadNote(note)}
                                            >
                                                <Eye size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                                onClick={() => onEditNote(noteId)}
                                            >
                                                <Edit2 size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 rounded-lg text-primary/60 hover:text-primary hover:bg-primary/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                                disabled={sendingToAIId === noteId}
                                                onClick={() => onSendToAI(note)}
                                                title="Send to AI Assistant"
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
                                                className="h-8 w-8 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                                onClick={() => onDeleteConfirmChange(noteId)}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div
                                        className="text-sm leading-relaxed text-muted-foreground prose prose-sm dark:prose-invert max-w-none overflow-hidden mask-fade flex-1"
                                        dangerouslySetInnerHTML={{
                                            __html: note.content,
                                        }}
                                    />

                                    <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                                        <Clock size={10} />
                                        <span>
                                            {new Date(
                                                note.updatedAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {deleteConfirm === noteId && (
                                        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4 z-20">
                                            <p className="text-xs font-bold uppercase tracking-wider text-center">
                                                Permanently remove this note?
                                            </p>
                                            <div className="flex gap-2 w-full">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => onDeleteConfirmChange(null)}
                                                    className="flex-1 rounded-2xl bg-card/10 border-foreground/20 text-foreground hover:bg-card/20"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
                                                    onClick={() => onDeleteNote(noteId)}
                                                >
                                                    Delete
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
                <DialogContent className="glass border-foreground/10 max-w-2xl w-full rounded-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b border-foreground/10 shrink-0">
                        <DialogTitle className="text-lg font-bold">
                            Edit Note
                        </DialogTitle>
                    </DialogHeader>

                    {editingNote && (
                        <div className="flex flex-col gap-4 px-6 py-5 overflow-y-auto flex-1">
                            <Input
                                value={editingNote.title}
                                className="rounded-2xl bg-card/5 border-foreground/10"
                                placeholder="Note title"
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
                                <SelectTrigger className="rounded-2xl bg-card/5 border-foreground/10 h-10">
                                    <SelectValue placeholder="No Group" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Group</SelectItem>
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

                    <div className="flex justify-end gap-2 px-6 py-4 border-t border-foreground/10 shrink-0">
                        <Button
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() => onEditNote(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="rounded-xl px-6"
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
                            <Save size={14} className="mr-2" />
                            {editingNote && savingId === editingNote.id
                                ? 'Saving...'
                                : 'Save'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
