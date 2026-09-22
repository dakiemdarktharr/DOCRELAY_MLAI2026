# Policy review and refinement record

> Đây là biên bản review lịch sử của policy-v2. Các mục “remaining implementation work” mô tả trạng thái trước khi runtime hiện tại được tích hợp; runtime hiện tại dùng `src/domain/policy-source.ts`, `src/domain/policy.ts` và policy `support-guidance-v5.2`.

Date: `2026-09-20`  
Policy version after review: `policy-v2`  
Scope: synthetic/proposed challenge policy only; not an official VNG policy.

## High-impact findings fixed in policy-v2

| Severity | Finding | Risk before refinement | Policy-v2 treatment |
|---|---|---|---|
| P0 | `lead approved` was accepted as approval in a routine example. | A user could self-assert approval and obtain an automatic decision. | Split `approval_claim`, `approval_reference`, verification status, authority role, scope match and expiry. Only server-side verification can set `verified`. |
| P0 | Policy said raw input is always retained while also forbidding secret exposure. | Tokens/passwords could be sent to the model or retained in audit. | Redact secret values before model, storage, audit and UI; keep only redaction marker and safe evidence. |
| P1 | Routing rows used outcomes such as `AUTO_APPROVE_OR_NEEDS_INFORMATION`. | A TypeScript implementation could choose a result arbitrarily. | Routing matrix now has explicit outcomes for complete, missing/unverified and high-risk requests. |
| P1 | No explicit map from request scope to authorized approver. | A manager/lead could be treated as service, data, quota or security authority. | Added `approval-authority-matrix.csv`; it distinguishes business approval from technical authorization. |
| P1 | Structured/free-text conflict and bundled requests had no complete deterministic handling. | A dangerous subrequest could inherit a safe decision. | Added conflict, split and maximum-risk invariants plus `AUTH-006`. |
| P1 | Production/customer-data export was not explicitly a security rule. | A dump to a private repo/laptop might not match a high-risk rule. | Added `SEC-005` and corresponding glossary vocabulary. |
| P1 | `AUTO_APPROVE` could be read as direct provisioning authority. | Workflow classification might be confused with permission execution. | Policy now states auto approval is a safe workflow/demo decision; privileged execution remains blocked. |

## Remaining implementation work — owned by the decision-engine integration

- Add typed TypeScript contracts for the approval evidence fields and canonical request/subrequest model.
- Implement a server-side synthetic approval verifier/registry. The LLM and browser must never produce `verified` status.
- Implement redaction before any LLM, persistence, audit or UI boundary.
- Evaluate each split subrequest and select the highest-risk outcome for the parent ticket.
- Add tests for all rule IDs, precedence, role/scope mismatch, expiry, redaction, conflict and bundled-request behavior.

## Cross-file issue not changed here

`data/verify/verify_cases.json` currently labels `verify-003-etl-missing-specs` as `expected_action: ESCALATE` while the policy action for `MISSING_INFO` is `NEEDS_INFORMATION`.

This should be resolved by the dataset/decision-engine owners before the Verify harness is wired: either represent a missing-information handoff as `NEEDS_INFORMATION`, or document a separate display status that maps it to an escalation queue. The policy remains explicit that missing facts use `NEEDS_INFORMATION`.

## Handoff note

The policy author owns this rule meaning and must approve semantic changes. The decision-engine owner may convert the files into TypeScript/config, but must not weaken approval verification, secret redaction, precedence or conflict handling.
