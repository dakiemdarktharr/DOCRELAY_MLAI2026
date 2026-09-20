"use client";
import Link from "next/link";
import { useState } from "react";
import {
  supportVerifyCases,
  runSupportCase,
  type VerifyResult,
} from "@/lib/support-verify";
import { Alert, Button, Card, Textarea } from "@/components/ui";
import { browserApi } from "@/lib/browser-api";
import type { SupportRequest } from "@/domain/contracts";
import { SupportResult } from "@/components/support-result";

export default function VerifyPage() {
  const [pack, setPack] = useState("de-a-v3"),
    [results, setResults] = useState<VerifyResult[]>([]),
    [running, setRunning] = useState(false);
  const [judge, setJudge] = useState(""),
    [judged, setJudged] = useState<SupportRequest | null>(null),
    [error, setError] = useState("");
  const cases =
    pack === "all"
      ? supportVerifyCases
      : supportVerifyCases.filter((item) => item.pack === pack);
  async function run() {
    setRunning(true);
    setResults([]);
    setError("");
    try {
      for (const item of cases) {
        const result = await runSupportCase(item);
        setResults((current) => [...current, result]);
      }
    } finally {
      setRunning(false);
    }
  }
  async function runJudge() {
    setRunning(true);
    setError("");
    try {
      setJudged(
        await browserApi<SupportRequest>("/api/support/requests", {
          rawText: judge,
          confirmed: true,
          idempotencyKey: crypto.randomUUID(),
        }),
      );
      setJudge("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "API error");
    } finally {
      setRunning(false);
    }
  }
  return (
    <main className="page space-y-6">
      <div>
        <p className="eyebrow">VERIFY · ĐỀ A</p>
        <h1>Đối chiếu, không đoán.</h1>
      </div>
      <Alert>
        Mỗi case gọi POST /api/support/requests, cùng API với workspace. Bộ Đề A
        v3 có 3 auto / 2 escalate. Fixture gốc được giữ nguyên; mismatch phản
        ánh thay đổi policy, không tự đổi expected.
      </Alert>
      <fieldset disabled={running} className="flex flex-wrap items-end gap-3">
        <label>
          Bộ kiểm thử
          <select
            className="mt-1 block max-w-full rounded border p-3"
            value={pack}
            onChange={(event) => {
              setPack(event.target.value);
              setResults([]);
            }}
          >
            <option value="de-a-v3">
              Đề A v3 — 5 case (3 auto / 2 escalate)
            </option>
            <option value="extended-v3">
              Migration v3 — hướng dẫn, model, conflict
            </option>
            <option value="official-original">
              Verify gốc — expected không sửa
            </option>
            <option value="ground-truth-original">
              Ground Truth gốc — 123 case
            </option>
            <option value="all">Toàn bộ các bộ kiểm thử</option>
          </select>
        </label>
        <Button onClick={() => void run()}>
          Chạy toàn bộ test ({cases.length})
        </Button>
      </fieldset>
      <p role="status">
        {running ? "Đang chạy… " : ""}
        {results.length}/{cases.length} · Pass:{" "}
        {results.filter((result) => result.pass).length} · Fail:{" "}
        {results.filter((result) => !result.pass).length}
      </p>
      {error && <Alert tone="error">{error}</Alert>}
      <div className="space-y-3">
        {results.map((result) => (
          <Card key={result.caseId}>
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-bold">{result.caseId}</h2>
              <strong
                className={result.pass ? "text-emerald-700" : "text-red-700"}
              >
                {result.pass ? "PASS" : "FAIL"}
              </strong>
            </div>
            <p className="text-xs text-slate-500">{result.timestamp}</p>
            <p>
              Expected: {result.expected.action} · {result.expected.bucket}{" "}
              {result.expected.rule && `· ${result.expected.rule}`}
            </p>
            <p>
              Actual: {result.actual?.action ?? "ERROR"} ·{" "}
              {result.actual?.bucket}
            </p>
            <p>Rule IDs: {result.actual?.ruleIds.join(", ") ?? "—"}</p>
            <p>{result.actual?.adminReason ?? result.error}</p>
            {supportVerifyCases.find((item) => item.id === result.caseId)
              ?.fault && (
              <p className="text-sm text-amber-800">
                Fault injection của adapter model (mô phỏng lỗi, không phải mất
                kết nối thật).
              </p>
            )}
            {result.requestId && (
              <Link
                className="text-accent underline"
                href={`/requests/${result.requestId}`}
              >
                Mở request / audit
              </Link>
            )}
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="mb-3 text-xl font-bold">Judge input mới</h2>
        <p className="mb-3 text-sm">
          Nhập một yêu cầu chưa có trong fixture. Kết quả lưu thành hồ sơ demo
          để kiểm tra reviewer và audit.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void runJudge();
          }}
          className="space-y-3"
        >
          <label className="block">
            Yêu cầu tự do
            <Textarea
              value={judge}
              onChange={(event) => setJudge(event.target.value)}
              maxLength={6000}
              required
            />
          </label>
          <Button disabled={running || !judge.trim()}>
            Đánh giá input mới
          </Button>
        </form>
        {judged?.decision && judged.canonical && (
          <div className="mt-4 space-y-3">
            <SupportResult
              decision={judged.decision}
              canonical={judged.canonical}
            />
            <Link
              className="text-accent underline"
              href={`/requests/${judged.id}`}
            >
              Xem hướng dẫn / chuyển admin
            </Link>
          </div>
        )}
      </Card>
      <Link className="text-accent underline" href="/legacy/verify">
        Generic echo Verify (compatibility)
      </Link>
    </main>
  );
}
