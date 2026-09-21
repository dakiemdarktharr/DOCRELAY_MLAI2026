# DOCRELAY report recheck — 2026-09-21

Input report: DOCRELAY_ERRORS_AND_NEGATIVE_IMPACTS.docx supplied by user. Report observations are hypotheses to recheck; baseline main 0b14538, deployed source c0c5ea5. Original student workspace draft stays untouched. Baseline: 154 tests and lint pass; build passed.

## Audit before changes

Runtime already has Vietnamese entry buttons, visible original question, short employee request IDs, bound expiring previews, intent-specific questions, separated high-risk reviewer questions, word boundaries for port, MongoDB production and a live-verified release. Report screenshots describe older UI.

Remaining work: persistent Verify runs and summary table (E03/E04/E17), additive server pagination/search (E18), contextual LLM explanations under unchanged deterministic authority (E07/E08), remaining targeted question/routing cases (E09/E10/E12), reviewer human-control visibility and short IDs (E14/E15/E21), and submission evidence packaging (E05/E06/E22/E23).

Contracts: existing API arrays remain for compatibility; paginated requests/events use an opt-in view and return items/nextCursor. Verify run endpoints persist server-derived results and invoke the same production decision HTTP endpoint. Requests carry validated run provenance and are separated in queue filters. Model generates bounded contextual prose linked to vetted steps; cannot create policy, authority or tools. Production requires durable MongoDB; local mock/memory remains explicitly temporary.

Migration: (1) Verify/persistence/pagination with regression tests; (2) contextual assistance, routing/questions and UI with tests; (3) submission artifacts and per-error evidence; (4) full QA, main commit/push, existing Vercel production deployment and live smoke.

Expected files: src/domain/{contracts,input,guidance,questions,text,policy}.ts, src/lib/{support-repository,support-verify,support-model,events}.ts, new verify-run repository/service/routes, src/app/{page,verify,audit,workspace}/page.tsx, reviewer/history/result components, tests, README/STATUS/RUNBOOK/BUILD-LOG and submission evidence. No original Ground Truth edits. Real users/outcome claims require evidence from the team; never synthesize them.

## Kết quả đối chiếu 23 mục

| Mục | Kết luận sau sửa | Bằng chứng / giới hạn |
|---|---|---|
| E01 Deployment lệch source | Sửa cơ chế nhận diện | Health trả `sourceRevision`; CLI deploy truyền SHA chính xác. Bằng chứng live được ghi sau deploy. |
| E02 Không rõ thao tác đầu | Đã khắc phục | Trang chào có một câu chỉ nút cần chọn và ví dụ VPN; hai lối vào tiếng Việt, không login. |
| E03 Verify 5 thay vì 4 case | Đã khắc phục | Default `submission-4`; giữ riêng Đề A 5 case, 3 auto/2 escalate. E2E chạy cả hai. |
| E04 Không lưu lần Verify | Đã khắc phục | `v3_verify_runs`, bảng expected/actual/pass/fail/time/rule; link tải lại, dừng/tiếp tục. |
| E05 Thiếu slide/video | Bổ sung bản kỹ thuật | `submission/DOCRELAY-5-SLIDES.pptx`, video raw local mock. Nhóm cần xác nhận trước khi nộp. |
| E06 Build log chưa một trang | Đã bổ sung | `submission/BUILD-LOG-ONE-PAGE.pdf`, đúng một trang. Bản log dài vẫn giữ lịch sử. |
| E07 Hướng dẫn chung chung | Cải thiện có kiểm thử | Shutdown trả lời trực tiếp; VPN dựa OS/lỗi timeout và câu hỏi tiếp theo. Chưa phải chẩn đoán toàn bộ thiết bị. |
| E08 LLM chỉ chọn template | Đã mở rộng có giới hạn | Model viết summary, giải thích từng bước, expectedResult/nextQuestion với evidence trích từ input. Bước thao tác và quyền vẫn do code. |
| E09 Hỏi tất cả field | Đã khắc phục trường hợp tái hiện | Planner ưu tiên tối đa 3 câu/đợt theo ngữ cảnh; giữ toàn bộ missing facts cho reviewer. |
| E10 Câu hỏi reviewer hiện cho user | Đã khắc phục trường hợp tái hiện | Risk/authority/fallback tách reviewerQuestions; người hỏi chỉ nhận câu cần bổ sung. |
| E11 `port` khớp trong từ khác | Không còn tái hiện | Regression support/important report/passport, rule biên từ đã có. |
| E12 Chọn nhóm theo từ đầu | Cải thiện, còn giới hạn | So khớp subject/symptom, loại trạng thái bình thường khỏi phân loại, tie về OTHER. Risk vẫn đọc toàn input. Không khẳng định NLP bao phủ mọi cách diễn đạt. |
| E13 Không thấy câu hỏi gốc | Không còn tái hiện | Request detail giữ câu hỏi đã redact; regression UI hiện có. |
| E14 Mã kỹ thuật gây nhiễu | Đã khắc phục | Mã ngắn trên user và reviewer; UUID/version trong phần chi tiết. |
| E15 Không rõ trạng thái/tiếp theo | Không còn ở các luồng kiểm thử | Trạng thái tiếng Việt, bổ sung/handoff/rejected/stop rõ; E2E employee/reviewer. |
| E16 Hai nguồn audit | Đã làm rõ và thống nhất production storage | Support audit chỉ embedded request events trong MongoDB. Echo tương thích dùng Mongo `legacy_events` khi có URI; Prisma chỉ fallback legacy cục bộ. |
| E17 Verify lẫn hồ sơ thật | Đã khắc phục với lượt mới | Provenance run/case được server xác minh; queue/audit mặc định chỉ support. Hồ sơ cũ không tự đoán nguồn và không xóa. |
| E18 Giới hạn 200/300 bản ghi | Đã khắc phục UI/API mới | API `view=page`, query phía server, total/nextCursor, metrics toàn bộ. Test 205 hồ sơ. API array cũ vẫn giữ limit tương thích. |
| E19 Memory mất dữ liệu | Production fail-closed | Vercel cần MongoDB, health ping thật. Local mock/memory được ghi rõ tạm thời. |
| E20 Preview chưa persist | Đã phân biệt | Preview là snapshot tạm TTL 10 phút, chưa là hồ sơ. Chỉ xác nhận mới gửi; UI ghi rõ chưa gửi. |
| E21 Stop/Override khó thấy | Đã bổ sung + test | Link nhảy tới thao tác/audit, lý do bắt buộc, E2E override rồi stop và đối chiếu audit. Không gọi đó là undo hạ tầng. |
| E22 Thiếu người dùng thật/impact | CHƯA ĐỦ BẰNG CHỨNG | Chủ dự án xác nhận chưa có. Thêm mẫu thu thập, không tạo phản hồi hay số liệu giả. |
| E23 Tài liệu/version cũ | Đã cập nhật tài liệu hoạt động | Policy `support-guidance-v4.2`, health lấy constant; README/RUNBOOK/STATUS cập nhật, giữ phần cũ có nhãn lịch sử. |

## Kiểm chứng và giới hạn

- Baseline: 154 unit/integration, lint, build pass.
- Sau sửa và diagnostic follow-up: 176 unit/integration pass; lint/build pass. 26 desktop/mobile E2E và 1 E2E Stop/Override/video pass, dùng server mới port 3227, `reuseExistingServer=false`, mock/memory.
- Bộ fixture gốc giữ nguyên: 55/128 khớp, 73 khác biệt policy có sẵn. Đây không phải 128/128 pass và không phải bằng chứng hiệu quả người dùng.
- Live production: xem `artifacts/report-live-verification.json` sau triển khai. Local E2E không chứng minh OpenAI/MongoDB thật.
- `stepExplanations` là nội dung model qua schema/evidence/redaction/risk guard. Guard ngôn ngữ không phải chứng minh ngữ nghĩa tuyệt đối; model không có tool hoặc quyền thay policy. Khi không hợp lệ, fail-safe.
- Pagination dùng offset và thứ tự createdAt/id. Nếu có ghi đồng thời, trang sau có thể dịch; tìm bằng ID vẫn truy xuất được. Chưa thiết kế cho số lượng enterprise.
- Phiên Verify public dùng rate limit hiện có. 429 giữ kết quả đã chạy để chờ và tiếp tục. Run đang chạy bị đóng trình duyệt cần mở lại link rồi Tiếp tục.
- Reviewer public là lựa chọn demo đã được chủ dự án chấp thuận. Không dùng dữ liệu thật, không có side effect hạ tầng.


### Follow-up từ kiểm chứng production

Lần deploy 6b93962 và 2d50176 xác nhận MongoDB/Verify thật nhưng model fail-safe vì BUDGET_EXHAUSTED. Chủ dự án đã cho phép tăng tổng hạn mức lên 30, giữ nguyên số lượt đã dùng (thêm tối đa 10 lượt). Cấu hình Vercel đã cập nhật. Regression mới xác nhận không vượt trần và không reset.

Kiểm tra E2E lặp lại tìm được race đổi pack sau khi đủ kết quả nhưng trước khi đọc lại run hoàn tất. Đã khóa lựa chọn đến sau readback; test trì hoãn phản hồi GET thật 350ms để tái hiện. Sau sửa race: 27 E2E pass, 1 skip quay video trùng trên mobile; không retry.
