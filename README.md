# sketchd

A collaborative whiteboard + code editor powered by AI.

## Structure

```
sketchd/
├── client/   React + Vite + TypeScript + Tailwind + tldraw + Monaco
└── server/   Node + Express + Axios
```
client/ (React + Vite + TypeScript)
  ├── App.tsx                 — root, coordinates canvas export → generation
  ├── pages/Landing.tsx       — animated hero landing page
  ├── components/
  │   ├── CanvasPanel.tsx     — tldraw whiteboard, exports JPEG
  │   ├── OutputPanel.tsx     — Monaco editor + iframe live preview (2 tabs)
  │   ├── SplitView.tsx       — resizable canvas ↔ editor layout
  │   ├── Toolbar.tsx         — tool selector, Generate/Stop button
  │   ├── StatusBar.tsx       — streaming status indicator
  │   ├── AssetManagement.tsx — extract/edit colors & fonts from code
  │   ├── LayoutInspector.tsx — analyze flex/grid/spacing tokens
  │   └── EditableChip.tsx    — inline-editable tag with color picker
  └── store/sketchStore.ts    — Zustand: streaming state, SSE client, modes

server/ (Node.js + Express)
  ├── index.js                — port 3001, CORS, 10MB body limit
  ├── routes/generate.js      — POST /api/generate → SSE token stream
  ├── llm/
  │   ├── index.js            — provider factory (env-driven)
  │   ├── anthropic.js        — Claude Sonnet 4 streaming
  │   └── kimi-nvidia.js      — NVIDIA-hosted Kimi K2.6 streaming
  └── prompts/system.js       — fresh + refine system prompts
  
## Getting Started

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
cp .env.example .env   # fill in your API key
npm run dev
```

Client runs on http://localhost:5173  
Server runs on http://localhost:3001
