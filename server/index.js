import "dotenv/config";
import express from "express";
import cors from "cors";
import generateRouter from "./routes/generate.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/api", generateRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", provider: process.env.LLM_PROVIDER });
});

app.listen(PORT, () => {
  console.log(`🚀 Sketchd server running on http://localhost:${PORT}`);
  console.log(`📡 LLM provider: ${process.env.LLM_PROVIDER}`);
});
