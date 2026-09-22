# Vercel release readiness

The user authorized a repository-wide check followed by Vercel deployment. Use the existing `acne-a6cd/vng-support` project (`prj_hmxBwMixxSLC7fZzeGXI6o6VV5Rh`), not a duplicate project. The mandatory two-package workflow has been removed.

The release candidate combines main `7909f0cc8f99629f114b528cde8a989450bc1de7` with diagnosis/evidence-first workflow, judge onboarding, QR access and patched build dependencies. Preserve required department/optional employee ID, the 5/15-case Verify packs and tracking/reviewer fixes from main. Policy is `support-guidance-v5.3`.

Run lint, typecheck, all unit/integration tests, build, npm audit and desktop/mobile E2E. See [judge onboarding checks](JUDGE-ONBOARDING.md) for separate production-mode browser runs. Use local mock/memory only. Do not treat a local test as a live database or paid-model receipt.

Inspect Vercel's dry-run upload list. Exclude secrets, `.env*`, `.git`, dependencies, generated files, local worktrees and submission/package artifacts. Set `APP_REVISION` to the exact committed deployment SHA; do not pretend the release came from main if it was deployed from another branch.

Reuse existing production credentials, MongoDB, model budget and domain. After deployment, verify deployment ID/READY state, alias, exact health sourceRevision/policy, Mongo ping, HTTP pages and first-visit UI/QR on desktop/mobile. Record actual results in a new receipt; old receipts remain historical. Human review and paid-model success are separate claims.

Historical `mlai26_new/data/policy/POLICY-REVIEW.md` describes policy-v2 before current runtime integration. Its original bytes remain protected by the pre-migration hash manifest. The context note added on main is retained here instead of changing that immutable source; current runtime policy lives in `src/domain/policy-source.ts` and `src/domain/policy.ts`.

Fresh combined-candidate QA: 355 unit/integration tests, 34 desktop E2E and 33 mobile E2E pass (one desktop-only recording skipped on mobile); lint, typecheck, Prisma generation and build pass. npm audit reports zero vulnerabilities. Original fixture/policy hash assertions pass unchanged. These are local synthetic/mock checks.
