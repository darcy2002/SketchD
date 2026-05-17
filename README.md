# Sketchd

**Turn hand-drawn wireframes into working React components.** Not just markup — components that actually do things.

Sketch a search box and a list, and you get a controlled input that filters items. Sketch a form with "name" and "email" fields, and you get controlled inputs with a working submit handler. Real `useState`, real behavior.

## Demo

https://github.com/darcy2002/SketchD/raw/main/docs/demo.mp4

> If the video doesn't play inline, [click here to download/view](docs/demo.mp4).

## Why this exists

Most sketch-to-code tools stop at static JSX. The upload button doesn't upload, the form doesn't submit, the search doesn't search. Sketchd treats certain words on your sketch as **interaction vocabulary** — when the model sees them, it wires real behavior instead of dead markup.

| Sketch a box labeled... | Get... |
| --- | --- |
| `upload` / `attach` / `file` | Working file input with state + filename preview |
| `form` / `submit` / `contact` | Controlled form, onSubmit handler, success state |
| `search` / `filter` | Controlled input filtering a list below it |
| `list` / `items` / `feed` | Array in state, `.map()` render with mock data |
| `modal` / `dialog` / `popup` | Open/close state, overlay, close button |
| `tabs` | Active-tab state, conditional content |
| `login` / `signin` | Email + password controlled inputs |
| `nav` / `menu` | Working anchor links to in-page sections |

Plus the usual structural hints: `NAV`, `HERO`, `CARD`, `FOOTER`, `BTN` map to semantic layouts with realistic placeholder content.

## How it works

1. You draw on an infinite canvas (tldraw) — boxes, lines, freeform pen, real text labels
2. The canvas exports as a JPEG and gets POSTed to the backend
3. The backend sends the image + a carefully tuned system prompt to Claude Sonnet 4
4. Tokens stream back over SSE and render as live JSX in a sandboxed iframe
5. The vocabulary system + inline recipes guide the model to emit *functional* components in one shot — no second pass, no extra API call

## Stack

**Frontend** — React 18 · Vite · TypeScript · Tailwind · tldraw · Monaco · Zustand
**Backend** — Node · Express · Anthropic SDK (Claude Sonnet 4) · streaming SSE
**Deploy** — Vercel (frontend) + Render (backend)

## Project structure

```
sketchd/
├── client/                          React + Vite + TS frontend
│   ├── App.tsx                      Root: coordinates canvas → generation
│   ├── pages/Landing.tsx            Animated hero landing
│   ├── components/
│   │   ├── CanvasPanel.tsx          tldraw canvas, JPEG export
│   │   ├── OutputPanel.tsx          Monaco editor + sandboxed iframe preview
│   │   ├── SplitView.tsx            Resizable canvas ↔ output layout
│   │   ├── Toolbar.tsx              Tool selector + Generate button
│   │   ├── StatusBar.tsx            Streaming status indicator
│   │   ├── AssetManagement.tsx      Extract/edit colors & fonts
│   │   └── LayoutInspector.tsx      Inspect flex/grid/spacing tokens
│   └── store/sketchStore.ts         Zustand store + SSE client
│
└── server/                          Node + Express backend
    ├── index.js                     Port 3001, CORS, body parsing
    ├── routes/generate.js           POST /api/generate → SSE token stream
    ├── llm/
    │   ├── index.js                 Provider factory
    │   ├── anthropic.js             Claude Sonnet 4 streaming
    │   └── kimi-nvidia.js           NVIDIA-hosted Kimi K2.6 streaming
    └── prompts/system.js            Vocabulary + recipes + system prompt
```

## Getting started

### Prerequisites
- Node 18+
- An Anthropic API key (or NVIDIA NGC key for Kimi)

### Backend

```bash
cd server
npm install
cp .env.example .env        # add your ANTHROPIC_API_KEY
npm run dev                 # http://localhost:3001
```

### Frontend

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Open the client URL, sketch, click **Generate**, watch the code stream.

## Environment variables

**Server (`server/.env`)**
```
ANTHROPIC_API_KEY=sk-ant-...
PROVIDER=anthropic          # or "kimi" for NVIDIA-hosted
CLIENT_URL=http://localhost:5173
PORT=3001
```

**Client (`client/.env`)**
```
VITE_API_URL=http://localhost:3001
```

## Roadmap

- [ ] More vocabulary patterns (charts, tables with sort, multi-step forms)
- [ ] Component registry — deterministic local assembly instead of LLM JSX
- [ ] Export to a full Next.js / Vite project, not just a single component
- [ ] Versioned iterations — diff between generations

## License

MIT
