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
const selectClass =
  "min-h-11 w-full rounded-xl border border-line bg-white p-3 text-sm";
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-accent">
          VNG TECH SUPPORT · DEMO
        </p>
        <h1 className="mt-2 text-3xl font-black">Bạn cần hỗ trợ gì?</h1>
        <p className="mt-3 text-slate-600">
          Mô tả vấn đề hoặc chọn thông tin có sẵn. Không gửi mật khẩu, token hay
          dữ liệu thật.
        </p>
      </div>
      <Card>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void analyze();
          }}
          className="space-y-5"
        >
          <fieldset disabled={busy} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
            <label className="block space-y-2">
              <span>Cách nhập</span>
              <select
                className={selectClass}
                aria-label="Cách nhập"
                value={input.mode}
                onChange={(event) =>
                  edit({
                    mode: event.target.value as SupportInput["mode"],
                    fields: {},
                  })
                }
              >
                <option value="freeform">Mô tả tự do</option>
                <option value="structured">Chọn thông tin chi tiết</option>
              </select>
            </label>
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
                value={input.rawText}
                maxLength={6000}
                onChange={(event) => edit({ rawText: event.target.value })}
                placeholder="Ví dụ: VPN không kết nối, tôi nên kiểm tra gì?"
              />
            </label>
            <Button type="submit" disabled={busy}>
              {busy ? (
                <>
                  <Spinner />
                  <span className="ml-2">Đang xử lý…</span>
                </>
              ) : (
                "Xem hệ thống đã hiểu gì"
              )}
            </Button>
          </fieldset>
        </form>
      </Card>
      {error && <Alert tone="error">{error}</Alert>}
      {preview && (
        <>
          <SupportResult {...preview} />
          <Card className="space-y-3">
            <p>
              Kiểm tra thông tin trước khi gửi. Đây là demo synthetic; không có
              cấp quyền hay thay đổi hạ tầng thật.
            </p>
            <Button disabled={busy} onClick={() => void submit()}>
              Xác nhận và gửi yêu cầu
            </Button>
          </Card>
        </>
      )}
    </div>
  );
}
