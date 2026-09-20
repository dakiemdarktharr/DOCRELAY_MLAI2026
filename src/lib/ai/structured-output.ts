import { z } from "zod";
import { requestStructuredText } from "@/lib/ai/client";

export type StructuredOutputErrorCode =
  | "MODEL_ERROR"
  | "MODEL_TIMEOUT"
  | "INVALID_OUTPUT";

export class StructuredOutputError extends Error {
  constructor(
    public readonly code: StructuredOutputErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "StructuredOutputError";
  }
}

export function parseStructuredOutput<T>(
  raw: unknown,
  schema: z.ZodType<T>,
): T {
  if (
    raw === null ||
    raw === undefined ||
    (typeof raw === "string" && raw.trim() === "")
  ) {
    throw new StructuredOutputError(
      "INVALID_OUTPUT",
      "Model returned an empty response",
    );
  }

  let value: unknown = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch (error) {
      throw new StructuredOutputError(
        "INVALID_OUTPUT",
        "Model returned invalid JSON",
        error,
      );
    }
  }

  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new StructuredOutputError(
      "INVALID_OUTPUT",
      "Model response did not match the requested schema",
      parsed.error,
    );
  }

  return parsed.data;
}

type StructuredOutputOptions = {
  run?: (prompt: string) => Promise<unknown>;
  retries?: number;
  timeoutMs?: number;
};

function asStructuredError(error: unknown): StructuredOutputError {
  if (error instanceof StructuredOutputError) return error;
  const message = "Model request failed";
  const name = error instanceof Error ? error.name.toLowerCase() : "";
  const code = name.includes("timeout") ? "MODEL_TIMEOUT" : "MODEL_ERROR";
  return new StructuredOutputError(code, message, error);
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () =>
        reject(
          new StructuredOutputError(
            "MODEL_TIMEOUT",
            `Model timed out after ${timeoutMs}ms`,
          ),
        ),
      timeoutMs,
    );
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function generateStructured<T>(
  prompt: string,
  schema: z.ZodType<T>,
  options: StructuredOutputOptions = {},
) {
  const run =
    options.run ??
    ((value: string) => requestStructuredText(value, options.timeoutMs));
  const retries = options.retries ?? 0;
  const timeoutMs = options.timeoutMs ?? 12_000;
  let lastError: StructuredOutputError | undefined;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const raw = await withTimeout(run(prompt), timeoutMs);
      return parseStructuredOutput(raw, schema);
    } catch (error) {
      lastError = asStructuredError(error);
    }
  }

  throw (
    lastError ??
    new StructuredOutputError("MODEL_ERROR", "Model request failed")
  );
}
