"use client";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ResultPage,
  type SupportSummary,
  type RequestStatus,
  type SupportRequest,
} from "@/domain/contracts";
import { displayId, statusLabels, optionName } from "@/domain/presentation";
import { catalog, labelForField } from "@/domain/catalog";
import { canReview, type ReviewAction } from "@/domain/transitions";
import { browserApi } from "@/lib/browser-api";
import { Alert, Badge, Button, Card, Textarea } from "@/components/ui";
import { SupportResult } from "@/components/support-result";
import { AssistanceHistory, AuditTimeline } from "@/components/support-history";

export function ReviewConsole({ requestId }: { requestId?: string }) {
  const sequence = useRef(0);
  const [requests, setRequests] = useState<SupportSummary[]>([]),
    [selected, setSelected] = useState<SupportRequest | null>(null);
  const [reason, setReason] = useState(""),
    [target, setTarget] = useState<RequestStatus>("NEEDS_INFORMATION"),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [origin, setOrigin] = useState("support");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const refresh = useCallback(
    async (cursor: string | null = null) => {
      const current = ++sequence.current;
      try {
        const params = new URLSearchParams({
          view: "page",
          q: search,
          status: filter,
          origin,
          limit: "30",
          ...(cursor ? { cursor } : {}),
        });
        const page = await browserApi<ResultPage<SupportSummary>>(
          `/api/support/requests?${params}`,
        );
        if (current !== sequence.current) return;
        setRequests((previous) =>
          cursor ? [...previous, ...page.items] : page.items,
        );
        setNextCursor(page.nextCursor);
        setTotal(page.total);
        setError("");
      } catch (error) {
        if (current === sequence.current)
          setError(
            error instanceof Error ? error.message : "Không thể tải danh sách.",
          );
      }
    },
    [search, filter, origin],
  );
  useEffect(() => {
    const tracker = sequence;
    const timer = setTimeout(() => void refresh(), 250);
    return () => {
      clearTimeout(timer);
      tracker.current++;
    };
  }, [refresh]);
  useEffect(() => {
    if (!requestId) return;
    void browserApi<SupportRequest>(
      `/api/support/requests/${encodeURIComponent(requestId)}`,
    )
      .then(setSelected)
      .catch(() => setError("Không thể tải yêu cầu."));
  }, [requestId]);
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
    APPROVE: "Duyệt yêu cầu",
    REJECT: "Từ chối",
    REQUEST_INFORMATION: "Hỏi thêm thông tin",
    STOP: "Dừng xử lý",
    OVERRIDE: "Điều chỉnh quyết định",
    FULFILL: "Hoàn tất mô phỏng",
  };
  const visibleRequests = requests;
  return (
    <main className="page page-enter space-y-6">
      <div>
        <p className="eyebrow">KHÔNG GIAN NHÂN VIÊN</p>
        <h1>Tiếp nhận hỗ trợ</h1>
      </div>

      {error && <Alert tone="error">{error}</Alert>}
      <div>
        {!requestId && (
          <Card>
            <div className="section-heading">
              <h2>Yêu cầu phù hợp ({total})</h2>
              <Button
                variant="secondary"
                onClick={() => void refresh()}
                disabled={pending}
              >
                Tải lại danh sách
              </Button>
            </div>
            <label>
              Tìm theo nội dung hoặc mã yêu cầu
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="max-w-sm">
              Hiển thị
              <select
                aria-label="Hiển thị"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="pending">Đang chờ xử lý</option>
                <option value="all">Tất cả trạng thái</option>
              </select>
            </label>
            <label>
              Nguồn yêu cầu
              <select
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              >
                <option value="support">Người dùng gửi</option>
                <option value="verify">Case Verify</option>
                <option value="all">Tất cả</option>
              </select>
            </label>
            {!visibleRequests.length && (
              <div className="text-center py-6">
                <Image
                  src="/illustrations/support-mascot.png"
                  width={110}
                  height={110}
                  alt=""
                  className="mx-auto rounded-full"
                />
                <p>
                  Chưa có yêu cầu phù hợp.{" "}
                  <Link className="text-accent underline" href="/send-help">
                    Tạo yêu cầu demo
                  </Link>
                </p>
              </div>
            )}
            <ul className="review-list">
              {visibleRequests.map((request) => (
                <li key={request.id}>
                  <Link
                    href={`/review?requestId=${request.id}`}
                    className="support-row"
                  >
                    <Badge
                      tone={
                        request.status === "ESCALATED" ? "warning" : "neutral"
                      }
                    >
                      {statusLabels[request.status]}
                    </Badge>
                    <span className="block font-semibold">{request.title}</span>
                    <span className="block text-xs">
                      {displayId(request.id)} ·{" "}
                      {catalog[request.serviceGroup].label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p>
              Đang hiển thị {requests.length}/{total} yêu cầu.
            </p>
            {nextCursor && (
              <Button
                variant="secondary"
                onClick={() => void refresh(nextCursor)}
              >
                Tải thêm yêu cầu
              </Button>
            )}
          </Card>
        )}
        {requestId && selected ? (
          <div className="min-w-0 space-y-5">
            <Link href="/review" className="button secondary">
              ← Danh sách yêu cầu
            </Link>
            <p role="status" className="break-all text-sm">
              {displayId(selected.id)} ·{" "}
              <strong>{statusLabels[selected.status]}</strong>
            </p>
            <div className="flex flex-wrap gap-3">
              <a className="button secondary" href="#review-actions">
                Dừng / điều chỉnh xử lý
              </a>
              <a className="button secondary" href="#request-audit">
                Xem nhật ký quyết định
              </a>
            </div>
            <details>
              <summary>Mã đối chiếu kỹ thuật</summary>
              <p className="break-all">
                {selected.id} · phiên bản {selected.version}
              </p>
            </details>
            <div className="support-columns review-comparison">
              <Card>
                <h2 className="font-bold">
                  Nội dung đã che thông tin nhạy cảm
                </h2>
                <p className="my-3 whitespace-pre-wrap break-words">
                  {selected.input.rawText}
                </p>
                <dl>
                  {Object.entries(selected.input.fields).map(([key, value]) => (
                    <div className="mb-1 break-words" key={key}>
                      <dt className="inline font-semibold">
                        {labelForField(key)}:{" "}
                      </dt>
                      <dd className="inline">{optionName(value)}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
              {selected.decision && selected.canonical && (
                <SupportResult
                  decision={selected.decision}
                  canonical={selected.canonical}
                  audience="reviewer"
                />
              )}
            </div>
            {selected.decision && selected.canonical && (
              <Card>
                <h2 className="font-bold">Giải thích cho admin</h2>
                <p>{selected.decision.adminReason}</p>
                <p className="mt-2">
                  Dấu hiệu rủi ro:{" "}
                  {selected.canonical.riskSignals.join(", ") || "Không"}
                </p>
                <p>
                  Thông tin còn thiếu:{" "}
                  {selected.decision.missingFields
                    .map(labelForField)
                    .join(", ") || "Không"}
                </p>
              </Card>
            )}
            <AssistanceHistory items={selected.assistance} />
            {selected.stepExplanations?.map((item, index) => (
              <Card key={index}>
                <h2>Giải thích bước {item.step + 1}</h2>
                <p>{item.text}</p>
              </Card>
            ))}
            <Card id="review-actions">
              <p className="mb-3">
                Dừng xử lý chặn các bước tiếp theo. Điều chỉnh quyết định luôn
                cần lý do và được ghi vào nhật ký; không xóa lịch sử hoặc hoàn
                tác hạ tầng thật.
              </p>
              {(!!selected.decision?.missingFields.length ||
                selected.decision?.bucket === "SECURITY_RISK") && (
                <p className="mb-3 text-sm text-amber-900">
                  Chưa thể duyệt: cần đủ thông tin, phê duyệt đúng phạm vi và
                  không thuộc yêu cầu rủi ro bảo mật.
                </p>
              )}
              <fieldset disabled={pending} className="space-y-4">
                <legend className="mb-3 font-bold">Thao tác xử lý</legend>
                <label className="block">
                  Lý do (bắt buộc cho mọi quyết định của reviewer)
                  <Textarea
                    maxLength={1000}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </label>
                <label className="block">
                  Trạng thái sau điều chỉnh
                  <select
                    className="ml-2 max-w-full rounded border p-2"
                    value={target}
                    onChange={(event) =>
                      setTarget(event.target.value as RequestStatus)
                    }
                  >
                    <option value="NEEDS_INFORMATION">
                      Cần bổ sung thông tin
                    </option>
                    <option value="REJECTED">Từ chối</option>
                    <option value="APPROVED_BY_HUMAN">Đã duyệt</option>
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
                        reason.trim().length < 8 ||
                        (["APPROVE", "FULFILL"].includes(action) &&
                          (selected.status === "NEEDS_INFORMATION" ||
                            selected.decision?.action === "NEEDS_INFORMATION" ||
                            Boolean(
                              selected.decision?.missingFields.length,
                            ))) ||
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
            <Card id="request-audit">
              <h2 className="mb-4 font-bold">Lịch sử xử lý</h2>
              <AuditTimeline events={selected.events} />
            </Card>
          </div>
        ) : requestId && !error ? (
          <p role="status">Đang tải yêu cầu…</p>
        ) : null}
      </div>
    </main>
  );
}
