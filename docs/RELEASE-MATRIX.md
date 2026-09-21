# Release matrix — integrated source and deployment evidence

Runtime source rechecked at `9d9ab053806250c72eea0b7b8b17f43f875252c1`, then deployed with documentation corrections as `01a20a7128b58a0e09e8e6f6ed1fe10a1f4a85a3`. Repository integration, QA, human review and live operation are separate claims. [Fresh deployment receipt](releases/01a20a7.md) records the actual deployment and read-only checks; the receipt commit itself changes documentation only.

| Layer | Source / policy | Evidence and limits |
| --- | --- | --- |
| Verified public deployment | 01a20a7; support-guidance-v5.2 | READY dpl_J4sT4LpVHb73sMSXiEKQnkaHjm8q at https://vng-support.vercel.app. Health matched SHA/policy and performed Mongo ping; six main pages returned HTTP 200. No paid-model call or workflow-persistence test. |
| Inspected main | 9d9ab05; support-guidance-v5.2 | Contains all twelve files from the two release-fix packages. No package reapplication is needed. |
| Knowledge release fix | 4ad01e8 | Runtime schema validation per Mongo knowledge document, boundary regressions and governance documentation are committed. Malformed neighbors no longer abort retrieval. |
| Verify release fix | 276c264, 5161a6e, dcce69c, 9d9ab05 | UUID-validated exact-ID page query/readback, compatibility/retry regressions and old-request coverage are committed. |
| Fresh local QA | 9d9ab05 runtime source; clean npm ci | 290 tests, lint, typecheck and build PASS. Fresh desktop/mobile E2E: 33 pass, 1 skipped duplicate recording, dedicated 127.0.0.1:3227 server. Tests use mock/memory or mocked Mongo adapters, not production data. |
| Original package QA | base 92d140a plus the same patches | Historical agent result: 290 tests; 33 E2E pass, 1 skip. The fresh QA row above comes from a new run on integrated source. |
| Production at preparation | cfb9295; v5.0 historical receipt | Vercel CLI confirmed existing project acne-a6cd/vng-support and Ready deployment dpl_BcyeJnNXbZae9StBorhA2adSu28Y at https://vng-support.vercel.app. This is the old deployment, not the integrated candidate. |
| Deployment authorization | explicit owner follow-up | Owner requested review, fixes, commit/push and Vercel deployment. Reuse the existing project after QA; keep database, secrets and model budget intact. |
| Human review / impact | NOT ESTABLISHED / NOT COLLECTED | Package ownership and Git commits do not prove individual authorship, review, understanding, participant consent or real-user outcomes. |

After deployment, record its exact source SHA, URL, deployment ID and policy together with the actual smoke-check scope. APP_REVISION must match the deployed source commit. A successful health Mongo ping supports connectivity only; it does not verify workflow durability, answer quality or a live OpenAI call. Never carry historical paid-model or workflow receipts forward as proof for this release.

The original workspace's uncommitted changes remain outside this isolated release clone. No Ground Truth/expected fixture changes, policy changes, budget resets, fabricated reviews or secret synchronization are part of this release.
