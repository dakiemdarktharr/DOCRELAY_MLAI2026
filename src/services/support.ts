import { createHash, randomUUID } from "node:crypto";
import type {
  AuditEvent,
  CanonicalRequest,
  Decision,
  SupportInput,
  SupportRequest,
} from "@/domain/contracts";
import { supportInputSchema } from "@/domain/input";
import { evaluatePolicy } from "@/domain/policy";
import { extractIntake, safeInput } from "@/domain/text";
import {
  getSupportRequest,
  insertSupportRequest,
  SupportError,
  updateSupportRequest,
} from "@/lib/support-repository";
import { verifyApproval } from "./approvals";
import {
  createAssistance,
  extractWithModel,
  modelFailure,
  type ModelOptions,
} from "@/lib/support-model";

export function auditEvent(
  request: SupportRequest,
  beforeStatus: SupportRequest["status"] | null,
  action: string,
  actor: string,
  explanation: string,
): AuditEvent {
  return {
    id: randomUUID(),
    requestId: request.id,
    timestamp: new Date().toISOString(),
    actor,
    beforeStatus,
    afterStatus: request.status,
    action,
    requestKind: request.decision?.requestKind ?? "OTHER",
    riskLevel: request.decision?.riskLevel ?? "UNKNOWN",
    bucket: request.decision?.bucket ?? "MISSING_INFO",
    ruleIds: request.decision?.ruleIds ?? ["INTAKE-001"],
    safeEvidence: request.decision?.safeEvidence ?? [
      request.input.rawText || "Structured intake",
    ],
    missingFields: request.decision?.missingFields ?? [],
    explanation,
  };
}
export function prepareInput(value: unknown) {
  const parsed = supportInputSchema.parse(value);
  return safeInput(parsed);
}
export async function analyze(
  input: SupportInput,
  markers: string[],
  options: ModelOptions = {},
): Promise<{ canonical: CanonicalRequest; decision: Decision }> {
  const canonical = await extractWithModel(
    input,
    extractIntake(input, markers),
    options,
  );
  return {
    canonical,
    decision: evaluatePolicy(canonical, verifyApproval(canonical)),
  };
}
export async function previewSupport(value: unknown) {
  const safe = prepareInput(value);
  return { input: safe.input, ...(await analyze(safe.input, safe.markers)) };
}
export async function submitSupport(
  value: unknown,
  options: ModelOptions = {},
): Promise<SupportRequest> {
  const safe = prepareInput(value);
  const input = safe.input;
  if (!input.confirmed)
    throw new SupportError(
      "CONFIRMATION_REQUIRED",
      "Xác nhận preview trước khi gửi.",
      422,
    );
  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify({
        ...input,
        fields: Object.fromEntries(Object.entries(input.fields).sort()),
        confirmed: undefined,
        idempotencyKey: undefined,
      }),
    )
    .digest("hex");
  const existing = await getSupportRequest(input.idempotencyKey);
  if (existing) {
    if (existing.fingerprint !== fingerprint)
      throw new SupportError(
        "IDEMPOTENCY_CONFLICT",
        "Mã gửi này đã dùng cho nội dung khác.",
        409,
      );
    return existing;
  }
  const now = new Date().toISOString();
  const request: SupportRequest = {
    id: input.idempotencyKey,
    version: 0,
    fingerprint,
    createdAt: now,
    updatedAt: now,
    status: "RECEIVED",
    input,
    canonical: null,
    decision: null,
    assistance: [],
    feedback: [],
    events: [],
  };
  request.events.push(
    auditEvent(
      request,
      null,
      "RECEIVED",
      "employee-demo",
      "Đã tiếp nhận input đã redact; chưa có hành động thực thi.",
    ),
  );
  if (!(await insertSupportRequest(request))) {
    const winner = await getSupportRequest(request.id);
    if (!winner || winner.fingerprint !== fingerprint)
      throw new SupportError(
        "IDEMPOTENCY_CONFLICT",
        "Mã gửi bị trùng nội dung khác.",
        409,
      );
    return winner;
  }
  const result = await analyze(input, safe.markers, options);
  let assistance = null;
  if (
    result.decision.action === "AUTO_APPROVE" &&
    ["GUIDE", "LLM_ASSIST"].includes(result.decision.handlingMode)
  ) {
    try {
      assistance = await createAssistance(
        result.canonical,
        result.decision.handlingMode === "LLM_ASSIST",
        options,
      );
    } catch (error) {
      result.canonical = modelFailure(result.canonical, error);
      result.decision = evaluatePolicy(
        result.canonical,
        verifyApproval(result.canonical),
      );
    }
  }
  return updateSupportRequest(request.id, 0, (draft) => {
    draft.canonical = result.canonical;
    draft.decision = result.decision;
    if (assistance) draft.assistance.push(assistance);
    draft.status =
      result.decision.action === "AUTO_APPROVE"
        ? "AUTO_APPROVED"
        : result.decision.action === "ESCALATE"
          ? "ESCALATED"
          : "NEEDS_INFORMATION";
    draft.events.push(
      auditEvent(
        draft,
        "RECEIVED",
        "DECISION",
        "deterministic-policy",
        result.decision.adminReason,
      ),
    );
  });
}
