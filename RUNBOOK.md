# VNG Support runbook

Current source/deployment evidence: [release matrix](docs/RELEASE-MATRIX.md). Local main is not automatically the deployed revision.

## Local QA

Use a clean clone of the exact manifest base and apply only the package-owned patch. Preserve any dirty checkout. Install dependencies with `npm ci` and generate local Prisma types using `npm run db:generate` (no database connection), then run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test:e2e` sequentially. Unit tests exercise a mocked default budget of 20; do not force AI_MAX_ATTEMPTS=0 across unit tests because the budget regression expects that default. E2E config independently sets attempts=0, mock/memory and empty credentials.

Playwright owns a fresh server at 127.0.0.1:3227 with reuseExistingServer=false. Check the port first; do not stop an unrelated process or reuse 3000. Build and E2E share .next and must not run concurrently. Do not stage timestamp/UUID/screenshot/video churn automatically. Never copy secrets to run local QA.

## Verify recovery

Open /verify, choose a pack, run, and retain the saved-run link. Pack/new-run/history controls lock while a saved run loads. Rate limits, transient server/network failures, pending request processing and unavailable readback leave the case unrecorded and retryable. Select Continue after recovery; the case reuses its request ID. A real policy mismatch, successful-but-failed persistence assertion or nonretryable validation error remains FAIL. No automatic retry consumes a new model request.

## Policy and measurement

With Tiến Khoa's package the candidate uses v5.2; recreate v5.0/v5.1 previews. Duy Anh's package alone keeps v5.1. Security/authority precedence stays deterministic. Cap ceiling remains 50; local mock defaults remain unchanged.

[Evaluation contract](docs/EVALUATION.md) applies when Tiến Khoa's package is installed. The additive endpoint computes declared-label reports without storing data or changing runtime policy. Held-out data cannot tune proposals. No authentic reviewer identity or internal entitlement is inferred from the public demo.

## Deployment boundary

Vercel + MongoDB is the recorded deployment architecture. render.yaml is a deprecated historical PostgreSQL blueprint and must not be selected as the current target. Deployment requires an explicit owner request, human review and fresh QA. Keep secrets, model counter, old knowledge revisions and existing database intact. After an authorized deployment record source SHA, policy, URL, deployment ID and actual synthetic live checks together in the release matrix. Do not reuse old receipts to claim new code is live.

[Historical runbook](docs/history/RUNBOOK-before-20727b5-fixes.md) is retained for provenance only.
