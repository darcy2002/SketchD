import { useEffect, useRef, useState } from 'react'
import { useSketchStore } from '../store/sketchStore'

interface EditableChipProps {
  value: string
  swatch?: string | null
  colorPickable?: boolean
}

export default function EditableChip({ value, swatch, colorPickable }: EditableChipProps) {
  const code = useSketchStore((s) => s.code)
  const setCode = useSketchStore((s) => s.setCode)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setDraft(value)
  }, [value])

  const commit = (next: string) => {
    const trimmed = next.trim()
    if (!trimmed || trimmed === value) {
      setEditing(false)
      setDraft(value)
      return
    }
    setCode(code.split(value).join(trimmed))
    setEditing(false)
  }

  const baseStyle = {
    background: 'rgba(232,228,220,0.04)',
    fontSize: 10,
    color: 'rgba(232,228,220,0.75)',
  } as const

  if (editing) {
    return (
      <div
        className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono-code"
        style={{ background: 'rgba(212,196,160,0.1)', fontSize: 10 }}
      >
        {swatch && (
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: swatch,
              display: 'inline-block',
              border: '1px solid rgba(232,228,220,0.1)',
            }}
          />
        )}
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit(draft)
            if (e.key === 'Escape') {
              setDraft(value)
              setEditing(false)
            }
          }}
          className="bg-transparent outline-none font-mono-code"
          style={{
            fontSize: 10,
            color: '#e8e4dc',
            width: `${Math.max(draft.length, 4)}ch`,
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono-code"
      style={baseStyle}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(232,228,220,0.08)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(232,228,220,0.04)')}
    >
      {swatch && colorPickable ? (
        <>
          <button
            onClick={() => colorInputRef.current?.click()}
            title="pick color"
            style={{
              width: 11,
              height: 11,
              borderRadius: 2,
              background: swatch,
              display: 'inline-block',
              border: '1px solid rgba(232,228,220,0.15)',
              cursor: 'pointer',
              padding: 0,
            }}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(swatch) ? swatch : '#000000'}
            onChange={(e) => commit(e.target.value)}
            style={{
              width: 0,
              height: 0,
              opacity: 0,
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />
        </>
      ) : swatch ? (
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 2,
            background: swatch,
            display: 'inline-block',
            border: '1px solid rgba(232,228,220,0.1)',
          }}
        />
      ) : null}
      <span
        onClick={() => setEditing(true)}
        style={{ cursor: 'pointer' }}
        title="click to edit"
      >
        {value}
      </span>
    </div>
  )
}
