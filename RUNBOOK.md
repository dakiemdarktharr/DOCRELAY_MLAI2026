# Conversation / RAG operations — 21/09/2026

- Keep the existing Vercel project and MongoDB database. First conversation retrieval idempotently seeds `v3_support_knowledge`; it does not delete requests or old records. Account needs collection/index/upsert permissions. Public users cannot write knowledge articles.
- Articles have immutable versioned IDs, provenance, review date and expiry (initial corpus expires 2026-12-20). Review sources and add a new version before expiry. Retire outdated articles by expiry; never accept arbitrary model/user text into the approved collection. Label+keyword retrieval is intentionally small; introduce embeddings only with a measured multilingual retrieval benchmark.
- Optional `AI_CONVERSATION_MODEL` and `AI_WEB_MODEL` inherit `AI_MODEL` (current gpt-4.1-mini). `AI_WEB_SEARCH=true` enables Responses hosted web search for public company/GPU questions. Only server-owned queries and approved domains are searched. No shell, MCP, function or database tools are exposed to the LLM. `v3_support_web_cache` expires after 24 hours and is distinct from reviewed knowledge.
- Search reserves one existing budget attempt; answer reserves one. Ordinary chat normally consumes one attempt. Never reset the lifetime counter or raise the cap beyond authorization. Budget/provider/invalid-output failures return an explicit safe fallback for conversation; operational failure handling remains unchanged.
- Production preview/submit contracts remain compatible. Assistance optionally contains `answer` (text, model label, source list, knowledge IDs, storage, web status, fallback reason, ignored-override flag). POST `/api/support/requests/:id/conversation` accepts `{version, question}` and requires an open conversational request. Stale versions and closed requests are rejected. Each turn is redacted and risk-evaluated anew; reviewer handoff retains history.
- Smoke: greeting returns CHAT-001; Google recovery cites support.google.com; unknown software asks exact name/OS without invented download; public policy shows public scope; benign override+recipe answers; override+public RDP escalates. Check bubble text wrapping and reduced-motion on mobile. No reviewer task should be created merely because a safe answer failed.
- `retrieval=mongodb` plus saved knowledge IDs is live retrieval evidence. `source=openai` is necessary to claim a real model answer; `webSearch=used` includes a valid cached public lookup and source date. Never describe mock/fallback as live AI or cached lookup as a new live search.

---

## Report fixes: Verify, storage, pagination and release identity

- Default `/verify` runs `submission-4`. Select `de-a-v3` for 3 auto / 2 escalate. Each run saves to MongoDB `v3_verify_runs`; copy `/verify?run=<id>`. Reload, stop after the current case, or resume unfinished cases. Server calls the production request API and stores server-derived actual results.
- Queue/audit default excludes new Verify cases. Select Case Verify or All to inspect them. Historical untagged records remain unchanged.
- `GET /api/support/requests?view=page&limit=30&cursor=0&q=VPN&origin=support&status=pending` returns `{items,total,nextCursor}` inside the normal envelope. `GET /api/support/events?view=page` uses the same query contract. `limit` max 100; cursor is an offset. Existing summary/full array routes retain compatibility limits. Metrics aggregate all stored support records including synthetic Verify.
- Owner authorized 10 additional model attempts on 21/09/2026: production AI_MAX_ATTEMPTS=30, code ceiling=30, default remains 20. Existing lifetime counter stays intact; no reset. Further increases require owner authorization.
- On Vercel, MongoDB is mandatory even if SUPPORT_STORAGE is set to memory-demo. `/api/support/health` pings DB and reports storage/durable/provider/policy/sourceRevision. Health does not make a paid model call.
- Deploy this existing project with `vercel --prod --yes --env APP_REVISION=<full git SHA>` after tests. Check health SHA against the source commit. Never print or commit environment values. Do not reset AI budget to make a smoke pass.
- Support audit's source of truth remains embedded `v3_support_requests.data.events`. Legacy echo events use MongoDB `legacy_events` when MONGODB_URI exists, and keep their API shape. Prisma remains a local legacy fallback only. No historical data is dropped.
- Model prose explains curated steps and requires an exact input evidence quote. Invalid/risky/unanchored output fails safe. Local E2E uses mock; run live OpenAI separately and record whether contextual fields were returned.
- Public Verify runs are demo artifacts, not trusted records of real employee activity. Rate-limited runs retain completed cases; wait one minute and resume. Current routes retain 20 recent run summaries; a known older run ID remains accessible.


## Historical runbook (superseded where different)

# Runbook update — 2026-09-21

## Bản sửa feedback và UX

- Chạy trong checkout `mlai26-ux-refurbish-20260921`, không dùng bản nháp `contracts.ts` của workspace gốc. QA dùng mock/memory; không đọc/copy `.env.local` hay ghi MongoDB thật.
- `npm run test:e2e` khởi động server Next của checkout trên **127.0.0.1:3227**, `reuseExistingServer:false`; đã kiểm tra port trống trước khi chạy. Không dùng process 3000. Không chạy build cùng lúc với E2E do dùng chung `.next`.
- Preview trả `input.previewId`, decision và assistance; submit lại nguyên input đó với confirmed:true. Snapshot Mongo `v3_support_previews` có TTL 10 phút (index expiresAt); truy cập ứng dụng cần quyền tạo index như collection requests hiện có. Snapshot không phải ticket, không xuất hiện queue.
- Sửa nội dung hoặc snapshot hết hạn/policy đổi/approval thay đổi: `409 PREVIEW_EXPIRED`; bấm Quay lại sửa và kiểm tra lại. Direct POST không previewId vẫn tương thích.
- Gửi trùng đang xử lý sẽ đợi tối đa 26 giây; sau đó `409 REQUEST_PROCESSING`, giữ nguyên idempotencyKey để thử lại. Không báo 201 với RECEIVED/version 0. Process chết vẫn chưa có recovery worker: dùng Stop, rồi tạo hồ sơ mới.
- Queue UI dùng `GET /api/support/requests?view=summary`; GET không query giữ full document cho client cũ trong compatibility window. Detail/audit UUID không tồn tại đều 404. Metrics pending gồm ESCALATED/NEEDS_INFORMATION/APPROVED_BY_HUMAN, phạm vi 200 hồ sơ gần nhất.
- Reviewer không thể dùng Approve, Override→approved hoặc Fulfill để bỏ qua thiếu facts/approval, kể cả hồ sơ cũ. Phê duyệt demo chỉ có registry synthetic; không nhập claim để vượt xác minh.
- Feedback mới EXPLAIN yêu cầu step (zero-based), giữ trạng thái. CONFUSED cũ vẫn tạo handoff; UI mới chỉ dùng EXPLAIN và ADMIN riêng biệt.
- Không reset model budget để che lỗi. Giới hạn 20 lifetime, timeout và fail-safe giữ nguyên; cần budget/model live riêng nếu muốn nghiệm thu kết nối thật.
- Public reviewer không đăng nhập là lựa chọn demo được người dùng cho phép. Không có công cụ thay đổi hạ tầng thật. Lượt này không triển khai, không đổi database hoặc secret.

Các mục bên dưới là runbook/bằng chứng các phiên bản trước; chỉ áp dụng khi không mâu thuẫn với cập nhật trên.

# Support Referee runbook

> **Trạng thái main:** đã nhận đầy đủ source từ `codex/support-v3-migration` tại `89d62c4` theo yêu cầu mới của người dùng. Các hướng dẫn runtime dưới đây áp dụng cho bản source này. Không lấy file đang viết dở ở workspace khác thay cho bản đã commit.

## Setup và server đúng repository

Chạy trong `C:/Users/ANHKHOI/Documents/ChatGPT/mlai26`, không phải repository khác. `npm ci`, copy `.env.example` sang `.env.local` nếu chưa có, `npm run db:generate`, rồi `npm run dev`. Mặc định memory/mock; không cần credential. Trên PowerShell kiểm tra `Get-NetTCPConnection -State Listen` trước khi chọn port. Không dừng process không thuộc tác vụ.

Nếu port 3000 đang được app khác dùng: `npm run dev -- --hostname 127.0.0.1 --port 3216`. Gọi `/api/support/health` và xác nhận `app=MLAI_SUPPORT_REFEREE_V3`, `policy=support-guidance-v3`. Đây là liveness; muốn xác nhận DB thực sự phải tạo rồi đọc lại request.

## Demo cho giám khảo

Giao diện orange/NAVI đã tích hợp trên nhánh migration. Home chỉ có `admin` và `I need help`; cả hai không cần đăng nhập. `/send-help` và `/workspace` dùng cùng form. Freeform chỉ cần chọn nhóm + mô tả; nút Structured mở các trường v3. Preview khóa intake để tránh gửi nhầm dữ kiện; **Quay lại sửa** giữ nội dung đã redact và cho chỉnh trước xác nhận. Header dùng Verify thay QR của prototype vì migration chưa có QR endpoint.

1. Home → **I need help**. Nhập `Tôi tắt máy tính lúc về được không?`, preview và xác nhận. Kết quả AUTO_APPROVE / GUIDE, không hỏi device ID. Chọn A để đóng hồ sơ.
2. Nhập `Làm sao để reset máy?`. Cần làm rõ, không escalate ngay. Bổ sung `Restart laptop, không factory reset` để nhận hướng dẫn.
3. Nhập `VPN không kết nối`. Xem các bước và nguồn model **mock**. C hoặc D chuyển admin và giữ lịch sử.
4. Chọn **admin**, mở hồ sơ từ queue. Xem raw đã redact, structured/extracted facts, risk/rule/missing/admin reason, history. Thử Request information, Reject (lý do >=8 ký tự), Stop, Override. Version cũ bị 409; tải lại trang chi tiết để lấy version mới. Queue mặc định lọc đang chờ xử lý; chọn **Tất cả 200 yêu cầu gần đây** để xem cả hồ sơ đã đóng. URL `/review?requestId=UUID` có thể tải lại trực tiếp.
5. `Mở port 3389 public cho vendor` → Security / Network, không được Approve/Fulfill kể cả override. `Cho quyền production admin` → review; human approval chỉ mô phỏng, policy ESCALATE giữ nguyên trong hồ sơ.
6. `Cấp read-only staging DB` → thiếu scope/duration và approval xác minh, không nhầm thành Security risk.
7. Verify → **Chạy toàn bộ test** với Đề A v3: 3 AUTO / 2 ESCALATE. Extended có fault injection model unavailable/invalid. Chọn bộ gốc để xem mismatch, không sửa expected.
8. Nhập câu mới tại Judge input; mở request để kiểm tra audit. `/audit` lọc theo UUID và xem actor, before/after, rule, evidence, missing fields.

Synthetic simulated workflow có approval: chọn structured → DATABASE_READ_ACCESS; system `postgresql`, resourceScope `demo_inventory`, environment `staging`, permission `read-only`, duration `2 hours`, reason `Synthetic demo`, approvalReference `DEMO-1001`. Không cần freeform. Reference demo chỉ đúng scope này và hết hạn 01/01/2027 UTC. Browser không được gửi `approvalStatus=verified`.

## QA

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

E2E desktop + Pixel 7 khởi động server mới trên port3216, không reuse, env override Mongo/Postgres/key rỗng, mock/memory, max model attempts0. Port3216 phải trống; nếu đang chạy preview của chính bạn, tắt đúng process đó trước khi chạy. Không chạy build đồng thời với dev/E2E vì cùng `.next`. `artifacts/e2e-results.json` và screenshots ghi bằng chứng; output failure/trace trong `test-results/` không commit.

## Mongo và kiểm tra sau restart

1. Tạo database disposable riêng, cấp credential hạn chế và đặt vào environment phía server. `MONGODB_DB=mlai26_support_v3_demo`; không trỏ DB production hoặc vùng hồ sơ cũ.
2. Đặt `MONGODB_URI`, chạy app; health phải ghi MONGODB. Submit một request, lưu UUID, thao tác reviewer.
3. Restart đúng server. GET request UUID và audit; kiểm tra status/version/history còn nguyên. Hai reviewer dùng cùng version: chỉ một thao tác thành công, thao tác còn lại409.
4. Kiểm tra trực tiếp collections chỉ có dữ liệu synthetic đã redact. Không xóa collection để reset budget. Budget model giới hạn20 lifetime trong collection `v3_model_budgets`; memory budget chỉ theo process và không phù hợp deployment nhiều instance.

Live Mongo đã xác nhận qua production workflow và đọc document/audit bằng kết nối độc lập ngày 20/09/2026. Chưa kiểm thử chủ động cluster restart/failover. Memory tests vẫn không phải bằng chứng Mongo.

## Model live (tùy chọn)

Đặt `AI_PROVIDER=openai`, `OPENAI_API_KEY`, `AI_MODEL`, `AI_ESCALATION_MODEL` vào secret store của host, tên model có quyền truy cập trong tài khoản. Không đặt key trong browser hoặc Git. Dùng lượng request nhỏ trong giới hạn ngân sách; mỗi preview/submit unknown có thể gọi extraction riêng; VPN submit gọi assistance. `AI_MAX_ATTEMPTS` 0..20, timeout12s, max output1000 tokens, no retries/no tools. Model thiếu key, hết budget, refusal/invalid/evidence conflict → ESCALATE. Explanation deterministic vẫn có. Regression dùng mock/fault injection; smoke production đã xác nhận một assistance call bằng gpt-4.1-mini.

## Deploy

Production hiện tại: https://labpass-five.vercel.app, Vercel project `labpass`, deployment `dpl_9EUsGJXDWeHpaw6KGMh9YSQkWFwF`, source main `c0c5ea5`. Bằng chứng ngày 21/09: 17/17 live checks PASS; xem RELEASE-VERIFICATION-2026-09-21.md. Project/domain cũ đã được thay bằng Support v3 của repository này. MongoDB dùng `mlai26_support_v3_demo`; bốn DB LabPass cũ đã bị xóa theo yêu cầu. Không dùng lại cấu hình MONGODB_DB=labpass_demo.

Local: điền key vào `.env.local` (đã gitignore), đặt `AI_PROVIDER=openai`, `AI_MODEL=gpt-4.1-mini`, `AI_ESCALATION_MODEL=gpt-4.1-mini`, URI Mongo và đúng DB mới. Trên Vercel, key/URI phải là Secret và `SUPPORT_ACCESS_MODE=public-demo`. `SUPPORT_VERIFY_FAULTS=true` cho demo Verify có chủ ý; header chỉ mô phỏng lỗi, không thể ép approve. Dùng Mongo để lưu giữa serverless instances; `memory-demo` chỉ smoke ngắn và không bền vững. Không tự copy secret của dự án khác. Sau deploy kiểm tra marker, Submit → Reviewer → Audit và persistence rồi ghi URL/deployment ID vào STATUS.

`render.yaml` vẫn là blueprint generic PostgreSQL lịch sử, chưa cấu hình Mongo Support v3. Nếu dùng Render phải thêm các env Support/Mongo; không coi blueprint cũ là migration release đã được kiểm chứng. Prisma migrations chỉ phục vụ `/api/events` cũ.

## Khắc phục lỗi

- 422: xem field/code; chọn dropdown hợp lệ, UUID mới cho request mới, confirmed true cho submit.
- 409: version đã thay đổi, key trùng nội dung khác, transition cấm hoặc security không được approve. Tải lại request/queue.
- 403 reviewer production: cần chọn rõ public-demo theo phạm vi demo được cho phép.
- 503: kiểm tra storage cấu hình; không bật log raw exception chứa URI/credential.
- NEEDS_INFORMATION do approval: claim không đủ; cần đúng synthetic registry. Reviewer không thể bỏ qua yêu cầu xác minh.
- RECEIVED còn treo nếu process chết khi xử lý: reviewer Stop rồi tạo request mới; hiện chưa có background recovery job.
- Không dùng git reset --hard, force-push hoặc xóa dữ liệu để sửa trạng thái.

Trong Codex sandbox Windows, Playwright có thể hoàn tất test nhưng bị treo khi taskkill cây process. Lượt QA cuối chạy ngoài sandbox và tự cleanup thành công. Nếu gặp tình huống này, xác minh PID/command line của server3216 thuộc repository trước khi dừng; không dừng process3000 của ứng dụng khác.

## Liên kết GitHub với Vercel

Bản production hiện tại được triển khai bằng Vercel CLI và đã xác nhận hoạt động. Tự deploy khi push GitHub chưa bật: Vercel từ chối `git connect` vì tài khoản chưa có GitHub Login Connection (HTTP 400). Người dùng cần kết nối GitHub trong phần Login Methods/Connections của Vercel, sau đó liên kết project labpass với dakiemdarktharr/DOCRELAY_MLAI2026. Lỗi này không ảnh hưởng URL production đang chạy.

## Live release verification — 21/09/2026

User authorized main push, production deployment and actual MongoDB/OpenAI verification. Local regression remains mock/memory. Production smoke uses only synthetic requests and a bounded real OpenAI assistance call. Verify preview -> submit -> independent GET -> explain -> handoff -> reviewer -> audit. MongoDB mode has no memory fallback when MONGODB_URI is set. MongoClient ignores undefined optional values to keep stored API snapshots stable. Do not reset lifetime model budget. Direct Atlas TCP from this machine was refused; deployment API read/write tests exercise Atlas from Vercel. See artifacts/live-release-verification.json and final release evidence for exact source/deployment IDs.
