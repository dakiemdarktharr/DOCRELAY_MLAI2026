import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { supportDatabase } from "@/lib/support-repository";
import { withAnswerCache, resetAnswerCacheForTest } from "@/lib/answer-cache";
vi.mock("@/lib/support-repository", () => ({ supportDatabase: vi.fn() }));
const documents = new Map<string, Record<string, unknown>>();
const findOne = vi.fn(
  async ({ _id }: { _id: string }) => documents.get(_id) ?? null,
);
const updateOne = vi.fn(
  async (
    { _id }: { _id: string },
    update: { $set: Record<string, unknown> },
  ) => {
    documents.set(_id, structuredClone(update.$set));
    return {};
  },
);
const createIndex = vi.fn(async () => "ttl");
const validator = (value: unknown) => {
  if (typeof value !== "string") throw Error("invalid");
  return value;
};
beforeEach(() => {
  documents.clear();
  vi.clearAllMocks();
  resetAnswerCacheForTest();
  vi.stubEnv("AI_PROVIDER", "openai");
  vi.stubEnv("OPENAI_API_KEY", "synthetic-cache-signing-key");
  // Minimal Mongo boundary fake; no real URI or network access.
  vi.mocked(supportDatabase).mockReturnValue({
    collection: () => ({ findOne, updateOne, createIndex }),
  } as unknown as ReturnType<typeof supportDatabase>);
});
afterEach(() => vi.unstubAllEnvs());
it("persists a signed Mongo entry, uses Date TTL, and rejects modified cached content", async () => {
  const generate = vi.fn(async () => "Verified public response");
  await withAnswerCache("hashed-question", generate, validator);
  expect(documents.get("hashed-question")?.deleteAt).toBeInstanceOf(Date);
  expect(
    (await withAnswerCache("hashed-question", generate, validator)).cacheHit,
  ).toBe(true);
  documents.get("hashed-question")!.value = "Injected unreviewed response";
  const recovered = await withAnswerCache(
    "hashed-question",
    generate,
    validator,
  );
  expect(recovered.cacheHit).toBe(false);
  expect(recovered.value).toBe("Verified public response");
  expect(generate).toHaveBeenCalledTimes(2);
  expect(JSON.stringify([...documents])).not.toContain(
    "synthetic-cache-signing-key",
  );
});
it("cache read/write outages do not discard an otherwise valid generated answer", async () => {
  findOne.mockRejectedValueOnce(Error("unavailable"));
  updateOne.mockRejectedValueOnce(Error("unavailable"));
  const result = await withAnswerCache(
    "key",
    async () => "safe answer",
    validator,
  );
  expect(result.value).toBe("safe answer");
  expect(result.cacheHit).toBe(false);
});
