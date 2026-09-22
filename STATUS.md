> Current release work: main `7909f0c` has been integrated with policy v5.3, judge onboarding and QR access. The user authorized Vercel deployment after checks; see [release readiness](docs/VERCEL-READINESS.md). The older snapshot below is historical and does not establish the current deployed revision. The two-package requirement no longer applies.
> Package provenance: hai package AI-assisted, package base `532b123c7f78a3d6c0dd03058ef113d255c272b7`, current main head `bea350303d5812c7a72873e2cc592de9f9c2acf2`. Human review chưa được xác nhận; receipt triển khai cũ chỉ là lịch sử. Bản sửa tài liệu này không tạo project, đổi cấu hình hay deploy Vercel.

# VNG Support status — integrated release fixes

[Release matrix](docs/RELEASE-MATRIX.md) is the current reference for source, policy, deployment and evidence boundaries.

Current main head is `bea350303d5812c7a72873e2cc592de9f9c2acf2`; the package base is historical.

The latest recorded production receipt is historical: source `01a20a7`, deployment `dpl_J4sT4LpVHb73sMSXiEKQnkaHjm8q`, https://vng-support.vercel.app. It does not prove that current main `bea3503` is deployed. See [fresh deployment receipt](docs/releases/01a20a7.md) for the actual scope.

- Historical package QA inspected `9d9ab053806250c72eea0b7b8b17f43f875252c1`; current main is `bea350303d5812c7a72873e2cc592de9f9c2acf2` and includes the later judge-pack boundary/docs commit.
- Knowledge boundary fixes entered main in `4ad01e8`. Exact-ID query/readback fixes entered in `276c264` and `5161a6e`; Verify tests are included through `9d9ab05`. Policy remains `support-guidance-v5.2`.
- Historical QA on the previous integrated source used `npm ci`: 290 unit/integration tests, lint, typecheck and build passed; fresh desktop/mobile E2E was 33 pass and 1 skipped. The latest main commit message reports 322 unit/integration tests and 45 E2E pass, but that result was not independently rerun in this documentation-only correction.
- The latest main changes are AI-assisted; human review is not established by Git authorship or package ownership. This documentation correction did not deploy or modify Vercel.
- Existing Vercel project: `acne-a6cd/vng-support`. At deployment preparation its production alias still pointed to historical deployment `dpl_BcyeJnNXbZae9StBorhA2adSu28Y`. This observation is not proof that the new source is live. Compare the new deployment receipt and `/api/support/health` sourceRevision after release.
- Model cap/counters, database contents and policy authority remain unchanged. No paid model call or workflow write is needed for the planned read-only deployment smoke checks.
- Independent held-out data, three consenting participants, before/after outcomes and observed negative impact remain NOT COLLECTED. Threshold proposals remain inactive.
- No verified internal policy/entitlement. Public reviewer is a demo identity; no real IAM/cloud execution. Exact quote matching and lexical retrieval do not establish complete faithfulness or universal injection resistance.

[Historical status](docs/history/STATUS-before-20727b5-fixes.md) retains earlier release statements.
