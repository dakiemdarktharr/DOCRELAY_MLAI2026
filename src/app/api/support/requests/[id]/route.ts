import { supportApi, requestId } from "@/lib/support-http";
import { getSupportRequest, SupportError } from "@/lib/support-repository";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return supportApi(async () => {
    const row = await getSupportRequest(requestId((await context.params).id));
    if (!row)
      throw new SupportError("NOT_FOUND", "Không tìm thấy yêu cầu.", 404);
    return row;
  });
}
