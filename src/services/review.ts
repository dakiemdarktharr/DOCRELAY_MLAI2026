import { z } from "zod";
import { canReview } from "@/domain/transitions";
import { redact } from "@/domain/redaction";
import { evaluatePolicy } from "@/domain/policy";
import {
  getSupportRequest,
  SupportError,
  updateSupportRequest,
} from "@/lib/support-repository";
import { createAssistance, modelFailure } from "@/lib/support-model";
import { analyze, auditEvent, prepareInput } from "./support";
import { verifyApproval } from "./approvals";

const reviewSchema = z
  .object({
    version: z.number().int().nonnegative(),
    action: z.enum([
      "APPROVE",
      "REJECT",
      "REQUEST_INFORMATION",
      "STOP",
      "OVERRIDE",
      "FULFILL",
    ]),
    reason: z.string().trim().max(1000).default(""),
    target: z
      .enum(["APPROVED_BY_HUMAN", "REJECTED", "NEEDS_INFORMATION"])
      .optional(),
  })
  .strict()
  .superRefine((input, ctx) => {
    if (input.reason.length < 8)
      ctx.addIssue({
        code: "custom",
        path: ["reason"],
        message: "Cần lý do cụ thể tối thiểu 8 ký tự.",
      });
    if (input.action === "OVERRIDE" && !input.target)
      ctx.addIssue({
        code: "custom",
        path: ["target"],
        message: "Chọn trạng thái đích.",
      });
  });
export async function reviewSupport(id: string, value: unknown, actor: string) {
  const input = reviewSchema.parse(value);
  const redactedReason = redact(input.reason);
  const reason = redactedReason.text || "Reviewer xác nhận thao tác demo.";
  return updateSupportRequest(id, input.version, (request) => {
    if (!canReview(request.status, input.action))
      throw new SupportError(
        "INVALID_TRANSITION",
        "Không thể thực hiện thao tác từ trạng thái hiện tại.",
        409,
      );
    const target =
      input.action === "OVERRIDE"
        ? input.target!
        : (
            {
              APPROVE: "APPROVED_BY_HUMAN",
              REJECT: "REJECTED",
              REQUEST_INFORMATION: "NEEDS_INFORMATION",
              STOP: "STOPPED",
              FULFILL: "COMPLETED",
            } as const
          )[input.action];
    if (
      ["APPROVED_BY_HUMAN", "COMPLETED"].includes(target) &&
      request.decision?.bucket === "SECURITY_RISK"
    )
      throw new SupportError(
        "SECURITY_REVIEW_REQUIRED",
        "Demo không được approve/fulfill Security risk. Chọn Stop, Reject hoặc hỏi thêm.",
        409,
      );
    if (
      ["APPROVED_BY_HUMAN", "COMPLETED"].includes(target) &&
      (request.status === "NEEDS_INFORMATION" ||
        request.decision?.action === "NEEDS_INFORMATION" ||
        Boolean(request.decision?.missingFields.length))
    )
      throw new SupportError(
        "MISSING_INFORMATION",
        "Không thể approve/fulfill khi dữ kiện hoặc approval bắt buộc còn thiếu.",
        409,
      );
    if (
      ["APPROVED_BY_HUMAN", "COMPLETED"].includes(target) &&
      request.decision?.ruleIds.includes("AUTH-007") &&
      (!request.canonical ||
        verifyApproval(request.canonical).status !== "verified")
    )
      throw new SupportError(
        "APPROVAL_INVALID",
        "Approval vẫn chưa hợp lệ; cần bổ sung và phân tích lại trước khi approve.",
        409,
      );
    if (
      input.action === "FULFILL" &&
      request.status === "AUTO_APPROVED" &&
      request.decision?.handlingMode !== "SIMULATED_WORKFLOW"
    )
      throw new SupportError(
        "INVALID_TRANSITION",
        "Guidance cần phản hồi của người dùng; không phải workflow cấp quyền.",
        409,
      );
    if (
      input.action === "FULFILL" &&
      request.status === "AUTO_APPROVED" &&
      request.canonical
    ) {
      const current = evaluatePolicy(request.canonical, verifyApproval);
      if (
        current.action !== "AUTO_APPROVE" ||
        current.handlingMode !== "SIMULATED_WORKFLOW"
      )
        throw new SupportError(
          "APPROVAL_RECHECK_FAILED",
          "Policy hoặc approval không còn hợp lệ tại thời điểm fulfill.",
          409,
        );
    }
    const before = request.status;
    request.status = target;
    const event = auditEvent(
      request,
      before,
      input.action,
      actor,
      reason +
        (target === "COMPLETED"
          ? " Chỉ hoàn tất mô phỏng; không gọi công cụ hạ tầng."
          : ""),
    );
    event.redactions = [
      ...new Set([...event.redactions, ...redactedReason.markers]),
    ];
    request.events.push(event);
  });
}

const feedbackSchema = z
  .object({
    version: z.number().int().nonnegative(),
    choice: z.enum(["RESOLVED", "STILL_BROKEN", "CONFUSED", "ADMIN"]),
  })
  .strict();
export async function feedbackSupport(id: string, value: unknown) {
  const input = feedbackSchema.parse(value);
  const snapshot = await getSupportRequest(id);
  if (!snapshot)
    throw new SupportError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
  if (snapshot.version !== input.version)
    throw new SupportError(
      "VERSION_CONFLICT",
      "Yêu cầu đã thay đổi. Tải lại.",
      409,
    );
  if (
    ["RECEIVED", "PROCESSING", "COMPLETED", "STOPPED", "REJECTED"].includes(
      snapshot.status,
    )
  )
    throw new SupportError(
      "INVALID_TRANSITION",
      "Yêu cầu chưa sẵn sàng hoặc đã kết thúc.",
      409,
    );
  if (
    ["RESOLVED", "STILL_BROKEN"].includes(input.choice) &&
    (snapshot.status !== "AUTO_APPROVED" || !snapshot.assistance.length)
  )
    throw new SupportError(
      "INVALID_TRANSITION",
      "Lựa chọn này chỉ áp dụng cho hướng dẫn đang mở.",
      409,
    );
  let nextAssistance = null;
  let failedCanonical = null;
  if (
    input.choice === "STILL_BROKEN" &&
    snapshot.assistance.length < 3 &&
    snapshot.canonical
  ) {
    try {
      nextAssistance = await createAssistance(
        snapshot.canonical,
        snapshot.decision?.handlingMode === "LLM_ASSIST",
      );
    } catch (error) {
      failedCanonical = modelFailure(snapshot.canonical, error);
    }
  }
  return updateSupportRequest(id, input.version, (request) => {
    const before = request.status;
    request.feedback.push({
      choice: input.choice,
      timestamp: new Date().toISOString(),
    });
    if (nextAssistance) request.assistance.push(nextAssistance);
    if (failedCanonical) {
      request.canonical = failedCanonical;
      request.decision = evaluatePolicy(
        failedCanonical,
        verifyApproval(failedCanonical),
      );
      request.status = "ESCALATED";
    } else if (input.choice === "RESOLVED") request.status = "COMPLETED";
    else if (
      input.choice === "CONFUSED" ||
      input.choice === "ADMIN" ||
      (input.choice === "STILL_BROKEN" && !nextAssistance)
    ) {
      request.status = "ESCALATED";
      if (request.decision && request.decision.bucket !== "SECURITY_RISK")
        request.decision = {
          ...request.decision,
          action: "ESCALATE",
          handlingMode: "HUMAN_REVIEW",
          bucket: "BEYOND_AUTHORITY",
          uncertaintyClass: "AUTHORITY_REQUIRED",
          ruleIds: [...new Set([...request.decision.ruleIds, "HANDOFF-001"])],
          userReason:
            "Đã chuyển người phụ trách cùng toàn bộ lịch sử hướng dẫn.",
          adminReason:
            "User yêu cầu hỗ trợ trực tiếp hoặc đã thử nhiều lần chưa giải quyết.",
          nextStep: "Reviewer tiếp nhận và trao đổi bước tiếp theo.",
        };
    }
    request.events.push(
      auditEvent(
        request,
        before,
        request.status === "ESCALATED" ? "HANDOFF" : "FEEDBACK",
        "employee-demo",
        `Phản hồi: ${input.choice}. Giữ lịch sử hướng dẫn; không có side effect bên ngoài.`,
      ),
    );
  });
}

const clarificationSchema = z
  .object({
    version: z.number().int().nonnegative(),
    rawText: z.string().trim().max(6000),
    fields: z.record(z.string().max(300)).default({}),
  })
  .strict();
export async function clarifySupport(id: string, value: unknown) {
  const input = clarificationSchema.parse(value);
  const current = await getSupportRequest(id);
  if (!current)
    throw new SupportError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
  if (
    current.status !== "NEEDS_INFORMATION" ||
    current.version !== input.version
  )
    throw new SupportError(
      "INVALID_TRANSITION",
      "Chỉ bổ sung cho yêu cầu đang chờ thông tin và đúng phiên bản.",
      409,
    );
  const safe = prepareInput({
    ...current.input,
    rawText: [current.input.rawText, input.rawText].filter(Boolean).join("\n"),
    fields: { ...current.input.fields, ...input.fields },
  });
  const result = await analyze(safe.input, safe.markers);
  let assistance = null;
  if (
    result.decision.action === "AUTO_APPROVE" &&
    ["GUIDE", "LLM_ASSIST"].includes(result.decision.handlingMode)
  ) {
    try {
      assistance = await createAssistance(
        result.canonical,
        result.decision.handlingMode === "LLM_ASSIST",
      );
    } catch (error) {
      result.canonical = modelFailure(result.canonical, error);
      result.decision = evaluatePolicy(
        result.canonical,
        verifyApproval(result.canonical),
      );
    }
  }
  return updateSupportRequest(id, input.version, (request) => {
    request.input = safe.input;
    request.canonical = result.canonical;
    request.decision = result.decision;
    request.status =
      result.decision.action === "AUTO_APPROVE"
        ? "AUTO_APPROVED"
        : result.decision.action === "ESCALATE"
          ? "ESCALATED"
          : "NEEDS_INFORMATION";
    if (assistance) request.assistance.push(assistance);
    request.events.push(
      auditEvent(
        request,
        "NEEDS_INFORMATION",
        "CLARIFICATION",
        "employee-demo",
        result.decision.adminReason,
      ),
    );
  });
}
