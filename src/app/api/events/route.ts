import { errorResponse, successResponse } from "@/lib/api-response";
import { listEvents } from "@/lib/events";

export async function GET() {
  try {
    return successResponse(await listEvents());
  } catch {
    return errorResponse("DATABASE_ERROR", "Could not load events", 503);
  }
}
