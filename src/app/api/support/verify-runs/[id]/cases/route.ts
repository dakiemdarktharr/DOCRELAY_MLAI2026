import {
  supportApi,
  supportBody,
  requestId,
  requireDemoReviewer,
  enforceDemoRateLimit,
} from "@/lib/support-http";
import { executeVerifyCase } from "@/services/verification";
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return supportApi(async () => {
    requireDemoReviewer();
    enforceDemoRateLimit(request, "intake");
    const origin = new URL(request.url).origin;
    const productionApi: typeof fetch = (path, init) =>
      fetch(new URL(String(path), origin), { ...init, cache: "no-store" });
    return executeVerifyCase(
      requestId((await context.params).id),
      await supportBody(request),
      productionApi,
    );
  });
}
