import { z } from "zod";

export const evaluationActions = ["AUTO_APPROVE", "NEEDS_INFORMATION", "ESCALATE"] as const;
const action = z.enum(evaluationActions);
const identifier = z.string().regex(/^[a-zA-Z0-9_-]{1,80}$/);
export const evaluationBatchSchema = z.object({
  datasetId: identifier,
  split: z.enum(["development", "held-out"]),
  evidence: z.enum(["synthetic", "consented-anonymized"]),
  policyVersion: z.string().min(1).max(80),
  sourceRevision: z.string().regex(/^[a-f0-9]{40}$/),
  developmentCaseIds: z.array(identifier).max(1000),
  rows: z.array(z.object({
    caseId: identifier,
    expectedAction: action,
    actualAction: action.nullable(),
    confidence: z.number().finite().min(0).max(1).optional(),
    observedAt: z.string().datetime(),
    review: z.object({
      reviewerId: identifier,
      labelledBeforeRun: z.literal(true),
    }).strict(),
  }).strict()).max(1000),
}).strict().superRefine((batch, context) => {
  const seen = new Set<string>();
  const development = new Set(batch.developmentCaseIds);
  batch.rows.forEach((row, index) => {
    if (seen.has(row.caseId) || (batch.split === "held-out" && development.has(row.caseId)))
      context.addIssue({ code: "custom", path: ["rows", index, "caseId"], message: "Duplicate case or declared development/held-out overlap" });
    seen.add(row.caseId);
  });
});
export type EvaluationBatch = z.infer<typeof evaluationBatchSchema>;
const rate = (numerator: number, denominator: number) => denominator ? numerator / denominator : null;

// Labels and provenance are caller declarations, not authenticated ground truth.
export function evaluateBatch(value: unknown) {
  const batch = evaluationBatchSchema.parse(value);
  const confusion = {
    AUTO_APPROVE: { AUTO_APPROVE: 0, NEEDS_INFORMATION: 0, ESCALATE: 0 },
    NEEDS_INFORMATION: { AUTO_APPROVE: 0, NEEDS_INFORMATION: 0, ESCALATE: 0 },
    ESCALATE: { AUTO_APPROVE: 0, NEEDS_INFORMATION: 0, ESCALATE: 0 },
  };
  let scored = 0, correct = 0, truePositive = 0, trueNegative = 0, falsePositive = 0, falseNegative = 0;
  for (const row of batch.rows) {
    if (row.actualAction === null) continue;
    scored++;
    confusion[row.expectedAction][row.actualAction]++;
    if (row.expectedAction === row.actualAction) correct++;
    if (row.expectedAction === "ESCALATE") {
      if (row.actualAction === "ESCALATE") truePositive++; else falseNegative++;
    } else if (row.actualAction === "ESCALATE") falsePositive++; else trueNegative++;
  }
  return {
    datasetId: batch.datasetId, split: batch.split, evidence: batch.evidence,
    policyVersion: batch.policyVersion, sourceRevision: batch.sourceRevision,
    provenance: "caller-declared-unverified" as const,
    status: !batch.rows.length ? "NO_DATA" : scored < batch.rows.length ? "INCOMPLETE" : "COMPLETE_DECLARED",
    total: batch.rows.length, scored, unavailable: batch.rows.length - scored,
    coverage: rate(scored, batch.rows.length), accuracy: rate(correct, scored),
    confusion, escalation: { truePositive, trueNegative, falsePositive, falseNegative,
      falseNegativeRate: rate(falseNegative, truePositive + falseNegative),
      unnecessaryEscalationRate: rate(falsePositive, trueNegative + falsePositive) },
    limitations: ["Rates exclude unavailable predictions; inspect coverage.", "Held-out independence, consent and reviewer identity require external evidence.", "Feedback choices are not labels; no raw input is accepted."],
  };
}
