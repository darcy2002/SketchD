import { useEffect, useRef, useState } from 'react'
import { Code2, Monitor } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useSketchStore } from '../store/sketchStore'
import AssetManagement from './AssetManagement'
import LayoutInspector from './LayoutInspector'

type Tab = 'code' | 'preview'

export default function OutputPanel() {
  const [tab, setTab] = useState<Tab>('code')
  const code = useSketchStore((s) => s.code)
  const isStreaming = useSketchStore((s) => s.isStreaming)
  const setError = useSketchStore((s) => s.setError)
  const setCode = useSketchStore((s) => s.setCode)
  const confirmation = useSketchStore((s) => s.confirmation)
  const prevStreamingRef = useRef(isStreaming)
  const [bottomHeight, setBottomHeight] = useState(180)
  const [assetWidthPct, setAssetWidthPct] = useState(50)
  const [draggingV, setDraggingV] = useState(false)
  const [draggingH, setDraggingH] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!draggingV && !draggingH) return

    const onMove = (e: MouseEvent) => {
      if (draggingV) {
        const el = containerRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const fromBottom = rect.bottom - e.clientY
        setBottomHeight(Math.max(60, Math.min(rect.height - 120, fromBottom)))
      }
      if (draggingH) {
        const el = bottomRowRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const pct = ((e.clientX - rect.left) / rect.width) * 100
        setAssetWidthPct(Math.max(15, Math.min(85, pct)))
      }
    }
    const onUp = () => {
      setDraggingV(false)
      setDraggingH(false)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    document.body.style.cursor = draggingV ? 'row-resize' : 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [draggingV, draggingH])

  useEffect(() => {
    if (prevStreamingRef.current && !isStreaming && code.trim()) {
      setTab('preview')
    }
    prevStreamingRef.current = isStreaming
  }, [isStreaming, code])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'preview-error') {
        setError(e.data.error)
        console.error('Preview error at line', e.data.line, ':', e.data.error)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [setError])

  const tabs: { id: Tab; label: string; icon: typeof Code2 }[] = [
    { id: 'code', label: 'code', icon: Code2 },
    { id: 'preview', label: 'preview', icon: Monitor },
  ]

  const sanitizedCode = code
    .replace(/^\s*```[\w]*\n?/, '')
    .replace(/```\s*$/, '')
    .replace(/^\s*import\s+.*?$/gm, '')
    .replace(/export\s+default\s+function/g, 'function')
    .replace(/export\s+default\s+/g, 'const __SketchdDefault = ')
    .trim()

  const componentMatch = sanitizedCode.match(/function\s+([A-Z]\w*)/)
  const componentName = componentMatch?.[1] ?? '__SketchdDefault'

  const iframeContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; padding: 0; background: white; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
${sanitizedCode}

try {
  const __Component = eval(${JSON.stringify(componentName)});
  if (typeof __Component === 'function') {
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(__Component));
  } else {
    document.getElementById('root').innerHTML =
      '<div style="padding:20px;color:#888;font-family:monospace">No component named ' + ${JSON.stringify(componentName)} + ' found</div>';
  }
} catch (e) {
  document.getElementById('root').innerHTML =
    '<div style="padding:20px;color:red;font-family:monospace">Preview error: ' + e.message + '</div>';
  parent.postMessage({ type: 'preview-error', error: e.message }, '*');
}

window.onerror = (msg, src, line) => {
  parent.postMessage({ type: 'preview-error', error: msg, line }, '*');
};
  </script>
</body>
</html>`

  return (
    <div ref={containerRef} className="relative h-full w-full flex flex-col" style={{ background: '#0a0a0c' }}>
      <style>{`
        @keyframes sketchdFadeInUp {
          from { opacity: 0; transform: translate(-50%, 8px) }
          to   { opacity: 1; transform: translate(-50%, 0) }
        }
      `}</style>
      {confirmation && (
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(212,196,160,0.15)',
          border: '1px solid rgba(212,196,160,0.3)',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 12,
          color: '#d4c4a0',
          fontFamily: 'Geist Mono, monospace',
          zIndex: 50,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          animation: 'sketchdFadeInUp 0.2s ease both',
          pointerEvents: 'none',
        }}>
          {confirmation}
        </div>
      )}
      <div className="absolute z-10 flex items-center gap-1.5 pointer-events-none" style={{ top: 16, right: 18 }}>
        <span style={{ color: '#d4c4a0', fontSize: 13 }} className="font-mono-code">
          {'{02}'}
        </span>
        <span
          className="uppercase tracking-widest"
          style={{ color: 'rgba(232,228,220,0.5)', fontSize: 12 }}
        >
          output
        </span>
      </div>

      <div
        className="flex items-center border-b hairline shrink-0"
        style={{ height: 42, paddingLeft: 12 }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 h-full px-5 transition-colors"
              style={{
                borderBottom: active ? '2px solid #d4c4a0' : '2px solid transparent',
                color: active ? 'rgba(232,228,220,0.95)' : 'rgba(232,228,220,0.55)',
                fontSize: 13,
                marginBottom: -0.5,
              }}
            >
              <Icon size={14} strokeWidth={1.5} />
              {label}
            </button>
          )
        })}
      </div>

      <div
        className="flex-1 overflow-hidden relative"
        style={{ pointerEvents: draggingV || draggingH ? 'none' : 'auto' }}
      >
        <div className="h-full w-full" style={{ display: tab === 'code' ? 'block' : 'none' }}>
          <Editor
            height="100%"
            language="javascript"
            theme="sketchd-dark"
            value={code}
            onChange={(value) => {
              if (!isStreaming) setCode(value ?? '')
            }}
            options={{
              readOnly: isStreaming,
              fontSize: 12,
              fontFamily: 'Geist Mono, JetBrains Mono, monospace',
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              renderLineHighlight: 'none',
              overviewRulerLanes: 0,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: 'hidden',
                horizontal: 'hidden',
              },
              padding: { top: 14, bottom: 14 },
            }}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme('sketchd-dark', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                  { token: 'string', foreground: 'd4c4a0' },
                  { token: 'string.js', foreground: 'd4c4a0' },
                  { token: 'keyword', foreground: 'c792ea' },
                  { token: 'identifier', foreground: '82aaff' },
                  { token: 'tag', foreground: 'f07178' },
                  { token: 'attribute.name', foreground: 'ffcb6b' },
                  { token: 'comment', foreground: '4a4a5a' },
                  { token: 'delimiter', foreground: '89ddff' },
                ],
                colors: {
                  'editor.background': '#0a0a0c',
                  'editor.foreground': '#e8e4dc',
                  'editorLineNumber.foreground': '#2a2a2e',
                  'editorLineNumber.activeForeground': '#4a4a5a',
                  'editor.selectionBackground': '#d4c4a020',
                  'editor.lineHighlightBackground': '#00000000',
                  'editorCursor.foreground': '#d4c4a0',
                  'editor.selectionHighlightBackground': '#d4c4a010',
                },
              })
            }}
          />
        </div>

        <div className="h-full w-full" style={{ display: tab === 'preview' ? 'block' : 'none' }}>
          {code.trim() ? (
            <iframe
              sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
              srcDoc={iframeContent}
              style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
              title="preview"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span style={{ color: 'rgba(232,228,220,0.55)', fontSize: 13 }}>
                preview will render here
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        onMouseDown={() => setDraggingV(true)}
        className="shrink-0 relative"
        style={{
          height: 4,
          cursor: 'row-resize',
          background: draggingV ? 'rgba(212,196,160,0.3)' : 'transparent',
          borderTop: '1px solid rgba(232,228,220,0.06)',
        }}
      />

      <div
        ref={bottomRowRef}
        className="flex shrink-0"
        style={{ height: bottomHeight }}
      >
        <div style={{ width: `${assetWidthPct}%` }} className="overflow-hidden">
          <AssetManagement />
        </div>
        <div
          onMouseDown={() => setDraggingH(true)}
          className="shrink-0"
          style={{
            width: 4,
            cursor: 'col-resize',
            background: draggingH ? 'rgba(212,196,160,0.3)' : 'transparent',
            borderLeft: '1px solid rgba(232,228,220,0.06)',
          }}
        />
        <div style={{ width: `calc(${100 - assetWidthPct}% - 4px)` }} className="overflow-hidden">
          <LayoutInspector />
        </div>
      </div>
    </div>
  )
}
