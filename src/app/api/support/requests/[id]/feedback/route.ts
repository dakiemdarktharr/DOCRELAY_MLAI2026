import { supportApi, supportBody, requestId } from "@/lib/support-http";
import { feedbackSupport } from "@/services/review";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return supportApi(async () =>
    feedbackSupport(
      requestId((await context.params).id),
      await supportBody(request),
    ),
  );
}
