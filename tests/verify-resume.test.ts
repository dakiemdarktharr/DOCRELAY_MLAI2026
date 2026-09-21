import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createVerifyRun, executeVerifyCase } from "@/services/verification";
import { getVerifyRun } from "@/lib/verify-repository";
import { resetSupportTestStore } from "@/lib/support-repository";
import { POST, GET as list } from "@/app/api/support/requests/route";
import { GET as detail } from "@/app/api/support/requests/[id]/route";
import { GET as events } from "@/app/api/support/events/route";
import { GET as metrics } from "@/app/api/support/metrics/route";

beforeEach(() => { vi.stubEnv("MONGODB_URI", ""); vi.stubEnv("AI_PROVIDER", "mock"); vi.stubEnv("AI_MAX_ATTEMPTS", "0"); resetSupportTestStore(); });
afterEach(() => vi.unstubAllEnvs());
const api: typeof fetch = async (url, init) => {
  const request = new Request(`http://localhost${url}`, init);
  if (init?.method === "POST") return POST(request);
  if (String(url).startsWith("/api/support/events?")) return events(request);
  if (String(url) === "/api/support/metrics") return metrics();
  if (String(url).includes("?view=summary")) return list(request);
  return detail(request, { params: Promise.resolve({ id: String(url).split("/").at(-1)! }) });
};
it.each(["json-503", "html-502", "rate-limit", "network", "processing", "readback"])("keeps %s retryable without consuming a case result or changing request ID", async (failure) => {
  const run = await createVerifyRun({ pack: "submission-4" });
  const entry = run.cases[0];
  const broken: typeof fetch = async (url, init) => {
    if (failure === "network") throw new Error("synthetic network outage");
    if (failure === "html-502") return new Response("<html>gateway unavailable</html>", { status: 502 });
    if (failure === "readback" && init?.method === "POST") return api(url, init);
    const status = failure === "rate-limit" ? 429 : failure === "processing" ? 409 : 503;
    return Response.json({ success: false, error: { code: failure === "processing" ? "REQUEST_PROCESSING" : "SERVER_ERROR", message: "synthetic unavailable" } }, { status });
  };
  await expect(executeVerifyCase(run.id, { caseId: entry.caseId }, broken)).rejects.toMatchObject({ code: failure === "rate-limit" ? "RATE_LIMITED" : "VERIFY_RETRYABLE" });
  expect((await getVerifyRun(run.id)).results).toHaveLength(0);
  const completed = await executeVerifyCase(run.id, { caseId: entry.caseId }, api);
  expect(completed.results[0]).toMatchObject({ requestId: entry.requestId, pass: true });
});
it("retains deterministic validation failures and does not silently retry them", async () => {
  const run = await createVerifyRun({ pack: "submission-4" });
  const invalid: typeof fetch = async () => Response.json({ success: false, error: { code: "VALIDATION_ERROR", message: "synthetic invalid fixture" } }, { status: 422 });
  const result = await executeVerifyCase(run.id, { caseId: run.cases[0].caseId }, invalid);
  expect(result.results[0]).toMatchObject({ pass: false, httpStatus: 422 });
  const never = vi.fn();
  await executeVerifyCase(run.id, { caseId: run.cases[0].caseId }, never);
  expect(never).not.toHaveBeenCalled();
});
