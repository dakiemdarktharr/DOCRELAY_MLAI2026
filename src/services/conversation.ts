import { z } from "zod";
import {
  getSupportRequest,
  SupportError,
  updateSupportRequest,
} from "@/lib/support-repository";
import { auditEvent, completeAnalysis, prepareInput } from "./support";
const schema = z
  .object({
    version: z.number().int().nonnegative(),
    question: z.string().trim().min(2).max(2000),
  })
  .strict();
export async function continueConversation(id: string, value: unknown) {
  const input = schema.parse(value);
  const current = await getSupportRequest(id);
  if (!current)
    throw new SupportError("NOT_FOUND", "Không tìm thấy cuộc trò chuyện.", 404);
  if (
    current.version !== input.version ||
    current.status !== "AUTO_APPROVED" ||
    !current.canonical?.conversation
  )
    throw new SupportError(
      "INVALID_TRANSITION",
      "Cuộc trò chuyện đã thay đổi hoặc kết thúc. Vui lòng tải lại.",
      409,
    );
  const safe = prepareInput({
    ...current.input,
    previewId: undefined,
    rawText: `${current.input.rawText.slice(-3900)}\nCâu hỏi tiếp theo: ${input.question}`,
    fields: {},
  });
  const result = await completeAnalysis(safe.input, safe.markers);
  return updateSupportRequest(id, input.version, (request) => {
    request.input = safe.input;
    request.canonical = result.canonical;
    request.decision = result.decision;
    request.status =
      result.decision.action === "ESCALATE"
        ? "ESCALATED"
        : result.decision.action === "NEEDS_INFORMATION"
          ? "NEEDS_INFORMATION"
          : "AUTO_APPROVED";
    if (result.assistance) request.assistance.push(result.assistance);
    request.events.push(
      auditEvent(
        request,
        "AUTO_APPROVED",
        "CONVERSATION",
        "employee-demo",
        result.decision.adminReason,
      ),
    );
    if (result.assistance?.answer)
      request.events.push(
        auditEvent(
          request,
          request.status,
          "ANSWER",
          result.assistance.source,
          JSON.stringify(result.assistance.answer),
        ),
      );
  });
}
