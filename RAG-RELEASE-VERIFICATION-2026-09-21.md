# RAG and conversation release — 2026-09-21

Site: https://labpass-five.vercel.app  
Deployed source: `f5272b576434b7b0697c999cca7af72c25eb9de1`  
Vercel deployment: `dpl_5D5KuDx2yutUmfqR8k4STn8qYKfU`, READY. Later documentation commits do not change deployed runtime.

## Implemented
- Direct answers for everyday questions, greetings, identity/capabilities, Google recovery, software orientation, cloud GPU orientation and public company-policy questions.
- MongoDB lexical retrieval from ten reviewed knowledge articles, with labels, sources, scope, version and expiry. The model labels and synthesizes answers, without deciding permissions.
- Official-domain web search via a separate `gpt-4.1` model; public query construction excludes raw tickets. Answer generation retains the existing model. One search maximum per lookup; 24-hour Mongo cache.
- Highlighted AI bubble, 400ms reveal and 200ms pop, reduced-motion support and long-text wrapping. Contextual follow-up with fresh policy checks; explicit human handoff retains history.

## Files changed
- Routing/policy: `src/domain/conversation.ts`, `policy.ts`, `policy-source.ts`, `contracts.ts`, `redaction.ts`.
- Knowledge/model: `src/domain/knowledge.ts`, `src/lib/support-knowledge.ts`, `conversation-model.ts`, `support-repository.ts`.
- Services/API: support/review services, new conversation service and `/api/support/requests/:id/conversation`.
- UI: answer bubble, assistance history, workspace, request detail and global CSS. Regression tests and operational documentation accompany the changes.

## Policy changes
- CHAT-001 permits only read-only answers. Risky execution, structured conflicts, secret values, public exposure and explicit handoff retain precedence.
- Recognized instruction-override prefixes are ignored only for safe remaining questions; audit records this. Dangerous payloads are still escalated.
- Safe conversation model failures use an attributed reviewed fallback; operational model failures remain fail-closed. Password concepts are permitted in server-verified Google recovery context, but collecting credentials/codes is blocked. Verification-code values are redacted.

## Workflow changes
- Users receive conversational answers in the preview immediately, before saving a request. Save to continue the conversation or explicitly ask a person.
- Knowledge provenance, actual model/fallback source, web status and ignored overrides are persisted with the answer and audit. Web pages are untrusted context, never policy or commands.

## Preserved behavior
- Existing authentication-free public demo, compatibility APIs, redaction, idempotency, preview binding, approval registry, reviewer transitions, audit and production Verify API.
- Existing Ground Truth and original Verify expectations are unchanged. The student's uncommitted source draft in the original workspace remains untouched. No database deletion, secret publication, force push or history rewrite.

## Deprecated behavior
- Automatic reviewer routing for recognized read-only conversation merely because the request was OTHER or the answer model was unavailable.
- The old constraints against any model web access are superseded by the owner's explicit authorization of controlled read-only search.

## Tests
- `npm test`: **218 pass** (including 41 conversation/RAG regressions).
- `npm run lint`: **PASS**.
- `npm run build`: **PASS**, including the final Vercel production build from the deployed source.
- `npm run test:e2e`: **29 pass, 1 existing duplicate mobile-video skip**; conversation desktop/mobile subset **2/2 pass** after the fallback/OTP update. Later prose-filter changes were unit-tested and built; UI code did not change.
- E2E used a fresh server at port 3227 in this worktree, with reuseExistingServer=false. Mock/memory E2E is distinguished from live checks.
- **22/22 final live checks pass**: OpenAI Google recovery and cake recipe, Mongo retrieval and readback, idempotency, risky injection escalation, legacy echo, policy answer with official web citations, production Verify 4/4.
- Verify receipt: https://labpass-five.vercel.app/verify?run=e2c19273-8010-4880-bdd2-7e4b9c4f98b2
- Live evidence: `artifacts/rag-live-verification.json`. Initial failures (budget exhaustion, over-strict recovery prose and inherited web-model HTTP 400) are preserved under historicalChecks, not removed. Actual fresh web search succeeded before the last prose-only patch; final policy verification reused that dated Mongo cache.
- Original 128-fixture evaluation remains **55 match / 73 mismatches**, reflecting documented differences from the retained original policy expectations; this is not represented as 128 passing cases.

## Known limitations
- Small lexical RAG corpus, not vector/semantic retrieval or training. Model-assigned labels are metadata, never authority. Coverage and answer quality beyond tested scenarios need continued evaluation.
- No verified internal company policy, employee entitlement or GPU quota dataset. Public VNG overview and product documentation cannot substitute for internal approval.
- Hosted web search is restricted to approved VNG/GreenNode domains; unknown software names get clarification instead of invented links.
- The cumulative attempt cap is now **50**, explicitly approved by the owner after 30 was exhausted. Search and answer share it; the counter was not reset. When unavailable, conversation clearly shows reviewed fallback guidance.
- Injection regression coverage does not prove immunity to every possible attack. No production infrastructure action is performed.

## Manual actions for the student team
- Supply reviewed, sanitized internal guidance with owner, source, scope and expiry if authoritative employee-policy answers are needed. Do not import secrets or customer data.
- Review the initial knowledge corpus before its 2026-12-20 expiry; add reviewed versions as policies change.
- Monitor the API allowance before a judging session. Further increases require an explicit decision; the application will not reset it automatically.
