import { Router } from "express";
import { getProvider } from "../llm/index.js";
import { FRESH_PROMPT, REFINE_PROMPT } from "../prompts/system.js";

const router = Router();

router.post("/generate", async (req, res) => {
  const { imageBase64, mode = "fresh", previousCode } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "imageBase64 is required" });
  }

  if (mode === "refine" && !previousCode) {
    return res.status(400).json({ error: "previousCode is required for refine mode" });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  req.socket.setTimeout(0);
  req.socket.setNoDelay(true);
  req.socket.setKeepAlive(true);

  const heartbeat = setInterval(() => {
    if (!res.writableEnded) {
      res.write(': heartbeat\n\n');
    }
  }, 5000);

  const prompt = mode === "refine" ? REFINE_PROMPT(previousCode) : FRESH_PROMPT;
  const provider = getProvider();
  const abortController = new AbortController();

  let clientClosed = false;
  res.on("close", () => {
    if (!res.writableEnded) {
      clientClosed = true;
      abortController.abort();
    }
  });

  try {
    await provider.generateCode({
      imageBase64,
      prompt,
      signal: abortController.signal,
      onToken: (token) => {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
    });
    clearInterval(heartbeat);

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    clearInterval(heartbeat);
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      return;
    }
    console.error("provider error:", error.message);
    if (!clientClosed) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

export default router;
