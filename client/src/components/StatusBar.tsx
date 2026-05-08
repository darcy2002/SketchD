import { useSketchStore } from '../store/sketchStore'

export default function StatusBar() {
  const isStreaming = useSketchStore((s) => s.isStreaming)
  const error = useSketchStore((s) => s.error)

  const dotColor = error ? '#ef4444' : '#d4c4a0'
  const label = error ? 'error' : isStreaming ? 'generating...' : 'ready'

  return (
    <div
      className="flex items-center justify-between px-3 border-t hairline shrink-0"
      style={{
        height: 26,
        background: '#0a0a0c',
        fontSize: 10,
        color: 'rgba(232,228,220,0.18)',
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className={isStreaming ? 'pulse-dot' : ''}
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: dotColor,
            display: 'inline-block',
          }}
        />
        <span className="font-mono-code">{label}</span>
      </div>

      <div className="font-mono-code">react + tailwind</div>

      <div className="flex items-center gap-3 font-mono-code">
        <span>ln 1, col 1</span>
        <span>utf-8</span>
      </div>
    </div>
  )
}
