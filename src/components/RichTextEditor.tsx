import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { MouseEvent } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Undo,
    Redo,
    Globe,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor = ({
    content,
    onChange,
    placeholder,
}: RichTextEditorProps) => {
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
    const [linkDraft, setLinkDraft] = useState('');
    const [linkSelection, setLinkSelection] = useState<{
        from: number;
        to: number;
    } | null>(null);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start typing...',
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class:
                    'ProseMirror prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        if (content !== current) {
            editor.commands.setContent(content || '', false);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const keepEditorFocus = (event: MouseEvent<HTMLButtonElement>) => {
        // Prevent toolbar buttons from stealing selection/caret from the editor.
        event.preventDefault();
    };

    const toggleInlineStyle = (style: 'bold' | 'italic' | 'underline') => {
        if (style === 'bold') {
            editor.chain().focus().toggleBold().run();
            return;
        }
        if (style === 'italic') {
            editor.chain().focus().toggleItalic().run();
            return;
        }
        editor.chain().focus().toggleUnderline().run();
    };

    /*
     * How: Prompts the user for a URL and attaches/removes it from the selected text.
     * Why: Enables inline hyperlink management for note-taking without complex UI modals.
     */
    const toggleLink = () => {
        const existingUrl = editor.getAttributes('link').href as
            | string
            | undefined;
        const { from, to } = editor.state.selection;
        setLinkSelection({ from, to });
        setLinkDraft(existingUrl || '');
        setIsLinkDialogOpen(true);
    };

    const applyLink = () => {
        const normalizedUrl = linkDraft.trim();
        const chain = editor.chain().focus();
        if (linkSelection) {
            chain.setTextSelection(linkSelection);
        }

        if (!normalizedUrl) {
            chain.unsetLink().run();
            setIsLinkDialogOpen(false);
            return;
        }

        chain.extendMarkRange('link').setLink({ href: normalizedUrl }).run();
        setIsLinkDialogOpen(false);
    };

    return (
        <div className="w-full border rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Toolbar */}
            <TooltipProvider delayDuration={120}>
                <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() => toggleInlineStyle('bold')}
                                className={
                                    editor.isActive('bold') ? 'bg-muted' : ''
                                }
                                type="button"
                                aria-label="Bold"
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() => toggleInlineStyle('italic')}
                                className={
                                    editor.isActive('italic') ? 'bg-muted' : ''
                                }
                                type="button"
                                aria-label="Italic"
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() => toggleInlineStyle('underline')}
                                className={
                                    editor.isActive('underline')
                                        ? 'bg-muted'
                                        : ''
                                }
                                type="button"
                                aria-label="Underline"
                            >
                                <UnderlineIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Underline</TooltipContent>
                    </Tooltip>
                    <div className="w-px h-6 bg-border mx-1 my-auto" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 1 })
                                        .run()
                                }
                                className={
                                    editor.isActive('heading', { level: 1 })
                                        ? 'bg-muted'
                                        : ''
                                }
                                type="button"
                                aria-label="Heading 1"
                            >
                                <Heading1 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Heading 1</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleHeading({ level: 2 })
                                        .run()
                                }
                                className={
                                    editor.isActive('heading', { level: 2 })
                                        ? 'bg-muted'
                                        : ''
                                }
                                type="button"
                                aria-label="Heading 2"
                            >
                                <Heading2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Heading 2</TooltipContent>
                    </Tooltip>
                    <div className="w-px h-6 bg-border mx-1 my-auto" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBulletList()
                                        .run()
                                }
                                className={
                                    editor.isActive('bulletList')
                                        ? 'bg-muted'
                                        : ''
                                }
                                type="button"
                                aria-label="Bullet List"
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleOrderedList()
                                        .run()
                                }
                                className={
                                    editor.isActive('orderedList')
                                        ? 'bg-muted'
                                        : ''
                                }
                                type="button"
                                aria-label="Numbered List"
                            >
                                <ListOrdered className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .toggleBlockquote()
                                        .run()
                                }
                                className={
                                    editor.isActive('blockquote')
                                        ? 'bg-muted'
                                        : ''
                                }
                                type="button"
                                aria-label="Quote"
                            >
                                <Quote className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Quote</TooltipContent>
                    </Tooltip>
                    <div className="w-px h-6 bg-border mx-1 my-auto" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={toggleLink}
                                className={
                                    editor.isActive('link') ? 'bg-muted' : ''
                                }
                                type="button"
                                aria-label="Insert Link"
                            >
                                <LinkIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Insert Link</TooltipContent>
                    </Tooltip>
                    <div className="flex-1" />
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor.chain().focus().undo().run()
                                }
                                type="button"
                                aria-label="Undo"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onMouseDown={keepEditorFocus}
                                onClick={() =>
                                    editor.chain().focus().redo().run()
                                }
                                type="button"
                                aria-label="Redo"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            <Dialog
                open={isLinkDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsLinkDialogOpen(false);
                    }
                }}
            >
                <DialogContent className="glass border-foreground/10 max-w-[92vw] sm:max-w-md rounded-3xl p-0 overflow-hidden">
                    <div className="border-b border-foreground/10 bg-card/40 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                <Globe size={18} />
                            </div>
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary/70">
                                    Link Manager
                                </p>
                                <DialogTitle className="text-lg font-bold">
                                    Attach a URL
                                </DialogTitle>
                            </div>
                        </div>
                        <DialogDescription className="mt-2 text-sm text-foreground/70">
                            Add or update the hyperlink for the selected text.
                        </DialogDescription>
                    </div>

                    <form
                        className="px-5 py-5 space-y-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            applyLink();
                        }}
                    >
                        <div className="space-y-2">
                            <Label
                                htmlFor="rte-link-input"
                                className="text-xs uppercase tracking-[0.3em] text-foreground/50"
                            >
                                URL
                            </Label>
                            <Input
                                id="rte-link-input"
                                value={linkDraft}
                                onChange={(event) =>
                                    setLinkDraft(event.target.value)
                                }
                                autoFocus
                                placeholder="https://example.com"
                                className="rounded-2xl border-foreground/10 bg-card/5 h-12 font-medium"
                            />
                        </div>

                        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsLinkDialogOpen(false)}
                                className="rounded-xl border-foreground/10"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl bg-primary text-primary-foreground font-bold"
                            >
                                Save Link
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror {
          min-height: 150px;
        }
        .ProseMirror ul {
          list-style: disc;
          margin-left: 1.2rem;
          padding-left: 0.4rem;
        }
        .ProseMirror ol {
          list-style: decimal;
          margin-left: 1.2rem;
          padding-left: 0.4rem;
        }
        .ProseMirror a {
          color: hsl(var(--primary));
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror u {
          text-decoration: underline;
        }
      `}</style>
        </div>
    );
};

export default RichTextEditor;
