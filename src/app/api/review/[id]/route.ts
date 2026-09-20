import {
  supportApi,
  supportBody,
  requestId,
  requireDemoReviewer,
} from "@/lib/support-http";
import { reviewSupport } from "@/services/review";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return supportApi(async () => {
    const actor = requireDemoReviewer();
    return reviewSupport(
      requestId((await context.params).id),
      await supportBody(request),
      actor,
    );
  });
}
