import type { CanonicalRequest } from "@/domain/contracts";
import type { Approval } from "@/domain/policy";
import { requiresApproval } from "@/domain/policy";
import { normalize } from "@/domain/text";

// Deliberately narrow synthetic server registry. A reference is not enough without matching scope.
// No person, real approval or production resource is represented here.
const demoApprovals = [
  {
    reference: "DEMO-1001",
    role: "service_owner_or_dba_delegate",
    service: "DATABASE",
    resource: "demo_inventory",
    system: "postgresql",
    environment: "staging",
    permission: "read-only",
    duration: "2 hours",
    expiresAt: "2027-01-01T00:00:00Z",
  },
];
export function verifyApproval(
  request: CanonicalRequest,
  now = Date.now(),
): Approval {
  if (!requiresApproval(request)) return { status: "not_required" };
  const reference = request.entities.approvalReference;
  if (!reference) return { status: "pending" };
  const entry = demoApprovals.find(
    (approval) => approval.reference === reference,
  );
  if (!entry)
    return {
      status: "pending",
      reason: "Reference chưa được registry xác minh.",
    };
  const e = request.entities;
  if (
    Date.parse(entry.expiresAt) <= now ||
    entry.role !== "service_owner_or_dba_delegate" ||
    request.serviceGroup !== entry.service ||
    normalize(e.system ?? "") !== entry.system ||
    e.resourceScope !== entry.resource ||
    request.environment !== entry.environment ||
    e.permission !== entry.permission ||
    normalize(e.duration ?? "") !== entry.duration
  )
    return {
      status: "invalid",
      reason:
        "Synthetic approval hết hạn hoặc sai resource/environment/permission/duration.",
    };
  return { status: "verified" };
}
