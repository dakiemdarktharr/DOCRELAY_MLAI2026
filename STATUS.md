# VNG Support status

[Release matrix](docs/RELEASE-MATRIX.md) is the current reference for source, policy, deployment and evidence boundaries.

- Main base 20727b5 already contains the RAG patches. Do not reapply the old ZIPs from base 7c26cae.
- Two new AI-assisted packages are uncommitted candidates. Tiến Khoa adds a deterministic control-bypass fix (policy v5.2) plus evaluation/proposal tooling. Duy Anh fixes retryable Verify errors and saved-run loading.
- Full package QA is recorded in the delivered QA-RESULTS.md. Old 243-test/31-E2E figures describe the previous RAG candidate, not this new patch.
- No new deployment, MongoDB/OpenAI live calls, budget reset or cap increase. Last recorded deployment remains separate from merged source; see the matrix.
- Actual human review/commit of the new code is not evidenced. Existing Git authorship alone does not prove who wrote or understood every line.
- Held-out labels, 3 consented participants, before/after outcomes and observed negative impact remain NOT COLLECTED. Threshold proposals cannot activate routing.
- No verified internal policy or entitlement. Public reviewer is a demo identity. Lexical retrieval and quote matching have limited coverage; no universal injection protection or real IAM/cloud execution.

[Historical status](docs/history/STATUS-before-20727b5-fixes.md) preserves previous release statements and QA provenance.
