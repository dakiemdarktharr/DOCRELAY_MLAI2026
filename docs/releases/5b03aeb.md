# Vercel release receipt — 5b03aeb

The user explicitly requested a complete repository check followed by Vercel deployment. This records AI-assisted implementation and observed checks, not human review or a claim that every possible defect is absent.

## Deployed source

- Source: `5b03aeb634c55ccffd559860b2b5720da2de620d`, branch `codex/evidence-workflow-followup`.
- Includes main `7909f0cc8f99629f114b528cde8a989450bc1de7`, diagnosis/evidence-first workflow, judge onboarding, QR access and dependency fixes. No existing main functionality was intentionally removed.
- Existing project: `acne-a6cd/vng-support`, ID `prj_hmxBwMixxSLC7fZzeGXI6o6VV5Rh`.
- Deployment: `dpl_3BgVbM8CHp7kcDxcDphvCHhssET5`, production, READY.
- Vercel creation time: 2026-09-22 19:57:36 Asia/Saigon.
- Public URL: https://vng-support.vercel.app.
- Immutable URL: https://vng-support-iwd7dbxis-acne-a6cd.vercel.app.
- Dashboard: https://vercel.com/acne-a6cd/vng-support/3BgVbM8CHp7kcDxcDphvCHhssET5.
- `APP_REVISION` explicitly matches the deployed source SHA; policy is `support-guidance-v5.3`.

This was a direct authorized Vercel CLI deployment from the committed local worktree. GitHub push was not retried after the earlier automatic approval rejection; this receipt does not claim the release branch is published on GitHub. The receipt commit itself is documentation-only and is not the deployed source SHA.

## Reconciliation and fixes

Main had advanced since the package base: required department/optional employee ID, 5/15-case Verify boundaries, tracking URL normalization and visible reviewer responses were integrated before deployment. The sender tour now includes department selection. A new regression verifies that identity metadata does not prevent evidence-first routing for missing private data. Conversation follow-ups preserve employee identity while retaining bounded diagnosis behavior.

Vitest moved to 4.1.11 with an ESM config. Prisma 6.16.2 remains unchanged; its config dependencies use scoped overrides for deepmerge-ts 8.0.0 and effect 3.20.0. Prisma generation, tests and build validate this combination. The historical POLICY-REVIEW.md hash was restored by moving the new explanatory note into VERCEL-READINESS.md; no Ground Truth, expected outcome or manifest hash was changed.

## Local and hosted build evidence

- Lint, typecheck, Prisma generation and production build passed.
- 355 unit/integration tests passed across 28 test files, including fixture/policy integrity checks.
- Desktop E2E: 34 passed. Pixel 7 browser emulation: 33 passed, one configured desktop-only recording skip. Each project used its own local production-mode server with mock AI and memory storage.
- `npm audit`: zero reported vulnerabilities, including development dependencies.
- Vercel dry-run: 219 files, 3,597,570 bytes; zero forbidden secret/environment/dependency/generated-artifact paths. Existing runtime assets and source were uploaded; local reports/video were excluded.
- Vercel's Linux/Node 24 build installed dependencies, generated Prisma, compiled Next.js, typechecked and produced serverless functions successfully.

## Post-deployment observations

Vercel inspect confirmed that the public alias resolves to this exact READY deployment. Public health returned `status=ok`, `storage=MONGODB`, `durable=true`, `provider=openai`, policy v5.3 and the exact source SHA; the handler performed a MongoDB ping.

Live browser checks passed on desktop and Pixel 7 emulation: first-visit popup, separate role tours, required department step, sender tour not replaying after returning home, **Gửi**, and QR decoded from rendered pixels to `https://vng-support.vercel.app/`. Ten routes returned HTTP 200 per device: `/`, `/send-help`, `/workspace`, `/track`, `/review`, `/audit`, `/verify`, and three `/legacy/*` pages. Verify exposes exactly `de-a-v3` and `judge-15`. No page JavaScript errors or same-origin HTTP 5xx responses were observed. Checked pages had no horizontal overflow; additional narrow-phone checks used 320 × 568.

These live checks were read-only: no production workflow submission/reviewer decision, database deletion/migration, paid model request, budget reset or credential change was made. Mongo ping demonstrates connectivity, not a newly tested durable workflow round trip. Model configuration is not proof of live model output. Physical iOS/Safari devices were not tested.

The original dirty checkout and its uncommitted contract edits were preserved. Generated local test files were excluded from release commits. No human authorship, review, private policy authority or real-user outcome is inferred.
