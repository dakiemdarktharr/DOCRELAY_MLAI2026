import { supportApi, supportBody } from "@/lib/support-http";
import { previewSupport } from "@/services/support";
export async function POST(request: Request) {
  return supportApi(async () => previewSupport(await supportBody(request)));
}
