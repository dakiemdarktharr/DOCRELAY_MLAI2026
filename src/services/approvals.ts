import type { CanonicalRequest, ServiceGroup } from "@/domain/contracts";
import type { Approval } from "@/domain/policy";
import { requiresApproval } from "@/domain/policy";
import { normalize } from "@/domain/text";

type DemoApproval = {
  reference: string;
  role: string;
  service: ServiceGroup;
  scope: Record<string, string>;
  expiresAt: string;
};

// Deliberately narrow synthetic server registry. These records only make the
// documented routine demo paths testable; they are not real people/resources.
const demoApprovals: DemoApproval[] = [
  {
    reference: "DEMO-1001",
    role: "service_owner_or_dba_delegate",
    service: "DATABASE",
    scope: {
      system: "postgresql",
      resourceScope: "demo_inventory",
      environment: "staging",
      permission: "read-only",
      duration: "2 hours",
    },
    expiresAt: "2027-01-01T00:00:00Z",
  },
  {
    reference: "DEMO-ACCOUNT-1001",
    role: "system_owner",
    service: "ACCOUNT_ACCESS",
    scope: {
      targetSystem: "jira-demo",
      environment: "staging",
      accessType: "standard",
      duration: "8 hours",
    },
    expiresAt: "2027-01-01T00:00:00Z",
  },
  {
    reference: "DEMO-GIT-1001",
    role: "repository_owner",
    service: "GIT_PERMISSION",
    scope: {
      provider: "github",
      repository: "docrelay-demo",
      permission: "write",
      duration: "8 hours",
    },
    expiresAt: "2027-01-01T00:00:00Z",
  },
  {
    reference: "DEMO-GPU-1001",
    role: "quota_or_budget_owner",
    service: "CLOUD_GPU",
    scope: {
      provider: "internal cloud",
      environment: "development",
      gpuType: "t4",
      quantity: "1",
      duration: "4 hours",
      purpose: "model testing",
      budgetOrQuota: "verified demo quota",
    },
    expiresAt: "2027-01-01T00:00:00Z",
  },
  {
    reference: "DEMO-LICENSE-1001",
    role: "license_or_budget_owner",
    service: "SOFTWARE_LICENSE",
    scope: {
      software: "demo ide",
      version: "1",
      os: "macos",
      approvedCatalogStatus: "approved",
      businessPurpose: "application development",
      licenseDuration: "30 days",
      licenseType: "named-user",
    },
    expiresAt: "2027-01-01T00:00:00Z",
  },
];

export function verifyApproval(
  request: CanonicalRequest,
  now = Date.now(),
): Approval {
  if (!requiresApproval(request))
    return { status: "not_required", scope: "matched" };
  const reference = request.entities.approvalReference;
  if (!reference) return { status: "pending", scope: "unknown" };
  const entry = demoApprovals.find(
    (approval) => approval.reference === reference,
  );
  if (!entry)
    return {
      status: "unverifiable",
      reference,
      scope: "unknown",
      reason: "Reference chưa tồn tại trong server-side registry.",
    };
  const metadata = {
    reference: entry.reference,
    authorizedRole: entry.role,
    expiresAt: entry.expiresAt,
  };
  if (Date.parse(entry.expiresAt) <= now)
    return {
      status: "expired",
      scope: "matched",
      reason: "Synthetic approval đã hết hạn.",
      ...metadata,
    };
  const scopeMatches =
    request.serviceGroup === entry.service &&
    Object.entries(entry.scope).every(([key, expected]) => {
      const actual =
        key === "environment" ? request.environment : request.entities[key];
      return normalize(actual ?? "") === normalize(expected);
    });
  if (!scopeMatches)
    return {
      status: "invalid",
      scope: "mismatched",
      reason:
        "Synthetic approval sai service/resource/environment/action/quyền hoặc thời hạn.",
      ...metadata,
    };
  return { status: "verified", scope: "matched", ...metadata };
}
