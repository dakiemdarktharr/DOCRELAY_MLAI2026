import { successResponse } from "@/lib/api-response";

export function GET() {
  return successResponse({ status: "ok" });
}
