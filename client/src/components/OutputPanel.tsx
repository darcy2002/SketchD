import { useState } from 'react'
import { Code2, Monitor } from 'lucide-react'
import { useSketchStore } from '../store/sketchStore'

type Tab = 'code' | 'preview'

export default function OutputPanel() {
  const [tab, setTab] = useState<Tab>('code')
  const code = useSketchStore((s) => s.code)
  const isStreaming = useSketchStore((s) => s.isStreaming)

  const tabs: { id: Tab; label: string; icon: typeof Code2 }[] = [
    { id: 'code', label: 'code', icon: Code2 },
    { id: 'preview', label: 'preview', icon: Monitor },
  ]

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
        {tab === 'code' ? (
          <div
            className="h-full w-full p-4 font-mono-code overflow-auto whitespace-pre-wrap"
            style={{ fontSize: 12, color: 'rgba(232,228,220,0.7)' }}
          >
            {code || (
              <span style={{ color: 'rgba(232,228,220,0.22)' }}>
                {isStreaming ? 'generating…' : '// code will appear here'}
              </span>
            )}
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span style={{ color: 'rgba(232,228,220,0.22)', fontSize: 11 }}>
              preview will render here
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
