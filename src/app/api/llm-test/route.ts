import { z } from "zod";
import { errorResponse, successResponse } from "@/lib/api-response";
import {
  generateStructured,
  StructuredOutputError,
} from "@/lib/ai/structured-output";
import { redact } from "@/domain/redaction";

const LLMTestInputSchema = z.object({
  prompt: z.string().trim().min(1).max(6000),
});
const PersonSchema = z.object({
  name: z.string(),
  age: z.number().int().nonnegative(),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse(
      "VALIDATION_ERROR",
      "Request body must be valid JSON",
      422,
    );
  }
  const parsed = LLMTestInputSchema.safeParse(payload);
  if (!parsed.success)
    return errorResponse("VALIDATION_ERROR", "prompt is required", 422);
  if (redact(parsed.data.prompt).markers.length)
    return errorResponse(
      "SENSITIVE_INPUT",
      "Do not send credentials to the model sandbox",
      422,
    );

  try {
    const data = await generateStructured(parsed.data.prompt, PersonSchema);
    return successResponse({ ...data, name: redact(data.name).text });
  } catch (error) {
    const modelError =
      error instanceof StructuredOutputError ? error : undefined;
    return errorResponse(
      modelError?.code ?? "MODEL_ERROR",
      "The model request failed",
      modelError?.code === "MODEL_TIMEOUT" ? 504 : 502,
    );
  }
}
