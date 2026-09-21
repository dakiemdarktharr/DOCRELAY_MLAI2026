import versioned from "../../mlai26_new/data/verify/support-v3.json";
import official from "../../mlai26_new/data/verify/verify_cases.json";
import synthetic from "../../mlai26_new/data/ground-truth/synthetic_tickets.json";
import extended from "../../mlai26_new/data/ground-truth/extended_ticket_cases.json";
import crossFunction from "../../mlai26_new/data/ground-truth/enterprise_cross_function_cases.json";
import {
  pendingReview,
  type AuditEvent,
  type SupportSummary,
  type Decision,
  type SupportRequest,
} from "@/domain/contracts";

export type VerifyCase = {
  id: string;
  pack: string;
  rawText: string;
  fields?: Record<string, string>;
  fault?: string;
  expected_action: string;
  expected_bucket: string;
  expected_rule?: string;
};
const originals = (
  rows: typeof official | typeof synthetic,
  pack: string,
): VerifyCase[] =>
  rows.map((row) => ({
    id: row.id,
    pack,
    rawText: row.ticket_content,
    expected_action: row.expected_action,
    expected_bucket: row.expected_bucket,
  }));
export const supportVerifyCases: VerifyCase[] = [
  ...versioned.map((row) => ({
    ...row,
    fields: row.fields
      ? Object.fromEntries(
          Object.entries(row.fields).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : undefined,
  })),
  ...originals(official, "official-original"),
  ...originals(synthetic, "ground-truth-original"),
  ...originals(extended, "ground-truth-original"),
  ...originals(crossFunction, "ground-truth-original"),
];
export type VerifyResult = {
  caseId: string;
  timestamp: string;
  requestId?: string;
  expected: { action: string; bucket: string; rule?: string };
  actual?: Decision;
  pass: boolean;
  persistence?: { pass: boolean; checks: string[] };
  error?: string;
};
// Browser and integration tests use this same HTTP contract. No direct policy shortcut.
export async function runSupportCase(
  item: VerifyCase,
  fetcher: typeof fetch = fetch,
): Promise<VerifyResult> {
  const result: VerifyResult = {
    caseId: item.id,
    timestamp: new Date().toISOString(),
    expected: {
      action: item.expected_action,
      bucket: item.expected_bucket,
      rule: item.expected_rule,
    },
    pass: false,
  };
  try {
    const response = await fetcher("/api/support/requests", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(item.fault ? { "x-support-model-simulation": item.fault } : {}),
      },
      body: JSON.stringify({
        rawText: item.rawText,
        fields: item.fields ?? {},
        confirmed: true,
        idempotencyKey: crypto.randomUUID(),
      }),
    });
    const body = await response.json();
    if (!response.ok || body.success !== true)
      return { ...result, error: body.error?.message ?? "API error" };
    const request = body.data as SupportRequest;
    const actual = request.decision;
    if (!actual)
      return {
        ...result,
        requestId: request.id,
        error: "Request đang xử lý; chưa có quyết định.",
      };
    const persistence = await verifyPersistence(request, fetcher);
    return {
      ...result,
      persistence,
      timestamp: request.updatedAt,
      requestId: request.id,
      actual,
      pass:
        persistence.pass &&
        actual.action === item.expected_action &&
        actual.bucket === item.expected_bucket &&
        (!item.expected_rule || actual.ruleIds.includes(item.expected_rule)),
    };
  } catch {
    return { ...result, error: "Không thể kết nối decision API." };
  }
}

// Read back through the public production contracts; a successful POST alone is not persistence evidence.
export async function verifyPersistence(
  request: SupportRequest,
  fetcher: typeof fetch = fetch,
) {
  const read = async <T>(path: string): Promise<T> => {
    const response = await fetcher(path, { cache: "no-store" });
    const body = await response.json();
    if (!response.ok || body.success !== true)
      throw new Error("Không đọc lại được hồ sơ qua API.");
    return body.data as T;
  };
  const [detail, events, queue, metrics] = await Promise.all([
    read<SupportRequest>(`/api/support/requests/${request.id}`),
    read<AuditEvent[]>(`/api/support/events?requestId=${request.id}`),
    read<SupportSummary[]>("/api/support/requests?view=summary"),
    read<{ total: number; pendingReview: number }>("/api/support/metrics"),
  ]);
  const checks = [
    detail.id === request.id &&
    detail.version >= request.version &&
    Boolean(detail.decision)
      ? "detail:pass"
      : "detail:fail",
    events.some(
      (event) =>
        event.requestId === request.id &&
        event.ruleIds.length &&
        event.actor &&
        event.action === "DECISION",
    )
      ? "audit:pass"
      : "audit:fail",
    queue.some((row) => row.id === request.id && row.version >= request.version)
      ? "queue:pass"
      : "queue:fail",
    metrics.total >= 1 &&
    metrics.pendingReview >= 0 &&
    metrics.pendingReview <= metrics.total &&
    (!pendingReview(request.status) || metrics.pendingReview >= 1)
      ? "metrics:pass"
      : "metrics:fail",
  ];
  return { pass: checks.every((check) => check.endsWith(":pass")), checks };
}
