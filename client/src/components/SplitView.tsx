import { useEffect, useRef, useState } from 'react'
import CanvasPanel from './CanvasPanel'
import OutputPanel from './OutputPanel'

export default function SplitView() {
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
      <div style={{ width: `${leftPct}%` }} className="h-full">
        <CanvasPanel />
      </div>

      <div
        onMouseDown={() => setDragging(true)}
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: 3, cursor: 'col-resize', background: 'transparent' }}
      >
        <div
          style={{
            width: 1,
            height: 28,
            background: 'rgba(232,228,220,0.06)',
          }}
        />
      </div>

      <div style={{ width: `calc(${100 - leftPct}% - 3px)` }} className="h-full">
        <OutputPanel />
      </div>
    </div>
  )
}
