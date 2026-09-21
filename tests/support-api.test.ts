import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { POST as submit } from "@/app/api/support/requests/route";
import { POST as preview } from "@/app/api/support/preview/route";
import { resetSupportTestStore } from "@/lib/support-repository";
import { GET as detail } from "@/app/api/support/requests/[id]/route";

beforeEach(() => {
  vi.stubEnv("MONGODB_URI", "");
  vi.stubEnv("AI_PROVIDER", "mock");
  resetSupportTestStore();
});
afterEach(() => vi.unstubAllEnvs());
const request = (body: unknown) =>
  new Request("http://localhost/api/support/requests", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

it("preview and submission apply the same policy; detail survives a new GET", async () => {
  const input = {
    rawText: "Tôi tắt máy tính lúc về được không?",
    confirmed: true,
    idempotencyKey: crypto.randomUUID(),
  };
  const before = await (await preview(request(input))).json();
  const saved = await (await submit(request(input))).json();
  expect(saved.data.decision).toEqual(before.data.decision);
  const fetched = await (
    await detail(request({}), {
      params: Promise.resolve({ id: saved.data.id }),
    })
  ).json();
  expect(fetched.data.id).toBe(saved.data.id);
  expect(fetched.data.events).toHaveLength(2);
  expect(fetched.data.events[1]).toMatchObject({
    requestId: saved.data.id,
    actor: "deterministic-policy",
    ruleIds: ["GUIDE-001"],
    policyVersion: "support-guidance-v4.2",
    approvalStatus: "not_required",
    nextStep: expect.any(String),
    questions: [],
    redactions: [],
    subrequestOutcomes: [],
  });
});
it("repeated submit has one request/audit and a different payload cannot reuse the key", async () => {
  const input = {
    rawText: "Restart my laptop",
    confirmed: true,
    idempotencyKey: crypto.randomUUID(),
  };
  const responses = await Promise.all([
    submit(request(input)),
    submit(request(input)),
  ]);
  expect(responses.every((response) => response.status === 201)).toBe(true);
  const replay = await (await submit(request(input))).json();
  expect(replay.data.events).toHaveLength(2);
  expect(
    (await submit(request({ ...input, rawText: "Different input" }))).status,
  ).toBe(409);
});
it("does not leak secret values in response, input, audit or validation errors", async () => {
  const secret = "SYNTHETIC" + "_SECRET_94532";
  const response = await submit(
    request({
      rawText: `token=${secret}`,
      confirmed: true,
      idempotencyKey: crypto.randomUUID(),
    }),
  );
  const body = await response.text();
  expect(body).not.toContain(secret);
  expect(body).toContain("SEC-001");
  const invalid = await submit(
    request({
      fields: { permission: secret },
      confirmed: true,
      idempotencyKey: crypto.randomUUID(),
    }),
  );
  expect(await invalid.text()).not.toContain(secret);
});
it("requires confirmation and rejects forged decisions", async () => {
  const input = {
    rawText: "Shutdown laptop",
    idempotencyKey: crypto.randomUUID(),
  };
  expect((await submit(request(input))).status).toBe(422);
  expect(
    (await preview(request({ ...input, decision: "AUTO_APPROVE" }))).status,
  ).toBe(422);
});
