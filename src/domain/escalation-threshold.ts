import { z } from "zod";
import type { Decision } from "./contracts";
import { evaluationBatchSchema, evaluateBatch } from "./evaluation";

export const thresholdBounds = { minimum: 0.7, maximum: 0.95, step: 0.02, minimumSamples: 30, minimumPerClass: 10, maximumWindowDays: 30 } as const;
const threshold = z.number().finite().min(thresholdBounds.minimum).max(thresholdBounds.maximum);
export const thresholdWindowSchema = z.object({
  current: threshold,
  version: z.number().int().nonnegative(),
  from: z.string().datetime(),
  to: z.string().datetime(),
}).strict().refine((value) => {
  const duration = Date.parse(value.to) - Date.parse(value.from);
  return duration > 0 && duration <= thresholdBounds.maximumWindowDays * 86400000;
}, "Sample window must be positive and at most 30 days");

// This is an offline proposal. No feedback endpoint or environment flag activates it.
export function proposeThreshold(value: unknown, windowValue: unknown) {
  const batch = evaluationBatchSchema.parse(value);
  const window = thresholdWindowSchema.parse(windowValue);
  if (batch.split !== "development") throw new Error("Held-out data must never tune thresholds");
  const rows = batch.rows.filter((row) => Date.parse(row.observedAt) >= Date.parse(window.from) && Date.parse(row.observedAt) < Date.parse(window.to));
  const report = evaluateBatch({ ...batch, rows });
  const positives = report.escalation.truePositive + report.escalation.falseNegative;
  const negatives = report.escalation.trueNegative + report.escalation.falsePositive;
  const ready = report.scored >= thresholdBounds.minimumSamples && report.unavailable === 0 && positives >= thresholdBounds.minimumPerClass && negatives >= thresholdBounds.minimumPerClass;
  let proposed = window.current;
  if (ready && report.escalation.falseNegative > 0) proposed += thresholdBounds.step;
  else if (ready && (report.escalation.unnecessaryEscalationRate ?? 0) > 0.2) proposed -= thresholdBounds.step;
  proposed = Number(Math.max(thresholdBounds.minimum, Math.min(thresholdBounds.maximum, proposed)).toFixed(2));
  return {
    status: ready ? "PROPOSED_NOT_ACTIVE" : "INSUFFICIENT_REVIEWED_DATA",
    active: false as const,
    previousVersion: window.version, proposedVersion: window.version + 1,
    previousThreshold: window.current, proposedThreshold: proposed,
    rollback: { version: window.version, threshold: window.current },
    window: { from: window.from, to: window.to }, samples: report.scored,
    caseIds: rows.map((row) => row.caseId),
    datasetId: batch.datasetId, evidence: batch.evidence,
    policyVersion: batch.policyVersion, sourceRevision: batch.sourceRevision,
    ownerApproval: "REQUIRED_NOT_RECORDED" as const,
    reason: !ready ? "Need complete reviewed predictions and both escalation classes" : report.escalation.falseNegative ? "Conservative increase after missed escalation" : "Bounded development-only proposal; human approval and independent evaluation required",
  };
}

// Dry-run only: a threshold may withhold a safe answer, never grant authority.
export function simulateThreshold(decision: Decision, confidence: number, proposed: number): Decision["action"] {
  const validatedThreshold = threshold.parse(proposed);
  const score = z.number().finite().min(0).max(1).parse(confidence);
  if (decision.action !== "AUTO_APPROVE" || decision.bucket !== "ROUTINE" || decision.riskLevel !== "LOW" ||
      !["GUIDE", "LLM_ASSIST"].includes(decision.handlingMode) || decision.approvalStatus !== "not_required" ||
      decision.missingFields.length || decision.subrequestOutcomes.length) return decision.action;
  return score < validatedThreshold ? "NEEDS_INFORMATION" : decision.action;
}
