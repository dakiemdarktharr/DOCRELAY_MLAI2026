# Conversation and MongoDB retrieval migration — 2026-09-21

## Before implementation audit
Runtime: deterministic policy v4.2, redacted intake, preview snapshots, MongoDB requests/audit/budget, constrained OpenAI assistance, human review, Verify through production APIs. Baseline: 177 tests pass; lint and production build pass. Existing compatibility endpoints /api/health, /api/events, /api/echo remain.

Missing in runtime: conversational answers, retrieved knowledge, web sources and chat bubbles. Current OTHER->AUTH-005 and workflow field requirements over-escalate ordinary questions. Existing prose validator intentionally rejects URLs/free answers; it must remain for operational assistance.

Conflicts: historical no-network LLM constraint is superseded by the user's explicit read-only web authorization. Failure of a conversational answer must give a safe knowledge fallback/clarification, not automatic reviewer escalation. Operational model failure remains fail-closed. Original Ground Truth and Verify expectations are retained; changed behavior is tested separately, never silently relabeled. Public cloud documentation is not internal employee policy or verified approval.

## Contract / phases
1. Deterministic read-only conversation gate AFTER redaction and risk checks. Explicit execution, structured conflicts, risky subrequests and human handoff retain the existing engine. Known benign instruction-override prefixes are ignored and recorded; their remaining payload still passes all safety checks.
2. Versioned curated knowledge in MongoDB v3_support_knowledge: label, keywords, answer, source, scope, review/expiry dates. Lexical retrieval ranks content and labels. LLM labels the answer within a fixed taxonomy and synthesizes retrieved candidates, without deciding authority. This is lexical RAG, not vector search or model training.
3. Responses API model for read-only answer generation; optional domain-filtered hosted web search uses a server-owned public query, never raw tickets/internal identifiers. One request/at most one search, no shell/function/database tools, unchanged cumulative budget 30. Invalid answer, no sources or outage -> explicit deterministic fallback. No provider errors, secrets or chain-of-thought are stored.
4. Existing preview/submit snapshots carry answer text, provenance and retrieval evidence. Display before confirmation; human handoff stays explicit. Bubble reveal 400ms + pop 200ms, reduced-motion and long-text wrapping.
5. Regression/unit/E2E tests, same Mongo/Vercel project deployment and bounded live verification.

## Planned files
New domain/conversation.ts, domain/knowledge.ts, lib/support-knowledge.ts, lib/conversation-model.ts, components/answer-bubble.tsx, tests/conversation.test.ts and E2E coverage. Update contracts, support service, policy source/engine, assistance rendering, workspace, global CSS, env example and README/RUNBOOK/STATUS/BUILD-LOG. No dependency additions, no database deletion, no changes to the student's original workspace draft.

## Environment
AI_PROVIDER, OPENAI_API_KEY and AI_MODEL remain. AI_CONVERSATION_MODEL and AI_WEB_MODEL optionally override AI_MODEL. AI_WEB_SEARCH=true enables controlled public search. AI_MAX_ATTEMPTS remains capped at 30, never reset. MongoDB is required on Vercel; local mock uses the same seed corpus in memory. Sources expire and are excluded until reviewed; web results never automatically overwrite approved knowledge.

## Validation and retained external QA
212 unit/integration tests, lint, production build and 29 E2E passed (one duplicate mobile recording skipped). No old Ground Truth expected values changed; only the API test's policy-version assertion was migrated from v4.2 to v5.0. Main advanced to 864c5da with a historical live adversarial report and fixture; fast-forwarded without dropping either. Its two findings (duplicate submit returning RECEIVED and reviewer completing missing facts) are already guarded by current waitForDecision and reviewSupport, and covered by existing regression tests. The old report remains historical evidence, not a claim about this release.

Source references: https://support.google.com/accounts/answer/7682439?hl=vi ; https://vng.com.vn/news/enterprise/chien-luoc-phat-trien-con-nguoi.html ; https://developers.openai.com/api/docs/guides/tools-web-search . Public VNG HR overview describes internal communication channels; it does not establish individual employee entitlements. Model instruction isolation, deterministic risk checks and adversarial regressions reduce injection risk; they do not prove immunity against every possible attack.
