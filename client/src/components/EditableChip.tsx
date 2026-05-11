import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface EditableChipProps {
  value: string
  swatch?: string | null
  colorPickable?: boolean
  tooltip?: string
  dropdownOptions?: string[]
  onCommit: (oldVal: string, newVal: string) => void
}

export default function EditableChip({
  value,
  swatch,
  colorPickable,
  tooltip,
  dropdownOptions,
  onCommit,
}: EditableChipProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [committed, setCommitted] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (!dropdownOpen) return
    const onDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [dropdownOpen])

  const commit = (next: string) => {
    const trimmed = next.trim()
    if (!trimmed || trimmed === value) {
      setEditing(false)
      setDraft(value)
      return
    }
    onCommit(value, trimmed)
    setEditing(false)
    setDropdownOpen(false)
    setCommitted(true)
    setTimeout(() => setCommitted(false), 600)
  }

  const handleLabelClick = () => {
    if (dropdownOptions && dropdownOptions.length) {
      if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect())
      setDropdownOpen((o) => !o)
    } else {
      setEditing(true)
    }
  }

  const baseStyle = {
    background: committed ? 'rgba(212,196,160,0.18)' : 'rgba(232,228,220,0.04)',
    fontSize: 10,
    color: 'rgba(232,228,220,0.75)',
    transition: 'background 0.3s ease',
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

  const normalized = swatch ? swatch.slice(0, 7) : '#000000'

  const updateRect = () => {
    if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect())
  }

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        updateRect()
        setHovered(true)
      }}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono-code"
        style={{
          ...baseStyle,
          background: hovered && !committed ? 'rgba(232,228,220,0.08)' : baseStyle.background,
        }}
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
              value={/^#[0-9a-fA-F]{6}$/.test(normalized) ? normalized : '#000000'}
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
          onClick={handleLabelClick}
          style={{ cursor: 'pointer' }}
        >
          {value}
        </span>
      </div>

      {tooltip && hovered && !dropdownOpen && rect && createPortal(
        <div
          style={{
            position: 'fixed',
            top: rect.top - 6,
            left: rect.left + rect.width / 2,
            transform: 'translate(-50%, -100%)',
            background: '#1a1a1e',
            color: '#e8e4dc',
            fontSize: 10,
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            fontFamily: 'Geist Mono, monospace',
            border: '1px solid rgba(232,228,220,0.1)',
          }}
        >
          {tooltip}
          <span
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: '4px solid #1a1a1e',
            }}
          />
        </div>,
        document.body,
      )}

      {dropdownOpen && dropdownOptions && rect && createPortal(
        <div
          style={{
            position: 'fixed',
            top: rect.bottom + 4,
            left: rect.left,
            background: '#1a1a1e',
            border: '1px solid rgba(232,228,220,0.1)',
            borderRadius: 6,
            zIndex: 1000,
            minWidth: 80,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {dropdownOptions.map((opt) => {
            const active = opt === value
            return (
              <div
                key={opt}
                onClick={() => commit(opt)}
                style={{
                  padding: '6px 12px',
                  fontSize: 11,
                  fontFamily: 'Geist Mono, monospace',
                  color: active ? '#d4c4a0' : 'rgba(232,228,220,0.8)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,196,160,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {opt}
              </div>
            )
          })}
        </div>,
        document.body,
      )}
    </div>
  )
}
