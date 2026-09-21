import { expect, it } from "vitest";
import { evaluateBatch, type EvaluationBatch } from "@/domain/evaluation";

export function batch(): EvaluationBatch {
  return { datasetId: "synthetic-test", split: "held-out", evidence: "synthetic", policyVersion: "test-policy", sourceRevision: "a".repeat(40), developmentCaseIds: [], rows: [] };
}
it("reports no data without manufacturing accuracy", () => {
  expect(evaluateBatch(batch())).toMatchObject({ status: "NO_DATA", accuracy: null, coverage: null, escalation: { falseNegativeRate: null, unnecessaryEscalationRate: null } });
});
it("keeps all three actions and separates missed escalation from unnecessary escalation", () => {
  const data = batch();
  data.rows = [
    ["ESCALATE", "ESCALATE"], ["ESCALATE", "NEEDS_INFORMATION"],
    ["AUTO_APPROVE", "ESCALATE"], ["NEEDS_INFORMATION", "NEEDS_INFORMATION"],
    ["AUTO_APPROVE", null],
  ].map(([expectedAction, actualAction], i) => ({ caseId: `test-${i}`, expectedAction: expectedAction as "ESCALATE", actualAction: actualAction as "ESCALATE" | null, observedAt: "2026-09-20T00:00:00Z", review: { reviewerId: "synthetic-reviewer", labelledBeforeRun: true } }));
  expect(evaluateBatch(data)).toMatchObject({ status: "INCOMPLETE", scored: 4, unavailable: 1, accuracy: 0.5, coverage: 0.8, confusion: { ESCALATE: { NEEDS_INFORMATION: 1 } }, escalation: { truePositive: 1, trueNegative: 1, falsePositive: 1, falseNegative: 1, falseNegativeRate: 0.5, unnecessaryEscalationRate: 0.5 } });
});
it("rejects duplicates, declared split leakage, feedback-as-label and raw inputs", () => {
  const row = { caseId: "a", expectedAction: "AUTO_APPROVE", actualAction: "AUTO_APPROVE", observedAt: "2026-09-20T00:00:00Z", review: { reviewerId: "synthetic-reviewer", labelledBeforeRun: true } };
  expect(() => evaluateBatch({ ...batch(), rows: [row, row] })).toThrow();
  expect(() => evaluateBatch({ ...batch(), developmentCaseIds: ["a"], rows: [row] })).toThrow();
  expect(() => evaluateBatch({ ...batch(), rows: [{ ...row, expectedAction: "RESOLVED" }] })).toThrow();
  expect(() => evaluateBatch({ ...batch(), rows: [{ ...row, rawText: "personal input" }] })).toThrow();
  expect(() => evaluateBatch({ ...batch(), rows: [{ ...row, review: { reviewerId: "x", labelledBeforeRun: false } }] })).toThrow();
});
