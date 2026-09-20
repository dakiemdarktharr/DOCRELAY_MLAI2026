import { supportApi, requestId, requireDemoReviewer } from "@/lib/support-http";
import {
  getSupportRequest,
  listSupportRequests,
} from "@/lib/support-repository";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return supportApi(async () => {
    requireDemoReviewer();
    const id = new URL(request.url).searchParams.get("requestId");
    if (id) return (await getSupportRequest(requestId(id)))?.events ?? [];
    return (await listSupportRequests())
      .flatMap((row) => row.events)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 300);
  });
}
