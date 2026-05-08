# sketchd

A collaborative whiteboard + code editor powered by AI.

## Structure

```
sketchd/
├── client/   React + Vite + TypeScript + Tailwind + tldraw + Monaco
└── server/   Node + Express + Axios
```

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
