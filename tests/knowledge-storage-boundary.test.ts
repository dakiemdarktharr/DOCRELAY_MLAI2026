import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { knowledgeSeed } from "@/domain/knowledge";
import { supportDatabase } from "@/lib/support-repository";
import { retrieveKnowledge } from "@/lib/support-knowledge";

vi.mock("@/lib/support-repository", () => ({ supportDatabase: vi.fn() }));
const article = knowledgeSeed.find((row) => row.label === "GOOGLE_RECOVERY")!;
const toArray = vi.fn(async (): Promise<unknown[]> => []);
const limit = vi.fn(() => ({ toArray }));
const find = vi.fn(() => ({ limit }));
const collection = {
  createIndex: vi.fn(async () => "synthetic-index"),
  bulkWrite: vi.fn(async () => ({})),
  find,
};
beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-22T00:00:00Z"));
  // A storage-boundary fake, not a live Mongo call or persistence receipt.
  vi.mocked(supportDatabase).mockReturnValue({ collection: () => collection } as unknown as ReturnType<typeof supportDatabase>);
});
afterEach(() => vi.useRealTimers());

it("keeps valid Mongo evidence even when another returned document has broken sources", async () => {
  toArray.mockResolvedValueOnce([{ ...article, sources: [null] }, article]);
  const result = await retrieveKnowledge("How can I recover my Gmail account?", "GOOGLE_RECOVERY");
  expect(result.storage).toBe("mongodb");
  expect(result.articles).toEqual([article]);
  expect(limit).toHaveBeenCalledWith(knowledgeSeed.length);
  expect(find).toHaveBeenCalledWith(expect.objectContaining({ _id: { $in: knowledgeSeed.map((row) => row._id) } }));
});
it("does not substitute an unreviewed Mongo revision when every returned row is invalid", async () => {
  toArray.mockResolvedValueOnce([{ ...article, sources: "broken" }, { ...article, answer: "unreviewed replacement" }]);
  expect(await retrieveKnowledge("Recover Gmail account", "GOOGLE_RECOVERY")).toEqual({ storage: "mongodb", articles: [] });
});
