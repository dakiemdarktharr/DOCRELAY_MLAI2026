import { supportApi, requireDemoReviewer } from "@/lib/support-http";
import { listSupportRequests } from "@/lib/support-repository";
import { pendingReview } from "@/domain/contracts";
export const dynamic = "force-dynamic";
export async function GET() {
  return supportApi(async () => {
    requireDemoReviewer();
    const rows = await listSupportRequests();
    return {
      scope: "Most recent 200 synthetic requests; not production accuracy",
      total: rows.length,
      resolvedFeedback: rows.filter((row) =>
        row.feedback.some((item) => item.choice === "RESOLVED"),
      ).length,
      handoffs: rows.filter((row) =>
        row.events.some((event) => event.action === "HANDOFF"),
      ).length,
      modelFailures: rows.filter((row) => row.canonical?.model.failure).length,
      pendingReview: rows.filter((row) => pendingReview(row.status)).length,
    };
  });
}
