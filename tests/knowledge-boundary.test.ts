import { expect, it } from "vitest";
import { knowledgeSeed } from "@/domain/knowledge";
import { rankKnowledge } from "@/lib/support-knowledge";

const now = Date.parse("2026-09-22T00:00:00Z");
const good = knowledgeSeed.find((row) => row.label === "GOOGLE_RECOVERY")!;
it.each([null, 42, { ...good, sources: "not-an-array" }, { ...good, sources: [null] }, { ...good, sources: [{ ...good.sources[0], url: null }] }, { ...good, keywords: null }])("skips malformed storage documents without suppressing a valid reviewed match: %j", (bad) => {
  const rows = [bad, good];
  const result = rankKnowledge(rows, "How can I recover my Gmail account?", "GOOGLE_RECOVERY", now);
  expect(result.map((row) => row._id)).toContain(good._id);
  expect(result).toHaveLength(1);
});
it("rejects structurally valid poisoned content and expiry while keeping the original row", () => {
  const rows = [{ ...good, answer: "unreviewed substitute text" }, { ...good, expiresAt: "2020-01-01T00:00:00Z" }, good];
  expect(rankKnowledge(rows, "Recover Gmail account", "GOOGLE_RECOVERY", now)).toEqual([good]);
});
