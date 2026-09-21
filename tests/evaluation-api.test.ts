import { afterEach, expect, it, vi } from "vitest";
import { POST } from "@/app/api/support/evaluation/route";
afterEach(() => vi.unstubAllEnvs());
function request(value: unknown) { return new Request("http://local/api/support/evaluation", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(value) }); }
const evaluation = { datasetId: "synthetic-test", split: "held-out", evidence: "synthetic", policyVersion: "test", sourceRevision: "a".repeat(40), developmentCaseIds: [], rows: [] };
it("returns explicitly declared, non-persisted evidence without provider/database calls", async () => {
  vi.stubEnv("NODE_ENV", "test");
  const fetcher = vi.spyOn(globalThis, "fetch");
  try {
    const response = await POST(request({ evaluation }));
    expect(response.status).toBe(200);
    expect((await response.json()).data).toMatchObject({ report: { status: "NO_DATA", provenance: "caller-declared-unverified" }, proposal: null, runtimePolicyChanged: false, storage: "NOT_PERSISTED" });
    expect(fetcher).not.toHaveBeenCalled();
  } finally { fetcher.mockRestore(); }
});
it("rejects held-out tuning and production access unless public demo is enabled", async () => {
  expect((await POST(request({ evaluation, proposal: { current: 0.8, version: 1, from: "2026-09-01T00:00:00Z", to: "2026-09-21T00:00:00Z" } }))).status).toBe(422);
  vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("SUPPORT_ACCESS_MODE", "");
  expect((await POST(request({ evaluation }))).status).toBe(403);
});
