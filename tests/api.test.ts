import { describe, expect, it } from "vitest";
import { GET as health } from "@/app/api/health/route";
import { POST as echo } from "@/app/api/echo/route";

describe("generic API routes", () => {
  it("returns a healthy standardized response", async () => {
    const response = health();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, data: { status: "ok" } });
  });

  it("echoes validated input", async () => {
    const response = await echo(new Request("http://localhost/api/echo", { method: "POST", body: JSON.stringify({ text: " hello " }) }));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ success: true, data: { text: "hello" } });
  });

  it("returns a validation error for missing input", async () => {
    const response = await echo(new Request("http://localhost/api/echo", { method: "POST", body: JSON.stringify({}) }));
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ success: false, error: { code: "VALIDATION_ERROR" } });
  });
});
