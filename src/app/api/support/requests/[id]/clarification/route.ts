import { supportApi, supportBody, requestId } from "@/lib/support-http";
import { clarifySupport } from "@/services/review";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return supportApi(async () =>
    clarifySupport(
      requestId((await context.params).id),
      await supportBody(request),
    ),
  );
}
