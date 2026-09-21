import {
  supportApi,
  supportBody,
  requireDemoReviewer,
  verifyModelOptions,
} from "@/lib/support-http";
import {
  listSupportRequests,
  listSupportSummaries,
} from "@/lib/support-repository";
import { submitSupport } from "@/services/support";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  return supportApi(
    async () =>
      submitSupport(await supportBody(request), verifyModelOptions(request)),
    201,
  );
}
export async function GET(request: Request) {
  return supportApi(async () => {
    requireDemoReviewer();
    return request &&
      new URL(request.url).searchParams.get("view") === "summary"
      ? listSupportSummaries()
      : listSupportRequests();
  });
}
