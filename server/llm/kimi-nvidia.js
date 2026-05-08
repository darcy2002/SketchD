import axios from "axios";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2.6";

export async function generateCode({ imageBase64, prompt, onToken, signal }) {
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: { url: `data:image/png;base64,${imageBase64}` },
        },
        { type: "text", text: prompt },
      ],
    },
  ];

  const response = await axios.post(
    NVIDIA_API_URL,
    {
      model: MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 4096,
      stream: true,
      chat_template_kwargs: { thinking: false },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      responseType: "stream",
      signal,
    }
  );

  await new Promise((resolve, reject) => {
    let buffer = "";

    response.data.on("data", (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const payload = trimmed.slice(6);
        if (payload === "[DONE]") return;

        try {
          const json = JSON.parse(payload);
          if (json.choices?.[0]?.finish_reason === "stop") return;
          const text =
            json.choices?.[0]?.delta?.content ||
            json.choices?.[0]?.text ||
            "";
          if (text) onToken(text);
        } catch {
          // malformed chunk — skip
        }
      }
    });

    response.data.on("end", resolve);
    response.data.on("error", reject);
  });
}
