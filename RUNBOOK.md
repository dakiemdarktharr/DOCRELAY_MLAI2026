> Phát hành hai package: Chủ dự án đã yêu cầu rõ agent commit cả hai package và deploy để chuyển cho tester. Thay đổi là AI-assisted; việc commit theo yêu cầu này không chứng minh Tiến Khoa hoặc Duy Anh đã human review hay tự viết code. Source package dựa trên main 532b123c7f78a3d6c0dd03058ef113d255c272b7. Kết quả/receipt triển khai cũ ở phần dưới chỉ là lịch sử; đối chiếu SHA đang chạy qua /api/support/health trước khi dùng làm bằng chứng.

# VNG Support runbook

Current source/deployment evidence: [release matrix](docs/RELEASE-MATRIX.md). Local main is not automatically the deployed revision.

## Local QA

Use a clean clone of the source being verified. Main at 9d9ab05 already contains both release-fix packages; do not apply those patches again. For future packages, check their manifest base and apply only their owned patch. Preserve any dirty checkout. Install dependencies with `npm ci` and generate local Prisma types using `npm run db:generate` (no database connection), then run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e` sequentially. Unit tests exercise a mocked default budget of 20; do not force AI_MAX_ATTEMPTS=0 across unit tests because the budget regression expects that default. E2E config independently sets attempts=0, mock/memory and empty credentials.

Playwright owns a fresh server at 127.0.0.1:3227 with reuseExistingServer=false. Check the port first; do not stop an unrelated process or reuse 3000. Build and E2E share .next and must not run concurrently. Do not stage timestamp/UUID/screenshot/video churn automatically. Never copy secrets to run local QA.

## Verify recovery

Open /verify, choose a pack, run, and retain the saved-run link. Pack/new-run/history controls lock while a saved run loads. Rate limits, transient server/network failures, pending request processing and unavailable readback leave the case unrecorded and retryable. Select Continue after recovery; the case reuses its request ID. A real policy mismatch, successful-but-failed persistence assertion or nonretryable validation error remains FAIL. No automatic retry consumes a new model request.

## Policy and measurement

Inspected main 9d9ab05 uses v5.2; recreate v5.0/v5.1 previews. The integrated release fixes leave v5.2 unchanged. Security/authority precedence stays deterministic. Cap ceiling remains 50; local mock defaults remain unchanged.

[Evaluation contract](docs/EVALUATION.md) is already included in inspected main. The additive endpoint computes declared-label reports without storing data or changing runtime policy. Held-out data cannot tune proposals. No authentic reviewer identity or internal entitlement is inferred from the public demo.

## Deployment boundary

Vercel + MongoDB is the recorded deployment architecture. render.yaml is a deprecated historical PostgreSQL blueprint and must not be selected as the current target. Deployment requires an explicit owner request and fresh QA; record human review separately and never infer it from a commit. The owner explicitly authorized agent fixes, commit/push and Vercel deployment in this follow-up. Keep secrets, model counter, old knowledge revisions and existing database intact. Reuse the existing acne-a6cd/vng-support project. Set APP_REVISION to the committed source SHA for the deployment, then record source SHA, policy, URL, deployment ID and actual checks together in the release matrix. A read-only health ping is not a workflow-persistence or paid-model receipt. Do not reuse old receipts to claim new code is live.

[Historical runbook](docs/history/RUNBOOK-before-20727b5-fixes.md) is retained for provenance only.


## Release recheck corrections

Verify now checks `/api/support/requests?view=page&requestId=<UUID>&limit=1&origin=all` instead of assuming the request appears in the newest-200 summary list. The new filter uses exact identity, is UUID-validated, and does not change the legacy array contracts. Do not repair a false queue failure by deleting newer requests or widening an unbounded list. Genuine missing records, audit problems or persistence mismatches still fail verification.

Knowledge retrieval validates database document shapes before reviewed-content comparison. A malformed record is skipped while valid neighbors stay available. All-invalid returned rows give no Mongo matches; the code does not rewrite database documents. Actual storage outages still use the existing explicitly labeled local fallback. Use synthetic boundary tests before any authorized live verification.
