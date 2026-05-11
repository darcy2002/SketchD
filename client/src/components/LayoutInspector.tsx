import { useEffect, useRef } from 'react'
import { Ruler } from 'lucide-react'
import { useSketchStore } from '../store/sketchStore'
import EditableChip from './EditableChip'
import { TOOLTIP_MAP, getDropdownOptions } from './chipMeta'

function inspect(code: string) {
  const elements = (code.match(/<[A-Za-z][A-Za-z0-9]*/g) ?? []).length
  const spacing = Array.from(
    new Set(code.match(/\b(?:p|m|gap|space)[xytrbl]?-(?:\d+|px|0\.5|1\.5|2\.5|3\.5)\b/g) ?? [])
  ).slice(0, 12)
  const flex = (code.match(/\bflex\b/g) ?? []).length
  const grid = (code.match(/\bgrid\b/g) ?? []).length
  const rounded = Array.from(new Set(code.match(/\brounded(?:-\w+)?\b/g) ?? [])).slice(0, 6)
  const shadows = Array.from(new Set(code.match(/\bshadow(?:-\w+)?\b/g) ?? [])).slice(0, 6)

  return { elements, spacing, flex, grid, rounded, shadows }
}

export default function LayoutInspector() {
  const code = useSketchStore((s) => s.code)
  const isStreaming = useSketchStore((s) => s.isStreaming)
  const setCode = useSketchStore((s) => s.setCode)
  const setConfirmation = useSketchStore((s) => s.setConfirmation)
  const dataRef = useRef(inspect(''))

  useEffect(() => {
    if (!isStreaming) {
      dataRef.current = inspect(code)
    }
  }, [isStreaming, code])

  const data = isStreaming ? dataRef.current : inspect(code)

  const handleCommit = (oldVal: string, newVal: string) => {
    const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'g')
    setCode(code.replace(regex, newVal))
    setConfirmation('✓ Code updated')
    setTimeout(() => setConfirmation(null), 2500)
  }

  return (
    <div className="h-full flex flex-col" style={{ background: '#0a0a0c' }}>
      <div
        className="flex items-center gap-1.5 border-b hairline shrink-0"
        style={{ height: 32, paddingLeft: 14 }}
      >
        <Ruler size={12} strokeWidth={1.5} color="#d4c4a0" />
        <span
          className="uppercase tracking-widest font-mono-code"
          style={{ color: 'rgba(232,228,220,0.55)', fontSize: 10 }}
        >
          layout
        </span>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="elements" value={data.elements} />
          <Stat label="flex" value={data.flex} />
          <Stat label="grid" value={data.grid} />
        </div>

        <Group label={`spacing · ${data.spacing.length}`} items={data.spacing} onCommit={handleCommit} />
        <Group label={`radius · ${data.rounded.length}`} items={data.rounded} onCommit={handleCommit} />
        <Group label={`shadow · ${data.shadows.length}`} items={data.shadows} onCommit={handleCommit} />
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded px-2 py-1.5"
      style={{ background: 'rgba(232,228,220,0.04)' }}
    >
      <div
        className="uppercase tracking-wider"
        style={{ color: 'rgba(232,228,220,0.45)', fontSize: 9 }}
      >
        {label}
      </div>
      <div
        className="font-mono-code"
        style={{ color: 'rgba(232,228,220,0.9)', fontSize: 14 }}
      >
        {value}
      </div>
    </div>
  )
}

function Group({ label, items, onCommit }: { label: string; items: string[]; onCommit: (oldVal: string, newVal: string) => void }) {
  return (
    <div>
      <div
        className="uppercase tracking-wider mb-1.5"
        style={{ color: 'rgba(232,228,220,0.45)', fontSize: 9 }}
      >
        {label}
      </div>
      {items.length ? (
        <div className="flex flex-wrap gap-1.5">
          {items.map((s) => (
            <EditableChip
              key={s}
              value={s}
              tooltip={TOOLTIP_MAP[s] ?? s}
              dropdownOptions={getDropdownOptions(s)}
              onCommit={onCommit}
            />
          ))}
        </div>
      ) : (
        <span style={{ color: 'rgba(232,228,220,0.3)', fontSize: 10 }}>—</span>
      )}
    </div>
  )
}
