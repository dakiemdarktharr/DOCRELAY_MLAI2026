import { errorResponse, successResponse } from "@/lib/api-response";
import { recordEvent } from "@/lib/events";
import { formatValidationDetails, EchoSchema } from "@/lib/validation";
import { redact } from "@/domain/redaction";

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

  const parsed = EchoSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(
      "VALIDATION_ERROR",
      "Input validation failed",
      422,
      formatValidationDetails(parsed.error),
    );
  }

  try {
    await recordEvent({
      type: "ECHO_PROCESSED",
      actor: "system",
      metadata: { textLength: parsed.data.text.length },
    });
    return successResponse({ text: redact(parsed.data.text).text });
  } catch {
    return errorResponse(
      "DATABASE_ERROR",
      "The request was processed but could not be recorded",
      503,
    );
  }
}
