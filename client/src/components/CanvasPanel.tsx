import { forwardRef } from 'react'

interface CanvasPanelProps {
  onExport?: (base64: string) => void
}

const CanvasPanel = forwardRef<HTMLDivElement, CanvasPanelProps>((_props, ref) => {
  return (
    <div
      className="relative h-full w-full border-r hairline dot-grid"
      style={{ background: '#0a0a0c' }}
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 pointer-events-none">
        <span style={{ color: '#d4c4a0', fontSize: 10 }} className="font-mono-code">
          {'{01}'}
        </span>
        <span
          className="uppercase tracking-widest"
          style={{ color: 'rgba(232,228,220,0.3)', fontSize: 9 }}
        >
          canvas
        </span>
      </div>

      <div ref={ref} className="h-full w-full" />
    </div>
  )
})

CanvasPanel.displayName = 'CanvasPanel'

export default CanvasPanel
