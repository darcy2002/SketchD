import { forwardRef, useImperativeHandle, useRef, useCallback } from 'react'
import { Tldraw, exportToBlob, type Editor } from 'tldraw'
import 'tldraw/tldraw.css'

export interface CanvasPanelHandle {
  exportCanvas: () => Promise<string | null>
}

interface CanvasPanelProps {
  onEditorReady?: (editor: Editor) => void
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.readAsDataURL(blob)
  })
}

const CanvasPanel = forwardRef<CanvasPanelHandle, CanvasPanelProps>(
  ({ onEditorReady }, ref) => {
    const editorRef = useRef<Editor | null>(null)

    const exportCanvas = useCallback(async (): Promise<string | null> => {
      const editor = editorRef.current
      if (!editor) return null
      const shapeIds = editor.getCurrentPageShapeIds()
      if (shapeIds.size === 0) return null
      const blob = await exportToBlob({
        editor,
        ids: Array.from(shapeIds),
        format: 'jpeg',
        opts: { background: true },
      })
      return await blobToBase64(blob)
    }, [])

    useImperativeHandle(ref, () => ({ exportCanvas }), [exportCanvas])

    const handleMount = (editor: Editor) => {
      editorRef.current = editor
      onEditorReady?.(editor)
    }

    return (
      <div
        className="relative h-full w-full border-r hairline"
        style={{ background: '#0a0a0c' }}
      >
        <div className="absolute z-20 flex items-center gap-1.5 pointer-events-none" style={{ top: 16, left: 18 }}>
          <span style={{ color: '#d4c4a0', fontSize: 13 }} className="font-mono-code">
            {'{01}'}
          </span>
          <span
            className="uppercase tracking-widest"
            style={{ color: 'rgba(232,228,220,0.5)', fontSize: 12 }}
          >
            canvas
          </span>
        </div>

        <div className="absolute inset-0 dot-grid">
          <Tldraw
            hideUi
            onMount={handleMount}
            components={{
              ContextMenu: null,
              ActionsMenu: null,
              HelpMenu: null,
              ZoomMenu: null,
              MainMenu: null,
              Minimap: null,
              StylePanel: null,
              PageMenu: null,
              NavigationPanel: null,
              Toolbar: null,
              KeyboardShortcutsDialog: null,
              QuickActions: null,
              HelperButtons: null,
              MenuPanel: null,
            }}
          />
        </div>
      </div>
    )
  }
)

CanvasPanel.displayName = 'CanvasPanel'

export default CanvasPanel
