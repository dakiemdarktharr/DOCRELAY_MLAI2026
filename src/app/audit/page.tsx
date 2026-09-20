"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { AuditEvent } from "@/domain/contracts";
import { browserApi } from "@/lib/browser-api";
import { Alert, Button, Card, Input } from "@/components/ui";
import { AuditTimeline } from "@/components/support-history";
export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]),
    [id, setId] = useState(""),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  const [metrics, setMetrics] = useState<{
    total: number;
    resolvedFeedback: number;
    handoffs: number;
    modelFailures: number;
    pendingReview: number;
  } | null>(null);
  useEffect(() => {
    void browserApi<AuditEvent[]>("/api/support/events")
      .then(setEvents)
      .catch(() => setError("Không thể tải audit."));
    void browserApi<typeof metrics>("/api/support/metrics")
      .then(setMetrics)
      .catch(() => setError("Không thể tải metrics."));
  }, []);
  async function load() {
    setPending(true);
    try {
      setEvents(
        await browserApi<AuditEvent[]>(
          `/api/support/events${id ? `?requestId=${encodeURIComponent(id)}` : ""}`,
        ),
      );
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Không thể tải audit.");
    } finally {
      setPending(false);
    }
  }
  return (
    <main className="page page-narrow space-y-6">
      <div>
        <p className="eyebrow">APPEND-ONLY AUDIT</p>
        <h1>Mỗi quyết định, một dấu vết.</h1>
      </div>
      <p className="text-sm text-slate-600">
        300 event mới nhất trong 200 hồ sơ demo gần đây. Lọc theo mã yêu cầu để
        xem toàn bộ timeline của hồ sơ đó.
      </p>
      {metrics && (
        <Card>
          <p>
            Hồ sơ: {metrics.total} · Đã tự giải quyết:{" "}
            {metrics.resolvedFeedback} · Chuyển người: {metrics.handoffs} · Lỗi
            model: {metrics.modelFailures} · Chờ review: {metrics.pendingReview}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Số đếm dữ liệu synthetic; không phải độ chính xác trên dữ liệu
            production.
          </p>
        </Card>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="min-w-0 flex-1">
          Mã yêu cầu
          <Input
            value={id}
            onChange={(event) => setId(event.target.value)}
            placeholder="UUID hoặc để trống"
          />
        </label>
        <Button disabled={pending}>Lọc / tải lại</Button>
      </form>
      {error && <Alert tone="error">{error}</Alert>}
      <Card>
        {events.length ? (
          <AuditTimeline events={events} />
        ) : (
          <p>Chưa có event phù hợp.</p>
        )}
      </Card>
      <Link className="text-accent underline" href="/legacy/audit">
        Generic event log (compatibility)
      </Link>
    </main>
  );
}
