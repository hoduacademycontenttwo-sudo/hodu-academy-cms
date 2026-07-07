'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Bold } from '@tiptap/extension-bold'
import { Italic } from '@tiptap/extension-italic'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Bold as BoldIcon, Italic as ItalicIcon } from 'lucide-react'

interface InlineRichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
}

const SWATCHES = ['#1B2A44', '#7E0D0D', '#922222', '#475569', '#FFFFFF', '#F3DCDC', '#111111']

function ToolbarButton({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) {
  return (
    <button
      type="button"
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${active ? 'bg-[#7E0D0D] text-white' : 'text-[#1B2A44] hover:bg-white'}`}
    >
      {children}
    </button>
  )
}

export default function InlineRichTextEditor({ value, onChange, placeholder, multiline, className }: InlineRichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document, Paragraph, Text, Bold, Italic, TextStyle, Color,
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `focus:outline-none px-3 py-2 text-sm ${multiline ? 'min-h-[60px]' : 'min-h-[38px]'} ${className ?? ''}`,
        'data-placeholder': placeholder ?? '',
      },
      handleKeyDown: (view, event) => {
        if (!multiline && event.key === 'Enter') return true // swallow Enter for single-line fields
        return false
      },
    },
  })

  if (!editor) return null

  const isEmpty = editor.isEmpty

  return (
    <div className="border border-[#F3DCDC] rounded-xl overflow-hidden bg-white focus-within:border-[#7E0D0D] transition-colors">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#F3DCDC] bg-[#FDF5F5] px-2 py-1">
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><BoldIcon size={13} /></ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicIcon size={13} /></ToolbarButton>
        <div className="w-px h-4 bg-[#F3DCDC] mx-1" />
        {SWATCHES.map(color => (
          <button
            key={color}
            type="button"
            title={`Color selected text ${color}`}
            onMouseDown={e => e.preventDefault()}
            onClick={() => editor.chain().focus().setColor(color).run()}
            className="w-5 h-5 rounded-full border border-[#F3DCDC] shrink-0 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
          />
        ))}
        <input
          type="color"
          title="Custom color for selected text"
          onMouseDown={e => e.preventDefault()}
          onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent p-0 ml-0.5"
        />
      </div>
      <div className="relative">
        {isEmpty && placeholder && (
          <span className="absolute left-3 top-2 text-sm text-[#C9C8CB] pointer-events-none">{placeholder}</span>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
