import { MousePointer2, Pencil, Square, Type, Undo2, Trash2, Zap } from 'lucide-react'
import { useSketchStore } from '../store/sketchStore'
import { useState } from 'react'

type Tool = 'select' | 'draw' | 'rectangle' | 'text'

const toolButtons: { id: Tool; icon: typeof MousePointer2 }[] = [
  { id: 'select', icon: MousePointer2 },
  { id: 'draw', icon: Pencil },
  { id: 'rectangle', icon: Square },
  { id: 'text', icon: Type },
]

interface ToolbarProps {
  onGenerate: () => void
}

export default function Toolbar({ onGenerate }: ToolbarProps) {
  const [activeTool, setActiveTool] = useState<Tool>('draw')
  const isStreaming = useSketchStore((s) => s.isStreaming)
  const stopGeneration = useSketchStore((s) => s.stopGeneration)

  const handleGenerateClick = () => {
    if (isStreaming) stopGeneration()
    else onGenerate()
  }

  return (
    <div
      className="flex items-center justify-between px-3 border-b hairline shrink-0"
      style={{ height: 40, background: '#0a0a0c' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tracking-tight">
          sketchd<span style={{ color: '#d4c4a0' }}>.</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center gap-0.5">
          {toolButtons.map(({ id, icon: Icon }) => {
            const active = activeTool === id
            return (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                className="flex items-center justify-center rounded-md transition-colors"
                style={{
                  width: 28,
                  height: 28,
                  background: active ? 'rgba(212,196,160,0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'rgba(232,228,220,0.06)'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={1.5}
                  color={active ? '#d4c4a0' : 'rgba(232,228,220,0.5)'}
                />
              </button>
            )
          })}
        </div>

        <div className="mx-2 h-4 w-px" style={{ background: 'rgba(232,228,220,0.06)' }} />

        <div className="flex items-center gap-0.5">
          {[Undo2, Trash2].map((Icon, i) => (
            <button
              key={i}
              className="flex items-center justify-center rounded-md transition-colors"
              style={{ width: 28, height: 28 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(232,228,220,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Icon size={14} strokeWidth={1.5} color="rgba(232,228,220,0.5)" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="font-mono-code"
          style={{ fontSize: 10, color: 'rgba(232,228,220,0.3)' }}
        >
          kimi k2.6 / nvidia
        </span>
        <button
          onClick={handleGenerateClick}
          className="flex items-center gap-1.5 rounded-md px-4 font-medium"
          style={{
            height: 30,
            background: '#d4c4a0',
            color: '#0a0a0c',
            fontSize: 11,
          }}
        >
          {isStreaming ? (
            <>
              <Square size={11} strokeWidth={2} fill="#0a0a0c" />
              stop
            </>
          ) : (
            <>
              <Zap size={11} strokeWidth={2} />
              generate
            </>
          )}
        </button>
      </div>
    </div>
  )
}
