import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import generateRouter from "./routes/generate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: isProd ? true : (process.env.CLIENT_URL || "http://localhost:5173"),
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/api", generateRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", provider: process.env.LLM_PROVIDER });
});

if (isProd) {
  const clientDist = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Sketchd server running on http://localhost:${PORT}`);
  console.log(`📡 LLM provider: ${process.env.LLM_PROVIDER}`);
});
