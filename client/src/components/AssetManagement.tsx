import { useEffect, useRef } from 'react'
import { Palette } from 'lucide-react'
import { useSketchStore } from '../store/sketchStore'
import EditableChip from './EditableChip'
import { TOOLTIP_MAP } from './chipMeta'

function extractColors(code: string): string[] {
  const hex = code.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []
  const rgb = code.match(/rgba?\([^)]+\)/g) ?? []
  const tw = code.match(/(?:bg|text|border|from|to|via|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d+)?/g) ?? []
  return Array.from(new Set([...hex, ...rgb, ...tw])).slice(0, 12)
}

function extractFonts(code: string): string[] {
  const families = code.match(/font-family\s*:\s*[^;"'`]+/gi) ?? []
  const tw = code.match(/font-(?:sans|serif|mono|thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g) ?? []
  return Array.from(new Set([...families, ...tw])).slice(0, 8)
}

const swatchColor = (token: string): string | null => {
  if (token.startsWith('#') || token.startsWith('rgb')) return token
  const map: Record<string, string> = {
    red: '#ef4444', orange: '#f97316', amber: '#f59e0b', yellow: '#eab308',
    lime: '#84cc16', green: '#22c55e', emerald: '#10b981', teal: '#14b8a6',
    cyan: '#06b6d4', sky: '#0ea5e9', blue: '#3b82f6', indigo: '#6366f1',
    violet: '#8b5cf6', purple: '#a855f7', fuchsia: '#d946ef', pink: '#ec4899',
    rose: '#f43f5e', slate: '#64748b', gray: '#6b7280', zinc: '#71717a',
    neutral: '#737373', stone: '#78716c', black: '#000', white: '#fff',
  }
  const m = token.match(/-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)/)
  return m ? map[m[1]] : null
}

export default function AssetManagement() {
  const code = useSketchStore((s) => s.code)
  const isStreaming = useSketchStore((s) => s.isStreaming)
  const setCode = useSketchStore((s) => s.setCode)
  const setConfirmation = useSketchStore((s) => s.setConfirmation)
  const colorsRef = useRef<string[]>([])
  const fontsRef = useRef<string[]>([])

  useEffect(() => {
    if (!isStreaming) {
      colorsRef.current = extractColors(code)
      fontsRef.current = extractFonts(code)
    }
  }, [isStreaming, code])

  const colors = isStreaming ? colorsRef.current : extractColors(code)
  const fonts = isStreaming ? fontsRef.current : extractFonts(code)

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
        <Palette size={12} strokeWidth={1.5} color="#d4c4a0" />
        <span
          className="uppercase tracking-widest font-mono-code"
          style={{ color: 'rgba(232,228,220,0.55)', fontSize: 10 }}
        >
          assets
        </span>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-3">
        <div>
          <div
            className="uppercase tracking-wider mb-1.5"
            style={{ color: 'rgba(232,228,220,0.45)', fontSize: 9 }}
          >
            colors · {colors.length}
          </div>
          {colors.length ? (
            <div className="flex flex-wrap gap-1.5">
              {colors.map((c) => {
                const sw = swatchColor(c)
                const pickable = c.startsWith('#') || c.startsWith('rgb')
                return (
                  <EditableChip
                    key={c}
                    value={c}
                    swatch={sw}
                    colorPickable={pickable}
                    tooltip={TOOLTIP_MAP[c] ?? `color: ${c}`}
                    onCommit={handleCommit}
                  />
                )
              })}
            </div>
          ) : (
            <span style={{ color: 'rgba(232,228,220,0.3)', fontSize: 10 }}>—</span>
          )}
        </div>

        <div>
          <div
            className="uppercase tracking-wider mb-1.5"
            style={{ color: 'rgba(232,228,220,0.45)', fontSize: 9 }}
          >
            typography · {fonts.length}
          </div>
          {fonts.length ? (
            <div className="flex flex-wrap gap-1.5">
              {fonts.map((f) => (
                <EditableChip
                  key={f}
                  value={f}
                  tooltip={TOOLTIP_MAP[f] ?? `font: ${f}`}
                  onCommit={handleCommit}
                />
              ))}
            </div>
          ) : (
            <span style={{ color: 'rgba(232,228,220,0.3)', fontSize: 10 }}>—</span>
          )}
        </div>
      </div>
    </div>
  )
}
