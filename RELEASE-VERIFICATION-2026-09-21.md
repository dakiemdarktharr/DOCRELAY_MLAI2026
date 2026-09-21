# Production release verification — 2026-09-21

- Site: https://labpass-five.vercel.app
- Deployed source: `c0c5ea5fbc71f1a5541e2aab552bfa9249b4567a`.
- Deployment: `dpl_9EUsGJXDWeHpaw6KGMh9YSQkWFwF` (production, READY).
- Verification: 2026-09-21T06:16:01.422Z to 2026-09-21T06:16:16.399Z.
- **17/17 live checks passed**. Exact checks and synthetic request IDs: [live-final-verification.json](artifacts/live-final-verification.json).

## Actual services

OpenAI assistance completed through the deployed `/api/support/preview` route with `source=openai`, validated structured output and no model failure. Submit reused the bound preview instead of invoking a second model call. Two successful real assistance calls were made across the initial and final release checks; no budget counter was reset or increased.

MongoDB was exercised through Vercel: preview insertion, request submission, a separate detail GET, idempotent repeat, explanation, handoff, reviewer rejection, summary read and audit readback. With MONGODB_URI set, the repository uses MongoDB and has no memory fallback. Final preview and persisted decision/assistance matched exactly. Local direct Atlas TCP was refused, so this evidence is production API read/write/readback, not a separate local database-console inspection.

The initial smoke found absent approvalReference becoming BSON null. `ignoreUndefined: true` fixes new writes; the failed initial comparison and diagnosis are preserved in [live-release-verification.json](artifacts/live-release-verification.json).

## Safety and regression

- Reset asks clarification with OpenAI enabled; shutdown auto-guides.
- Missing database scope requests information and blocks approval.
- Public exposure and a synthetic secret escalate; secret value is absent from response/audit.
- Security override is rejected. Model-unavailable simulation fails safe. Unknown request audit returns 404.
- Final source: **154/154 unit/integration**, lint, build and **26/26 desktop/mobile E2E** passed. E2E used a fresh server from the main worktree on port 3227, mock model and memory storage.
- All live submitted verification requests were closed as synthetic checks. No old database or production record was deleted.
- Original 128 fixtures remain unchanged: 55 matches, 73 policy mismatches are visible. This is not a claim that the old Ground Truth pack is fully passing.
- User's uncommitted contracts.ts draft in the original workspace remains untouched.

Any following documentation-only commit records this evidence; runtime source remains the deployed commit above.
