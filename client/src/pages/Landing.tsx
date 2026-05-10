
interface LandingProps {
  onEnter: () => void
}

const SKETCH_PATHS = [
  // outer container — slightly wobbly rectangle
  'M 38 78 Q 80 75 160 77 Q 240 75 322 79 Q 324 100 321 158 Q 240 162 160 160 Q 80 163 39 159 Q 36 120 38 78',
  // upload button (left) — rough rectangle
  'M 53 98 Q 80 95 105 97 Q 130 96 157 99 Q 158 112 156 141 Q 130 143 105 142 Q 78 144 54 141 Q 52 125 53 98',
  // cancel button (right) — rough rectangle
  'M 163 98 Q 210 95 255 97 Q 285 96 307 99 Q 309 115 307 141 Q 280 143 245 142 Q 205 144 164 141 Q 162 122 163 98',
  // label line above — wavy
  'M 53 70 Q 90 67 130 69 Q 160 68 185 70',
  // plus icon inside upload button — hand drawn cross
  'M 96 113 L 114 113 M 105 104 L 105 122',
  // small scribble detail inside cancel button
  'M 175 114 Q 210 111 240 114 M 175 124 Q 200 122 225 124',
]

const CODE_LINES = [
  { indent: 0, text: '<div className="flex gap-3 justify-end">' },
  { indent: 1, text: '<button className="bg-black text-white">' },
  { indent: 2, text: 'Upload' },
  { indent: 1, text: '</button>' },
  { indent: 1, text: '<button className="border border-zinc-300">' },
  { indent: 2, text: 'Cancel' },
  { indent: 1, text: '</button>' },
  { indent: 0, text: '</div>' },
]


export default function Landing({ onEnter }: LandingProps) {
  return (
    <div
      className="relative flex flex-col h-screen w-screen overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 0% 0%,    rgba(212,196,160,0.28) 0%, transparent 55%),
          radial-gradient(ellipse 80%  80% at 100% 100%, rgba(180,160,120,0.22) 0%, transparent 50%),
          radial-gradient(ellipse 60%  50% at 50% 50%,  rgba(212,196,160,0.10) 0%, transparent 60%),
          #0a0a0c
        `,
        backgroundSize: '400% 400%',
        animation: 'gradientShift 18s ease infinite',
        color: '#e8e4dc',
      }}
    >
      {/* mesh gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: `
          radial-gradient(ellipse 70% 45% at 15% 10%, rgba(212,196,160,0.09) 0%, transparent 65%),
          radial-gradient(ellipse 50% 35% at 85% 90%, rgba(212,196,160,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 30% 50% at 60% 40%, rgba(180,160,120,0.04) 0%, transparent 55%)
        `,
        pointerEvents: 'none',
      }} />

      {/* glow orb 1 */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,196,160,0.18) 0%, transparent 70%)',
          top: '-15%',
          left: '-10%',
          animation: 'drift1 20s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      {/* glow orb 2 */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,196,160,0.14) 0%, transparent 70%)',
          bottom: '-10%',
          right: '5%',
          animation: 'drift2 25s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      {/* glow orb 3 */}
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,196,160,0.10) 0%, transparent 70%)',
          top: '40%',
          right: '25%',
          animation: 'drift3 16s ease-in-out infinite',
          zIndex: 0,
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50% }
          25%  { background-position: 50% 0% }
          50%  { background-position: 100% 50% }
          75%  { background-position: 50% 100% }
          100% { background-position: 0% 50% }
        }
        @keyframes drift1 {
          0%   { transform: translate(0, 0) }
          33%  { transform: translate(60px, 40px) }
          66%  { transform: translate(-30px, 70px) }
          100% { transform: translate(0, 0) }
        }
        @keyframes drift2 {
          0%   { transform: translate(0, 0) }
          33%  { transform: translate(-50px, -40px) }
          66%  { transform: translate(40px, -60px) }
          100% { transform: translate(0, 0) }
        }
        @keyframes drift3 {
          0%   { transform: translate(0, 0) }
          33%  { transform: translate(30px, -50px) }
          66%  { transform: translate(-40px, 30px) }
          100% { transform: translate(0, 0) }
        }

        /* 12s cycle:
           0%      = 0s   draw start
           25%     = 3s   draw complete / hold begins
           70.83%  = 8.5s hold ends / fade out begins
           83.33%  = 10s  fade out complete / blank pause
           100%    = 12s  loop restart
        */

        @keyframes drawLoop {
          0%   { stroke-dashoffset: 800; opacity: 1 }
          60%  { stroke-dashoffset: 0;   opacity: 1 }
          85%  { stroke-dashoffset: 0;   opacity: 1 }
          100% { stroke-dashoffset: 800; opacity: 0 }
        }

        @keyframes codeLoop {
          0%   { opacity: 0; transform: translateX(-6px) }
          15%  { opacity: 1; transform: translateX(0) }
          75%  { opacity: 1; transform: translateX(0) }
          90%  { opacity: 0; transform: translateX(0) }
          100% { opacity: 0; transform: translateX(-6px) }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px) }
          to   { opacity: 1; transform: translateY(0) }
        }
      `}</style>

      {/* nav */}
      <nav
        className="relative flex items-center justify-between px-8 shrink-0"
        style={{ height: 56, zIndex: 10, borderBottom: '1px solid rgba(232,228,220,0.06)' }}
      >
        <span className="font-medium" style={{ fontSize: 18, letterSpacing: '-0.01em' }}>
          sketchd<span style={{ color: '#d4c4a0' }}>.</span>
        </span>
      </nav>

      {/* hero */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center px-6"
        style={{ zIndex: 10 }}
      >
        {/* headline */}
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            textAlign: 'center',
            color: '#e8e4dc',
            marginBottom: 20,
            animation: 'fadeInUp 0.7s ease both',
          }}
        >
          if you can{' '}
          <span style={{ color: '#d4c4a0', textTransform: 'uppercase' }}>sketch</span>
          , you can{' '}
          <span style={{ color: '#d4c4a0', textTransform: 'uppercase' }}>code</span>
          .
        </h1>

        <p
          style={{
            fontSize: 15,
            color: 'rgba(232,228,220,0.45)',
            textAlign: 'center',
            maxWidth: 400,
            lineHeight: 1.6,
            marginBottom: 40,
            animation: 'fadeInUp 0.7s 0.1s ease both',
          }}
        >
          draw a wireframe, get working react code. no prompts, no boilerplate.
        </p>

        <button
          onClick={onEnter}
          style={{
            height: 44,
            paddingLeft: 28,
            paddingRight: 28,
            background: '#d4c4a0',
            color: '#0a0a0c',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            marginBottom: 64,
            animation: 'fadeInUp 0.7s 0.2s ease both',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#e0d4b0')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#d4c4a0')}
        >
          start sketching
        </button>

        {/* demo */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            width: '100%',
            maxWidth: 820,
            height: 260,
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid rgba(232,228,220,0.08)',
            background: '#0d0d0f',
            animation: 'fadeInUp 0.7s 0.3s ease both',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
          }}
        >
          {/* left: sketch canvas */}
          <div
            style={{
              flex: 1,
              borderRight: '1px solid rgba(232,228,220,0.06)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a0a0c',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 10,
                left: 12,
                fontSize: 9,
                fontFamily: 'Geist Mono, monospace',
                color: 'rgba(212,196,160,0.6)',
                letterSpacing: '0.08em',
              }}
            >
              {'{01}'} CANVAS
            </div>
            <svg
              width="340"
              height="200"
              viewBox="0 0 360 200"
              fill="none"
              style={{ overflow: 'visible', filter: 'url(#pencil)' }}
            >
              <defs>
                <filter id="pencil">
                  <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
              </defs>
              {SKETCH_PATHS.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={i === 0 ? 'rgba(232,228,220,0.65)' : i <= 2 ? 'rgba(232,228,220,0.60)' : 'rgba(232,228,220,0.45)'}
                  strokeWidth={i === 0 ? 1.8 : i <= 2 ? 1.5 : 1.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                  style={{
                    animation: `drawLoop 8s ease infinite`,
                    animationDelay: `${[0, 1, 1.8, 2.4, 2.9, 3.3][i]}s`,
                  }}
                />
              ))}
            </svg>
          </div>

          {/* right: code + preview */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* code output */}
            <div
              style={{
                flex: 1,
                padding: '12px 16px',
                borderBottom: '1px solid rgba(232,228,220,0.06)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontFamily: 'Geist Mono, monospace',
                  color: 'rgba(212,196,160,0.6)',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                {'{02}'} OUTPUT
              </div>
              {CODE_LINES.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 10,
                    lineHeight: 1.7,
                    paddingLeft: line.indent * 12,
                    color: line.text.startsWith('<')
                      ? '#82aaff'
                      : line.text.includes('className')
                      ? '#ffcb6b'
                      : 'rgba(232,228,220,0.75)',
                    opacity: 0,
                    animation: `codeLoop 8s ease infinite`,
                    animationDelay: `${3 + i * 0.2}s`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {line.text}
                </div>
              ))}
            </div>

            {/* live preview */}
            <div
              style={{
                height: 80,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '0 16px',
                gap: 10,
                background: '#ffffff',
              }}
            >
              <button
                style={{
                  padding: '7px 16px',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'default',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Upload
              </button>
              <button
                style={{
                  padding: '7px 16px',
                  background: '#fff',
                  color: '#3f3f46',
                  border: '1px solid #d4d4d8',
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'default',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
