import { useEffect, useRef, useState, forwardRef } from 'react'
import CanvasPanel, { type CanvasPanelHandle } from './CanvasPanel'
import OutputPanel from './OutputPanel'
import type { Editor } from 'tldraw'

interface SplitViewProps {
  onEditorReady?: (editor: Editor) => void
}

const SplitView = forwardRef<CanvasPanelHandle, SplitViewProps>(({ onEditorReady }, ref) => {
  const [leftPct, setLeftPct] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setLeftPct(Math.max(20, Math.min(80, pct)))
    }
    const onUp = () => setDragging(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [dragging])

  return (
    <div ref={containerRef} className="flex h-full w-full overflow-hidden">
      <div
        style={{ width: `${leftPct}%`, pointerEvents: dragging ? 'none' : 'auto' }}
        className="h-full"
      >
        <CanvasPanel ref={ref} onEditorReady={onEditorReady} />
      </div>

      <div
        onMouseDown={() => setDragging(true)}
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: 6, cursor: 'col-resize', background: 'transparent' }}
      >
        <div
          style={{
            width: 1,
            height: 28,
            background: 'rgba(232,228,220,0.06)',
          }}
        />
      </div>

      <div
        style={{
          width: `calc(${100 - leftPct}% - 6px)`,
          pointerEvents: dragging ? 'none' : 'auto',
        }}
        className="h-full"
      >
        <OutputPanel />
      </div>
    </div>
  )
})

SplitView.displayName = 'SplitView'

export default SplitView
