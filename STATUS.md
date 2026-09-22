> Phát hành hai package: Chủ dự án đã yêu cầu rõ agent commit cả hai package và deploy để chuyển cho tester. Thay đổi là AI-assisted; việc commit theo yêu cầu này không chứng minh Tiến Khoa hoặc Duy Anh đã human review hay tự viết code. Source package dựa trên main 532b123c7f78a3d6c0dd03058ef113d255c272b7. Kết quả/receipt triển khai cũ ở phần dưới chỉ là lịch sử; đối chiếu SHA đang chạy qua /api/support/health trước khi dùng làm bằng chứng.

# VNG Support status — integrated release fixes

[Release matrix](docs/RELEASE-MATRIX.md) is the current reference for source, policy, deployment and evidence boundaries.

Production is now verified at source `01a20a7`, deployment `dpl_J4sT4LpVHb73sMSXiEKQnkaHjm8q`, https://vng-support.vercel.app. [Fresh deployment receipt](docs/releases/01a20a7.md): exact SHA/policy and Mongo ping passed; six main pages returned HTTP 200. This receipt follow-up changes documentation only and is not a new runtime deployment.

- Inspected main: `9d9ab053806250c72eea0b7b8b17f43f875252c1`. All twelve files from the two release-fix packages match integrated source after Git newline normalization. Do not apply the old ZIPs again.
- Knowledge boundary fixes entered main in `4ad01e8`. Exact-ID query/readback fixes entered in `276c264` and `5161a6e`; Verify tests are included through `9d9ab05`. Policy remains `support-guidance-v5.2`.
- Fresh isolated QA used `npm ci`: 290 unit/integration tests, lint, typecheck and build passed. Fresh desktop/mobile E2E: 33 pass, 1 skipped duplicate recording, on mock/memory server 127.0.0.1:3227. The previous 277-test baseline is historical; deployment receipts are separate.
- The owner explicitly requested agent review, fixes, commit/push and Vercel deployment in this follow-up. Documentation corrections are AI-assisted. No human review or contribution by Tiến Khoa or Duy Anh is inferred from Git authorship or package ownership.
- Existing Vercel project: `acne-a6cd/vng-support`. At deployment preparation its production alias still pointed to historical deployment `dpl_BcyeJnNXbZae9StBorhA2adSu28Y`. This observation is not proof that the new source is live. Compare the new deployment receipt and `/api/support/health` sourceRevision after release.
- Model cap/counters, database contents and policy authority remain unchanged. No paid model call or workflow write is needed for the planned read-only deployment smoke checks.
- Independent held-out data, three consenting participants, before/after outcomes and observed negative impact remain NOT COLLECTED. Threshold proposals remain inactive.
- No verified internal policy/entitlement. Public reviewer is a demo identity; no real IAM/cloud execution. Exact quote matching and lexical retrieval do not establish complete faithfulness or universal injection resistance.

[Historical status](docs/history/STATUS-before-20727b5-fixes.md) retains earlier release statements.
