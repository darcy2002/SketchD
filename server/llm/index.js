import { generateCode as kimiGenerateCode } from "./kimi-nvidia.js";
import { generateCode as anthropicGenerateCode } from "./anthropic.js";

export function getProvider() {
  const provider = process.env.LLM_PROVIDER;

  if (provider === "kimi-nvidia") {
    return { generateCode: kimiGenerateCode };
  }

  if (provider === "anthropic") {
    return { generateCode: anthropicGenerateCode };
  }

  throw new Error(
    `Invalid LLM_PROVIDER "${provider}". Supported values: "kimi-nvidia", "anthropic".`
  );
}
