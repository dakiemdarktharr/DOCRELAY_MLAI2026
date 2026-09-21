import { safeInput } from "@/domain/text";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { SupportInput } from "@/domain/contracts";
import { supportVerifyCases, runSupportCase } from "@/lib/support-verify";
import {
  insertVerifyRun,
  getVerifyRun,
  updateVerifyRun,
} from "@/lib/verify-repository";
import { SupportError } from "@/lib/support-repository";
import { supportInputSchema } from "@/domain/input";

export async function createVerifyRun(value: unknown) {
  const { pack } = z
    .object({ pack: z.string().max(100) })
    .strict()
    .parse(value);
  const cases =
    pack === "all"
      ? supportVerifyCases
      : supportVerifyCases.filter((item) => item.pack === pack);
  if (!cases.length)
    throw new SupportError("UNKNOWN_PACK", "Bộ kiểm thử không tồn tại.", 422);
  const now = new Date().toISOString();
  return insertVerifyRun({
    id: randomUUID(),
    version: 0,
    pack,
    createdAt: now,
    updatedAt: now,
    status: "RUNNING",
    results: [],
    cases: cases.map((item) => ({ caseId: item.id, requestId: randomUUID() })),
  });
}
export async function validateVerificationInput(input: SupportInput) {
  if (!input.verifyRunId) return;
  const run = await getVerifyRun(input.verifyRunId);
  const entry = run.cases.find((item) => item.caseId === input.verifyCaseId);
  const fixture = supportVerifyCases.find(
    (item) => item.id === input.verifyCaseId,
  );
  const expected =
    fixture &&
    supportInputSchema.parse({
      rawText: fixture.rawText,
      fields: fixture.fields ?? {},
      confirmed: true,
      idempotencyKey: entry?.requestId,
      verifyRunId: run.id,
      verifyCaseId: fixture.id,
    });
  if (
    !entry ||
    !expected ||
    JSON.stringify(input) !== JSON.stringify(safeInput(expected).input)
  )
    throw new SupportError(
      "VERIFY_INPUT_MISMATCH",
      "Nội dung không khớp case của lần kiểm thử. Dùng ô nhập mới để thử yêu cầu riêng.",
      409,
    );
}
export async function executeVerifyCase(
  id: string,
  value: unknown,
  fetcher: typeof fetch,
) {
  const { caseId } = z
    .object({ caseId: z.string().max(150) })
    .strict()
    .parse(value);
  const run = await getVerifyRun(id);
  const existing = run.results.find((item) => item.caseId === caseId);
  if (existing) return run;
  if (run.status !== "RUNNING")
    throw new SupportError(
      "RUN_NOT_ACTIVE",
      "Lần kiểm thử đã dừng hoặc kết thúc.",
      409,
    );
  const entry = run.cases.find((item) => item.caseId === caseId),
    fixture = supportVerifyCases.find((item) => item.id === caseId);
  if (!entry || !fixture)
    throw new SupportError(
      "UNKNOWN_CASE",
      "Case không thuộc lần kiểm thử.",
      422,
    );
  const result = await runSupportCase(fixture, fetcher, {
    runId: id,
    requestId: entry.requestId,
  });
  // Throttling is resumable: do not record a rate limit as a policy failure.
  if (result.httpStatus === 429)
    throw new SupportError(
      "RATE_LIMITED",
      "Tạm dừng một phút trước khi tiếp tục lần kiểm thử này.",
      429,
    );
  return updateVerifyRun(id, (draft) => {
    if (!draft.results.some((item) => item.caseId === caseId))
      draft.results.push(result);
    if (draft.results.length === draft.cases.length) {
      draft.status = "COMPLETE";
      draft.completedAt = new Date().toISOString();
    }
  });
}
export async function changeVerifyRun(id: string, value: unknown) {
  const { action } = z
    .object({ action: z.enum(["stop", "resume"]) })
    .strict()
    .parse(value);
  return updateVerifyRun(id, (run) => {
    if (run.status === "COMPLETE") return;
    run.status = action === "stop" ? "STOPPED" : "RUNNING";
  });
}
