'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Link as LinkIcon,
  Image as ImageIcon, Undo, Redo, Quote,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
}

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${active ? 'bg-[#7E0D0D] text-white' : 'text-[#1B2A44] hover:bg-[#FDF5F5]'}`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#7E0D0D] underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full' } }),
      Placeholder.configure({ placeholder: 'Write your blog content here…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[300px] focus:outline-none px-4 py-3',
      },
    },
  })

  if (!editor) return null

  function addLink() {
    const url = window.prompt('Enter URL')
    if (url) editor!.chain().focus().setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('Enter image URL')
    if (url) editor!.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="border border-[#F3DCDC] rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[#F3DCDC] bg-[#FDF5F5] px-2 py-1.5">
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></ToolbarButton>
        <ToolbarButton title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></ToolbarButton>
        <ToolbarButton title="Numbered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={addLink}><LinkIcon size={15} /></ToolbarButton>
        <ToolbarButton title="Image" onClick={addImage}><ImageIcon size={15} /></ToolbarButton>
        <div className="w-px h-5 bg-[#F3DCDC] mx-1" />
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}><Undo size={15} /></ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}><Redo size={15} /></ToolbarButton>
      </div>

      {/* Editable area */}
      <EditorContent editor={editor} className="bg-white" />
    </div>
  )
}
