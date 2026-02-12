import { useEffect } from 'react';
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
} from 'lucide-react';
import { Button } from './ui/button';

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
        const url = window.prompt('Enter URL', existingUrl || '');
        if (url === null) return;

        const normalizedUrl = url.trim();
        if (!normalizedUrl) {
            editor.chain().focus().unsetLink().run();
            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: normalizedUrl })
            .run();
    };

    return (
        <div className="w-full border rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() => toggleInlineStyle('bold')}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() => toggleInlineStyle('italic')}
                    className={editor.isActive('italic') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() => toggleInlineStyle('underline')}
                    className={editor.isActive('underline') ? 'bg-muted' : ''}
                    type="button"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 1 })
                            ? 'bg-muted'
                            : ''
                    }
                    type="button"
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={
                        editor.isActive('heading', { level: 2 })
                            ? 'bg-muted'
                            : ''
                    }
                    type="button"
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                    type="button"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                    type="button"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                    type="button"
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={toggleLink}
                    className={editor.isActive('link') ? 'bg-muted' : ''}
                    type="button"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() => editor.chain().focus().undo().run()}
                    type="button"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onMouseDown={keepEditorFocus}
                    onClick={() => editor.chain().focus().redo().run()}
                    type="button"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

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
