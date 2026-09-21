# Report fixes: verified public release

- URL: https://labpass-five.vercel.app
- Source commit: `d432b94f8b3c5fefd0621735a41c575360b6a695`
- Deployment: `dpl_8uFvh41TniLMzoSaB2TjYNZmE5jr` (READY)
- Completed verification: `2026-09-21T07:12:30.024Z`
- Policy: support-guidance-v4.2
- Evidence: [27 live checks](artifacts/report-live-verification.json), [E2E report](artifacts/e2e-results.json), [23-item recheck](VNG-SUPPORT-ERRORS-RECHECK.md).

## Results

177 unit/integration pass, lint pass, npm run build pass locally and on Vercel. 27 desktop/mobile E2E pass, one deliberately skipped duplicate mobile recording, no retries. E2E uses a new repository server on port 3227 with mock/memory. These checks are separate from production verification.

27/27 live checks pass: deployed source SHA, real OpenAI assistance and evidence, MongoDB exact preview/submission/GET, idempotency, explanations and handoff history, reviewer/audit, clarification, risk guards, legacy echo/events, persisted Verify 4/4, queue provenance, pagination and aggregate totals.

Live Verify run: https://labpass-five.vercel.app/verify?run=4c6d7db4-074d-49c3-bbf6-cbc4ee945756
Model-assisted synthetic request: `99079dbf-3b9c-426f-a2bc-6511d00c35a8`. The smoke closed this request after validating history; the saved Verify table remains the original run snapshot even where later Stop/Override controls were tested.

## Authorization and limits

Owner authorized a cumulative ceiling of 30 model calls, preserving the existing counter, after the original 20-call budget was exhausted. No data deletion or budget reset. Three newly authorized preview attempts were used during diagnosis and final confirmation; two were rejected by output validation, one returned validated contextual assistance. The final full smoke reused the successful preview and did not make another paid model call. No remaining-budget amount is claimed because other visitors may use the public demo.

Public reviewer access and infrastructure simulations remain intentional demo behavior. No real provisioning occurs. Original fixture results remain 55/128 matching and 73 policy differences, unchanged expectations. Owner confirmed there is no real-user feedback evidence. Slide/build-log/video drafts are in [submission](submission/README.md); they do not establish real-user impact or contest authorship eligibility.

The subsequent evidence-only commit does not change deployed application source. Health APP_REVISION identifies the deployed code commit above, not later documentation commits.
