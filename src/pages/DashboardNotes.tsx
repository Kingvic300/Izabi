"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Plus, Trash2, Edit2, Save, AlertCircle, Sparkles, Clock } from "lucide-react"
import { useAppToast } from "@/hooks/useAppToast"
import { formValidation } from "@/lib/formValidation"
import { api } from "@/lib/apiClient"
import { PageLoader } from "@/components/PageLoader"
import RichTextEditor from "@/components/RichTextEditor"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface Note {
    id: string
    title: string
    content: string
    subject?: string
    createdAt: Date
    updatedAt: Date
}

export default function DashboardNotes() {
    const containerRef = useRef<HTMLDivElement>(null)
    const appToast = useAppToast()
    const [notes, setNotes] = useState<Note[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddingNote, setIsAddingNote] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const [newNote, setNewNote] = useState({ title: "", content: "", subject: "" })
    const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})

    useGSAP(() => {
        if (!isLoading) {
            gsap.from(".notes-header", { opacity: 0, y: -20, duration: 0.6, ease: "power2.out" })
            if (notes.length > 0) {
                gsap.from(".note-card", {
                    opacity: 0,
                    y: 20,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "power2.out"
                })
            }
        }
    }, { scope: containerRef, dependencies: [isLoading, notes.length] })

    useEffect(() => {
        /*
         * How: Fetches all notes associated with the user from the backend upon component mount.
         * Why: Populates the dashboard with the user's saved study materials.
         */
        const fetchNotes = async () => {
            try {
                const data = await api.getNotes()
                setNotes(data)
            } catch (err: any) {
                console.error("Failed to fetch notes:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNotes()
    }, [])

    const validateNote = () => {
        const titleCheck = formValidation.noteTitle(newNote.title)
        const contentCheck = formValidation.noteContent(newNote.content)
        const titleError = !titleCheck.isValid ? titleCheck.error : undefined
        const contentError = !contentCheck.isValid ? contentCheck.error : undefined
        setErrors({ title: titleError, content: contentError })
        return titleCheck.isValid && contentCheck.isValid
    }

    /*
     * How: Validates input, sends a creation request to the API, and updates local state on success.
     * Why: Allows users to save new notes to their collection.
     */
    const handleCreateNote = async () => {
        if (!validateNote()) {
            appToast.error({
                title: "Invalid input",
                description: "Please check the highlighted fields.",
            })
            return
        }

        try {
            const created = await api.createNote({
                ...newNote,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
            setNotes([created, ...notes])
            setNewNote({ title: "", content: "", subject: "" })
            setErrors({})
            setIsAddingNote(false)
            appToast.success({ title: "Note saved", description: "Your new study note is ready!" })
        } catch (err) {
            console.error("Error creating note:", err)
        }
    }

    /*
     * How: Validates changes and sends a PUT request to update an existing note's title and content.
     * Why: Enables users to refine and edit their notes over time.
     */
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
            const updated = await api.updateNote(id, { title, content })
            setNotes(notes.map((note) => (note.id === id ? updated : note)))
            setEditingId(null)
            appToast.success({ title: "Note updated", description: "Your changes have been saved." })
        } catch (err) {
            console.error("Error updating note:", err)
        }
    }

    /*
     * How: Sends a DELETE request to remove a note by ID and updates the local list.
     * Why: Allows users to manage their storage and remove unwanted content.
     */
    const handleDeleteNote = async (id: string) => {
        try {
            await api.deleteNote(id)
            setNotes(notes.filter((n) => n.id !== id))
            setDeleteConfirm(null)
            appToast.success({ title: "Note deleted", description: "Your note was removed." })
        } catch (err) {
            console.error("Error deleting note:", err)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-gradient">My Notes</h1>
                <p className="text-muted-foreground">Manage and organize all your study notes in one place.</p>
                <PageLoader variant="skeleton-cards" itemCount={3} text="Loading your notes..." />
            </div>
        )
    }

    return (
        <div ref={containerRef} className="space-y-6 md:space-y-12 w-full pb-20 px-0 md:px-8 lg:px-12 pt-6 md:pt-12">
            <header className="notes-header flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tighter mb-2 text-gradient">My Notes</h1>
                    <p className="text-muted-foreground text-lg">Manage and organize all your study notes in one place.</p>
                </div>
                {!isAddingNote && (
                    <Button onClick={() => setIsAddingNote(true)} className="h-12 px-6 rounded-2xl shadow-glow">
                        <Plus className="h-5 w-5 mr-2" /> Create New Note
                    </Button>
                )}
            </header>

            {isAddingNote && (
                <Card className="glass shadow-2xl border-foreground/10 overflow-hidden stagger-card">
                    <CardHeader className="bg-foreground/5 border-b border-foreground/5">
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span>Create New Note</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs uppercase tracking-widest font-bold opacity-60">Title</Label>
                                <Input
                                    id="title"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                    placeholder="Enter note title..."
                                    className={`rounded-xl h-12 bg-foreground/5 border-foreground/10 ${errors.title ? "border-destructive" : ""}`}
                                />
                                {errors.title && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" /> {errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-xs uppercase tracking-widest font-bold opacity-60">Subject</Label>
                                <Input
                                    id="subject"
                                    value={newNote.subject}
                                    onChange={(e) => setNewNote({ ...newNote, subject: e.target.value })}
                                    placeholder="e.g., Biology, Math..."
                                    className="rounded-xl h-12 bg-foreground/5 border-foreground/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-widest font-bold opacity-60">Content</Label>
                            <RichTextEditor 
                                content={newNote.content} 
                                onChange={(val) => setNewNote({ ...newNote, content: val })} 
                                placeholder="Start writing your thoughts..."
                            />
                            {errors.content && (
                                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.content}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setIsAddingNote(false)} className="rounded-xl h-12 px-6">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateNote}
                                disabled={!newNote.title.trim() || !newNote.content.trim()}
                                className="rounded-xl h-12 px-8 shadow-glow"
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
                        <Card key={note.id} className="note-card glass shadow-lg hover-lift border-foreground/5 flex flex-col group h-[400px]">
                            <CardContent className="p-6 flex flex-col h-full">
                                {editingId === note.id ? (
                                    <div className="space-y-4 flex-1 flex flex-col">
                                        <Input
                                            value={note.title}
                                            className="rounded-xl bg-foreground/5 border-foreground/10"
                                            onChange={(e) =>
                                                setNotes((prev) =>
                                                    prev.map((n) => (n.id === note.id ? { ...n, title: e.target.value } : n))
                                                )
                                            }
                                        />
                                        <div className="flex-1 overflow-y-auto">
                                            <RichTextEditor 
                                                content={note.content} 
                                                onChange={(val) => 
                                                    setNotes((prev) => 
                                                        prev.map((n) => (n.id === note.id ? { ...n, content: val } : n))
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <Button variant="ghost" size="sm" onClick={() => setEditingId(null)} className="rounded-lg">
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="rounded-lg px-4"
                                                onClick={() => {
                                                    const updated = notes.find((n) => n.id === note.id)
                                                    if (updated) handleUpdateNote(note.id, updated.title, updated.content)
                                                }}
                                            >
                                                <Save size={14} className="mr-2" /> Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {note.subject || "General"}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">{note.title}</h3>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setEditingId(note.id)}>
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteConfirm(note.id)}>
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="text-sm leading-relaxed text-muted-foreground prose prose-sm dark:prose-invert max-w-none overflow-hidden mask-fade flex-1"
                                            dangerouslySetInnerHTML={{ __html: note.content }}
                                        />
                                        
                                        <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                                            <Clock size={10} />
                                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                        </div>

                                        {deleteConfirm === note.id && (
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-destructive text-white backdrop-blur-md rounded-b-3xl flex flex-col gap-2">
                                                <p className="text-xs font-bold uppercase tracking-wider text-center">Permanently remove this note?</p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1 bg-foreground/10 border-foreground/20 text-white hover:bg-foreground/20">
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-white text-destructive hover:bg-white/90 font-bold"
                                                        onClick={() => handleDeleteNote(note.id)}
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
                <div className="flex flex-col items-center justify-center py-24 glass rounded-[40px] border-dashed space-y-6">
                    <div className="w-24 h-24 rounded-full bg-foreground/5 flex items-center justify-center border border-foreground/10">
                        <FileText size={48} className="text-muted-foreground/30" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-bold">Your Slate is Clean</h3>
                        <p className="text-muted-foreground">Start documenting your brilliance. Create your first note.</p>
                    </div>
                    <Button onClick={() => setIsAddingNote(true)} size="lg" className="rounded-2xl h-14 px-10 shadow-glow font-bold text-lg">
                        <Plus size={20} className="mr-2" /> Get Started
                    </Button>
                </div>
            )}

            <style>{`
                .mask-fade {
                    mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
                }
            `}</style>
        </div>
    )
}
