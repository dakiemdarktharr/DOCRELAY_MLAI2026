import {
  enforceDemoRateLimit,
  supportApi,
  supportBody,
} from "@/lib/support-http";
import { continueConversation } from "@/services/conversation";
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return supportApi(async () => {
    enforceDemoRateLimit(request, "intake");
    return continueConversation(
      (await context.params).id,
      await supportBody(request),
    );
  });
}
