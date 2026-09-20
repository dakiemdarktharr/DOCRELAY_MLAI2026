import { z } from "zod";
import { errorResponse, successResponse } from "./api-response";
import { SupportError } from "./support-repository";

export async function supportApi(work: () => Promise<unknown>, status = 200) {
  try {
    return successResponse(await work(), { status });
  } catch (error) {
    if (error instanceof SupportError)
      return errorResponse(error.code, error.message, error.status);
    if (error instanceof z.ZodError)
      return errorResponse(
        "VALIDATION_ERROR",
        "Dữ liệu không hợp lệ.",
        422,
        error.issues.map((issue) => ({
          field: issue.path.join("."),
          code: issue.code,
        })),
      );
    // Never log database/provider exception bodies, prompts or credentials.
    return errorResponse(
      "SERVER_ERROR",
      "Không thể hoàn tất. Kiểm tra cấu hình hoặc thử lại sau.",
      503,
    );
  }
}
export async function supportBody(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== null) {
    const parsed = URL.parse(origin),
      target = new URL(request.url);
    if (
      !parsed ||
      parsed.origin !== origin ||
      (origin !== target.origin &&
        !(
          parsed.host === request.headers.get("host") &&
          parsed.protocol === target.protocol
        ))
    )
      throw new SupportError("INVALID_ORIGIN", "Origin không hợp lệ.", 403);
  }
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new SupportError("CONTENT_TYPE", "Cần JSON body.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new SupportError("VALIDATION_ERROR", "Thiếu body.", 422);
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 64000) {
        await reader.cancel();
        throw new SupportError("TOO_LARGE", "Nội dung quá dài.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new SupportError("VALIDATION_ERROR", "JSON không hợp lệ.", 422);
  }
}
export function requireDemoReviewer() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.SUPPORT_ACCESS_MODE !== "public-demo"
  )
    throw new SupportError(
      "REVIEW_NOT_ENABLED",
      "Reviewer công khai chỉ dùng cho demo đã bật rõ ràng.",
      403,
    );
  return "public-demo-reviewer";
}
export const requestId = (id: string) => z.string().uuid().parse(id);
export function verifyModelOptions(request: Request) {
  const fault = request.headers.get("x-support-model-simulation");
  if (!fault) return {};
  if (
    process.env.SUPPORT_VERIFY_FAULTS !== "true" &&
    process.env.NODE_ENV === "production"
  )
    throw new SupportError(
      "SIMULATION_DISABLED",
      "Fault simulation chưa bật ở môi trường này.",
      403,
    );
  return { fault: z.enum(["unavailable", "invalid"]).parse(fault) };
}
