> Package provenance: hai package AI-assisted, package base `532b123c7f78a3d6c0dd03058ef113d255c272b7`, current main head `bea350303d5812c7a72873e2cc592de9f9c2acf2`. Human review chưa được xác nhận; receipt triển khai cũ chỉ là lịch sử. Bản sửa tài liệu này không tạo project, đổi cấu hình hay deploy Vercel.

# Release matrix — integrated source and deployment evidence

Current main head: `bea350303d5812c7a72873e2cc592de9f9c2acf2`. Package base `532b123c7f78a3d6c0dd03058ef113d255c272b7` is historical.

Current main is `bea350303d5812c7a72873e2cc592de9f9c2acf2`. The latest recorded deployment used historical source `01a20a7128b58a0e09e8e6f6ed1fe10a1f4a85a3`; repository integration, QA, human review and live operation are separate claims.

| Layer | Source / policy | Evidence and limits |
| --- | --- | --- |
| Verified public deployment (historical) | 01a20a7; support-guidance-v5.2 | READY dpl_J4sT4LpVHb73sMSXiEKQnkaHjm8q at https://vng-support.vercel.app. Health matched SHA/policy and performed Mongo ping; six main pages returned HTTP 200. This is not evidence that current main `bea3503` is deployed. |
| Inspected main (current) | bea3503; support-guidance-v5.2 | Current main includes judge-pack boundary enforcement and refreshed submission docs. The latest commit message reports 322 unit/integration tests and 45 E2E pass; not independently rerun in this documentation-only correction. |
| Knowledge release fix | 4ad01e8 | Runtime schema validation per Mongo knowledge document, boundary regressions and governance documentation are committed. Malformed neighbors no longer abort retrieval. |
| Verify release fix | 276c264, 5161a6e, dcce69c, 9d9ab05 | UUID-validated exact-ID page query/readback, compatibility/retry regressions and old-request coverage are committed. |
| Fresh local QA (historical) | 9d9ab05 runtime source; clean npm ci | 290 tests, lint, typecheck and build PASS. Fresh desktop/mobile E2E: 33 pass, 1 skipped duplicate recording, dedicated 127.0.0.1:3227 server. Tests use mock/memory or mocked Mongo adapters, not production data. The latest main commit message reports 322 unit/integration tests and 45 E2E pass; not independently rerun in this correction. |
| Original package QA | base 92d140a plus the same patches | Historical agent result: 290 tests; 33 E2E pass, 1 skip. The fresh QA row above comes from a new run on integrated source. |
| Production at preparation | cfb9295; v5.0 historical receipt | Vercel CLI confirmed existing project acne-a6cd/vng-support and Ready deployment dpl_BcyeJnNXbZae9StBorhA2adSu28Y at https://vng-support.vercel.app. This is the old deployment, not the integrated candidate. |
| Deployment scope for this correction | documentation-only | No Vercel project creation, branch change, secret sync or deployment was performed. A current live SHA still requires a separate read-only/live verification. |
| Human review / impact | NOT ESTABLISHED / NOT COLLECTED | Package ownership and Git commits do not prove individual authorship, review, understanding, participant consent or real-user outcomes. |

After deployment, record its exact source SHA, URL, deployment ID and policy together with the actual smoke-check scope. APP_REVISION must match the deployed source commit. A successful health Mongo ping supports connectivity only; it does not verify workflow durability, answer quality or a live OpenAI call. Never carry historical paid-model or workflow receipts forward as proof for this release.

The original workspace's uncommitted changes remain outside this isolated release clone. No Ground Truth/expected fixture changes, policy changes, budget resets, fabricated reviews or secret synchronization are part of this release.
