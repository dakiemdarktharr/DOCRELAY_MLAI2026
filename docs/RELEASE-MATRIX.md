# Release matrix — current repository reference

GitHub main was inspected at `92d140a72bc424aa5e7199e6d815f9ae286a84a8`. This table separates observed Git state, local tests and the last repository-recorded live receipt. No live deployment/provider/database call was made in this recheck.

| Layer | Source / policy | Evidence and limits |
| --- | --- | --- |
| Inspected main | 92d140a; support-guidance-v5.2 | Contains RAG eae86db/4a86708, safety/evaluation 6cc5832 and Verify retry 92d140a. Prior packages are committed on main; deployment and human review are separate claims. |
| Baseline local QA | exact 92d140a | 277 tests, lint, typecheck, build PASS. New edge-case regressions subsequently reproduced 4 failing assertions; baseline PASS was insufficient for deployment approval. |
| New Tiến Khoa release-fix | uncommitted patch on 92d140a; keeps v5.2 | Runtime schema validation of each untrusted knowledge document; malformed neighbors no longer abort retrieval. |
| New Duy Anh release-fix | uncommitted patch on 92d140a; keeps v5.2 | Exact-ID paged Verify readback fixes false persistence failures beyond the newest 200 records; docs reflect actual main state. |
| Last recorded public release | cfb9295c07235f3f8bb20e45c6fd97fc9fcafed1; v5.0 | Repository receipt artifacts/vng-support-live-verification.json records 13/13 checks for https://vng-support.vercel.app, deployment dpl_BcyeJnNXbZae9StBorhA2adSu28Y. Historical receipt only; current site was not reverified. |
| New candidate QA | exact base + delivered patches | See new deliverable QA-RESULTS.md. Mock/memory and fake Mongo boundary tests; not live Mongo evidence. |
| Deployment decision | BLOCKED_PENDING_FIX_REVIEW | User authorized initialization only when no problems were found. Two reproduced runtime issues prevent that condition; no Vercel changes made. |
| Human impact / held-out quality | NOT COLLECTED | No participants, consented quotes, independent labels or before/after data invented. |

After human review/integration, rerun checks on the resulting exact source, then obtain the owner's deployment instruction. Reuse the existing Vercel project if present; do not create a duplicate or synchronize secrets automatically. Update source SHA, policy, URL, deployment ID and verified checks together only when actual evidence exists.
