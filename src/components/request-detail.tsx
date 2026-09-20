"use client";
import { useEffect, useState } from "react";
import type { SupportRequest } from "@/domain/contracts";
import { allFields, fieldOptions, labelForField } from "@/domain/catalog";
import { browserApi } from "@/lib/browser-api";
import { Alert, Button, Card, Input, Textarea } from "./ui";
import { SupportResult } from "./support-result";
import { AssistanceHistory, AuditTimeline } from "./support-history";

export function RequestDetail({ id }: { id: string }) {
  const [request, setRequest] = useState<SupportRequest | null>(null),
    [error, setError] = useState("");
  const [pending, setPending] = useState(false),
    [clarification, setClarification] = useState(""),
    [fields, setFields] = useState<Record<string, string>>({});
  async function refresh() {
    try {
      setRequest(
        await browserApi<SupportRequest>(`/api/support/requests/${id}`),
      );
      setError("");
    } catch {
      setError("Không thể tải yêu cầu. Thử tải lại.");
    }
  }
  useEffect(() => {
    void browserApi<SupportRequest>(`/api/support/requests/${id}`)
      .then(setRequest)
      .catch(() => setError("Không thể tải yêu cầu."));
  }, [id]);
  async function update(path: string, body: object) {
    if (!request) return;
    setPending(true);
    setError("");
    try {
      setRequest(
        await browserApi<SupportRequest>(
          `/api/support/requests/${id}/${path}`,
          { ...body, version: request.version },
        ),
      );
      setClarification("");
      setFields({});
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật. Tải lại yêu cầu.",
      );
    } finally {
      setPending(false);
    }
  }
  const open =
    request &&
    !["RECEIVED", "PROCESSING", "COMPLETED", "STOPPED", "REJECTED"].includes(
      request.status,
    );
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-black">Yêu cầu hỗ trợ</h1>
      <p className="break-all text-sm text-slate-500">Mã yêu cầu: {id}</p>
      {error && <Alert tone="error">{error}</Alert>}
      {!request && !error && <p role="status">Đang tải…</p>}
      {request && (
        <>
          <p role="status">
            Trạng thái: <strong>{request.status}</strong>
          </p>
          {request.decision && request.canonical && (
            <SupportResult
              decision={request.decision}
              canonical={request.canonical}
            />
          )}
          <AssistanceHistory items={request.assistance} />
          {open && (
            <fieldset disabled={pending} className="space-y-3">
              {request.status === "AUTO_APPROVED" &&
                request.assistance.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {(
                      ["RESOLVED", "STILL_BROKEN", "CONFUSED", "ADMIN"] as const
                    ).map((choice, index) => (
                      <Button
                        key={choice}
                        variant={index === 0 ? "primary" : "secondary"}
                        onClick={() => void update("feedback", { choice })}
                      >
                        {request.assistance.at(-1)?.options[index]}
                      </Button>
                    ))}
                  </div>
                )}
              {request.status !== "ESCALATED" && (
                <Button
                  variant="secondary"
                  onClick={() => void update("feedback", { choice: "ADMIN" })}
                >
                  Tôi vẫn cần hỗ trợ — Chuyển cho admin
                </Button>
              )}
            </fieldset>
          )}
          {request.status === "NEEDS_INFORMATION" && (
            <Card>
              <h2 className="mb-3 font-bold">Bổ sung thông tin</h2>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void update("clarification", {
                    rawText: clarification,
                    fields,
                  });
                }}
              >
                <fieldset disabled={pending} className="space-y-4">
                  <label className="block">
                    Thông tin làm rõ
                    <Textarea
                      required
                      value={clarification}
                      onChange={(event) => setClarification(event.target.value)}
                      maxLength={4000}
                    />
                  </label>
                  {(request.decision?.missingFields ?? [])
                    .map((field) =>
                      field === "verifiedApproval"
                        ? "approvalReference"
                        : field,
                    )
                    .filter((field) => allFields.has(field))
                    .map((field) => (
                      <label className="block" key={field}>
                        {labelForField(field)}
                        {fieldOptions[field] ? (
                          <select
                            className="block min-h-10 w-full rounded border p-2"
                            value={fields[field] ?? ""}
                            onChange={(event) =>
                              setFields({
                                ...fields,
                                [field]: event.target.value,
                              })
                            }
                          >
                            <option value="">Chưa rõ</option>
                            {fieldOptions[field].map((value) => (
                              <option key={value}>{value}</option>
                            ))}
                          </select>
                        ) : (
                          <Input
                            maxLength={300}
                            value={fields[field] ?? ""}
                            onChange={(event) =>
                              setFields({
                                ...fields,
                                [field]: event.target.value,
                              })
                            }
                          />
                        )}
                      </label>
                    ))}
                  <Button type="submit">Gửi bổ sung</Button>
                </fieldset>
              </form>
            </Card>
          )}
          <Card>
            <h2 className="mb-4 font-bold">Lịch sử yêu cầu</h2>
            <AuditTimeline events={request.events} />
          </Card>
        </>
      )}
      <Button
        variant="secondary"
        disabled={pending}
        onClick={() => void refresh()}
      >
        Tải lại yêu cầu
      </Button>
    </div>
  );
}
