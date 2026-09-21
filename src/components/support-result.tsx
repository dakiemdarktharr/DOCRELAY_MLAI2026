import type { CanonicalRequest, Decision } from "@/domain/contracts";
import { labelForField } from "@/domain/catalog";
import { intentName } from "@/domain/presentation";
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
  const questions =
    audience === "reviewer"
      ? [...decision.questions, ...(decision.reviewerQuestions ?? [])]
      : decision.questions;
  return (
    <Card className="space-y-4" aria-label="Kết quả quyết định">
      <div className="flex flex-wrap items-center gap-3">
        <h2>{title}</h2>
        {audience === "reviewer" && (
          <Badge
            tone={decision.action === "AUTO_APPROVE" ? "success" : "warning"}
          >
            {decision.action}
          </Badge>
        )}
      </div>
      <p>
        {audience === "reviewer" ? decision.adminReason : decision.userReason}
      </p>
      {questions.length > 0 && (
        <ul className="list-disc space-y-2 pl-5">
          {questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      )}
      <p>
        {decision.action === "ESCALATE" && audience === "employee"
          ? "Nhân viên hỗ trợ sẽ xem xét yêu cầu và lịch sử của bạn. Bạn có thể theo dõi tại liên kết yêu cầu."
          : decision.nextStep}
      </p>
      <p className="text-sm text-slate-600">
        Cách hỗ trợ:{" "}
        {
          {
            GUIDE: "Hướng dẫn tự thực hiện",
            LLM_ASSIST: "Hướng dẫn từng bước",
            SIMULATED_WORKFLOW: "Tiếp nhận xử lý mô phỏng",
            HUMAN_REVIEW: "Nhân viên xem xét",
          }[decision.handlingMode]
        }
      </p>
      {audience === "reviewer" && (
        <details className="rounded-xl bg-paper p-4 text-sm">
          <summary>Quy tắc và thông tin đã hiểu</summary>
          <dl className="mt-3 space-y-2">
            <div>
              <dt>Nhu cầu</dt>
              <dd>
                {intentName(canonical.intentLabel)} · {canonical.intentLabel}
              </dd>
            </div>
            <div>
              <dt>Rule IDs</dt>
              <dd>{decision.ruleIds.join(", ")}</dd>
            </div>
            <div>
              <dt>Mức rủi ro / nhóm</dt>
              <dd>
                {decision.riskLevel} / {decision.bucket}
              </dd>
            </div>
            <div>
              <dt>Dấu hiệu rủi ro</dt>
              <dd>{canonical.riskSignals.join(", ") || "Không phát hiện"}</dd>
            </div>
            <div>
              <dt>Thông tin còn thiếu</dt>
              <dd>
                {decision.missingFields.map(labelForField).join(", ") ||
                  "Không"}
              </dd>
            </div>
          </dl>
          <ul>
            {canonical.evidence.map((item, index) => (
              <li key={index} className="break-words whitespace-pre-wrap">
                <strong>{labelForField(item.field)}: </strong>
                {item.quote}
              </li>
            ))}
          </ul>
        </details>
      )}
      {canonical.model.failure && (
        <p className="text-sm text-amber-900">
          Trợ lý hiện chưa thể đưa ra hướng dẫn đáng tin cậy. Yêu cầu được
          chuyển cho nhân viên hỗ trợ.
          {audience === "reviewer" && ` (${canonical.model.failure})`}
        </p>
      )}
    </Card>
  );
}
