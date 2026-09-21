import {
  supportApi,
  supportBody,
  requireDemoReviewer,
  enforceDemoRateLimit,
} from "@/lib/support-http";
import { createVerifyRun } from "@/services/verification";
import { listVerifyRuns } from "@/lib/verify-repository";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  return supportApi(async () => {
    requireDemoReviewer();
    enforceDemoRateLimit(request, "mutation");
    return createVerifyRun(await supportBody(request));
  }, 201);
}
export async function GET() {
  return supportApi(async () => {
    requireDemoReviewer();
    return listVerifyRuns();
  });
}
