import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Undo,
} from 'lucide-react';
import * as React from 'react';

// ================================
// TOOLBAR BUTTON
// ================================

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                'h-8 w-8 p-0',
                isActive && 'bg-muted text-muted-foreground',
            )}
        >
            {children}
        </Button>
    );
}

// ================================
// TOOLBAR
// ================================

interface ToolbarProps {
    editor: Editor | null;
}

function Toolbar({ editor }: ToolbarProps) {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-1 border-b p-2">
            {/* Text formatting */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
                title="Strikethrough"
            >
                <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleCode().run()}
                isActive={editor.isActive('code')}
                title="Code"
            >
                <Code className="h-4 w-4" />
            </ToolbarButton>

            <div className="mx-1 h-8 w-px bg-border" />

            {/* Headings */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </ToolbarButton>

            <div className="mx-1 h-8 w-px bg-border" />

            {/* Lists */}
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </ToolbarButton>

            <div className="mx-1 h-8 w-px bg-border" />

            {/* History */}
            <ToolbarButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <Redo className="h-4 w-4" />
            </ToolbarButton>
        </div>
    );
}

// ================================
// RICH TEXT EDITOR
// ================================

interface RichTextEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    className?: string;
    editable?: boolean;
    minHeight?: string;
}

function RichTextEditor({
    content = '',
    onChange,
    onBlur,
    placeholder = 'Start writing...',
    className,
    editable = true,
    minHeight = '200px',
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none focus:outline-none p-4',
                    'prose-headings:font-semibold prose-headings:text-foreground',
                    'prose-p:text-foreground prose-p:leading-relaxed',
                    'prose-strong:text-foreground prose-strong:font-semibold',
                    'prose-ul:list-disc prose-ol:list-decimal',
                    'prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:pl-4 prose-blockquote:italic',
                ),
                style: `min-height: ${minHeight}`,
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        onBlur: () => {
            onBlur?.();
        },
    });

    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={cn('rounded-md border', className)}>
            {editable && <Toolbar editor={editor} />}
            <EditorContent
                editor={editor}
                className="min-h-[200px]"
            />
            {!content && editor?.isEmpty && (
                <div className="pointer-events-none absolute left-4 top-[60px] text-muted-foreground">
                    {placeholder}
                </div>
            )}
        </div>
    );
}

// ================================
// READ-ONLY VIEWER
// ================================

interface RichTextViewerProps {
    content: string;
    className?: string;
}

function RichTextViewer({ content, className }: RichTextViewerProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-sm max-w-none',
                    'prose-headings:font-semibold prose-headings:text-foreground',
                    'prose-p:text-foreground prose-p:leading-relaxed',
                    'prose-strong:text-foreground prose-strong:font-semibold',
                ),
            },
        },
    });

    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={className}>
            <EditorContent editor={editor} />
        </div>
    );
}

export { RichTextEditor, RichTextViewer };
