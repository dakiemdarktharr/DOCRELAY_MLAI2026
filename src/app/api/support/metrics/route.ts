import { supportApi, requireDemoReviewer } from "@/lib/support-http";
import { supportMetrics } from "@/lib/support-query";
export const dynamic = "force-dynamic";
export async function GET() {
  return supportApi(async () => {
    requireDemoReviewer();
    return {
      scope:
        "All persisted synthetic requests, including Verify; not real-user outcome metrics",
      ...(await supportMetrics()),
    };
  });
}
