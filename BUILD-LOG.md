# Build Log

## UX and judge feedback — 2026-09-21

- Tool: Astra/Codex. User approved U1–U11/B1 and requested fixes from three judge feedback files before commit. Existing prototype/AI provenance retained; new commits do not rewrite authorship or contest dates.
- Base main0764f1d; isolated checkout to protect the uncommitted student contracts draft. Baseline87 tests/lint/build pass.
- Implemented Vietnamese role entry, targeted intake/preview, original question/current status, step explanation/handoff separation, readable queue/audit/Verify and VNG-inspired orange/white surfaces. Generated an original AI interpretation of NAVI; prompt and source research in public/illustrations/PROVENANCE.md. Kept licensed Nunito; old custom cursor no longer mounted.
- Shared boundary fixes: AWS secret aliases, bounded idempotency waiting, reevaluated facts/approval on all approval/completion paths, intent-derived authority, negation/exposure and K8S label guards. Independent read-only investigation and candidate review found regressions; final tests cover them.
- Server preview snapshot with fingerprint/TTL/policy binding avoids duplicate analysis. Summary projection is additive; Verify reads detail/events/queue/metrics. Original fixture expected values/hashes unchanged (48/128 match, 80 visible mismatches).
- Final source:136 unit/integration tests pass, lint pass, production build pass. Browser evidence is detailed in STATUS and artifacts/e2e-results.json. Mock/memory only; no new live provider/DB validation or deployment.
- First browser run:25/26, audit filter race/old results visible during loading; fixed request sequencing/loading state. Subsequent full run:26/26; final run after additional policy regression guards recorded in STATUS.


## Vercel và MongoDB live — 2026-09-20

- Theo yêu cầu: tạo `.env.local` cho key mới; không dùng key OpenAI cũ. Xác nhận model access, đồng bộ key/URI qua stdin vào Vercel Sensitive Secret. Không ghi secret vào source/log/report.
- Thêm vercel.json và .vercelignore; kiểm tra upload không có env files. Merge cập nhật cache/index/README đồng thời trên main, không force-push. 87 tests, lint/typecheck pass; Vercel production build pass từ `08cca12`.
- Deploy project labpass tại labpass-five.vercel.app; model gpt-4.1-mini và DB mlai26_support_v3_demo. Live smoke 12 checks pass, 1 paid model attempt tại thời điểm kiểm tra; read/write/audit được đối chiếu qua Mongo connection độc lập.
- Sau khi bản mới hoạt động, drop bốn database LabPass cũ đúng danh sách đã kiểm kê, theo yêu cầu người dùng. Report ghi tên DB đã drop và DB được giữ; không đọc/ghi hồ sơ cũ vào fixture.
- Browser desktop/mobile public entry pass. Không tuyên bố đã thử failover, load test hoặc mọi intent với model live.


## Merge toàn bộ vào main — 2026-09-20

- Người dùng thay đổi phạm vi, yêu cầu đưa toàn bộ migration kể cả `src/` lên main.
- Merge `89d62c4`, khôi phục đầy đủ source từng bị loại ở merge chọn lọc; không rewrite history, không đổi source đã kiểm thử.
- Cập nhật tài liệu và hướng dẫn agent để không còn mô tả main là source-free. Giữ prompt Luna cũ như tài liệu lịch sử có chú thích.
- Không đưa `src/domain/contracts.ts` chưa commit đang được người dùng chỉnh tại workspace chính vào merge.
- Kiểm tra tree source/runtime/test/config trùng bản đã pass 87 unit/integration, 24 E2E, lint/typecheck/build. Không chạy lại E2E chỉ vì thay đổi tài liệu.

## Merge chọn lọc để người dùng tự viết src — 2026-09-20

- Theo chỉ dẫn mới: nhận mọi thay đổi ngoài `src/` từ nhánh `codex/support-v3-migration` vào main. Loại source khỏi merge result; vẫn giữ nguyên source tham khảo trong commit `69b1649` và nhánh cũ, không rewrite history.
- Main chứa tests/config/fixtures/docs/artifacts để học và kiểm chứng về sau, chưa có runtime. 87 tests và20E2E ở các mục cũ là evidence bản tham khảo, không phải kết quả main thiếu source.
- Tạo `LUNA-SRC-TUTOR-PROMPT.md` với vai trò gia sư, bản đồ từng file, dependency/thứ tự viết, test gates và nguyên tắc chờ người dùng tự viết. Root AGENTS ghi rõ không tự generate/restore source.
- Cập nhật các trang hướng dẫn và nhãn artifacts để tránh nhầm trạng thái. Không triển khai main thiếu source; không tạo task Luna hoặc code core thay người dùng.

## Support policy/workflow migration — 2026-09-20

- Tool: Astra/Codex, theo master prompt Policy Engine & Workflow Migration. Implement trực tiếp `mlai26`, không tạo project mới; không copy runtime hoặc credential từ repository khác. Không ghi nhận thay mặt sinh viên rằng họ tự viết phần này.
- Trước code: đọc tài liệu/source/tests/datasets theo checklist, ghi `MIGRATION-AUDIT.md` và manifest SHA256. Baseline12tests/lint/build PASS.
- Phases1–2: typed contract/catalog, executable rule data độc lập, guidance/precedence/missing/conflict/subrequests/redaction, tests tương ứng trước nối intake.
- Phase3: preview và confirmed/idempotent submit, memory/Mongo document storage, safe input/decision API, UI động; giữ generic UI ở `/legacy/*` và API cũ.
- Phase4: mock/OpenAI server adapter, strict schema và evidence, recompute risk, approved assistance steps, no tools, no retries, timeout12s và budget tối đa20. Explanation deterministic. Tham khảo OpenAI JSON/structured-output docs; không gọi paid model trong QA.
- Phase5: public synthetic reviewer, optimistic versions, transitions, mandatory reject/override reason, employee feedback/handoff/clarification, embedded audit và history.
- Phase6: Verify dùng route submit thật, bộ v3 riêng3auto/2escalate, extended10case, load5+123 fixture gốc không sửa expected. Hash tests bảo đảm originals không đổi. Original evaluation cuối48/128 matched,80 mismatch hiển thị; không case ESCALATE gốc nào thành AUTO.
- Các lỗi phát hiện và sửa: phủ định “không factory reset” bị nhận destructive; redaction dấu tiếng Việt ở “mật khẩu là”; model environment thiếu evidence; guidance label đi kèm requestedAction wipe; generic endpoint phản chiếu secret/provider exceptions; từ “load” khớp nhầm “loa”; yêu cầu chuyển admin bị hiểu nhầm xin quyền admin. Regression tests đi kèm.
- Phase7: README/RUNBOOK/STATUS cập nhật runtime, provenance, limits và compatibility; E2E server riêng3216, reusefalse, app marker/mock/memory. Xem STATUS và artifacts cho kết quả QA cuối.
- Baseline Git mới nhất `4009759`; không đổi author date/commit date/lịch sử. Commit mới chỉ ghi nhận thay đổi mới, không biến prototype cũ thành code sáng tác sau cutoff. Nhóm cần công bố scaffold/AI assistance và xác nhận quy định cuộc thi.
- Human review chưa được quan sát: đội thi vẫn phải đọc, giải thích, kiểm thử và ghi quyết định của từng thành viên. Không ghi khống đã review hoặc bảo đảm đủ điều kiện dự thi.

## Initial generic scaffold

- Date: 2026-09-16
- Scope: reusable pre-sprint shell only.
- AI tools used: AI coding assistant (this session); team should add the exact tool/account details before submission.
- AI assistance: generated the initial Next.js/TypeScript structure, generic UI primitives, API response helpers, Zod validation pattern, Prisma Event model, LLM wrapper, generic Verify runner, and documentation templates.
- Human decisions: preserve LabPass as the future concept, keep the current code challenge-agnostic, use deterministic generic echo verification, keep the API key server-side, and use PostgreSQL/Prisma for production event persistence.
- Corrections/risks to review: dependency versions, Render configuration, database connectivity, and all generated code must be reviewed and explained directly by team members.
- Largest feature intentionally cut: challenge workflow, because it must be developed during Sprint 1 after the official brief is released.

## 2026-09-20 — Restore prototype UI around Support v3

- Tool: Astra/Codex. User requested the previous orange/NAVI interface integrated with the existing migration policy/workflow.
- Reused prototype home, NAVI illustration/cursor, font assets/licenses and relevant CSS. Adapted presentation to the current Next 15/Tailwind 3 stack without importing prototype backend or environments.
- Restored employee modes/preview editing, reviewer queue/filter/deep links, and cream/orange presentation for assistance, audit and Verify. `/workspace` remains an alias alongside `/send-help`; legacy generic API/UI remains.
- Initial E2E exposed a filter label selector issue, fixed with an explicit accessible label. A concurrent edit to `src/domain/contracts.ts` then broke catalog compatibility in the shared workspace; preserved that edit and moved final validation to an isolated checkout of `69b1649` plus UI changes.
- Final unit/integration: 87 pass. Final E2E: 24 pass, no retry/flaky tests, desktop + Pixel 7. Lint passes. Build/typecheck evidence is recorded in STATUS. Screenshots and JSON report are in `artifacts/`.
- Main remains source-free. The UI commit excludes the concurrent domain edit. No student review/authorship or contest eligibility is asserted.

## Update template

For every meaningful change, record:

1. Tool or assistant used.
2. What it generated or changed.
3. What failed or cost time.
4. What a team member reviewed and decided.
5. Test/evidence link.

## Authorship clarification

The team requirement is stricter than merely using an AI coding assistant: challenge-specific TypeScript/TSX core must be self-written by student members. AI-generated generic scaffold code is not evidence of student authorship for the challenge core. During Sprint 1, each member must own a vertical slice, make the commits, explain the code, and record any material AI assistance.

## 2026-09-21 — Merge security fixes with UX/judge feedback

Merged both histories from e98d91e and 2803b8e. Policy support-guidance-v4.1 retains scoped approval verification, full subrequest evaluation, reviewer reasons and audit metadata alongside bound previews and Vietnamese UX. Labelled fact fragments do not become false subrequests. Older abandoned receipts recover through optimistic version guards. Validation: 153 unit/integration, lint, production build and 26 fresh-server desktop/mobile E2E passed. Original 128 fixture expectations unchanged (55 matches, 73 mismatches). Live release evidence follows after deployment.

### Production verification follow-up

Real OpenAI assistance and MongoDB submission/readback/reviewer/audit succeeded on deployment dpl_71e2uTywwY3Kqp4ipktDLSoX79rS. Found optional approvalReference converted to BSON null; set MongoClient ignoreUndefined so preview and stored API snapshots match. Added a regression reproducing an OpenAI-enabled reset ambiguity unnecessarily invoking extraction; deterministic INFO-RESET now asks the known clarification without a model call. No secrets or budget counters changed.

### Final public release

Source c0c5ea5 deployed as dpl_9EUsGJXDWeHpaw6KGMh9YSQkWFwF to https://labpass-five.vercel.app. Final validation: 154 tests, lint, build, 26 desktop/mobile E2E and 17 live checks passed. Real OpenAI assistance and MongoDB persistence/audit verified through the deployed application. Evidence: RELEASE-VERIFICATION-2026-09-21.md and artifacts/live-final-verification.json. Budget unchanged.


## 2026-09-21 — DOCX error report recheck

Codex/Astra read all 23 findings against current runtime and history. Added persisted Verify runs, a default four-case pack (preserving De A five cases), server pagination/search and full counts, contextual model explanations bound to curated actions, targeted clarification and reviewer audit navigation. New regression suites add 21 tests to baseline 154. Original Ground Truth unchanged (55 match / 73 mismatch).

Validation: 175 unit/integration, lint, production build, 26 desktop/mobile E2E and a dedicated Stop/Override/audit video test passed. Tests use a new port 3227 server with mock/memory. Live production results are recorded separately after deployment. Formatted new code for student readability.

Created a five-slide technical draft, a one-page build log and raw local mock video. Owner confirmed no real-user feedback exists. No interviews, participant data, cost totals or time savings were invented. Student draft remains untouched. Main history is retained and AI contribution is disclosed. Runtime authority and actual infrastructure operations were deliberately kept separate: the public demo never executes real provisioning.


### Production diagnostic follow-up

First report release passed MongoDB/Verify/pagination/reviewer readback but the real model call failed safe as MODEL_UNAVAILABLE. Added safe categorical failureReason metadata (budget, configuration, timeout, refusal, truncated output or upstream class) without raw provider error text, credentials or extra logging. Shortened contextual output instructions within the existing token budget. Budget limits remain unchanged. 176 unit/integration and lint/build pass; final live outcome recorded separately.


### Explicit budget authorization

Production diagnosis returned BUDGET_EXHAUSTED. Owner explicitly approved at most 10 additional model attempts, raising cumulative limit from 20 to 30 while preserving the existing counter and data. Code ceiling is now 30; default remains 20. Regression reserves 20, raises config to 30, permits exactly 10 more and rejects config over the ceiling. No budget reset, no new database, no secret changes.


Final E2E repetition exposed a pack-selection race: Verify enabled controls before final saved-run readback, which could overwrite a newly selected pack. Kept controls locked until readback completes and added delayed real-API readback to the browser regression. No policy result is stubbed.
