# VNG Support status — main 92d140a

[Release matrix](docs/RELEASE-MATRIX.md) is the current reference for source, policy, deployment and evidence boundaries.

- Inspected GitHub main: `92d140a72bc424aa5e7199e6d815f9ae286a84a8`. Commits `6cc5832` and `92d140a` already contain the previous safety/evaluation and Verify fixes. Policy is v5.2. Do not reapply the old packages.
- Fresh baseline check on this source: 277 unit/integration tests, lint, typecheck and build passed in local mock/memory. This did not cover two subsequently reproduced edge cases.
- New uncommitted release-fix candidates address malformed knowledge documents aborting Mongo retrieval and a false Verify queue failure when a persisted request is older than the newest 200 records. The deployment condition was not met; no Vercel initialization or deployment was performed during this check.
- Agent QA for the new patches is included in the new deliverable's QA-RESULTS.md. These patches still require human review and commits; Git authorship alone does not establish who wrote or understood all code.
- Last recorded deployment is distinct from current source; no new live Mongo/OpenAI/Vercel receipt was collected. Cap and counters are unchanged.
- Independent held-out data, three consenting participants, before/after outcomes and observed negative impact remain NOT COLLECTED. Threshold proposals remain inactive.
- No verified internal policy/entitlement. Public reviewer is a demo identity; no real IAM/cloud execution. Exact quote matching and lexical retrieval do not establish complete faithfulness or universal injection resistance.

[Historical status](docs/history/STATUS-before-20727b5-fixes.md) retains earlier release statements.
