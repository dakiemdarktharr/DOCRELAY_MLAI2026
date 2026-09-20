export type VerifyCase = {
  id: string;
  description: string;
  input: string;
  expected: string;
};

// Generic, harmless cases only. Challenge-specific cases belong in Sprint 1.
export const genericVerifyCases: VerifyCase[] = [
  {
    id: "echo-hello",
    description: "Echo a short greeting",
    input: "hello",
    expected: "hello",
  },
  {
    id: "echo-number",
    description: "Echo a numeric string",
    input: "12345",
    expected: "12345",
  },
  {
    id: "echo-spaces",
    description: "Trim surrounding spaces",
    input: "  workspace  ",
    expected: "workspace",
  },
  {
    id: "echo-sentence",
    description: "Echo a normal sentence",
    input: "A simple test case.",
    expected: "A simple test case.",
  },
];
