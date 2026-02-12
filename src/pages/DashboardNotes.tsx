'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    FileText,
    Plus,
    Trash2,
    Edit2,
    Save,
    AlertCircle,
    Sparkles,
    Clock,
    Eye,
} from 'lucide-react';
import { useAppToast } from '@/hooks/useAppToast';
import { formValidation } from '@/lib/formValidation';
import { api } from '@/lib/apiClient';
import { PageLoader } from '@/components/PageLoader';
import RichTextEditor from '@/components/RichTextEditor';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Note {
    id: string;
    title: string;
    content: string;
    subject?: string;
    createdAt: Date;
    updatedAt: Date;
}

export default function DashboardNotes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const appToast = useAppToast();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [readingNote, setReadingNote] = useState<Note | null>(null);

    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        subject: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
        {},
    );

    useGSAP(
        () => {
            if (!isLoading) {
                gsap.from('.notes-header', {
                    opacity: 0,
                    y: -20,
                    duration: 0.6,
                    ease: 'power2.out',
                });
                if (notes.length > 0) {
                    gsap.from('.note-card', {
                        opacity: 0,
                        y: 20,
                        stagger: 0.1,
                        duration: 0.5,
                        ease: 'power2.out',
                    });
                }
            }
        },
        { scope: containerRef, dependencies: [isLoading, notes.length] },
    );

    useEffect(() => {
        /*
         * How: Fetches all notes associated with the user from the backend upon component mount.
         * Why: Populates the dashboard with the user's saved study materials.
         */
        const fetchNotes = async () => {
            try {
                const data = await api.getNotes();
                setNotes(data);
            } catch (err: any) {
                console.error('Failed to fetch notes:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const validateNote = () => {
        const titleCheck = formValidation.noteTitle(newNote.title);
        const contentCheck = formValidation.noteContent(newNote.content);
        const titleError = !titleCheck.isValid ? titleCheck.error : undefined;
        const contentError = !contentCheck.isValid
            ? contentCheck.error
            : undefined;
        setErrors({ title: titleError, content: contentError });
        return titleCheck.isValid && contentCheck.isValid;
    };

    /*
     * How: Validates input, sends a creation request to the API, and updates local state on success.
     * Why: Allows users to save new notes to their collection.
     */
    const handleCreateNote = async () => {
        if (!validateNote()) {
            appToast.error({
                title: 'Invalid input',
                description: 'Please check the highlighted fields.',
            });
            return;
        }

        try {
            const created = await api.createNote({
                ...newNote,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setNotes([created, ...notes]);
            setNewNote({ title: '', content: '', subject: '' });
            setErrors({});
            setIsAddingNote(false);
            appToast.success({
                title: 'Note saved',
                description: 'Your new study note is ready!',
            });
        } catch (err: any) {
            console.error('Error creating note:', err);
            appToast.apiError(err, 'Could not save note');
        }
    };

    /*
     * How: Validates changes and sends a PUT request to update an existing note's title and content.
     * Why: Enables users to refine and edit their notes over time.
     */
    const handleUpdateNote = async (
        id: string,
        title: string,
        content: string,
    ) => {
        const titleCheck = formValidation.noteTitle(title);
        const contentCheck = formValidation.noteContent(content);
        if (!titleCheck.isValid || !contentCheck.isValid) {
            appToast.error({
                title: 'Invalid update',
                description: titleCheck.error || contentCheck.error,
            });
            return;
        }

        try {
            setSavingId(id);
            const updated = await api.updateNote(id, { title, content });
            const normalizedUpdated = {
                ...updated,
                id: updated?.id || updated?._id || id,
            };
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, ...normalizedUpdated } : note,
                ),
            );
            setEditingId(null);
            appToast.success({
                title: 'Note updated',
                description: 'Your changes have been saved.',
            });
        } catch (err: any) {
            console.error('Error updating note:', err);
            appToast.apiError(err, 'Could not update note');
        } finally {
            setSavingId(null);
        }
    };

    /*
     * How: Sends a DELETE request to remove a note by ID and updates the local list.
     * Why: Allows users to manage their storage and remove unwanted content.
     */
    const handleDeleteNote = async (id: string) => {
        try {
            await api.deleteNote(id);
            setNotes(notes.filter((n) => n.id !== id));
            setDeleteConfirm(null);
            appToast.success({
                title: 'Note deleted',
                description: 'Your note was removed.',
            });
        } catch (err: any) {
            console.error('Error deleting note:', err);
            appToast.apiError(err, 'Could not delete note');
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
                    My Notes
                </h1>
                <p className="text-muted-foreground">
                    Manage and organize all your study notes in one place.
                </p>
                <PageLoader
                    variant="skeleton-cards"
                    itemCount={3}
                    text="Loading your notes..."
                />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="space-y-6 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12"
        >
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
                    <Button
                        onClick={() => setIsAddingNote(true)}
                        className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl shadow-glow w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" /> Create New Note
                    </Button>
                )}
            </header>

            {isAddingNote && (
                <Card className="glass shadow-2xl border-foreground/10 overflow-hidden stagger-card">
                    <CardHeader className="bg-card/5 border-b border-foreground/5">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span>Create New Note</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="title"
                                    className="text-xs uppercase tracking-widest font-bold opacity-60"
                                >
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    value={newNote.title}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter note title..."
                                    className={`rounded-2xl h-12 bg-card/5 border-foreground/10 ${errors.title ? 'border-destructive' : ''}`}
                                />
                                {errors.title && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />{' '}
                                        {errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="subject"
                                    className="text-xs uppercase tracking-widest font-bold opacity-60"
                                >
                                    Subject
                                </Label>
                                <Input
                                    id="subject"
                                    value={newNote.subject}
                                    onChange={(e) =>
                                        setNewNote({
                                            ...newNote,
                                            subject: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Biology, Math..."
                                    className="rounded-2xl h-12 bg-card/5 border-foreground/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-bold opacity-60">
                                Content
                            </Label>
                            <RichTextEditor
                                content={newNote.content}
                                onChange={(val) =>
                                    setNewNote({ ...newNote, content: val })
                                }
                                placeholder="Start writing your thoughts..."
                            />
                            {errors.content && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" />{' '}
                                    {errors.content}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setIsAddingNote(false)}
                                className="rounded-2xl h-11 sm:h-12 px-4 sm:px-6 w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateNote}
                                disabled={
                                    !newNote.title.trim() ||
                                    !newNote.content.trim()
                                }
                                className="rounded-2xl h-11 sm:h-12 px-4 sm:px-8 shadow-glow w-full sm:w-auto"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                Save Note
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Notes list */}
            {notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <Card
                            key={note.id}
                            className="note-card glass shadow-lg hover-lift border-foreground/5 flex flex-col group h-[400px]"
                        >
                            <CardContent className="p-6 flex flex-col h-full">
                                {editingId === note.id ? (
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <Input
                                            value={note.title}
                                            className="rounded-2xl bg-card/5 border-foreground/10"
                                            onChange={(e) =>
                                                setNotes((prev) =>
                                                    prev.map((n) =>
                                                        n.id === note.id
                                                            ? {
                                                                  ...n,
                                                                  title: e
                                                                      .target
                                                                      .value,
                                                              }
                                                            : n,
                                                    ),
                                                )
                                            }
                                        />
                                        <div className="flex-1 overflow-y-auto">
                                            <RichTextEditor
                                                content={note.content}
                                                onChange={(val) =>
                                                    setNotes((prev) =>
                                                        prev.map((n) =>
                                                            n.id === note.id
                                                                ? {
                                                                      ...n,
                                                                      content:
                                                                          val,
                                                                  }
                                                                : n,
                                                        ),
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="rounded-lg"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="rounded-lg px-4"
                                                disabled={savingId === note.id}
                                                onClick={() => {
                                                    const updated = notes.find(
                                                        (n) => n.id === note.id,
                                                    );
                                                    if (updated)
                                                        handleUpdateNote(
                                                            note.id,
                                                            updated.title,
                                                            updated.content,
                                                        );
                                                }}
                                            >
                                                <Save
                                                    size={14}
                                                    className="mr-2"
                                                />{' '}
                                                {savingId === note.id
                                                    ? 'Saving...'
                                                    : 'Save'}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {note.subject ||
                                                            'General'}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                                    {note.title}
                                                </h3>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg"
                                                    onClick={() =>
                                                        setReadingNote(note)
                                                    }
                                                >
                                                    <Eye size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg"
                                                    onClick={() =>
                                                        setEditingId(note.id)
                                                    }
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() =>
                                                        setDeleteConfirm(
                                                            note.id,
                                                        )
                                                    }
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

                                        {deleteConfirm === note.id && (
                                            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4 z-20">
                                                <p className="text-xs font-bold uppercase tracking-wider text-center">
                                                    Permanently remove this
                                                    note?
                                                </p>
                                                <div className="flex gap-2 w-full">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setDeleteConfirm(
                                                                null,
                                                            )
                                                        }
                                                        className="flex-1 rounded-2xl bg-card/10 border-foreground/20 text-foreground hover:bg-card/20"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
                                                        onClick={() =>
                                                            handleDeleteNote(
                                                                note.id,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 glass rounded-2xl border-dashed space-y-6">
                    <div className="w-24 h-24 rounded-2xl bg-card/5 flex items-center justify-center border border-foreground/10">
                        <FileText
                            size={48}
                            className="text-muted-foreground/30"
                        />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold">
                            Your Slate is Clean
                        </h3>
                        <p className="text-muted-foreground">
                            Your notes will appear here. Create your first note.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddingNote(true)}
                        size="lg"
                        className="rounded-2xl h-12 sm:h-14 px-6 sm:px-10 shadow-glow font-bold text-base sm:text-lg w-full sm:w-auto"
                    >
                        <Plus size={20} className="mr-2" /> Create First Note
                    </Button>
                </div>
            )}

            <Dialog
                open={Boolean(readingNote)}
                onOpenChange={(open) => {
                    if (!open) setReadingNote(null);
                }}
            >
                <DialogContent className="glass border-foreground/10 rounded-2xl sm:rounded-3xl sm:max-w-3xl w-[95vw] max-h-[85vh] p-0 overflow-hidden">
                    {readingNote && (
                        <>
                            <DialogHeader className="p-5 sm:p-6 border-b border-foreground/10 bg-card/5">
                                <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight leading-tight break-words">
                                    {readingNote.title}
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm flex items-center gap-2">
                                    <span className="text-primary font-semibold">
                                        {readingNote.subject || 'General'}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        Updated{' '}
                                        {new Date(
                                            readingNote.updatedAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </DialogDescription>
                            </DialogHeader>

                            <div className="p-5 sm:p-6 overflow-y-auto max-h-[65vh]">
                                <div
                                    className="prose prose-sm sm:prose-base dark:prose-invert max-w-none leading-relaxed text-foreground/90 break-words"
                                    dangerouslySetInnerHTML={{
                                        __html: readingNote.content,
                                    }}
                                />
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
