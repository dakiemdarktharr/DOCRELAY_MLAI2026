import {
  supportApi,
  supportBody,
  requestId,
  requireDemoReviewer,
  enforceDemoRateLimit,
} from "@/lib/support-http";
import { getVerifyRun } from "@/lib/verify-repository";
import { changeVerifyRun } from "@/services/verification";
type Context = { params: Promise<{ id: string }> };
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: Context) {
  return supportApi(async () => {
    requireDemoReviewer();
    return getVerifyRun(requestId((await context.params).id));
  });
}
export async function POST(request: Request, context: Context) {
  return supportApi(async () => {
    requireDemoReviewer();
    enforceDemoRateLimit(request, "mutation");
    return changeVerifyRun(
      requestId((await context.params).id),
      await supportBody(request),
    );
  });
}
