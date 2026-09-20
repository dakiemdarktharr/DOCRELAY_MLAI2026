import { describe, expect, it } from "vitest";
import { EchoSchema, formatValidationDetails } from "@/lib/validation";

describe("EchoSchema", () => {
  it("accepts and trims a non-empty string", () => {
    expect(EchoSchema.parse({ text: " hello " })).toEqual({ text: "hello" });
  });

  it.each([undefined, { text: 42 }, { text: "" }, { other: "hello" }])(
    "rejects %o",
    (value) => {
      const result = EchoSchema.safeParse(value);
      expect(result.success).toBe(false);
      if (!result.success)
        expect(formatValidationDetails(result.error).length).toBeGreaterThan(0);
    },
  );
});
