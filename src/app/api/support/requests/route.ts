import {
  supportApi,
  supportBody,
  enforceDemoRateLimit,
  requireDemoReviewer,
  verifyModelOptions,
} from "@/lib/support-http";
import { listSupportRequests } from "@/lib/support-repository";
import { submitSupport } from "@/services/support";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  return supportApi(
    async () => {
      enforceDemoRateLimit(request, "intake");
      return submitSupport(
        await supportBody(request),
        verifyModelOptions(request),
      );
    },
    201,
  );
}
export async function GET() {
  return supportApi(async () => {
    requireDemoReviewer();
    return listSupportRequests();
  });
}
