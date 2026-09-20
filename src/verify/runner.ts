import type { VerifyCase } from "@/verify/cases";

export type VerifyResult = {
  id: string;
  passed: boolean;
  expected: string;
  actual: string;
  timestamp: string;
  error?: string;
};

export async function runVerifyCase(testCase: VerifyCase, baseUrl = "") {
  const timestamp = new Date().toISOString();
  try {
    const response = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: testCase.input }),
    });
    const body = (await response.json()) as {
      success?: boolean;
      data?: { text?: string };
      error?: { message?: string };
    };
    const actual = body.data?.text ?? "";
    return {
      id: testCase.id,
      passed:
        response.ok && body.success === true && actual === testCase.expected,
      expected: testCase.expected,
      actual,
      timestamp,
      ...(body.error?.message ? { error: body.error.message } : {}),
    } satisfies VerifyResult;
  } catch (error) {
    return {
      id: testCase.id,
      passed: false,
      expected: testCase.expected,
      actual: "",
      timestamp,
      error: error instanceof Error ? error.message : "Request failed",
    } satisfies VerifyResult;
  }
}

export async function runAllVerifyCases(cases: VerifyCase[]) {
  const results: VerifyResult[] = [];
  for (const testCase of cases) {
    results.push(await runVerifyCase(testCase));
  }
  return results;
}
