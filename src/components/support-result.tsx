import type { CanonicalRequest, Decision } from "@/domain/contracts";
import { Badge, Card } from "./ui";

export function SupportResult({
  decision,
  canonical,
  audience = "employee",
}: {
  decision: Decision;
  canonical: CanonicalRequest;
  audience?: "employee" | "reviewer";
}) {
  const title =
    decision.action === "AUTO_APPROVE"
      ? "Có thể hỗ trợ an toàn"
      : decision.action === "NEEDS_INFORMATION"
        ? "Cần làm rõ thêm"
        : "Cần người phụ trách xem xét";
  return (
    <Card className="space-y-4" aria-label="Kết quả quyết định">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold">{title}</h2>
        <Badge
          tone={decision.action === "AUTO_APPROVE" ? "success" : "warning"}
        >
          {decision.action}
        </Badge>
      </div>
      <p>
        {audience === "reviewer" ? decision.adminReason : decision.userReason}
      </p>
      {decision.questions.length > 0 && (
        <ul className="list-disc space-y-2 pl-5">
          {decision.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      )}
      <p className="text-sm text-slate-600">{decision.nextStep}</p>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-bold">Nhóm tiếp nhận</dt>
          <dd>{decision.assignedTeam}</dd>
        </div>
        <div>
          <dt className="font-bold">Cách hỗ trợ</dt>
          <dd>{decision.handlingMode}</dd>
        </div>
      </dl>
      <details className="rounded-xl bg-paper p-4 text-sm">
        <summary className="cursor-pointer font-semibold">
          Quy tắc và thông tin đã hiểu
        </summary>
        <dl className="mt-3 space-y-2">
          <div>
            <dt>Intent</dt>
            <dd>
              {canonical.intentLabel} · {canonical.language}
            </dd>
          </div>
          <div>
            <dt>Rule IDs</dt>
            <dd>{decision.ruleIds.join(", ")}</dd>
          </div>
          <div>
            <dt>Risk / bucket</dt>
            <dd>
              {decision.riskLevel} / {decision.bucket}
            </dd>
          </div>
          <div>
            <dt>Risk signals</dt>
            <dd>{canonical.riskSignals.join(", ") || "Không phát hiện"}</dd>
          </div>
          <div>
            <dt>Missing information</dt>
            <dd>{decision.missingFields.join(", ") || "Không"}</dd>
          </div>
        </dl>
        <ul className="mt-3 space-y-2">
          {canonical.evidence.map((item, index) => (
            <li key={index} className="break-words whitespace-pre-wrap">
              <strong>{item.field}: </strong>
              {item.quote}
            </li>
          ))}
        </ul>
      </details>
      {canonical.model.failure && (
        <p role="status" className="text-sm text-amber-900">
          Không dùng kết quả model: {canonical.model.failure}
        </p>
      )}
    </Card>
  );
}
