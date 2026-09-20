import type { SupportRequest, AuditEvent } from "@/domain/contracts";
import { Card } from "./ui";

export function AssistanceHistory({
  items,
}: {
  items: SupportRequest["assistance"];
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <Card key={`${item.timestamp}-${index}`}>
          <h2 className="text-lg font-bold">
            Hướng dẫn {index + 1}: {item.summary}
          </h2>
          <p className="my-2 text-xs text-slate-500">
            {item.source === "mock"
              ? "Model mô phỏng (mock)"
              : item.source === "openai"
                ? "Model chọn các bước đã kiểm duyệt"
                : "Hướng dẫn theo policy"}{" "}
            · {new Date(item.timestamp).toLocaleString()}
          </p>
          <ol className="ml-5 list-decimal space-y-3">
            {item.stepByStepInstructions.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-amber-800">{item.warning}</p>
          <p className="mt-2 text-sm">
            Kết quả mong đợi: {item.expectedResult}
          </p>
          <p className="mt-2 font-semibold">{item.nextQuestion}</p>
        </Card>
      ))}
    </div>
  );
}
export function AuditTimeline({ events }: { events: AuditEvent[] }) {
  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="break-words border-l-2 border-line pl-3 text-sm"
        >
          <p className="font-semibold">
            {event.action} · {event.actor}
          </p>
          <time>{new Date(event.timestamp).toLocaleString()}</time>
          <p>
            {event.beforeStatus ?? "—"} → {event.afterStatus}
          </p>
          <p>{event.explanation}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">
              Rule, evidence và thông tin còn thiếu
            </summary>
            <p className="break-all">Request: {event.requestId}</p>
            <p>
              {event.requestKind} · {event.riskLevel} · {event.bucket}
            </p>
            <p>Rules: {event.ruleIds.join(", ") || "Chờ đánh giá"}</p>
            <p>Thiếu: {event.missingFields.join(", ") || "Không"}</p>
            {event.safeEvidence.map((evidence, i) => (
              <p key={i} className="whitespace-pre-wrap">
                {evidence}
              </p>
            ))}
          </details>
        </li>
      ))}
    </ol>
  );
}
