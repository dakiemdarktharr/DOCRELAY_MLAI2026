# UX and judge feedback migration — 2026-09-21

Baseline: main 0764f1d; isolated branch codex/ux-vng-refurbish. Student draft in the original checkout is untouched. Before edits: npm test 87/87, lint pass, single isolated build pass. An overlapping build failed due to shared .next output; the authoritative rerun passed.

Runtime has deterministic policy, schema-validated model extraction/assistance, public synthetic reviewer, CAS updates, Mongo embedded audit, compatibility health/events/echo and Verify production POST. Preview binding, targeted questions, Vietnamese catalog presentation and persistence verification were not implemented. No external infrastructure execution exists.

Confirmed conflicts: existing review tests approve incomplete production-admin intake; replace this unsafe success fixture with a complete guidance handoff, retain Ground Truth unchanged. Explicit user approval keeps public reviewer access. Current scope includes U1–U11/B1 and the three judge reports; C01–C20 checklist additions are not approved.

Contracts: /api/support/requests POST creates confirmed intake (UUID idempotency), GET returns latest 200 full rows; detail uses UUID, mutations require version; preview is analysis, not a ticket. Keep legacy health/events/echo. Add bound expiring preview, additive summary listing and EXPLAIN feedback while retaining CONFUSED compatibility. Requests and events are one Mongo document; memory-demo is local validation only. Models stay server-side, bounded and fail-safe; no live provider/Mongo mutation for tests.

Phases: (1) security and policy regressions, (2) intake/idempotency/preview/readback contracts, (3) Vietnamese UX and brand styling, (4) focused plus full tests/lint/build/E2E on a fresh identified local server, independent security fix review, documentation and commit.

Expected files: domain redaction/text/policy/catalog/contracts/guidance; services support/review; repository/model/verify adapters; support API routes; workspace/request/reviewer/verify components; layout/header/home/CSS; local illustration; regression/E2E tests; README/RUNBOOK/STATUS/BUILD-LOG. No fixture expected results or secrets will be changed.

## Judge feedback disposition

| Feedback | Implementation and evidence |
| --- | --- |
| BUG-01 secret aliases | Shared redact handles AWS env/camelCase/JSON assignments and ASIA temporary IDs; regression intake/audit plus existing echo/model rejection tests. No raw secrets retained. |
| BUG-02 concurrent submit | Same-key requests await the stored final decision; bounded 409 processing response if unfinished. 20 concurrent calls regression. |
| BUG-03 missing-info approval | Shared review guard reevaluates facts and server approval for approve, override-to-approve, fulfill; access intent and privileged/production risks cannot launder authority via operation/kind. Explicit NEEDS_INFORMATION cannot be approved. Valid scoped registry approval and guidance handoff still work. |
| BUG-04 substring port | Network classifier uses word boundaries; report/support/important controls. |
| BUG-05 negation | Local hazard-predicate negation; positive commands after symptoms, commas, semicolons and conjunctions retain risk. No claim of complete natural-language understanding. |
| BUG-06 public context | Public documentation context excluded; public bucket/service/Internet/all-interface/0/0 and numeric ports recognized. |
| BUG-07 irrelevant questions | Intent-specific requirements for DB diagnosis/data operations, monitoring, logs, network, software, storage, incidents. Up to three questions per turn with Vietnamese explanation/examples. |
| BUG-08 missed facts | Explicit scoped fact extraction and account aliases; known freeform intents with missing facts may use configured OpenAI extraction; evidence remains mandatory. |
| BUG-09 reviewer questions | Separate reviewerQuestions for network, secrets, authority and other risks; employee sees only their questions. |
| BUG-10 unstable model | Allow bounded lexical aliases (Postgres/PostgreSQL, Vietnamese read-only/time units) in grounded evidence. Assistance model selects step indexes, server fills approved text. Invalid/refusal/timeout/ambiguity remain fail-safe. Live provider reliability and exhausted budget not retested/reset. |
| BUG-11 bias hypothesis | Corrected confirmed substring/negation paths and neutralized populated example facts in extraction prompt. Catalog remains a schema vocabulary; no claim that LLM bias has been proven or eliminated. |
| BUG-12 preview drift | Server-owned snapshot includes canonical decision and assistance, input fingerprint, policy version, 10-minute expiry; edited/expired preview rejected, valid submit reuses analysis. |
| BUG-13 kind mutation | Structured kind/intent conflicts are explicit; unknown stays OTHER. Risk from dangerous labels independent of a benign action field. |
| BUG-14 Verify persistence | Same production submit API followed by detail, events, summary queue and metrics checks, including new judge input. Questions and readback checks displayed. Metrics bounded to latest 200; not a transactional cross-endpoint snapshot. |
| BUG-15 preview visibility | UI says CHƯA GỬI YÊU CẦU. Preview snapshots do not create request/queue entries. |
| BUG-16 queue/metrics | Shared pendingReview predicate includes escalated, needs-info and human-approved in the same 200-row scope. |
| BUG-17 missing audit UUID | Detail and request-specific events consistently return 404. |
| BUG-18 technical labels | Explicit Vietnamese intent, field, option and status presentation; friendly HT ID with full UUID/link preserved. |
| BUG-19 forced free text | Structured-only clarification accepted; reject empty/unknown-only submissions. Preserve input on API error. |
| BUG-20 full queue payload | Additive summary projection in Mongo, used by reviewer and Verify. Legacy full list stays available for compatibility. |
| BUG-21 API consistency | Shared error envelope unchanged; UUID/body/schema/origin tests retained plus cross-endpoint unknown resource and readback checks. |
| Diagnosis: unhelpful responses | Intent-specific shutdown/restart/account/MFA/peripheral/DB query guidance, expected outcomes, safe follow-up and audited per-step explanation; explicit handoff separate. No model tools/authority. |
| Diagnosis: database UI | Original redacted question, current status, updated time, copy tracking link, readable queue/search, history separate, audit filter ignores stale requests. |
| GPU risk | Explicit versioned simulation ceiling: 2 T4/A10 GPUs, 4 CPU, 16 GB RAM, 100 GB disk, 8 hours. Larger/unknown numeric allocations require review; existing approval requirement still applies. No actual provisioning. |
| Public reviewer | Preserved as explicitly authorized synthetic demo behavior, no login. |

## Independent security review

Applied codex-security fix-finding: one fresh read-only investigator before patch, one fresh read-only reviewer after focused checks. Reviewer discovered symptom-negation, comma exposure, access-operation authority laundering and model ambiguity regressions; these were corrected and covered by tests. Additional service/bucket negation controls corrected the last reported false positive. Existing legitimate guidance, verified database approval, handoff and compatibility echo remain covered. Validation uses synthetic memory data and mocked model callbacks; no claim of a new live Mongo/OpenAI test.

## Compatibility and deprecation

Preserved health/events/echo and legacy pages, UUID/version/error envelope, direct submit without previewId, original fixture hashes, public entry/reviewer, and CONFUSED API behavior. Deprecated the full-document queue for browser use (still callable), employee-facing raw codes, repeated demo banners/footer, custom cursor and old home SVG presentation. Old illustration/cursor source remains unused as provenance. New EXPLAIN is additive. Current-status UI no longer presents historic escalation as current after rejection/stop/completion.

## Known limits

The classifier is deterministic and conservative, not comprehensive language understanding. Freeform fact quality with a live model remains unverified in this pass. The model budget remains 20 lifetime and can already be exhausted on the existing deployment. Mongo preview TTL/projection need deployment smoke against the intended database; local E2E uses memory only. A crashed RECEIVED request has no recovery worker. Verify readbacks are concurrent observations, not a database transaction, and oldest rows can leave the 200-row scope. Guidance is a reviewed step library, not unrestricted model-generated troubleshooting. Original Ground Truth conflicts remain visible; no expected value was edited. No C01–C20 legal/checklist features added. No deploy or live database migration performed.

## Validation record

- Baseline 87 tests passed; final unit/integration 136 passed, lint passed, production build passed including TypeScript. Existing tests plus 49 targeted judge regression cases.
- Ordered security checks: trace/shared-boundary investigation; synthetic reproductions; syntax/type/build; malicious/alternate-input and legitimate controls; independent candidate review; regressions corrected. Outcome for reproduced source defects: fixed in this candidate, not yet deployed.
- Browser tests use repository-owned Next dev server port3227, mock/memory and no reused server. Desktop and Pixel 7 screenshots in artifacts; local views visually inspected for landing, mobile preview and reviewer layout. Exact final E2E count is in STATUS and machine-readable report.
- Existing fixture hashes preserved; full original evaluation remains 48/128 matched and80mismatches. The corrected negated-public sandbox fixture now needs facts/verified approval instead of a false security escalation; expected remains untouched.

Credential-shape scan of source/tests/public found only pre-existing synthetic private-key and connection-URI tests; no real credential match. This is a bounded scan, not a proof that every possible secret format can be recognized. The student draft remains the sole uncommitted change in the original workspace.

Final browser run:26/26 PASS, no skipped/flaky tests or retries. Final lint/build/unit results above apply to the committed source. No source edits after the final checks.
