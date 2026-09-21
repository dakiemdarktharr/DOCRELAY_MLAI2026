# Release matrix — single current reference

This is repository evidence, not a new live probe. Main was read from GitHub at base `20727b5a3d00d7f8a5e12381f679dc01aa078bf7`. No deployment or paid-provider call was performed while preparing these packages.

| Layer | Source / policy | Evidence and limits |
| --- | --- | --- |
| Main at package base | 20727b5; support-guidance-v5.1 | Git history includes eae86db (retrieval), 4a86708 (answer/cache) and merge 20727b5. RAG changes are already committed/merged; this does not prove human review or deployment. |
| New package Tiến Khoa | uncommitted patch on 20727b5; v5.2 | Control-bypass regression fix, reviewed-label evaluator and offline threshold proposals. No active adaptive threshold. |
| New package Duy Anh | uncommitted patch on 20727b5; retains base policy when used alone | Verify recovery/loading and evidence documentation. With both packages the runtime policy is v5.2. |
| Last recorded public release | cfb9295c07235f3f8bb20e45c6fd97fc9fcafed1; v5.0 | https://vng-support.vercel.app ; deployment dpl_BcyeJnNXbZae9StBorhA2adSu28Y. Repository receipt artifacts/vng-support-live-verification.json records 13/13 live checks. Not rechecked now and does not validate either new package or merged v5.1. |
| Original RAG QA | old package candidate; v5.1 | Previously recorded 243 tests and 31 E2E pass/1 skip; not new-package QA or human review. |
| New local QA | package patch + exact base | See QA-RESULTS.md delivered with the new packages for commands actually executed. Local mock/memory only. |
| Human impact / held-out quality | NOT COLLECTED | Need independent labels, consented participants and before/after measurements. No accuracy or user impact inferred from tests. |

Live release fields must only change together after authorized deployment plus a receipt identifying source SHA, deployment ID, URL, policy, environment and checks. A Git merge is not a live receipt. Old release narratives are archived under docs/history; BUILD-LOG remains chronological provenance.
