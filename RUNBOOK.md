> Current release work: main `7909f0c` has been integrated with policy v5.3, judge onboarding and QR access. The user authorized Vercel deployment after checks; see [release readiness](docs/VERCEL-READINESS.md). The older snapshot below is historical and does not establish the current deployed revision. The two-package requirement no longer applies.
> Package provenance: hai package AI-assisted, package base `532b123c7f78a3d6c0dd03058ef113d255c272b7`, current main head `bea350303d5812c7a72873e2cc592de9f9c2acf2`. Human review chưa được xác nhận; receipt triển khai cũ chỉ là lịch sử. Bản sửa tài liệu này không tạo project, đổi cấu hình hay deploy Vercel.

# VNG Support runbook

Current main head: `bea350303d5812c7a72873e2cc592de9f9c2acf2`. The package base `532b123c7f78a3d6c0dd03058ef113d255c272b7` is historical.

Current source/deployment evidence: [release matrix](docs/RELEASE-MATRIX.md). Local main is not automatically the deployed revision.

## Local QA

Use a clean clone of the source being verified. Current main is `bea350303d5812c7a72873e2cc592de9f9c2acf2`; the package base `532b123c7f78a3d6c0dd03058ef113d255c272b7` is already integrated, so do not apply those patches again. Earlier QA counts in this file are historical.

Playwright owns a fresh server at 127.0.0.1:3227 with reuseExistingServer=false. Check the port first; do not stop an unrelated process or reuse 3000. Build and E2E share .next and must not run concurrently. Do not stage timestamp/UUID/screenshot/video churn automatically. Never copy secrets to run local QA.

## Verify recovery

Open /verify, choose a pack, run, and retain the saved-run link. Pack/new-run/history controls lock while a saved run loads. Rate limits, transient server/network failures, pending request processing and unavailable readback leave the case unrecorded and retryable. Select Continue after recovery; the case reuses its request ID. A real policy mismatch, successful-but-failed persistence assertion or nonretryable validation error remains FAIL. No automatic retry consumes a new model request.

## Policy and measurement

Current main `bea350303d5812c7a72873e2cc592de9f9c2acf2` uses policy `support-guidance-v5.2`; the integrated package base is historical. Recreate v5.0/v5.1 previews only for historical regression checks.

[Evaluation contract](docs/EVALUATION.md) is already included in inspected main. The additive endpoint computes declared-label reports without storing data or changing runtime policy. Held-out data cannot tune proposals. No authentic reviewer identity or internal entitlement is inferred from the public demo.

## Deployment boundary

Vercel + MongoDB is the recorded deployment architecture. `render.yaml` is a deprecated historical PostgreSQL blueprint and must not be selected. This documentation-only correction does not run `vercel link`, `vercel init`, secret sync or deployment; those require separate explicit authorization. Keep secrets, model counter, old knowledge revisions and the existing database intact.

[Historical runbook](docs/history/RUNBOOK-before-20727b5-fixes.md) is retained for provenance only.


## Release recheck corrections

Verify now checks `/api/support/requests?view=page&requestId=<UUID>&limit=1&origin=all` instead of assuming the request appears in the newest-200 summary list. The new filter uses exact identity, is UUID-validated, and does not change the legacy array contracts. Do not repair a false queue failure by deleting newer requests or widening an unbounded list. Genuine missing records, audit problems or persistence mismatches still fail verification.

Knowledge retrieval validates database document shapes before reviewed-content comparison. A malformed record is skipped while valid neighbors stay available. All-invalid returned rows give no Mongo matches; the code does not rewrite database documents. Actual storage outages still use the existing explicitly labeled local fallback. Use synthetic boundary tests before any authorized live verification.
