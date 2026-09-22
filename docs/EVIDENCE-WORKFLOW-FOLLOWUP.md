# Diagnosis follow-up and evidence-first LLM workflow

This change is AI-assisted. A local Git commit does not establish human review or production deployment.

## Source and integration

Base: `542d042097ff7ac2e73f1619f5543d513937d814`.

The twelve ordered patches in `TECH-SUPPORT-DIAGNOSIS-FOLLOWUP-542d042` were applied backend first, frontend second. They add bounded diagnostic possibilities, vetted potential fixes, cloud GPU contact guidance, and a follow-up box under safe assistance. The source package is preserved in the supplied `support-followup-542d` worktree. Its historical owner split and six-commit-per-owner instructions are superseded by the user's instruction to remove mandatory packages and commit locally.

The backend patch series also changes `src/domain/text.ts`, although the package plan did not list it. This integration includes that inspected patch: Vietnamese power/network symptom aliases and the “but still” diagnostic conjunction. It does not import unrelated uncommitted files from either checkout.

An additional correction keeps potential fixes in the same selection/order as model-selected vetted steps, and prevents model-supplied diagnosis/fixes from leaking through when the server has no such fields.

## Contract and behavior

- `src/domain/workflow-prompt.ts` holds the five evidence-first instructions and all ten task-specific workflows. `callModel` includes them at the real model boundary for both extraction and assistance, including injected test runners. Task-specific JSON schemas and deterministic safety checks still apply.
- Optional `CanonicalRequest.workEvidence` contains the work kind, requirements (`artifact`, `range`, `access`, `reason`), source lookup results, confidence and the next action. It is server-generated; clients and model output cannot supply it as an authority claim.
- Recognized, safe, freeform work requests first query the configured reviewed knowledge corpus. Missing private artefacts or tools produce `NEEDS_INFORMATION` under `INFO-EVIDENCE-001`, with precise requirements displayed in preview and request detail. Lookup failures are reported as failures, not as proof that a source is absent. Source checks are retained in audit events.
- `NEEDS_INFORMATION` remains visible in all requests and accepts clarification. It no longer counts as pending review in either memory or Mongo query/metrics, or the shared status helper. The existing queue metric test changed because this is the requested business behavior; Ground Truth fixtures were not changed.
- Work requests without a draft cannot use feedback handoff to enter review. The prompt requires a complete draft, positioned evidence, diff or actual check output, risks and a concrete decision. The application has no general work-artifact execution/review pipeline yet, so this change does not claim to produce review-ready business artefacts.
- Security and authority escalation remain separate helpdesk paths with their existing precedence. New task routing cannot erase risk signals, redactions, conflicting structured input or dangerous follow-up requests. These incidents may still require immediate human attention.

Policy is now `support-guidance-v5.3`; old previews fail the policy-version check. The answer cache namespace also changes so old prose does not bypass the new prompt. Version assertions were updated accordingly, without relaxing security expectations.

## Real capability boundary

This application can read the submitted request and its reviewed local/Mongo knowledge corpus. Its existing allowlisted public web search remains limited to company/GPU guidance. It does **not** inherit Codex's workspace, attachment, Drive, email, calendar, dashboard, PR, SQL or task-system tools. A URL or path in a message is not an executed read.

This change supplies a truthful missing-source path and updates the LLM workflow contract; it does not implement connectors or general execution of all ten business tasks. Even pasted business data is not yet processed by a dedicated analysis, code-editing or document-editing engine. That requires a separately implemented source/compute adapter, output validation and a review packet. Until then the app must not claim a completed analysis, patch, forecast, meeting decision or test run. The UI's proposed next action is conditional on receiving the necessary data **and** tools.

No email is sent, task assigned, purchase order created, production database queried or paid model called by local validation. Test evidence is synthetic/local/mock, not live performance or human acceptance evidence.

## Local validation

Commands are run in the isolated integration worktree with mock AI and local memory storage:

```text
npm ci --no-audit --no-fund
npm run db:generate
npm run typecheck
npm test -- --reporter=dot
npm run lint
npm run build
npm run test:e2e
```

Results: typecheck, lint (zero warnings), production build and all **323 unit/integration tests** passed. Full desktop/mobile browser suite: **41 passed, 1 configured skip**, exit code 0. On Windows, the test runner waited for its Next dev server after all cases finished; the exact server process started by this run was verified and stopped, after which Playwright emitted its successful summary. The targeted diagnosis/conversation/evidence browser suite also passed all six cases without intervention.

Runtime screenshots, video, benchmark output churn, dependencies, secrets and build files are excluded from the commit. Package patch hashes are recorded in `docs/diagnosis-package-provenance.json`.
