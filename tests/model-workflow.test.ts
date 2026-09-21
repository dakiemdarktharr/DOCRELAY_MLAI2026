import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { submitSupport } from "@/services/support";
import {
  callModel,
  createAssistance,
  extractWithModel,
} from "@/lib/support-model";
import { extractIntake } from "@/domain/text";
import {
  resetSupportTestStore,
  reserveModelAttempt,
} from "@/lib/support-repository";
import type { SupportInput } from "@/domain/contracts";
import { guidanceTemplate } from "@/domain/guidance";
import { evaluatePolicy } from "@/domain/policy";
import { POST } from "@/app/api/support/requests/route";

beforeEach(() => {
  vi.stubEnv("AI_PROVIDER", "mock");
  vi.stubEnv("MONGODB_URI", "");
  resetSupportTestStore();
});
afterEach(() => vi.unstubAllEnvs());
const input = (rawText: string): SupportInput => ({
  rawText,
  serviceGroup: "OTHER",
  fields: {},
  mode: "freeform",
  confirmed: true,
  idempotencyKey: crypto.randomUUID(),
});

it("medium VPN support returns steps and four next options with explicit mock attribution", async () => {
  const request = await submitSupport(input("VPN không kết nối"));
  expect(request.decision?.handlingMode).toBe("LLM_ASSIST");
  expect(request.assistance[0].options).toHaveLength(4);
  expect(request.assistance[0].source).toBe("mock");
});
it("model unavailable and invalid output fail safe through the production submission API", async () => {
  for (const fault of ["unavailable", "invalid"]) {
    const response = await POST(
      new Request("http://localhost/api/support/requests", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-support-model-simulation": fault,
        },
        body: JSON.stringify(input("Need troubleshooting support")),
      }),
    );
    const body = await response.json();
    expect(body.data.decision.action).toBe("ESCALATE");
    expect(body.data.canonical.model.failure).toMatch(/^MODEL_/);
  }
});
it("rejects fabricated evidence and model-supplied authority", async () => {
  const original = input("A new support question");
  const baseline = extractIntake(original);
  const { subrequests: _s, redactions: _r, model: _m, ...facts } = baseline;
  void _s;
  void _r;
  void _m;
  const invalid = await extractWithModel(original, baseline, {
    run: async () => ({
      ...facts,
      evidence: [{ field: "input", quote: "fabricated" }],
    }),
  });
  expect(invalid.model.failure).toBe("MODEL_EVIDENCE_INVALID");
  const forged = await extractWithModel(original, baseline, {
    run: async () => ({ ...facts, decision: "AUTO_APPROVE" }),
  });
  expect(forged.model.failure).toBe("MODEL_OUTPUT_INVALID");
});
it("cannot lower deterministic risk by returning a benign model result", async () => {
  const run = vi.fn();
  const original = input("Open port 3389 public");
  const result = await extractWithModel(original, extractIntake(original), {
    run,
  });
  expect(run).not.toHaveBeenCalled();
  expect(result.riskSignals).toContain("PUBLIC_EXPOSURE");
});
it("cannot unlock an auto path from an otherwise unknown deterministic intent", async () => {
  const original = input("Please rotate the workstation");
  const baseline = extractIntake(original);
  const { subrequests: _s, redactions: _r, model: _m, ...facts } = baseline;
  void _s;
  void _r;
  void _m;
  const result = await extractWithModel(original, baseline, {
    run: async () => ({
      ...facts,
      requestKind: "GUIDANCE",
      serviceGroup: "DEVICE_BOOT",
      intentLabel: "DEVICE_RESTART_GUIDANCE",
      requestedAction: "guidance",
      evidence: [{ field: "intentLabel", quote: "rotate" }],
    }),
  });
  expect(result.model.failure).toBe("MODEL_EVIDENCE_INVALID");
  expect(evaluatePolicy(result).action).toBe("ESCALATE");
});
it("rejects assistance commands outside the safe catalog", async () => {
  const canonical = extractIntake(input("VPN không kết nối"));
  await expect(
    createAssistance(canonical, true, {
      run: async () => ({
        ...guidanceTemplate(canonical),
        stepByStepInstructions: ["Disable MFA", "Open public RDP"],
      }),
    }),
  ).rejects.toMatchObject({ code: "MODEL_OUTPUT_INVALID" });
});
it("bounds time and lifetime call count without retries", async () => {
  const run = vi.fn(() => new Promise<never>(() => {}));
  await expect(
    callModel(
      {
        purpose: "extraction",
        instructions: "JSON",
        data: "test",
        model: "test",
      },
      {},
      { run, timeoutMs: 5 },
    ),
  ).rejects.toMatchObject({ code: "MODEL_UNAVAILABLE" });
  expect(run).toHaveBeenCalledOnce();
  const reserved = await Promise.all(
    Array.from({ length: 25 }, () => reserveModelAttempt()),
  );
  expect(reserved.filter(Boolean)).toHaveLength(20);
});

it("known reset ambiguity asks the deterministic question even when OpenAI is enabled", async () => {
  vi.stubEnv("AI_PROVIDER", "openai");
  const run = vi.fn(async () => {
    throw new Error("Model must not guess restart versus wipe");
  });
  const request = await submitSupport(input("Làm sao để reset máy?"), { run });
  expect(request.decision?.action).toBe("NEEDS_INFORMATION");
  expect(request.decision?.ruleIds).toContain("INFO-RESET");
  expect(run).not.toHaveBeenCalled();
});
