import { z } from "zod";

export const EchoSchema = z.object({
  text: z.string().trim().min(1, "text must not be empty"),
});

export type EchoInput = z.infer<typeof EchoSchema>;

export function formatValidationDetails(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
    code: issue.code,
  }));
}
