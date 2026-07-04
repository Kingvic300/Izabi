'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, FolderOpen, Filter } from 'lucide-react';
import { useAppToast } from '@/hooks/useAppToast';
import { useLanguage } from '@/contexts/LanguageContext';
import { formValidation } from '@/lib/formValidation';
import { api } from '@/lib/apiClient';
import { PageLoader } from '@/components/PageLoader';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import NotesHeader from '@/components/dashboard-notes/NotesHeader';
import GroupFilterBar from '@/components/dashboard-notes/GroupFilterBar';
import NewNoteForm from '@/components/dashboard-notes/NewNoteForm';
import NotesGrid from '@/components/dashboard-notes/NotesGrid';
import GroupManagerDialog from '@/components/dashboard-notes/GroupManagerDialog';
import ImportNoteDialog from '@/components/dashboard-notes/ImportNoteDialog';
import PreviewImportDialog from '@/components/dashboard-notes/PreviewImportDialog';
import NoteReaderDialog from '@/components/dashboard-notes/NoteReaderDialog';
import type { Note, NoteGroup } from '@/components/dashboard-notes/noteTypes';
import {
    ACCEPTED_IMPORT_TYPES,
    ACCEPTED_SCAN_TYPES,
    getGroupId,
    getNoteId,
    isAllowedImportFile,
    isImageFile,
    normalizeGroup,
    normalizeNote,
    plainTextToHtml,
    stripExtension,
} from '@/components/dashboard-notes/noteUtils';

export default function DashboardNotes() {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasLoadedOnceRef = useRef(false);
    const appToast = useAppToast();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingSnapshot, setEditingSnapshot] = useState<Note | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [sendingToAIId, setSendingToAIId] = useState<string | null>(null);
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
    const totalNotes = notes.length;
    const totalGroups = groups.length;
    const recentNotes = useMemo(() => {
        return [...notes]
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 3);
    }, [notes]);

    const handleSendToAI = async (note: Note) => {
        if (sendingToAIId) return;
        setSendingToAIId(note.id);
        try {
            const plainText = new DOMParser()
                .parseFromString(note.content, 'text/html')
                .body.textContent ?? '';
            const header = `Title: ${note.title}\n${note.subject ? `Subject: ${note.subject}\n` : ''}\n`;
            const file = new File(
                [header + plainText],
                `${note.title}.txt`,
                { type: 'text/plain' },
            );
            const res = await api.uploadFilesForChat([file]);
            if (res?.success && Array.isArray(res?.data) && res.data[0]) {
                const { documentId, fileName } = res.data[0];
                navigate('/dashboard/ai-assistant', {
                    state: { importedDoc: { documentId, fileName } },
                });
            } else {
                throw new Error('Upload returned no document');
            }
        } catch (err: any) {
            appToast.apiError(err, t('notes.toast_could_not_send_to_ai'));
        } finally {
            setSendingToAIId(null);
        }
    };

    const handleEditNote = (id: string | null) => {
        if (id === null) {
            if (editingSnapshot) {
                setNotes((prev) =>
                    prev.map((n) =>
                        n.id === editingSnapshot.id ? editingSnapshot : n,
                    ),
                );
            }
            setEditingSnapshot(null);
            setEditingId(null);
        } else {
            const note = notes.find((n) => n.id === id) ?? null;
            setEditingSnapshot(note);
            setEditingId(id);
        }
    };

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
                title: t('notes.toast_invalid_file_title'),
                description: t('notes.toast_invalid_scan_desc'),
            });
            return;
        }
        if (importMode === 'import' && !isAllowedImportFile(file)) {
            appToast.error({
                title: t('notes.toast_invalid_file_title'),
                description: t('notes.toast_invalid_import_desc'),
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
                title: t('notes.toast_no_file_title'),
                description: t('notes.toast_no_file_preview_desc'),
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
            appToast.apiError(err, t('notes.toast_preview_failed'));
        } finally {
            clearTimeout(processingTimer);
        }
    };

    const handleImportSave = async () => {
        if (!importFile) {
            appToast.error({
                title: t('notes.toast_no_file_title'),
                description: t('notes.toast_no_file_import_desc'),
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
                title: t('notes.toast_note_imported_title'),
                description: t('notes.toast_note_imported_desc'),
            });
        } catch (err: any) {
            console.error('Import failed:', err);
            setImportStatus('error');
            setImportError('Import failed. Please try again.');
            appToast.apiError(err, t('notes.toast_could_not_import_note'));
        } finally {
            clearTimeout(processingTimer);
        }
    };

    const handleSaveFromPreview = async () => {
        if (!previewText.trim()) {
            appToast.error({
                title: t('notes.toast_nothing_to_save_title'),
                description: t('notes.toast_nothing_to_save_desc'),
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
                title: t('notes.toast_note_saved_title'),
                description: t('notes.toast_imported_note_ready_desc'),
            });
        } catch (err: any) {
            console.error('Saving preview failed:', err);
            appToast.apiError(err, t('notes.toast_could_not_save_note'));
        } finally {
            setPreviewSaving(false);
        }
    };

    const handleCreateGroup = async () => {
        const trimmed = groupNameDraft.trim();
        if (!trimmed) {
            appToast.error({
                title: t('notes.toast_missing_name_title'),
                description: t('notes.toast_enter_group_name_desc'),
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
                title: t('notes.toast_group_created_title'),
                description: t('notes.toast_group_created_desc'),
            });
        } catch (err: any) {
            console.error('Failed to create group:', err);
            appToast.apiError(err, t('notes.toast_could_not_create_group'));
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
                title: t('notes.toast_missing_name_title'),
                description: t('notes.toast_group_name_empty_desc'),
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
                title: t('notes.toast_group_updated_title'),
                description: t('notes.toast_group_updated_desc'),
            });
        } catch (err: any) {
            console.error('Failed to update group:', err);
            appToast.apiError(err, t('notes.toast_could_not_update_group'));
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
                title: t('notes.toast_group_deleted_title'),
                description: t('notes.toast_group_deleted_desc'),
            });
        } catch (err: any) {
            console.error('Failed to delete group:', err);
            appToast.apiError(err, t('notes.toast_could_not_delete_group'));
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
                title: t('notes.toast_invalid_input_title'),
                description: t('notes.toast_invalid_input_desc'),
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
                title: t('notes.toast_note_saved_title'),
                description: t('notes.toast_new_note_ready_desc'),
            });
        } catch (err: any) {
            console.error('Error creating note:', err);
            appToast.apiError(err, t('notes.toast_could_not_save_note'));
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
                title: t('notes.toast_invalid_note_title'),
                description: t('notes.toast_invalid_note_desc'),
            });
            return;
        }

        const titleCheck = formValidation.noteTitle(title);
        const contentCheck = formValidation.noteContent(content);
        if (!titleCheck.isValid || !contentCheck.isValid) {
            appToast.error({
                title: t('notes.toast_invalid_update_title'),
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
            setEditingSnapshot(null);
            appToast.success({
                title: t('notes.toast_note_updated_title'),
                description: t('notes.toast_note_updated_desc'),
            });
        } catch (err: any) {
            console.error('Error updating note:', err);
            appToast.apiError(err, t('notes.toast_could_not_update_note'));
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
                title: t('notes.toast_invalid_note_title'),
                description: t('notes.toast_invalid_note_desc'),
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
                title: t('notes.toast_note_deleted_title'),
                description: t('notes.toast_note_deleted_desc'),
            });
        } catch (err: any) {
            console.error('Error deleting note:', err);
            appToast.apiError(err, t('notes.toast_could_not_delete_note'));
        }
    };

    const isImportBusy =
        importStatus === 'uploading' || importStatus === 'processing';

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    My Notes
                </h1>
                <p className="text-muted-foreground">
                    Organize, search, and create study notes with ease.
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
            className="space-y-8 md:space-y-12 w-full pb-20 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 pt-6 md:pt-12"
        >
            <div className="notes-header space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary">
                            Notes
                        </span>
                    </div>
                    <NotesHeader
                        isAddingNote={isAddingNote}
                        onImport={() => openImportModal('import')}
                        onScan={() => openImportModal('scan')}
                        onCreate={() => setIsAddingNote(true)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-card border-foreground/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <FileText size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Total Notes
                            </span>
                        </div>
                        <div className="mt-4 text-2xl font-black tracking-tight">
                            {totalNotes}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            Notes saved in your workspace
                        </p>
                    </div>

                    <div className="glass-card border-foreground/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <FolderOpen size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Folders
                            </span>
                        </div>
                        <div className="mt-4 text-2xl font-black tracking-tight">
                            {totalGroups}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                            Organize notes into groups
                        </p>
                    </div>

                    <div className="glass-card border-foreground/10 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Clock size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                Recent Updates
                            </span>
                        </div>
                        <div className="mt-4 space-y-2">
                            {recentNotes.length === 0 ? (
                                <p className="text-xs text-muted-foreground font-medium">
                                    No notes updated yet.
                                </p>
                            ) : (
                                recentNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="text-xs text-foreground/80 font-semibold truncate"
                                    >
                                        {note.title}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card border-foreground/10 rounded-[28px] p-4 sm:p-6 space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
                        <Filter size={12} className="text-primary" />
                        {activeGroupLabel}
                    </div>
                    <GroupFilterBar
                        groups={groups}
                        groupFilter={groupFilter}
                        isNotesRefreshing={isNotesRefreshing}
                        onFilterChange={setGroupFilter}
                        onOpenGroupModal={() => setGroupModalOpen(true)}
                    />
                </div>

                {isAddingNote && (
                    <NewNoteForm
                        draft={newNote}
                        groups={groups}
                        errors={errors}
                        onChange={(updates) =>
                            setNewNote((prev) => ({ ...prev, ...updates }))
                        }
                        onCancel={() => setIsAddingNote(false)}
                        onSave={handleCreateNote}
                        onOpenGroupModal={() => setGroupModalOpen(true)}
                    />
                )}

                <NotesGrid
                    notes={notes}
                    groups={groups}
                    groupMap={groupMap}
                    groupFilter={groupFilter}
                    activeGroupLabel={activeGroupLabel}
                    editingId={editingId}
                    savingId={savingId}
                    deleteConfirm={deleteConfirm}
                    sendingToAIId={sendingToAIId}
                    onEditNote={handleEditNote}
                    onReadNote={setReadingNote}
                    onDeleteConfirmChange={setDeleteConfirm}
                    onDeleteNote={handleDeleteNote}
                    onSaveNote={handleUpdateNote}
                    onSendToAI={handleSendToAI}
                    onUpdateDraft={(noteId, updates) =>
                        setNotes((prev) =>
                            prev.map((note) =>
                                note.id === noteId
                                    ? { ...note, ...updates }
                                    : note,
                            ),
                        )
                    }
                    onCreateNote={() => setIsAddingNote(true)}
                />
            </div>

            <GroupManagerDialog
                open={groupModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        cancelEditGroup();
                    }
                    setGroupModalOpen(open);
                }}
                groups={groups}
                groupNameDraft={groupNameDraft}
                groupEditingId={groupEditingId}
                groupEditingName={groupEditingName}
                groupBusyId={groupBusyId}
                onGroupNameDraftChange={setGroupNameDraft}
                onGroupEditingNameChange={setGroupEditingName}
                onCreateGroup={handleCreateGroup}
                onStartEditGroup={startEditGroup}
                onCancelEditGroup={cancelEditGroup}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
            />

            <ImportNoteDialog
                open={importOpen}
                onOpenChange={(open) => {
                    if (!open) resetImportState();
                    setImportOpen(open);
                }}
                importMode={importMode}
                importFile={importFile}
                importTitle={importTitle}
                importSubject={importSubject}
                importStatus={importStatus}
                importError={importError}
                isBusy={isImportBusy}
                acceptTypes={
                    importMode === 'scan'
                        ? ACCEPTED_SCAN_TYPES
                        : ACCEPTED_IMPORT_TYPES
                }
                onFileSelected={handleImportFile}
                onTitleChange={setImportTitle}
                onSubjectChange={setImportSubject}
                onPreview={handlePreviewImport}
                onSave={handleImportSave}
            />

            <PreviewImportDialog
                open={previewOpen}
                onOpenChange={(open) => {
                    if (!open) setPreviewOpen(false);
                }}
                previewTitle={previewTitle}
                previewSubject={previewSubject}
                previewText={previewText}
                previewSaving={previewSaving}
                onTitleChange={setPreviewTitle}
                onSubjectChange={setPreviewSubject}
                onSave={handleSaveFromPreview}
            />

            <NoteReaderDialog
                note={readingNote}
                groupMap={groupMap}
                open={Boolean(readingNote)}
                isSendingToAI={
                    readingNote ? sendingToAIId === readingNote.id : false
                }
                onSendToAI={() => {
                    if (readingNote) handleSendToAI(readingNote);
                }}
                onOpenChange={(open) => {
                    if (!open) setReadingNote(null);
                }}
            />
        </div>
    );
}
