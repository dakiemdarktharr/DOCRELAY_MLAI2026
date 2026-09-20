# QA Checklist

## Support v3 — evidence 20/09/2026

- [x] Read/audit/baseline trước code; phase gates trước mỗi phase tiếp theo.
- [x] Guidance shutdown/restart, reset clarification, medium assistance và C/D handoff.
- [x] Production/privilege/public/secret/conflict fail-safe; model invalid/timeout/evidence tests.
- [x] Approval scoped/expiry server-only; reviewer guarded/versioned; complete chỉ mô phỏng.
- [x] Audit actor/requestId/rules/evidence; secret không xuất hiện trong tested response/audit.
- [x] Verify production API, judge input, v3 3auto/2escalate, fixtures gốc hash unchanged.
- [x] 87 unit/integration tests, lint, typecheck, production build.
- [x] 20 browser tests desktop/mobile trên server3216 có marker đúng repository.
- [ ] Live Mongo persistence sau restart, approval integration thật, live model account/model access.
- [ ] Public Vercel deployment của migration, cần đích deployment rõ ràng.

Các checkbox generic bên dưới là checklist lịch sử, không thay thế báo cáo runtime mới trong STATUS.

## Local

- [ ] `npm ci` completes from the lockfile.
- [ ] `npm run db:generate` completes.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `/`, `/workspace`, `/verify`, and `/audit` open directly.
- [ ] Refreshing each route does not fail.
- [ ] `/api/health` returns a success response with `data.status = "ok"`.
- [ ] Valid echo input succeeds.
- [ ] Missing, wrong-type, malformed JSON, and empty echo input return `VALIDATION_ERROR`.
- [ ] `/verify` calls the API and records timestamps.
- [ ] `/audit` displays event metadata.

## Reliability and deployment

- [ ] Incognito browser can open the single Render URL without login.
- [ ] `DATABASE_URL` is configured in Render and no local file is used.
- [ ] A blank database accepts `prisma migrate deploy`.
- [ ] Events remain after an app restart.
- [ ] Missing LLM key returns a safe model error from `/api/llm-test`.
- [ ] Model timeout, rate limit, empty response, invalid JSON, invalid structure, and retry behavior are tested with mocks.
- [ ] Spam click and duplicate request behavior is reviewed.
- [ ] A failed deployment does not replace the last working URL.
- [ ] Repository scan finds no secrets or personal data.
