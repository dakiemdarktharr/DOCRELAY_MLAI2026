import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { supportVerifyCases, runSupportCase } from "@/lib/support-verify";
import { POST } from "@/app/api/support/requests/route";
import { resetSupportTestStore } from "@/lib/support-repository";
beforeEach(() => {
  vi.stubEnv("AI_PROVIDER", "mock");
  vi.stubEnv("MONGODB_URI", "");
  resetSupportTestStore();
});
afterEach(() => vi.unstubAllEnvs());
const productionApi: typeof fetch = async (url, init) => {
  expect(url).toBe("/api/support/requests");
  return POST(new Request(`http://localhost${url}`, init));
};
it("the new Đề A pack has exactly three auto and two escalation cases", () => {
  const rows = supportVerifyCases.filter((item) => item.pack === "de-a-v3");
  expect(
    rows.filter((row) => row.expected_action === "AUTO_APPROVE"),
  ).toHaveLength(3);
  expect(rows.filter((row) => row.expected_action === "ESCALATE")).toHaveLength(
    2,
  );
});
it.each(supportVerifyCases.filter((item) => item.pack.endsWith("v3")))(
  "$id verifies against the production route",
  async (item) => {
    const result = await runSupportCase(item, productionApi);
    expect(result.actual, result.error).toBeDefined();
    expect(result.pass, JSON.stringify(result)).toBe(true);
    expect(result.requestId).toBeTruthy();
  },
);
it("original fixtures and policy sources match their pre-migration hashes", () => {
  const manifest = JSON.parse(
    readFileSync("artifacts/migration-baseline-manifest.json", "utf8").replace(
      /^\uFEFF/,
      "",
    ),
  ) as Array<{ path: string; sha256: string }>;
  const originals = manifest.filter((item) =>
    item.path.startsWith("mlai26_new/data/"),
  );
  expect(originals.length).toBeGreaterThan(5);
  for (const item of originals)
    expect(
      createHash("sha256")
        .update(readFileSync(item.path))
        .digest("hex")
        .toUpperCase(),
      item.path,
    ).toBe(item.sha256);
});
it("reports original expectations without rewriting them or hiding mismatches", async () => {
  const original = supportVerifyCases.filter((item) =>
    item.pack.endsWith("original"),
  );
  expect(original).toHaveLength(128);
  const results = [];
  for (const item of original)
    results.push(await runSupportCase(item, productionApi));
  expect(
    results.every(
      (result) => result.actual && result.requestId && result.timestamp,
    ),
  ).toBe(true);
  expect(results.some((result) => !result.pass)).toBe(true);
  expect(
    results
      .filter(
        (result) =>
          result.expected.action === "ESCALATE" &&
          ["SECURITY_RISK", "BEYOND_AUTHORITY"].includes(
            result.expected.bucket,
          ),
      )
      .every((result) => result.actual?.action !== "AUTO_APPROVE"),
  ).toBe(true);
  writeFileSync(
    "artifacts/original-fixture-evaluation.json",
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        provider: "mock",
        route: "/api/support/requests",
        total: results.length,
        passed: results.filter((row) => row.pass).length,
        results,
      },
      null,
      2,
    ),
  );
});
