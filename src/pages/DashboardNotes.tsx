"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Trash2, Edit2, Save, AlertCircle } from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { formValidation } from "@/lib/formValidation"
import { apiWithFallback } from "@/lib/apiClient"
import { PageLoader } from "@/components/PageLoader"

interface Note {
    id: string
    title: string
    content: string
    subject?: string
    createdAt: Date
    updatedAt: Date
}

export default function DashboardNotes() {
    const appToast = useAppToast()
    const [notes, setNotes] = useState<Note[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const [newNote, setNewNote] = useState({ title: "", content: "", subject: "" })
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({})

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const loaded = await apiWithFallback.getNotes()
                setNotes(loaded)
            } catch (err) {
                console.error("Error loading notes:", err)
                appToast.error({
                    title: "Failed to load notes",
                    description: "Couldn’t retrieve your notes. Please refresh and try again.",
                })
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotes()
    }, [appToast])

    const validateNote = () => {
        const titleCheck = formValidation.noteTitle(newNote.title)
        const contentCheck = formValidation.noteContent(newNote.content)
        const titleError = !titleCheck.isValid ? titleCheck.error : undefined
        const contentError = !contentCheck.isValid ? contentCheck.error : undefined
        setErrors({ title: titleError, content: contentError })
        return titleCheck.isValid && contentCheck.isValid
    }

    const handleCreateNote = async () => {
        if (!validateNote()) {
            appToast.error({
                title: "Invalid input",
                description: errors.title || errors.content || "Please check your input.",
            })
            return
        }

        try {
            const created = await apiWithFallback.createNote({
                ...newNote,
                subject: newNote.subject || "General",
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            setNotes([created, ...notes])
            setNewNote({ title: "", content: "", subject: "" })
            setErrors({})
            setIsCreating(false)
            appToast.noteSaved()
        } catch (err) {
            console.error("Error creating note:", err)
            appToast.error({
                title: "Failed to save note",
                description: "Couldn’t save your note. Please check your connection.",
            })
        }
    }

    const handleUpdateNote = async (id: string, title: string, content: string) => {
        const titleCheck = formValidation.noteTitle(title)
        const contentCheck = formValidation.noteContent(content)
        if (!titleCheck.isValid || !contentCheck.isValid) {
            appToast.error({
                title: "Invalid update",
                description: titleCheck.error || contentCheck.error,
            })
            return
        }

        try {
            const updated = await apiWithFallback.updateNote(id, { title, content })
            setNotes(notes.map((note) => (note.id === id ? updated : note)))
            setEditingId(null)
            appToast.success({ title: "Note updated", description: "Your changes have been saved." })
        } catch (err) {
            console.error("Error updating note:", err)
            appToast.error({
                title: "Update failed",
                description: "Couldn’t save your changes. Try again later.",
            })
        }
    }

    const handleDeleteNote = async (id: string) => {
        try {
            await apiWithFallback.deleteNote(id)
            setNotes(notes.filter((n) => n.id !== id))
            setDeleteConfirm(null)
            appToast.success({ title: "Note deleted", description: "Your note was removed." })
        } catch (err) {
            console.error("Error deleting note:", err)
            appToast.error({
                title: "Delete failed",
                description: "Couldn’t delete this note. Try again.",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold mb-2">My Notes</h1>
                <p className="text-muted-foreground">Manage and organize all your study notes in one place.</p>
                <PageLoader variant="skeleton-cards" itemCount={3} text="Loading your notes..." />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold mb-2">My Notes</h1>
                <p className="text-muted-foreground">Manage and organize all your study notes in one place.</p>
            </header>

            {isCreating && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Create New Note</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                placeholder="Enter note title..."
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject (optional)</Label>
                            <Input
                                id="subject"
                                value={newNote.subject}
                                onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                                placeholder="e.g., Biology, Math..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                placeholder="Enter note content..."
                                rows={6}
                                className={errors.content ? "border-destructive" : ""}
                            />
                            {errors.content && (
                                <p className="text-sm text-destructive flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.content}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsCreating(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateNote}
                                disabled={!newNote.title || !newNote.content || !!errors.title || !!errors.content}
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
                <div className="space-y-4">
                    {!isCreating && (
                        <Button onClick={() => setIsCreating(true)} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Create New Note
                        </Button>
                    )}

                    {notes.map((note) => (
                        <Card key={note.id} className="hover:shadow-md transition">
                            <CardContent className="p-6">
                                {editingId === note.id ? (
                                    <div className="space-y-4">
                                        <Input
                                            value={note.title}
                                            onChange={(e) =>
                                                setNotes((prev) =>
                                                    prev.map((n) => (n.id === note.id ? { ...n, title: e.target.value } : n))
                                                )
                                            }
                                        />
                                        <Textarea
                                            rows={4}
                                            value={note.content}
                                            onChange={(e) =>
                                                setNotes((prev) =>
                                                    prev.map((n) => (n.id === note.id ? { ...n, content: e.target.value } : n))
                                                )
                                            }
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" onClick={() => setEditingId(null)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const updated = notes.find((n) => n.id === note.id)
                                                    if (updated) handleUpdateNote(note.id, updated.title, updated.content)
                                                }}
                                            >
                                                <Save className="h-4 w-4 mr-2" /> Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold">{note.title}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => setEditingId(note.id)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(note.id)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{note.content}</p>

                                        {deleteConfirm === note.id && (
                                            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                                <p className="text-sm font-medium mb-3">
                                                    Are you sure you want to delete this note?
                                                </p>
                                                <p className="text-xs text-muted-foreground mb-3">
                                                    This action cannot be undone.
                                                </p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDeleteNote(note.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span>Your Notes</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <FileText className="h-16 w-16 text-muted-foreground/50" />
                            <div className="text-center">
                                <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Start by creating a new note to get started.
                                </p>
                                <Button onClick={() => setIsCreating(true)} className="space-x-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Create New Note</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
