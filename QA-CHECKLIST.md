# Candidate QA checklist

Use the exact package base and inspect the complete patch. The delivered QA-RESULTS.md contains agent results; each human owner must rerun applicable checks. Unchecked items are not failures or completed human review.

- [ ] npm test: include control bypass/negation, evaluation leakage/empty denominators, threshold safety and Verify retry/resume.
- [ ] npm run lint; npm run typecheck; npm run build.
- [ ] npm run test:e2e: fresh 127.0.0.1:3227, mock/memory, no reuse; never concurrent with build.
- [ ] Verify saved-run loading locks selection and preserves the requested run.
- [ ] Transient Verify failures are retryable with the same request ID; policy mismatches remain visible.
- [ ] Original Ground Truth and Verify expected data hashes unchanged.
- [ ] Package contains only manifest paths; no secrets, runtime artifacts or personal inputs.
- [ ] Each owner explains actual reviewed/changed files and records real commands before their own commit.
- [ ] Independent held-out labeling and actual user-study evidence: NOT COLLECTED.
- [ ] Live checks for new candidate: NOT PERFORMED; only after explicit deployment authorization.

See [release matrix](docs/RELEASE-MATRIX.md) and [historical checklist](docs/history/QA-before-20727b5-fixes.md). Historical checked boxes do not validate a new patch.
