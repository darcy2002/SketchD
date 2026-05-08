import Toolbar from './components/Toolbar'
import SplitView from './components/SplitView'
import StatusBar from './components/StatusBar'
import { useSketchStore } from './store/sketchStore'

const PLACEHOLDER_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export default function App() {
  const startGeneration = useSketchStore((s) => s.startGeneration)

  const handleGenerate = () => {
    startGeneration(PLACEHOLDER_BASE64)
  }

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: '#0a0a0c', color: '#e8e4dc' }}
    >
      <Toolbar onGenerate={handleGenerate} />
      <div className="flex-1 overflow-hidden">
        <SplitView />
      </div>
      <StatusBar />
    </div>
  )
}
