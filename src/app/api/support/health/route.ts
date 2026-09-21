import { supportApi } from "@/lib/support-http";
import { supportDatabase, supportStorageMode } from "@/lib/support-repository";
import { POLICY_VERSION } from "@/domain/policy-source";
export const dynamic = "force-dynamic";
export function GET() {
  return supportApi(async () => {
    const db = supportDatabase();
    if (db) await db.command({ ping: 1 });
    return {
      status: "ok",
      app: "MLAI_SUPPORT_REFEREE_V3",
      storage: supportStorageMode(),
      durable: !!db,
      provider: process.env.AI_PROVIDER || "mock",
      policy: POLICY_VERSION,
      sourceRevision:
        process.env.APP_REVISION ||
        process.env.VERCEL_GIT_COMMIT_SHA ||
        "local",
      simulated: true,
    };
  });
}
