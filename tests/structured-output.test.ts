import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { generateStructured, parseStructuredOutput, StructuredOutputError } from "@/lib/ai/structured-output";

const PersonSchema = z.object({ name: z.string(), age: z.number().int() });

describe("structured output sandbox", () => {
  it("parses valid JSON and validates the schema", () => {
    expect(parseStructuredOutput('{"name":"Khoa","age":20}', PersonSchema)).toEqual({ name: "Khoa", age: 20 });
  });

  it("rejects invalid JSON, empty output, and invalid structure", () => {
    for (const value of ["not json", "", { name: "Khoa" }]) {
      expect(() => parseStructuredOutput(value, PersonSchema)).toThrow(StructuredOutputError);
    }
  });

  it("retries a transient model failure", async () => {
    const run = vi.fn().mockRejectedValueOnce(new Error("rate limit")).mockResolvedValue('{"name":"Khoa","age":20}');
    await expect(generateStructured("person", PersonSchema, { run, retries: 1 })).resolves.toEqual({ name: "Khoa", age: 20 });
    expect(run).toHaveBeenCalledTimes(2);
  });

  it("surfaces a timeout", async () => {
    const run = () => new Promise<never>(() => undefined);
    await expect(generateStructured("person", PersonSchema, { run, retries: 0, timeoutMs: 5 })).rejects.toMatchObject({ code: "MODEL_TIMEOUT" });
  });
});
