import { useRef, useState } from 'react'
import type { Editor } from 'tldraw'
import Toolbar from './components/Toolbar'
import SplitView from './components/SplitView'
import StatusBar from './components/StatusBar'
import Landing from './pages/Landing'
import { useSketchStore } from './store/sketchStore'
import type { CanvasPanelHandle } from './components/CanvasPanel'

export default function App() {
  const canvasRef = useRef<CanvasPanelHandle>(null)
  const [editor, setEditor] = useState<Editor | null>(null)
  const [showLanding, setShowLanding] = useState(true)
  const startGeneration = useSketchStore((s) => s.startGeneration)
  const setError = useSketchStore((s) => s.setError)

  const handleGenerate = async () => {
    const base64 = await canvasRef.current?.exportCanvas()
    if (!base64) {
      setError('Please draw something first')
      return
    }
    setError(null)
    startGeneration(base64)
  }

  if (showLanding) {
    return <Landing onEnter={() => setShowLanding(false)} />
  }

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: '#0a0a0c', color: '#e8e4dc' }}
    >
      <Toolbar onGenerate={handleGenerate} editor={editor} />
      <div className="flex-1 overflow-hidden">
        <SplitView ref={canvasRef} onEditorReady={setEditor} />
      </div>
      <StatusBar />
    </div>
  )
}
