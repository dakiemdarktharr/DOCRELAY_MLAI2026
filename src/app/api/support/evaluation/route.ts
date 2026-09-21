import { supportApi, supportBody, requireDemoReviewer, enforceDemoRateLimit } from "@/lib/support-http";
import { evaluationReport } from "@/services/evaluation";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  return supportApi(async () => {
    requireDemoReviewer();
    enforceDemoRateLimit(request, "mutation");
    return evaluationReport(await supportBody(request));
  });
}
