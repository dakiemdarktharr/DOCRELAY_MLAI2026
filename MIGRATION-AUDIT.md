# Phase 0 — audit trước triển khai, 20/09/2026

Repository thực hiện: `C:/Users/ANHKHOI/Documents/ChatGPT/mlai26`. Đây là skeleton echo, không phải repository `typescript_maxxing` của lượt trước. Nhánh master chưa có commit; toàn bộ file hiện untracked. Không khởi tạo project mới, không sửa lịch sử hoặc copy runtime/secret từ repository khác.

## Runtime đã có

- Next 15.5.25, React 19, TypeScript strict, Zod 3, Prisma/PostgreSQL, Vitest, Playwright.
- `/`, `/workspace` echo, `/verify` bốn echo cases gọi API thật, `/audit` generic events.
- Envelope `{success:true,data}` hoặc `{success:false,error:{code,message,details?}}`.
- `GET /api/health`: `{success:true,data:{status:"ok"}}`; `POST /api/echo`: `{text}` trim, 422 malformed/missing; `GET /api/events`: array `{id,type,actor,metadata,createdAt}`; `/api/llm-test` sandbox server-side.
- Event lưu PostgreSQL khi có DATABASE_URL, memory khi không có. Generic LLM có timeout/retry nhưng exception message chưa được lọc an toàn.
- Loading/error UI hiện có. Dialog chưa có focus trap; header chưa tối ưu mobile. Chưa auth; không có authority thực tế.

## Chỉ có trong tài liệu

Support taxonomy, Mongo repository, reviewer/state machine, deterministic decision engine, safe guidance, model extraction/assistance, scoped approval verification, request audit và evaluation metrics. Policy/ground truth/Verify đã có file, chưa được import vào runtime.

## Đọc và baseline

Đã đọc README, PROJECT-OVERVIEW, STATUS, RUNBOOK, TEAM-PLAN, PARALLEL-WORK-PLAN, mlai26_new/PROJECT-MEMORY và AGENTS, toàn bộ src/tests và policy/verify/ground-truth. Dữ liệu là synthetic, không phải policy VNG được xác nhận.

- `npm test`: PASS 12/12, 3 suites.
- `npm run lint`: PASS.
- `npm run build`: PASS, Prisma generation + Next production build.
- Port 3000: PID 48292, Node với helper `.codex-finalizer/atlas-dns.cjs`, là server repository trước. Không dùng lại. E2E mới dùng port 3216, `reuseExistingServer:false`, env mock/memory rõ ràng; health riêng định danh app.
- Repo hiện không có credentials runtime được cung cấp. Không tự sao chép secret từ repository khác. Mongo support thêm riêng; Prisma generic events giữ compatibility.

## Conflict và quyết định migration

1. README/STATUS/TEAM-PLAN mô tả chỉ generic, giới hạn AI và PostgreSQL/Render; prompt hiện tại yêu cầu agent implement Support. Áp dụng yêu cầu hiện tại, công bố AI-assisted, không nhận là sinh viên tự viết. Giữ tài liệu phân công làm lịch sử, cập nhật trạng thái thực tế.
2. policy-v2 yêu cầu device ID/location kể cả diagnosis và OTHER luôn escalate. Prompt mới ưu tiên guidance không over-escalate: GUIDE-001…008 không yêu cầu asset ID; chỉ repair/replacement ticket mới cần ID/location. OTHER được classify lại; unknown thiếu facts hỏi thêm, ngoài scope xác định thì review.
3. Approval claim/reference không là verified. Giữ AUTHZ, không đọc `verified` từ browser/model. Synthetic registry chỉ có scope demo cụ thể, có role, action, resource, duration, expiry.
4. Verify gốc 5 cases: 2 AUTO / 3 ESCALATE. ETL thiếu sizing đang ESCALATE/MISSING_INFO trái action contract. Nhiều AUTO fixtures dùng manager claim trái policy-v2. Export data ra laptop cần SECURITY_RISK thay vì chỉ BEYOND_AUTHORITY. Giữ toàn bộ fixture cũ byte-for-byte; không tự nâng claim thành verified.
5. Tạo pack version mới 3 AUTO / 2 ESCALATE bằng 3 guidance/diagnostic an toàn và 2 request production/public exposure. Giữ bộ gốc selectable và hiển thị mismatch, cùng migration note lý do; bộ mở rộng có missing/model failure/mixed/injection/conflict.
6. Reset không rõ restart/factory reset → NEEDS_INFORMATION; wipe/corporate factory reset hoặc yêu cầu thao tác xóa → review. Không cung cấp thao tác wipe tự động. Mọi AUTO chỉ guidance hoặc simulated workflow.
7. Chỉ giữ raw đã redact; không lưu bản secret gốc, kể cả mã hóa. Assistance chỉ được chọn các bước an toàn thuộc catalog; output ngoài schema/bằng chứng/allowlist → fail-safe. Không tool calls, không chain-of-thought.

## Phases và gate

0. Audit này + baseline + manifest hash nguồn cũ.
1. Contracts/schema + full service catalog/intent labels + policy data version mới; test contracts/catalog trước phase 2.
2. Normalization/redaction/extraction fallback + deterministic precedence/guidance/missing/conflict/multi-request; policy tests trước phase 3.
3. Preview/submit/result API + form nhóm/kind/dynamic fields/freeform, memory/Mongo adapter; API tests trước phase 4.
4. Server adapter, bounded calls/timeouts, extraction evidence, safe assistance, deterministic explanations; model failure tests trước phase 5.
5. Reviewer transitions/version guard, assistance handoff, feedback, audit; workflow tests trước phase 6.
6. Verify gọi cùng `/api/support/requests`, bộ gốc và version mới, judge input, metrics không giả; Verify integration trước phase 7.
7. README/RUNBOOK/STATUS/BUILD-LOG + full tests/lint/build/E2E đúng server. Báo giới hạn live Mongo/LLM nếu chưa có credential, không ghi là đã kiểm chứng.

## File dự kiến

- Thêm `src/domain/{contracts,catalog,policy-source,policy,text,redaction}.ts`.
- Thêm `src/services/support.ts`, `src/lib/{support-repository,support-http,support-model}.ts` và API `/api/support/*`, `/api/review/*`.
- Sửa trang workspace/verify/audit/home/header; thêm review và request detail; giữ generic UI ở `/legacy/*` cùng endpoint cũ.
- Thêm versioned policy/Verify config; không sửa JSON ground truth/Verify gốc. Thêm policy, API, model, workflow, Verify và E2E tests.
- Sửa package/lock để thêm Mongo driver; giữ Prisma, environment example, Playwright port; cập nhật docs và evidence.
