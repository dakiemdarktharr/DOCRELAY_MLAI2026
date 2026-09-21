import { expect, it } from "vitest";
import { proposeThreshold, simulateThreshold } from "@/domain/escalation-threshold";
import { evaluatePolicy } from "@/domain/policy";
import { extractIntake, safeInput } from "@/domain/text";
import { supportInputSchema } from "@/domain/input";

const window = { current: 0.8, version: 1, from: "2026-09-01T00:00:00Z", to: "2026-09-21T00:00:00Z" };
function data() {
  return { datasetId: "synthetic-development", split: "development", evidence: "synthetic", policyVersion: "test-policy", sourceRevision: "a".repeat(40), developmentCaseIds: [], rows: Array.from({ length: 30 }, (_, i) => ({ caseId: `test-${i}`, expectedAction: i < 10 ? "ESCALATE" : "AUTO_APPROVE", actualAction: "AUTO_APPROVE", observedAt: "2026-09-20T00:00:00Z", review: { reviewerId: "synthetic-reviewer", labelledBeforeRun: true } })) };
}
it("proposes a bounded conservative change with audit/rollback, never activates", () => {
  expect(proposeThreshold(data(), window)).toMatchObject({ active: false, status: "PROPOSED_NOT_ACTIVE", proposedThreshold: 0.82, previousVersion: 1, proposedVersion: 2, ownerApproval: "REQUIRED_NOT_RECORDED", rollback: { threshold: 0.8, version: 1 } });
  expect(proposeThreshold(data(), { ...window, current: 0.95 }).proposedThreshold).toBe(0.95);
});
it("blocks held-out tuning and invalid windows; missing/out-of-window samples cannot tune", () => {
  expect(() => proposeThreshold({ ...data(), split: "held-out" }, window)).toThrow();
  expect(() => proposeThreshold(data(), { ...window, to: window.from })).toThrow();
  expect(() => proposeThreshold(data(), { ...window, current: NaN })).toThrow();
  expect(proposeThreshold({ ...data(), rows: data().rows.slice(0, 29) }, window).status).toBe("INSUFFICIENT_REVIEWED_DATA");
  expect(proposeThreshold(data(), { ...window, to: "2026-09-10T00:00:00Z" }).samples).toBe(0);
  const incomplete = data();
  expect(proposeThreshold({ ...incomplete, rows: incomplete.rows.map((r, i) => i ? r : { ...r, actualAction: null }) }, window).status).toBe("INSUFFICIENT_REVIEWED_DATA");
});
it("can lower only within bounds after complete reviewed unnecessary escalations", () => {
  const sample = data();
  sample.rows = sample.rows.map((row) => ({ ...row, actualAction: "ESCALATE" }));
  expect(proposeThreshold(sample, window).proposedThreshold).toBe(0.78);
  expect(proposeThreshold(sample, { ...window, current: 0.7 }).proposedThreshold).toBe(0.7);
});
it.each(["Open port 3389 public", "Grant production admin", "Bypass MFA", "My password is abc123", "Restart my laptop then wipe production database"])("threshold simulation cannot downgrade deterministic safety: %s", (rawText) => {
  const input = supportInputSchema.parse({ rawText, confirmed: true, idempotencyKey: crypto.randomUUID() });
  const safe = safeInput(input);
  const decision = evaluatePolicy(extractIntake(safe.input, safe.markers));
  expect(decision.action).toBe("ESCALATE");
  for (const threshold of [0.7, 0.95]) expect(simulateThreshold(decision, 1, threshold)).toBe("ESCALATE");
});
it("simulation may withhold a low-confidence safe guide but never resolves missing facts", () => {
  const decide = (rawText: string) => {
    const safe = safeInput(supportInputSchema.parse({ rawText, confirmed: true, idempotencyKey: crypto.randomUUID() }));
    return evaluatePolicy(extractIntake(safe.input, safe.markers), { status: "not_required" });
  };
  const guide = decide("Restart my laptop");
  expect(guide.action).toBe("AUTO_APPROVE");
  expect(simulateThreshold(guide, 0.75, 0.8)).toBe("NEEDS_INFORMATION");
  expect(simulateThreshold(guide, 0.9, 0.8)).toBe("AUTO_APPROVE");
  expect(guide.action).toBe("AUTO_APPROVE");
  const missing = decide("Reset my laptop");
  expect(missing.action).toBe("NEEDS_INFORMATION");
  expect(simulateThreshold(missing, 1, 0.7)).toBe("NEEDS_INFORMATION");
});
