import type { VerifyResult } from "@/lib/support-verify";
export type VerifyRun = {
  id: string;
  version: number;
  pack: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  status: "RUNNING" | "COMPLETE" | "STOPPED";
  cases: { caseId: string; requestId: string }[];
  results: VerifyResult[];
};
