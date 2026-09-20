import OpenAI from "openai";
import { reserveModelAttempt } from "@/lib/support-repository";

let client: OpenAI | undefined;

export function getLLMClient() {
  const apiKey = process.env.LLM_API_KEY ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("LLM_API_KEY is not configured");
  }

  client ??= new OpenAI({ apiKey, maxRetries: 0 });
  return client;
}

export async function requestStructuredText(
  prompt: string,
  timeoutMs = 12_000,
) {
  if (!(await reserveModelAttempt()))
    throw new Error("Model call budget exhausted");
  const response = await getLLMClient().chat.completions.create(
    {
      model: process.env.LLM_MODEL ?? "gpt-4o-mini",
      store: false,
      max_completion_tokens: 1000,
      messages: [
        {
          role: "system",
          content:
            "Return only a valid JSON object. Do not include markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    },
    { timeout: timeoutMs },
  );

  const choice = response.choices[0];
  if (!choice || choice.finish_reason !== "stop" || choice.message.refusal)
    throw new Error("Model response unavailable");
  return choice.message.content ?? "";
}
