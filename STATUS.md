# Current production — Conversation/RAG — 21/09/2026

Site https://labpass-five.vercel.app · deployed source `f5272b5` · policy v5.0 · deployment `dpl_5D5KuDx2yutUmfqR8k4STn8qYKfU` READY. **22/22 final live checks pass**, including actual OpenAI answers, MongoDB retrieval/persistence, official web citations and Verify 4/4. Cumulative model-attempt cap 50 was explicitly approved; no counter reset. Final local suite: **218 pass**, lint and production build pass. E2E: 29 pass + 1 duplicate-video skip; targeted conversation rerun 2/2 pass.

Details, historical failures and limitations: [RAG release verification](RAG-RELEASE-VERIFICATION-2026-09-21.md).

---

# Conversation/RAG candidate — 21/09/2026

Policy `support-guidance-v5.0`: direct conversational answers, reviewed MongoDB knowledge, optional official web search and highlighted chat bubbles. 218 unit/integration tests pass; lint and production build pass; 29 desktop/mobile E2E pass (1 existing duplicate-video skip), fresh port 3227 server. Existing operational safeguards and all original fixture expectations retained. Live deployment verification is recorded separately after release; historical evidence below validates older releases.

See [migration audit](RAG-CONVERSATION-MIGRATION.md). Known limits: small lexical corpus, not semantic/vector retrieval; no verified internal employee/GPU policy; safe fallback when budget/API unavailable; public lookup restricted to VNG/GreenNode domains. No claim of universal prompt-injection immunity.

---

# Report fixes — 21/09/2026

Policy `support-guidance-v4.2`. Đã đối chiếu 23 mục, bổ sung Verify runs, phân trang/tìm kiếm, contextual assistance, câu hỏi có trọng tâm và minh bạch dữ liệu. Xem [DOCRELAY-ERRORS-RECHECK.md](DOCRELAY-ERRORS-RECHECK.md).

177 unit/integration, lint/build, 27 E2E pass (1 skip video mobile trùng). Race đổi bộ Verify đã được kiểm thử bằng phản hồi API chậm. Bằng chứng người dùng thật chưa có (chủ dự án xác nhận). Slide 5 trang, build log một trang và video local mock nằm trong `submission/`. Production source `d432b94`, deployment `dpl_8uFvh41TniLMzoSaB2TjYNZmE5jr` READY, **27/27 live checks PASS**, gồm OpenAI và MongoDB thật. Xem [release hiện tại](REPORT-RELEASE-VERIFICATION-2026-09-21.md).

# Status — Production release — 21/09/2026

## Previous production (before report fixes)

- URL: https://labpass-five.vercel.app
- Source `c0c5ea5`; deployment `dpl_9EUsGJXDWeHpaw6KGMh9YSQkWFwF`, READY.
- **17/17 live checks PASS**, including actual OpenAI assistance, MongoDB bound preview/submission/detail/audit readback, reviewer controls and reset clarification.
- **154/154 tests**, lint, build and **26/26 desktop/mobile E2E PASS** on final source.
- Full evidence and limits: [RELEASE-VERIFICATION-2026-09-21.md](RELEASE-VERIFICATION-2026-09-21.md).

## Release validation — 21/09/2026

- Reconciled UX/judge commit `e98d91e` with remote security/workflow commit `2803b8e`; policy is `support-guidance-v4.1`. Both histories are preserved.
- Combined validation: **154/154 unit/integration PASS**, lint PASS, build PASS, **26/26 desktop/mobile E2E PASS** on a fresh checkout server at port 3227.
- Preserved remote rate limits, required reviewer reasons, per-subrequest evaluation, approval registry and expanded audit. Bound previews, Vietnamese UX, field-specific questions, resource limits and secret protection remain.
- A labelled fact after a semicolon is attached to its request; independent risky subrequests still evaluate separately. Abandoned receipts older than 60 seconds can recover with a version guard.
- Original fixtures: **55/128 match, 73 mismatches**; original expected values unchanged.
- First production smoke confirmed real OpenAI and MongoDB persistence/reviewer/audit. Fixed BSON optional-field serialization and kept reset clarification deterministic with OpenAI enabled. Final deployment evidence is in artifacts/live-final-verification.json.

## Previous UX candidate validation (historical, before merge)

- Branch `codex/ux-vng-refurbish`, base main `0764f1d`, isolated checkout `C:/Users/ANHKHOI/AppData/Local/Temp/mlai26-ux-refurbish-20260921`. Original workspace remains on its prior branch with the student's uncommitted `src/domain/contracts.ts` untouched.
- Implemented U1–U11/B1: Vietnamese entry labels without login, one-column intake/preview, clear original question and current status, targeted clarification, explain-step separate from handoff, tracking link, staff queue/search, orange/white styling and AI mascot. Removed the four requested UI blocks. C01–C20 checklist not added.
- Judge feedback mapping and compatibility notes: [UX-JUDGE-MIGRATION.md](UX-JUDGE-MIGRATION.md). Redaction aliases, concurrent submit, reviewer authority, negation/exposure, model validation, preview binding, summary queue and Verify readback covered.
- Final source unit/integration: **136/136 PASS**. `npm run lint`: PASS. `npm run build`: PASS (includes TypeScript). Independent `npm run typecheck` also passed before final bounded policy/guidance edits; production build validates final types.
- Final `npm run test:e2e`: **26/26 PASS**, 0 failures/retries/flaky, desktop Chromium + Pixel 7, about 1.1 minutes. Uses fresh Next dev server on **127.0.0.1:3227**, reuseExistingServer=false, mock model, memory storage and no external credentials.
- Original 128 fixtures: **48 match, 80 mismatches** under current policy. Expected values and original data hashes unchanged; mismatches remain visible in `artifacts/original-fixture-evaluation.json`. New v3 Verify packs remain 3 auto/2 escalate and 10 extended cases.
- No new Vercel deployment, no MongoDB live writes/migration, no paid model call or budget reset in this pass. Existing public URL still has the earlier code; historical live results below do not validate this candidate.
- New Mongo collection `v3_support_previews` stores redacted expiring snapshots with TTL. A live deployment smoke must verify create-index permissions and cross-instance preview/readback before claiming live DB readiness.

---

The following sections are historical evidence for the previous release, retained for provenance.

# Support migration status — 20/09/2026

## Historical production — 20/09/2026

- Public URL: https://labpass-five.vercel.app; deployment `dpl_AZS54EPpARmgqwBJ11iqvGw6tsw6`, source main `08cca12`. Vercel build PASS.
- Runtime xác nhận `MLAI_SUPPORT_REFEREE_V3`, storage `MONGODB`, provider `openai`; AI_MODEL và AI_ESCALATION_MODEL dùng `gpt-4.1-mini`. Key mới do người dùng nhập, lưu Vercel Sensitive Secret.
- 12/12 live checks PASS: shutdown guide, reset hỏi thêm, VPN assistance từ OpenAI, handoff giữ history, reviewer reject, đọc lại version, RDP/secret fail-safe/redaction, audit, queue và đối chiếu document bằng kết nối Mongo độc lập. Đã tiêu thụ 1 model attempt lúc kiểm tra; giới hạn 20 lifetime.
- Database mới `mlai26_support_v3_demo`: `v3_support_requests`, `v3_model_budgets`, index updatedAt. Đã xóa bốn DB LabPass cũ theo yêu cầu sau khi xác nhận bản mới hoạt động; giữ sample_mflix/admin/local.
- Desktop/mobile public entry và không tràn ngang PASS. Reports: `artifacts/live-deployment-smoke.json`, `artifacts/mongodb-migration.json`; screenshots `production-help-*`.
- Sau khi đồng bộ cập nhật main từ tác vụ khác: 87/87 unit/integration, lint/typecheck PASS; full E2E 24/24 là evidence trước deploy. Smoke live bổ sung trên bản production hiện tại, không gọi lại cả bộ Verify bằng paid model.

## Policy hardening — 21/09/2026

- Runtime policy đã nâng lên `support-guidance-v4`; policy-v2, Verify cases và Ground Truth gốc vẫn giữ nguyên hash.
- Đã khóa các bypass phát hiện qua stress test: alternate security wording, database export, multi-subrequest, secret redaction thiếu dấu phân cách, model tự hạ unknown intent, reviewer approve khi còn missing facts, approval hết hạn/sai scope và audit thiếu metadata.
- Subrequest được evaluate độc lập; `OTHER` route `Classifier/reviewer`; câu hỏi được lưu ở cả `questions` và alias contract `targetedQuestions`; audit lưu policy version, next step, redaction markers, approval và subrequest outcomes.
- Verification sau hardening: unit/integration 102/102, E2E desktop/mobile 24/24, lint, typecheck và production build PASS. Các report/screenshot sinh trong lúc chạy được khôi phục, không đưa timestamp/UUID runtime vào thay đổi.

## Main đã nhận đầy đủ source

Theo yêu cầu mới nhất, merge toàn bộ `codex/support-v3-migration` tại `89d62c4` vào `main`, bao gồm `src/`. Source và các file runtime/test/config giữ nguyên bản migration đã kiểm thử; thay đổi thêm chỉ cập nhật tài liệu trạng thái main. Bản `contracts.ts` chưa commit trong workspace chính được giữ nguyên, không đưa vào merge.

## Cập nhật giao diện cũ + workflow v3

- Khôi phục orange/NAVI, Nunito/Baloo2, home hai nút, form employee hai cột và các panel reviewer/audit/Verify. `/send-help` và `/workspace` dùng cùng UI; preview có quay lại sửa; reviewer có lọc và URL chi tiết tải lại được.
- Giữ nguyên backend policy/workflow v3. Nguồn UI/font và khác biệt so với prototype được ghi tại `UI-RESTORATION.md`; không thay đổi provenance bằng commit mới.
- QA cuối cho thay đổi UI: 87/87 unit/integration, 24/24 E2E desktop/mobile PASS (75.25s, 0 retry/flaky); lint và production build PASS trên checkout riêng. Typecheck cũng được kiểm tra riêng; build bao gồm kiểm tra TypeScript.
- E2E cuối chạy tại checkout riêng `C:/Users/ANHKHOI/AppData/Local/Temp/mlai26-ui-validation-20260920`, port3216, base `69b1649` + UI changes. Đây là checkout của cùng repository, dùng mock/memory. Report có rootDir tương ứng.
- Trong lúc QA, `src/domain/contracts.ts` ở workspace chính được chỉnh bởi thao tác khác và không còn khớp catalog (ví dụ `STORAGE_BACKUP` thay `STORAGE`). File đó được bảo toàn, không đưa vào commit UI; không suy diễn kết quả QA này áp dụng cho bản domain đang viết dở.
- Tại thời điểm commit UI `89d62c4`, main còn chưa có source; yêu cầu merge toàn bộ sau đó thay thế giới hạn này như ghi ở đầu tài liệu.

Phases 0–7 đã có implementation, test và documentation cho demo local. Đây là repository `mlai26`, không phải bản LabPass/DocRelay trong repository khác. Live persistence/model/deployment đã được kiểm tra trong phạm vi smoke ghi ở đầu tài liệu.

## Runtime

- Canonical request/decision contract, 13 service groups, taxonomy/fields, versioned policy và GUIDE-001…008.
- Preview, confirmed idempotent submit, deterministic precedence, redaction, scoped demo approval.
- Model mock/OpenAI adapter, evidence/schema checks, fail-safe, bounded calls, safe assistance và deterministic explanations.
- Employee feedback/clarification, public demo reviewer, guarded transitions/CAS, embedded audit/history và feedback counts.
- Verify cùng API, judge input mới, Đề A v3 đúng3auto/2escalate. 123 Ground Truth +5Verify gốc giữ nguyên byte-for-byte và được báo mismatch riêng.
- Generic UI chuyển `/legacy/*`; các API health/echo/events được giữ. Không thao tác hạ tầng thật.

## Evidence hiện tại

- Baseline trước migration: 12 unit/integration tests, lint và build PASS.
- Phase gates domain3, policy17, supportAPI4, model6, reviewer8 ban đầu (nay10), Verify18 PASS.
- Full test: 87/87 PASS; lint, typecheck và production build PASS. E2E20/20 desktop/mobile PASS (51.9s, không retry, 0flaky), sau sửa regression từ khóa ETL. `artifacts/e2e-results.json` là report runner. Lượt cuối chạy ngoài sandbox Windows để Playwright tự cleanup server thành công; không dừng process3000.
- Original fixture report: 128 total, 48 matched action+bucket, 80 mismatch với expected cũ; không case ESCALATE gốc nào thành AUTO trong lượt này. Đây là compatibility analysis, không phải pass rate với policy mới hay production accuracy. Xem `artifacts/original-fixture-evaluation.json`.
- Hash check giữ nguyên toàn bộ nguồn policy/verify/ground-truth có trong `artifacts/migration-baseline-manifest.json`.
- E2E dùng port3216, app marker `MLAI_SUPPORT_REFEREE_V3`, mock/memory; không dùng port3000 PID48292 của repository khác.

## Chưa xác nhận / giới hạn

- Live Mongo connection/read-write và một assistance call OpenAI đã pass. Chưa kiểm chứng chủ động cluster restart/failover hoặc toàn bộ taxonomy trên model live. Memory vẫn không bền vững/chia sẻ instance nếu chọn chế độ đó.
- Regex extraction/redaction có giới hạn ngôn ngữ; medium model chỉ chọn bước đã kiểm duyệt. Catalog đầy đủ không có nghĩa đầy đủ automation nghiệp vụ.
- Không SSO/actor identity, external tools, IAM/DB/cloud execution, production data, approval authority thật. Public reviewer chỉ synthetic demo.
- Public deployment Vercel đã xác nhận; blueprint Render vẫn là generic và chưa được kiểm thử.
- npm audit từ dependency install báo6 advisories (2moderate/4high); không force-upgrade major ngoài phạm vi migration.
- Phần học sinh tự viết/review cần ghi riêng. Source migration do Astra/Codex hỗ trợ không được ghi là tự viết hay dùng commit mới để thay đổi nguồn gốc scaffold.

## Git và provenance

Baseline commit `4009759` trên `main` (20/09/2026 16:20 +07), remote `dakiemdarktharr/DOCRELAY_MLAI2026`. Migration được tập hợp trên nhánh `codex/support-v3-migration` để review. Audit phase0 ghi nhận trạng thái chưa commit ở thời điểm kiểm tra ban đầu; sau đó đã có baseline commit. Không rewrite lịch sử hoặc timestamp. Tài liệu phân công TEAM-PLAN/PARALLEL-WORK-PLAN là lịch sử kế hoạch; prompt migration hiện tại cho phép agent triển khai và phải công bố AI assistance.

## Liên kết GitHub với Vercel

Bản production hiện tại được triển khai bằng Vercel CLI và đã xác nhận hoạt động. Tự deploy khi push GitHub chưa bật: Vercel từ chối `git connect` vì tài khoản chưa có GitHub Login Connection (HTTP 400). Người dùng cần kết nối GitHub trong phần Login Methods/Connections của Vercel, sau đó liên kết project labpass với dakiemdarktharr/DOCRELAY_MLAI2026. Lỗi này không ảnh hưởng URL production đang chạy.
