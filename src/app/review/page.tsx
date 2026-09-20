"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RequestStatus, SupportRequest } from "@/domain/contracts";
import { canReview, type ReviewAction } from "@/domain/transitions";
import { browserApi } from "@/lib/browser-api";
import { Alert, Button, Card, Textarea } from "@/components/ui";
import { SupportResult } from "@/components/support-result";
import { AssistanceHistory, AuditTimeline } from "@/components/support-history";

export default function ReviewPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]),
    [selected, setSelected] = useState<SupportRequest | null>(null);
  const [reason, setReason] = useState(""),
    [target, setTarget] = useState<RequestStatus>("NEEDS_INFORMATION"),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  async function refresh() {
    try {
      setRequests(await browserApi<SupportRequest[]>("/api/support/requests"));
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Không thể tải queue.");
    }
  }
  useEffect(() => {
    void browserApi<SupportRequest[]>("/api/support/requests")
      .then(setRequests)
      .catch(() => setError("Không thể tải queue."));
  }, []);
  async function act(action: ReviewAction) {
    if (!selected) return;
    setPending(true);
    setError("");
    try {
      const updated = await browserApi<SupportRequest>(
        `/api/review/${selected.id}`,
        {
          action,
          reason,
          version: selected.version,
          ...(action === "OVERRIDE" ? { target } : {}),
        },
      );
      setSelected(updated);
      setReason("");
      await refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật; chọn lại yêu cầu để tải phiên bản mới.",
      );
    } finally {
      setPending(false);
    }
  }
  const labels: Record<ReviewAction, string> = {
    APPROVE: "Approve",
    REJECT: "Reject",
    REQUEST_INFORMATION: "Request information",
    STOP: "Stop",
    OVERRIDE: "Override",
    FULFILL: "Hoàn tất mô phỏng",
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Reviewer console</h1>
      <Alert>
        Demo công khai với dữ liệu giả lập. Approve và hoàn tất chỉ cập nhật hồ
        sơ mô phỏng, không cấp quyền hay thay đổi hạ tầng.
      </Alert>
      {error && <Alert tone="error">{error}</Alert>}
      <Button
        variant="secondary"
        onClick={() => void refresh()}
        disabled={pending}
      >
        Tải lại queue
      </Button>
      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <Card>
          <h2 className="mb-3 font-bold">
            Yêu cầu gần đây ({requests.length})
          </h2>
          {!requests.length && (
            <p>
              Chưa có yêu cầu.{" "}
              <Link className="text-accent underline" href="/workspace">
                Tạo yêu cầu demo
              </Link>
            </p>
          )}
          <ul className="space-y-3">
            {requests.map((request) => (
              <li key={request.id}>
                <button
                  disabled={pending}
                  onClick={() => {
                    setSelected(request);
                    setReason("");
                    setError("");
                  }}
                  className={`w-full rounded-lg border p-3 text-left text-sm ${selected?.id === request.id ? "border-accent bg-blue-50" : "border-line"}`}
                >
                  <span className="block font-semibold">
                    {request.input.rawText.slice(0, 80) ||
                      request.canonical?.intentLabel}
                  </span>
                  <span>{request.status}</span>
                  <span className="block text-xs">
                    {request.decision?.assignedTeam}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {selected ? (
          <div className="min-w-0 space-y-5">
            <p role="status" className="break-all text-sm">
              {selected.id} · v{selected.version} ·{" "}
              <strong>{selected.status}</strong>
            </p>
            <Card>
              <h2 className="font-bold">Intake đã redact</h2>
              <p className="my-3 whitespace-pre-wrap break-words">
                {selected.input.rawText}
              </p>
              <dl>
                {Object.entries(selected.input.fields).map(([key, value]) => (
                  <div className="mb-1 break-words" key={key}>
                    <dt className="inline font-semibold">{key}: </dt>
                    <dd className="inline">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
            {selected.decision && selected.canonical && (
              <>
                <SupportResult
                  decision={selected.decision}
                  canonical={selected.canonical}
                />
                <Card>
                  <h2 className="font-bold">Giải thích cho admin</h2>
                  <p>{selected.decision.adminReason}</p>
                  <p className="mt-2">
                    Risk signals:{" "}
                    {selected.canonical.riskSignals.join(", ") || "Không"}
                  </p>
                  <p>
                    Missing information:{" "}
                    {selected.decision.missingFields.join(", ") || "Không"}
                  </p>
                </Card>
              </>
            )}
            <AssistanceHistory items={selected.assistance} />
            <Card>
              <fieldset disabled={pending} className="space-y-4">
                <legend className="mb-3 font-bold">Xử lý của reviewer</legend>
                <label className="block">
                  Lý do (bắt buộc với Reject / Override)
                  <Textarea
                    maxLength={1000}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </label>
                <label className="block">
                  Trạng thái khi Override
                  <select
                    className="ml-2 max-w-full rounded border p-2"
                    value={target}
                    onChange={(event) =>
                      setTarget(event.target.value as RequestStatus)
                    }
                  >
                    <option value="NEEDS_INFORMATION">NEEDS_INFORMATION</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="APPROVED_BY_HUMAN">APPROVED_BY_HUMAN</option>
                  </select>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(labels) as ReviewAction[]).map((action) => (
                    <Button
                      key={action}
                      variant={
                        action === "STOP" || action === "REJECT"
                          ? "danger"
                          : "secondary"
                      }
                      disabled={
                        !canReview(selected.status, action) ||
                        (["REJECT", "OVERRIDE"].includes(action) &&
                          reason.trim().length < 8) ||
                        (selected.decision?.bucket === "SECURITY_RISK" &&
                          (action === "APPROVE" ||
                            action === "FULFILL" ||
                            (action === "OVERRIDE" &&
                              target === "APPROVED_BY_HUMAN"))) ||
                        (action === "FULFILL" &&
                          selected.status === "AUTO_APPROVED" &&
                          selected.decision?.handlingMode !==
                            "SIMULATED_WORKFLOW")
                      }
                      onClick={() => void act(action)}
                    >
                      {labels[action]}
                    </Button>
                  ))}
                </div>
              </fieldset>
            </Card>
            <Card>
              <h2 className="mb-4 font-bold">Audit timeline</h2>
              <AuditTimeline events={selected.events} />
            </Card>
          </div>
        ) : (
          <p>Chọn một yêu cầu để xem intent, policy và lịch sử.</p>
        )}
      </div>
    </div>
  );
}
