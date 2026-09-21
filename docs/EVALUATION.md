# Evaluation and bounded threshold proposals

AI-assisted candidate. No real-user or independently held-out dataset is supplied. The evaluator is runnable; missing evidence remains NOT COLLECTED. It does not activate adaptive routing in production.

## Contract

POST `/api/support/evaluation` accepts JSON `{evaluation, proposal?}`. It uses the existing public-demo reviewer gate, body-size and mutation-rate limits. The gate is not authentication of a reviewer. No database write, model call, raw question or feedback text is accepted. Outputs are `caller-declared-unverified`, never verified human evidence.

`evaluation`: datasetId (pseudonymous identifier), split (`development` or `held-out`), evidence (`synthetic` or `consented-anonymized`), policyVersion, sourceRevision (40 hex characters), developmentCaseIds, rows (at most 1000). Each row has caseId, expectedAction, actualAction (or null for unavailable), observedAt (UTC ISO), optional confidence [0,1], and review `{reviewerId, labelledBeforeRun:true}`. Actions are AUTO_APPROVE, NEEDS_INFORMATION and ESCALATE. IDs must be letters, digits, hyphens or underscores; keep names and private input out.

The 3x3 matrix uses expected action as rows and actual as columns. Binary escalation treats ESCALATE as positive and the other two actions as negative. FNR = FN/(TP+FN); unnecessary escalation rate = FP/(TN+FP). Missing predictions are excluded from these denominators and counted in unavailable; coverage is always returned. Empty denominators return null. An incomplete report must not be presented as complete accuracy. Duplicate case IDs and declared development/held-out overlap are rejected. This cannot prove that paraphrases are independent or identities/consent are authentic.

## Proposal and safety boundary

An optional proposal contains current (0.70..0.95), version (nonnegative integer), from and to (positive window, at most 30 days, start inclusive/end exclusive). Development data only: at least 30 complete reviewed observations and at least 10 positive and 10 negative escalation labels. Missed escalation proposes +0.02; otherwise unnecessary escalation >20% proposes -0.02; bounded to 0.70..0.95. These are candidate design constants, not empirically calibrated optimal settings.

The result records sample IDs/window, dataset/source/policy, previous/proposed versions and thresholds, rollback target and REQUIRED_NOT_RECORDED owner approval. It is never active. `simulateThreshold` may only withhold a low-confidence LOW-risk guide or answer already approved by deterministic policy; it cannot promote missing information, execute a workflow or downgrade security/authority decisions. It does not mutate the decision.

RESOLVED/CONFUSED are not labels. A trusted maintainer must independently review labels, retain consent outside the public repo, approve a proposal, test it on a separately frozen held-out set and define authenticated activation/audit/rollback storage before runtime integration. Those activation controls and real user collection remain BLOCKED pending owner evidence; no public endpoint accepts an approval command.

## New deterministic fix

Base 20727b5 incorrectly classified `Bypass MFA` as safe login guidance. The candidate identifies bypass/skip/ignore of MFA, 2FA, EDR, authentication and audit controls as BYPASS, retaining local negation and Unicode normalization. Policy 5.2 invalidates older previews. This is targeted regression coverage, not universal injection protection.

Read evaluation.ts -> escalation-threshold.ts -> services/evaluation.ts -> API route, then the four new test files. Tests use synthetic declarations, not human participation.
