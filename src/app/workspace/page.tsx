"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  catalog,
  commonFields,
  fieldOptions,
  labelForField,
} from "@/domain/catalog";
import {
  requestKinds,
  serviceGroups,
  type CanonicalRequest,
  type Decision,
  type SupportInput,
  type SupportRequest,
  type ServiceGroup,
  type RequestKind,
} from "@/domain/contracts";
import { browserApi } from "@/lib/browser-api";
import { Alert, Button, Card, Input, Spinner, Textarea } from "@/components/ui";
import { SupportResult } from "@/components/support-result";

type Preview = {
  input: SupportInput;
  canonical: CanonicalRequest;
  decision: Decision;
};
const selectClass = "min-h-11 w-full";
const kinds: Record<RequestKind, string> = {
  GUIDANCE: "Hỏi cách thực hiện",
  SAFE_DIAGNOSTIC: "Chẩn đoán sự cố",
  ROUTINE_WORKFLOW: "Workflow thông thường",
  ACCESS_REQUEST: "Yêu cầu quyền",
  CONFIGURATION_CHANGE: "Thay đổi cấu hình",
  INCIDENT: "Báo incident",
  OTHER: "Chưa rõ",
};

export default function WorkspacePage() {
  const router = useRouter();
  const [input, setInput] = useState<SupportInput>({
    mode: "freeform",
    serviceGroup: "OTHER",
    rawText: "",
    fields: {},
    confirmed: false,
    idempotencyKey: "",
  });
  const [preview, setPreview] = useState<Preview | null>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function edit(next: Partial<SupportInput>) {
    setInput((current) => ({ ...current, ...next }));
    setPreview(null);
    setError("");
  }
  async function analyze() {
    setBusy(true);
    setError("");
    try {
      const value = await browserApi<Preview>("/api/support/preview", {
        ...input,
        idempotencyKey: crypto.randomUUID(),
      });
      setInput(value.input);
      setPreview(value);
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "Không thể phân tích.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function submit() {
    if (!preview || busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await browserApi<SupportRequest>("/api/support/requests", {
        ...preview.input,
        confirmed: true,
      });
      router.push(`/requests/${result.id}`);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Không thể gửi.");
      setBusy(false);
    }
  }
  const fields = [
    ...new Set([...commonFields, ...catalog[input.serviceGroup].fields]),
  ];
  return (
    <main className="page page-enter">
      <div>
        <p className="eyebrow">EMPLOYEE SUPPORT</p>
        <h1>I Need Help</h1>
        <p className="page-description">
          Chọn cách gửi. Kiểm tra. Chuyển đúng người.
        </p>
      </div>
      <div className="support-actions" role="group" aria-label="Kiểu yêu cầu">
        {(["freeform", "structured"] as const).map((mode) => (
          <Button
            key={mode}
            variant={input.mode === mode ? "primary" : "secondary"}
            aria-pressed={input.mode === mode}
            disabled={busy || !!preview}
            onClick={() => edit({ mode, fields: {}, requestKind: undefined })}
          >
            {mode === "freeform" ? "Freeform · Mô tả" : "Structured · Chọn mục"}
          </Button>
        ))}
      </div>
      <div className="support-columns">
        <Card>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (preview) void submit();
              else void analyze();
            }}
            className="space-y-5"
          >
            <fieldset
              disabled={busy || !!preview}
              className="intake-fields space-y-5"
            >
              <div
                className={
                  input.mode === "structured" ? "grid gap-4 sm:grid-cols-2" : ""
                }
              >
                <label className="space-y-2">
                  <span>Nhóm hỗ trợ</span>
                  <select
                    aria-label="Nhóm hỗ trợ"
                    className={selectClass}
                    value={input.serviceGroup}
                    onChange={(event) =>
                      edit({
                        serviceGroup: event.target.value as ServiceGroup,
                        fields: {},
                      })
                    }
                  >
                    {serviceGroups.map((group) => (
                      <option key={group} value={group}>
                        {catalog[group].label}
                      </option>
                    ))}
                  </select>
                </label>
                {input.mode === "structured" && (
                  <label className="space-y-2">
                    <span>Loại yêu cầu</span>
                    <select
                      aria-label="Loại yêu cầu"
                      className={selectClass}
                      value={input.requestKind ?? ""}
                      onChange={(event) =>
                        edit({
                          requestKind: event.target.value
                            ? (event.target.value as RequestKind)
                            : undefined,
                        })
                      }
                    >
                      <option value="">Để hệ thống nhận diện</option>
                      {requestKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {kinds[kind]}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
              {input.mode === "structured" && (
                <>
                  <label className="block space-y-2">
                    <span>Nhu cầu cụ thể</span>
                    <select
                      className={selectClass}
                      aria-label="Nhu cầu cụ thể"
                      value={input.fields.intentLabel ?? ""}
                      onChange={(event) =>
                        edit({
                          fields: {
                            ...input.fields,
                            intentLabel: event.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Chọn nhu cầu</option>
                      {catalog[input.serviceGroup].labels.map((label) => (
                        <option key={label} value={label}>
                          {label.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                  <details>
                    <summary className="cursor-pointer font-semibold">
                      Thông tin bổ sung theo nhóm
                    </summary>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {fields.map((field) => (
                        <label className="space-y-2" key={field}>
                          <span>{labelForField(field)}</span>
                          {fieldOptions[field] ? (
                            <select
                              aria-label={labelForField(field)}
                              className={selectClass}
                              value={input.fields[field] ?? ""}
                              onChange={(event) =>
                                edit({
                                  fields: {
                                    ...input.fields,
                                    [field]: event.target.value,
                                  },
                                })
                              }
                            >
                              <option value="">Chưa cung cấp</option>
                              {fieldOptions[field].map((value) => (
                                <option key={value} value={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              aria-label={labelForField(field)}
                              maxLength={300}
                              value={input.fields[field] ?? ""}
                              onChange={(event) =>
                                edit({
                                  fields: {
                                    ...input.fields,
                                    [field]: event.target.value,
                                  },
                                })
                              }
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </details>
                </>
              )}
              <label className="block space-y-2">
                <span>
                  Mô tả yêu cầu{" "}
                  {input.mode === "structured" ? "(không bắt buộc)" : ""}
                </span>
                <Textarea
                  aria-label="Mô tả yêu cầu"
                  rows={7}
                  required={input.mode === "freeform"}
                  value={input.rawText}
                  maxLength={6000}
                  onChange={(event) => edit({ rawText: event.target.value })}
                  placeholder="Ví dụ: VPN không kết nối, tôi nên kiểm tra gì?"
                />
              </label>
            </fieldset>
            {error && <Alert tone="error">{error}</Alert>}
            {preview && (
              <section
                className="support-preview"
                aria-label="Kiểm tra dữ kiện"
              >
                <h2>Mình đã hiểu như sau</h2>
                <p>
                  {catalog[preview.canonical.serviceGroup].label} ·{" "}
                  {preview.canonical.intentLabel}
                </p>
                <p className="whitespace-pre-wrap">
                  {preview.input.rawText || "Yêu cầu từ form structured"}
                </p>
                <p className="text-sm">
                  Kiểm tra kết quả bên cạnh trước khi gửi. Bạn có thể quay lại
                  sửa thông tin.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => edit({ confirmed: false })}
                >
                  Quay lại sửa
                </Button>
              </section>
            )}
            <Button type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Spinner />
                  <span className="ml-2">Đang xử lý…</span>
                </>
              ) : preview ? (
                "Xác nhận và gửi yêu cầu"
              ) : (
                "Xem hệ thống đã hiểu gì"
              )}
            </Button>
          </form>
        </Card>
        <aside aria-label="Hướng dẫn gửi yêu cầu">
          {preview ? (
            <SupportResult {...preview} />
          ) : (
            <Card className="support-note">
              <p className="eyebrow">AI TRÍCH XUẤT · POLICY QUYẾT ĐỊNH</p>
              <h2>Có người kiểm tra.</h2>
              <p>
                Yêu cầu đơn giản nhận hướng dẫn ngay. Khi thiếu dữ kiện, hệ
                thống hỏi đúng thông tin cần bổ sung.
              </p>
              <p>
                Cần thêm hỗ trợ? Chuyển cho admin cùng lịch sử hướng dẫn. Yêu
                cầu có rủi ro luôn qua người phụ trách.
              </p>
              <hr className="my-5 border-line" />
              <p className="text-sm">
                Demo synthetic. Không gửi mật khẩu, token hay dữ liệu thật.
                Không có thao tác cấp quyền hoặc thay đổi hạ tầng thật.
              </p>
            </Card>
          )}
        </aside>
      </div>
    </main>
  );
}
