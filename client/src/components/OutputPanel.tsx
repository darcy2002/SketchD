import { useEffect, useRef, useState } from 'react'
import { Code2, Monitor } from 'lucide-react'
import Editor from '@monaco-editor/react'
import { useSketchStore } from '../store/sketchStore'

type Tab = 'code' | 'preview'

export default function OutputPanel() {
  const [tab, setTab] = useState<Tab>('code')
  const code = useSketchStore((s) => s.code)
  const isStreaming = useSketchStore((s) => s.isStreaming)
  const setError = useSketchStore((s) => s.setError)
  const prevStreamingRef = useRef(isStreaming)

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
    <div className="relative h-full w-full flex flex-col" style={{ background: '#0a0a0c' }}>
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 pointer-events-none">
        <span style={{ color: '#d4c4a0', fontSize: 10 }} className="font-mono-code">
          {'{02}'}
        </span>
        <span
          className="uppercase tracking-widest"
          style={{ color: 'rgba(232,228,220,0.3)', fontSize: 9 }}
        >
          output
        </span>
      </div>

      <div
        className="flex items-center border-b hairline shrink-0"
        style={{ height: 34, paddingLeft: 12 }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-1.5 h-full px-3 transition-colors"
              style={{
                borderBottom: active ? '1.5px solid #d4c4a0' : '1.5px solid transparent',
                color: active ? 'rgba(232,228,220,0.8)' : 'rgba(232,228,220,0.22)',
                fontSize: 11,
                marginBottom: -0.5,
              }}
            >
              <Icon size={12} strokeWidth={1.5} />
              {label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full" style={{ display: tab === 'code' ? 'block' : 'none' }}>
          <Editor
            height="100%"
            language="javascript"
            theme="sketchd-dark"
            value={code}
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
          {tab === 'preview' && code.trim() ? (
            <iframe
              sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-forms"
              srcDoc={iframeContent}
              style={{ width: '100%', height: '100%', border: 'none', background: 'white' }}
              title="preview"
            />
          ) : !code.trim() ? (
            <div className="h-full w-full flex items-center justify-center">
              <span style={{ color: 'rgba(232,228,220,0.22)', fontSize: 11 }}>
                preview will render here
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
