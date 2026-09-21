import { successResponse } from "@/lib/api-response";
import { supportStorageMode } from "@/lib/support-repository";
import { POLICY_VERSION } from "@/domain/policy-source";
export const dynamic = "force-dynamic";
export function GET() {
  return successResponse({
    status: "ok",
    app: "MLAI_SUPPORT_REFEREE_V3",
    storage: supportStorageMode(),
    provider: process.env.AI_PROVIDER || "mock",
    policy: POLICY_VERSION,
    simulated: true,
  });
}
