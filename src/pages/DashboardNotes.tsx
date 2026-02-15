'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
    Upload,
    Image,
    Loader2,
    Folder,
    PencilLine,
    Check,
    X,
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
    _id?: string;
    title: string;
    content: string;
    subject?: string;
    category?: string;
    groupId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface NoteGroup {
    id: string;
    _id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const getNoteId = (note: Partial<Note> | any): string =>
    String(note?.id || note?._id || '');

const normalizeNote = (note: any): Note => ({
    ...note,
    id: getNoteId(note),
    _id: note?._id,
    subject: note?.subject || note?.category || '',
    groupId:
        typeof note?.groupId === 'object'
            ? note?.groupId?._id || note?.groupId?.id || null
            : note?.groupId || null,
});

const getGroupId = (group: Partial<NoteGroup> | any): string =>
    String(group?.id || group?._id || '');

const normalizeGroup = (group: any): NoteGroup => ({
    ...group,
    id: getGroupId(group),
    _id: group?._id,
});

const ACCEPTED_IMPORT_TYPES = '.txt,.pdf,.docx,.jpg,.jpeg,.png';
const ACCEPTED_SCAN_TYPES = '.jpg,.jpeg,.png';

const stripExtension = (value: string): string =>
    value.replace(/\.[^/.]+$/, '');

const isImageFile = (file: File): boolean =>
    file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);

const isAllowedImportFile = (file: File): boolean =>
    /\.(txt|pdf|docx|jpg|jpeg|png)$/i.test(file.name) ||
    file.type.startsWith('image/') ||
    file.type === 'application/pdf' ||
    file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const escapeHtml = (value: string): string =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const plainTextToHtml = (text: string): string => {
    const paragraphs = text.split(/\n{2,}/);
    return paragraphs
        .map((paragraph) => {
            const escaped = escapeHtml(paragraph.trim());
            const withBreaks = escaped.replace(/\n/g, '<br />');
            return `<p>${withBreaks}</p>`;
        })
        .join('');
};

export default function DashboardNotes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);
    const hasLoadedOnceRef = useRef(false);
    const appToast = useAppToast();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [readingNote, setReadingNote] = useState<Note | null>(null);
    const [groups, setGroups] = useState<NoteGroup[]>([]);
    const [groupFilter, setGroupFilter] = useState<string>('all');
    const [groupModalOpen, setGroupModalOpen] = useState(false);
    const [groupNameDraft, setGroupNameDraft] = useState('');
    const [groupEditingId, setGroupEditingId] = useState<string | null>(null);
    const [groupEditingName, setGroupEditingName] = useState('');
    const [groupBusyId, setGroupBusyId] = useState<string | null>(null);
    const [isNotesRefreshing, setIsNotesRefreshing] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [importMode, setImportMode] = useState<'import' | 'scan'>('import');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importTitle, setImportTitle] = useState('');
    const [importSubject, setImportSubject] = useState('');
    const [importStatus, setImportStatus] = useState<
        'idle' | 'uploading' | 'processing' | 'success' | 'error'
    >('idle');
    const [importError, setImportError] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewText, setPreviewText] = useState('');
    const [previewHtml, setPreviewHtml] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [previewSubject, setPreviewSubject] = useState('');
    const [previewSaving, setPreviewSaving] = useState(false);

    const [newNote, setNewNote] = useState({
        title: '',
        content: '',
        subject: '',
        groupId: 'none',
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
        const fetchGroups = async () => {
            try {
                const data = await api.getGroups();
                const normalized = Array.isArray(data)
                    ? data
                          .map(normalizeGroup)
                          .filter((group) => Boolean(getGroupId(group)))
                    : [];
                setGroups(normalized);
            } catch (err: any) {
                console.error('Failed to fetch groups:', err);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        /*
         * How: Fetches notes associated with the user and optional group filter.
         * Why: Supports grouping filters without extra client-side work.
         */
        const fetchNotes = async () => {
            const isInitial = !hasLoadedOnceRef.current;
            if (isInitial) {
                setIsLoading(true);
            } else {
                setIsNotesRefreshing(true);
            }

            try {
                const groupParam = groupFilter === 'all' ? undefined : groupFilter;
                const data = await api.getNotes(groupParam);
                const normalized = Array.isArray(data)
                    ? data
                          .map(normalizeNote)
                          .filter((note) => Boolean(getNoteId(note)))
                    : [];
                setNotes(normalized);
            } catch (err: any) {
                console.error('Failed to fetch notes:', err);
            } finally {
                hasLoadedOnceRef.current = true;
                if (isInitial) {
                    setIsLoading(false);
                } else {
                    setIsNotesRefreshing(false);
                }
            }
        };

        fetchNotes();
    }, [groupFilter]);

    const groupMap = useMemo(() => {
        return new Map(groups.map((group) => [group.id, group.name]));
    }, [groups]);

    const matchesGroupFilter = (note: Note): boolean => {
        if (groupFilter === 'all') return true;
        if (groupFilter === 'none') return !note.groupId;
        return note.groupId === groupFilter;
    };

    const activeGroupLabel = useMemo(() => {
        if (groupFilter === 'none') return 'No Group';
        if (groupFilter === 'all') return 'All Notes';
        return groupMap.get(groupFilter) || 'Group';
    }, [groupFilter, groupMap]);

    const resetImportState = () => {
        setImportFile(null);
        setImportTitle('');
        setImportSubject('');
        setImportStatus('idle');
        setImportError(null);
        setPreviewText('');
        setPreviewHtml('');
        setPreviewTitle('');
        setPreviewSubject('');
    };

    const openImportModal = (mode: 'import' | 'scan') => {
        setImportMode(mode);
        resetImportState();
        setImportOpen(true);
    };

    const handleImportFile = (file: File | null) => {
        if (!file) return;
        if (importMode === 'scan' && !isImageFile(file)) {
            appToast.error({
                title: 'Invalid file',
                description: 'Scan Note accepts only JPG or PNG images.',
            });
            return;
        }
        if (importMode === 'import' && !isAllowedImportFile(file)) {
            appToast.error({
                title: 'Invalid file',
                description:
                    'Upload a TXT, PDF, DOCX, JPG, JPEG, or PNG file.',
            });
            return;
        }

        setImportFile(file);
        setImportError(null);
        setImportStatus('idle');
        if (!importTitle.trim()) {
            setImportTitle(stripExtension(file.name));
        }
    };

    const handlePreviewImport = async () => {
        if (!importFile) {
            appToast.error({
                title: 'No file selected',
                description: 'Choose a file to preview.',
            });
            return;
        }

        setImportStatus('uploading');
        setImportError(null);
        const processingTimer = setTimeout(
            () => setImportStatus('processing'),
            700,
        );

        try {
            const response = await api.importNote(
                importFile,
                { title: importTitle, subject: importSubject },
                { preview: true },
            );
            const text = response?.text || '';
            const html = response?.html || '';
            const title = response?.title || importTitle || importFile.name;
            const subject =
                response?.subject || importSubject || '';

            setPreviewText(text);
            setPreviewHtml(html);
            setPreviewTitle(title);
            setPreviewSubject(subject);
            setPreviewOpen(true);
            setImportStatus('success');
        } catch (err: any) {
            console.error('Import preview failed:', err);
            setImportStatus('error');
            setImportError('Preview failed. Please try again.');
            appToast.apiError(err, 'Preview failed');
        } finally {
            clearTimeout(processingTimer);
        }
    };

    const handleImportSave = async () => {
        if (!importFile) {
            appToast.error({
                title: 'No file selected',
                description: 'Choose a file to import.',
            });
            return;
        }

        setImportStatus('uploading');
        setImportError(null);
        const processingTimer = setTimeout(
            () => setImportStatus('processing'),
            700,
        );

        try {
            const created = await api.importNote(importFile, {
                title: importTitle,
                subject: importSubject,
            });
            const normalizedCreated = normalizeNote(created);
            if (!getNoteId(normalizedCreated)) {
                throw new Error('Note was created without a valid id.');
            }
            if (matchesGroupFilter(normalizedCreated)) {
                setNotes((prev) => [normalizedCreated, ...prev]);
            }
            setImportOpen(false);
            resetImportState();
            appToast.success({
                title: 'Note imported',
                description: 'Your note is ready for review.',
            });
        } catch (err: any) {
            console.error('Import failed:', err);
            setImportStatus('error');
            setImportError('Import failed. Please try again.');
            appToast.apiError(err, 'Could not import note');
        } finally {
            clearTimeout(processingTimer);
        }
    };

    const handleSaveFromPreview = async () => {
        if (!previewText.trim()) {
            appToast.error({
                title: 'Nothing to save',
                description: 'The preview text is empty.',
            });
            return;
        }

        const title = previewTitle.trim() || 'Imported Note';
        const subject = previewSubject.trim();
        const contentHtml =
            previewHtml || plainTextToHtml(previewText);

        try {
            setPreviewSaving(true);
            const created = await api.createNote({
                title,
                content: contentHtml,
                subject,
                category: subject,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const normalizedCreated = normalizeNote(created);
            if (!getNoteId(normalizedCreated)) {
                throw new Error('Note was created without a valid id.');
            }
            if (matchesGroupFilter(normalizedCreated)) {
                setNotes((prev) => [normalizedCreated, ...prev]);
            }
            setPreviewOpen(false);
            setImportOpen(false);
            resetImportState();
            appToast.success({
                title: 'Note saved',
                description: 'Your imported note is ready!',
            });
        } catch (err: any) {
            console.error('Saving preview failed:', err);
            appToast.apiError(err, 'Could not save note');
        } finally {
            setPreviewSaving(false);
        }
    };

    const handleCreateGroup = async () => {
        const trimmed = groupNameDraft.trim();
        if (!trimmed) {
            appToast.error({
                title: 'Missing name',
                description: 'Enter a group name to continue.',
            });
            return;
        }

        try {
            setGroupBusyId('create');
            const created = await api.createGroup(trimmed);
            const normalized = normalizeGroup(created);
            if (!getGroupId(normalized)) {
                throw new Error('Group was created without a valid id.');
            }
            setGroups((prev) => [normalized, ...prev]);
            setGroupNameDraft('');
            appToast.success({
                title: 'Group created',
                description: 'Your group is ready.',
            });
        } catch (err: any) {
            console.error('Failed to create group:', err);
            appToast.apiError(err, 'Could not create group');
        } finally {
            setGroupBusyId(null);
        }
    };

    const startEditGroup = (group: NoteGroup) => {
        setGroupEditingId(group.id);
        setGroupEditingName(group.name);
    };

    const cancelEditGroup = () => {
        setGroupEditingId(null);
        setGroupEditingName('');
    };

    const handleUpdateGroup = async (groupId: string) => {
        const trimmed = groupEditingName.trim();
        if (!trimmed) {
            appToast.error({
                title: 'Missing name',
                description: 'Group name cannot be empty.',
            });
            return;
        }

        try {
            setGroupBusyId(groupId);
            const updated = await api.updateGroup(groupId, trimmed);
            const normalized = normalizeGroup(updated);
            setGroups((prev) =>
                prev.map((group) =>
                    group.id === groupId ? normalized : group,
                ),
            );
            cancelEditGroup();
            appToast.success({
                title: 'Group updated',
                description: 'Group name updated successfully.',
            });
        } catch (err: any) {
            console.error('Failed to update group:', err);
            appToast.apiError(err, 'Could not update group');
        } finally {
            setGroupBusyId(null);
        }
    };

    const handleDeleteGroup = async (groupId: string) => {
        try {
            setGroupBusyId(groupId);
            await api.deleteGroup(groupId);
            setGroups((prev) => prev.filter((group) => group.id !== groupId));
            setNotes((prev) =>
                prev.map((note) =>
                    note.groupId === groupId
                        ? { ...note, groupId: null }
                        : note,
                ),
            );
            if (groupFilter === groupId) {
                setGroupFilter('all');
            }
            appToast.success({
                title: 'Group deleted',
                description: 'Group removed successfully.',
            });
        } catch (err: any) {
            console.error('Failed to delete group:', err);
            appToast.apiError(err, 'Could not delete group');
        } finally {
            setGroupBusyId(null);
        }
    };

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
            const normalizedGroupId =
                newNote.groupId && newNote.groupId !== 'none'
                    ? newNote.groupId
                    : null;
            const created = await api.createNote({
                ...newNote,
                groupId: normalizedGroupId,
                category: newNote.subject,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            const normalizedCreated = normalizeNote(created);
            if (!getNoteId(normalizedCreated)) {
                throw new Error('Note was created without a valid id.');
            }
            if (matchesGroupFilter(normalizedCreated)) {
                setNotes((prev) => [normalizedCreated, ...prev]);
            }
            setNewNote({
                title: '',
                content: '',
                subject: '',
                groupId: 'none',
            });
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
        groupId?: string | null,
    ) => {
        if (!id) {
            appToast.error({
                title: 'Invalid note',
                description:
                    'This note has an invalid identifier. Refresh and try again.',
            });
            return;
        }

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
            const updated = await api.updateNote(id, {
                title,
                content,
                groupId: groupId || null,
            });
            const normalizedUpdated = normalizeNote({ ...updated, id });
            setNotes((prev) => {
                if (!matchesGroupFilter(normalizedUpdated)) {
                    return prev.filter((note) => getNoteId(note) !== id);
                }
                return prev.map((note) =>
                    getNoteId(note) === id
                        ? { ...note, ...normalizedUpdated }
                        : note,
                );
            });
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
        if (!id) {
            appToast.error({
                title: 'Invalid note',
                description:
                    'This note has an invalid identifier. Refresh and try again.',
            });
            return;
        }

        try {
            await api.deleteNote(id);
            setNotes((prev) =>
                prev.filter((n) => getNoteId(n) !== id),
            );
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

    const isImportBusy =
        importStatus === 'uploading' || importStatus === 'processing';

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
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => openImportModal('import')}
                            className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl w-full sm:w-auto"
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            Import Note
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openImportModal('scan')}
                            className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl w-full sm:w-auto"
                        >
                            <Image className="h-4 w-4 mr-2" />
                            Scan Note (Image)
                        </Button>
                        <Button
                            onClick={() => setIsAddingNote(true)}
                            className="h-11 sm:h-12 px-4 sm:px-6 rounded-2xl shadow-glow w-full sm:w-auto"
                        >
                            <Plus className="h-5 w-5 mr-2" /> Create New Note
                        </Button>
                    </div>
                )}
            </header>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant={groupFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setGroupFilter('all')}
                        className="rounded-2xl"
                    >
                        All Notes
                    </Button>
                    <Button
                        size="sm"
                        variant={groupFilter === 'none' ? 'default' : 'outline'}
                        onClick={() => setGroupFilter('none')}
                        className="rounded-2xl"
                    >
                        No Group
                    </Button>
                    {groups.map((group) => (
                        <Button
                            key={group.id}
                            size="sm"
                            variant={
                                groupFilter === group.id
                                    ? 'default'
                                    : 'outline'
                            }
                            onClick={() => setGroupFilter(group.id)}
                            className="rounded-2xl"
                        >
                            {group.name}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    {isNotesRefreshing && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Refreshing...
                        </div>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setGroupModalOpen(true)}
                        className="rounded-2xl"
                    >
                        <Folder className="h-4 w-4 mr-2" />
                        Create Group
                    </Button>
                </div>
            </div>

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
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-widest font-bold opacity-60">
                                    Group
                                </Label>
                                <Select
                                    value={newNote.groupId}
                                    onValueChange={(value) =>
                                        setNewNote({
                                            ...newNote,
                                            groupId: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="rounded-2xl h-12 bg-card/5 border-foreground/10">
                                        <SelectValue placeholder="No Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            No Group
                                        </SelectItem>
                                        {groups.map((group) => (
                                            <SelectItem
                                                key={group.id}
                                                value={group.id}
                                            >
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setGroupModalOpen(true)}
                                    className="px-2 h-8 text-xs"
                                >
                                    <Folder className="h-3 w-3 mr-2" />
                                    Create group
                                </Button>
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
                        (() => {
                            const noteId = getNoteId(note);
                            const groupName = note.groupId
                                ? groupMap.get(note.groupId)
                                : null;
                            return (
                        <Card
                            key={noteId}
                            className="note-card glass shadow-lg hover-lift border-foreground/5 flex flex-col group h-[400px]"
                        >
                            <CardContent className="p-6 flex flex-col h-full relative">
                                {editingId === noteId ? (
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <Input
                                            value={note.title}
                                            className="rounded-2xl bg-card/5 border-foreground/10"
                                            onChange={(e) =>
                                                setNotes((prev) =>
                                                    prev.map((n) =>
                                                        getNoteId(n) === noteId
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
                                        <Select
                                            value={note.groupId || 'none'}
                                            onValueChange={(value) =>
                                                setNotes((prev) =>
                                                    prev.map((n) =>
                                                        getNoteId(n) === noteId
                                                            ? {
                                                                  ...n,
                                                                  groupId:
                                                                      value ===
                                                                      'none'
                                                                          ? null
                                                                          : value,
                                                              }
                                                            : n,
                                                    ),
                                                )
                                            }
                                        >
                                            <SelectTrigger className="rounded-2xl bg-card/5 border-foreground/10 h-10">
                                                <SelectValue placeholder="No Group" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    No Group
                                                </SelectItem>
                                                {groups.map((group) => (
                                                    <SelectItem
                                                        key={group.id}
                                                        value={group.id}
                                                    >
                                                        {group.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex-1 overflow-y-auto">
                                            <RichTextEditor
                                                content={note.content}
                                                onChange={(val) =>
                                                    setNotes((prev) =>
                                                        prev.map((n) =>
                                                            getNoteId(n) === noteId
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
                                                        (n) =>
                                                            getNoteId(n) ===
                                                            noteId,
                                                    );
                                                    if (updated)
                                                        handleUpdateNote(
                                                            noteId,
                                                            updated.title,
                                                            updated.content,
                                                            updated.groupId,
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
                                                    onClick={() =>
                                                        setReadingNote(note)
                                                    }
                                                >
                                                    <Eye size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                        setEditingId(noteId)
                                                    }
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                        setDeleteConfirm(
                                                            noteId,
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

                                        {deleteConfirm === noteId && (
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
                                                                noteId,
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
                            );
                        })()
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
                        onClick={() => setIsAddingNote(true)}
                        size="lg"
                        className="rounded-2xl h-12 sm:h-14 px-6 sm:px-10 shadow-glow font-bold text-base sm:text-lg w-full sm:w-auto"
                    >
                        <Plus size={20} className="mr-2" /> Create First Note
                    </Button>
                </div>
            )}

            <Dialog
                open={groupModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        cancelEditGroup();
                    }
                    setGroupModalOpen(open);
                }}
            >
                <DialogContent className="glass border-foreground/10 rounded-2xl sm:rounded-3xl sm:max-w-xl w-[95vw] p-0 overflow-hidden">
                    <DialogHeader className="p-5 sm:p-6 border-b border-foreground/10 bg-card/5">
                        <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                            Manage Groups
                        </DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            Create, rename, or delete note groups.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-5 sm:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                value={groupNameDraft}
                                onChange={(e) =>
                                    setGroupNameDraft(e.target.value)
                                }
                                placeholder="New group name..."
                                className="rounded-2xl h-11 bg-card/5 border-foreground/10 flex-1"
                            />
                            <Button
                                onClick={handleCreateGroup}
                                disabled={groupBusyId === 'create'}
                                className="rounded-2xl h-11 px-5 shadow-glow"
                            >
                                {groupBusyId === 'create' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {groups.length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    No groups yet. Create one to organize your
                                    notes.
                                </div>
                            ) : (
                                groups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/10 px-4 py-3 bg-card/5"
                                    >
                                        {groupEditingId === group.id ? (
                                            <Input
                                                value={groupEditingName}
                                                onChange={(e) =>
                                                    setGroupEditingName(
                                                        e.target.value,
                                                    )
                                                }
                                                className="rounded-xl h-9 bg-background/60 border-foreground/10 flex-1"
                                            />
                                        ) : (
                                            <span className="font-semibold text-sm">
                                                {group.name}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {groupEditingId === group.id ? (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        onClick={() =>
                                                            handleUpdateGroup(
                                                                group.id,
                                                            )
                                                        }
                                                        className="h-9 w-9 rounded-xl"
                                                        disabled={
                                                            groupBusyId ===
                                                            group.id
                                                        }
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={cancelEditGroup}
                                                        className="h-9 w-9 rounded-xl"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            startEditGroup(
                                                                group,
                                                            )
                                                        }
                                                        className="h-9 w-9 rounded-xl"
                                                    >
                                                        <PencilLine size={16} />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleDeleteGroup(
                                                                group.id,
                                                            )
                                                        }
                                                        className="h-9 w-9 rounded-xl text-destructive/70 hover:text-destructive"
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={importOpen}
                onOpenChange={(open) => {
                    if (!open) resetImportState();
                    setImportOpen(open);
                }}
            >
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
                                    handleImportFile(
                                        e.dataTransfer.files?.[0] || null,
                                    );
                                }}
                                onClick={() => importInputRef.current?.click()}
                            >
                                <input
                                    ref={importInputRef}
                                    type="file"
                                    accept={
                                        importMode === 'scan'
                                            ? ACCEPTED_SCAN_TYPES
                                            : ACCEPTED_IMPORT_TYPES
                                    }
                                    onChange={(e) =>
                                        handleImportFile(
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
                                    onChange={(e) =>
                                        setImportTitle(e.target.value)
                                    }
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
                                        setImportSubject(e.target.value)
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
                                onClick={() => setImportOpen(false)}
                                className="rounded-2xl h-11 px-4 w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="outline"
                                disabled={!importFile || isImportBusy}
                                onClick={handlePreviewImport}
                                className="rounded-2xl h-11 px-4 w-full sm:w-auto"
                            >
                                Preview
                            </Button>
                            <Button
                                onClick={handleImportSave}
                                disabled={!importFile || isImportBusy}
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

            <Dialog
                open={previewOpen}
                onOpenChange={(open) => {
                    if (!open) setPreviewOpen(false);
                }}
            >
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
                                    onChange={(e) =>
                                        setPreviewTitle(e.target.value)
                                    }
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
                                        setPreviewSubject(e.target.value)
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
                            onClick={() => setPreviewOpen(false)}
                            className="rounded-2xl h-11 px-4 w-full sm:w-auto"
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handleSaveFromPreview}
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
                                {(() => {
                                    const groupName = readingNote.groupId
                                        ? groupMap.get(readingNote.groupId)
                                        : null;
                                    return (
                                        <DialogDescription className="text-xs sm:text-sm flex items-center gap-2">
                                            <span className="text-primary font-semibold">
                                                {readingNote.subject ||
                                                    'General'}
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
                                                {new Date(
                                                    readingNote.updatedAt,
                                                ).toLocaleDateString()}
                                            </span>
                                        </DialogDescription>
                                    );
                                })()}
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
