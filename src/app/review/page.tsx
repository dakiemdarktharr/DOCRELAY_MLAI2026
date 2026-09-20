import { ReviewConsole } from "@/components/review-console";

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string | string[] }>;
}) {
  const { requestId } = await searchParams;
  const id = typeof requestId === "string" ? requestId : undefined;
  return <ReviewConsole key={id ?? "queue"} requestId={id} />;
}
