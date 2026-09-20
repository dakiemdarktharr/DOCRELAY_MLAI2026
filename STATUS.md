# Project Status

## Current phase

`PRE-SPRINT / GENERIC INFRASTRUCTURE SKELETON COMPLETE`

## Completed this session

- [x] Next.js App Router scaffold with `/`, `/workspace`, `/verify`, and `/audit`.
- [x] Generic shared UI primitives and navigation.
- [x] `GET /api/health`, `POST /api/echo`, `GET /api/events`, and optional `POST /api/llm-test`.
- [x] Zod validation and standardized success/error response format.
- [x] Prisma `Event` schema, migrations scripts, and PostgreSQL-backed event helper.
- [x] Generic in-memory fallback for local development when `DATABASE_URL` is absent.
- [x] Generic four-case Verify runner using the production echo endpoint.
- [x] Structured-output LLM wrapper with schema validation, timeout, and retry handling.
- [x] Playwright config and browser smoke-test spec for the generic routes/workspace.
- [x] README, Runbook, Build Log, QA checklist, Render blueprint, and task board.
- [x] Reproducible `package-lock.json` with pinned dependencies.
- [x] `npm test`: 12/12 tests pass.
- [x] `npm run build`: production build passes.
- [x] `npm run test:e2e`: 2/2 Chromium smoke tests pass.
- [x] Local production smoke test: UI routes, health, events, and echo pass.

## Next action

1. Team reviews the generated generic code and makes the repository public before reusing it.
2. Configure a disposable PostgreSQL database and run `npm run db:deploy` from a blank database.
3. Deploy the generic shell to Render and record the live URL.
4. Confirm the official challenge brief before adding any challenge-specific code during Sprint 1.

## Blockers

- No public repository URL yet.
- No Render service or PostgreSQL credentials provided.
- Official challenge-specific brief and test cases are intentionally not present.
- PostgreSQL migration/restart evidence is still pending.

## Decisions

- Keep TypeScript/Next.js/Tailwind/Prisma/PostgreSQL/Vitest/Playwright/Render as the planned stack.
- Keep all current behavior generic and harmless; do not add policy, escalation, authority, uncertainty, official prompt, or official dataset logic before Sprint 1.
- Keep the policy/decision boundary out of this pre-sprint shell; the future workflow must remain deterministic and explainable.
- Keep LLM access server-side behind `src/lib/ai/` and require a configured key only for the sandbox endpoint.
- Use an in-memory event fallback only for local usability; production must use PostgreSQL persistence.
- Upgrade direct Next.js, Vitest, and PostCSS versions based on audit findings; retain non-forced Prisma/Vitest transitive audit warnings for explicit team review.

## Risks

- `npm audit` still reports high transitive findings in Prisma CLI (`deepmerge-ts`/`effect`) and a moderate Vitest mocker advisory. No force-upgrade was applied because the suggested changes are major/breaking or unrelated to runtime production behavior.
- Render deployment and blank-database migration are not validated until team credentials are available.
- The generic pre-sprint code must be publicly disclosed if reused under the competition rules.

## Evidence

- Test command: `npm test` — 3 suites, 12 tests passed.
- Build command: `npm run build` — Next.js 15.5.25 production build passed.
- E2E command: `npm run test:e2e` — 2 Chromium smoke tests passed.
- Smoke test: local `next start` on port 3100; `/`, `/workspace`, `/verify`, `/audit`, `/api/health`, `/api/events`, and `POST /api/echo` all passed.
- Persistence evidence pending: PostgreSQL-backed migration and restart test.
- Repository URL: `[to be added by team]`.
- Live URL: `[to be added after Render deployment]`.
- Lint command: `npm run lint` — ESLint completed with no errors.
- Schema command: `DATABASE_URL=<process-local sample> npx prisma validate` — schema valid.

## User directive recorded

The three student members must self-write the challenge-specific core in TypeScript/TSX. Work is now split as three equal vertical slices in `TEAM-PLAN.md`: intake/verification, deterministic decision/safety, and human control/evidence. AI assistance is limited to explanation, review, test suggestions, and debugging support; it is not counted as core implementation authorship.

## Parallel-work directive recorded

Ba thành viên làm song song theo ba làn: intake/UI, decision engine và human review/audit. Contract và fixture cho phép mỗi làn chạy độc lập; Verify, QA và deployment được chia theo phần việc, không giao riêng cho Thành viên 3. Chi tiết ở `PARALLEL-WORK-PLAN.md`.
