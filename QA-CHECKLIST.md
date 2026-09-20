# QA Checklist

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
