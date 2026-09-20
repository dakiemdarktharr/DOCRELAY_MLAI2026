import { RequestDetail } from "@/components/request-detail";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <RequestDetail id={(await params).id} />;
}
