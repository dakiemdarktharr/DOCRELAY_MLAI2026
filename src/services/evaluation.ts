import { z } from "zod";
import { evaluationBatchSchema, evaluateBatch } from "@/domain/evaluation";
import { proposeThreshold, thresholdWindowSchema } from "@/domain/escalation-threshold";

const inputSchema = z.object({
  evaluation: evaluationBatchSchema,
  proposal: thresholdWindowSchema.optional(),
}).strict().superRefine((value, context) => {
  if (value.proposal && value.evaluation.split !== "development")
    context.addIssue({ code: "custom", path: ["proposal"], message: "Cannot tune on held-out data" });
});
export function evaluationReport(value: unknown) {
  const input = inputSchema.parse(value);
  return {
    report: evaluateBatch(input.evaluation),
    proposal: input.proposal ? proposeThreshold(input.evaluation, input.proposal) : null,
    runtimePolicyChanged: false,
    storage: "NOT_PERSISTED",
  };
}
