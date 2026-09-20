# Phân công đơn giản — MLAI VNG Đề A

## Quy tắc chung

- Ba thành viên tự viết phần core bằng TypeScript/TSX.
- AI chỉ hỗ trợ giải thích, gợi ý test, review và sửa lỗi; không làm thay phần core.
- Mỗi người phải có code, test, phần demo và review code của một bạn khác.
- Verify, QA và deployment là việc chung; thành viên 3 không phải tester riêng.
- Scaffold generic hiện tại chỉ là hạ tầng chuẩn bị trước Sprint 1.

## Thành viên 1 — Nhận yêu cầu và giao diện

Làm luồng:

`Người dùng nhập thông tin → hệ thống nhận và hiển thị kết quả`

Việc cần làm:

- Làm form nhập yêu cầu.
- Viết TypeScript type cho dữ liệu đầu vào.
- Kiểm tra dữ liệu bằng Zod.
- Tạo API nhận yêu cầu.
- Hiển thị trạng thái đang xử lý, lỗi và kết quả.
- Viết test cho dữ liệu đúng, thiếu, sai hoặc mơ hồ.

Phải demo được: nhập một yêu cầu và thấy hệ thống nhận đúng dữ liệu.

Review: Thành viên 2 review phần input và API contract.

## Thành viên 2 — Decision engine

Làm luồng:

`Dữ liệu đã nhận → hệ thống quyết định cách xử lý`

Việc cần làm:

- Viết policy/decision engine bằng TypeScript.
- Trả về `AUTO_APPROVE`, `NEEDS_INFORMATION` hoặc `ESCALATE`.
- Nhận ra dữ liệu thiếu, ngoài quy định hoặc vượt thẩm quyền.
- Tạo câu hỏi cụ thể khi cần bổ sung thông tin.
- Đảm bảo LLM không tự quyết định thay policy engine.
- Viết test cho các trường hợp bình thường và bất thường.

Phải demo được: hệ thống biết lúc nào tự xử lý, lúc nào hỏi thêm, lúc nào chuyển người.

Review: Thành viên 3 review decision engine và các test biên.

## Thành viên 3 — Human review và audit

Làm luồng:

`Cần người xử lý → người duyệt thao tác → hệ thống ghi lại lịch sử`

Việc cần làm:

- Làm hàng đợi yêu cầu cần người xử lý.
- Làm API và giao diện approve, reject, override.
- Viết state transition bằng TypeScript để không cho thao tác sai.
- Viết audit event type và lưu lịch sử thao tác.
- Kết nối PostgreSQL/Prisma cho dữ liệu cần lưu.
- Hiển thị chi tiết lịch sử trên audit page.

Phải demo được: người duyệt xử lý một yêu cầu và xem lại đầy đủ lịch sử.

Review: Thành viên 1 review review flow và audit.

## Việc chung của cả ba

### Verify

- Thành viên 1 phụ trách nối Verify runner vào UI.
- Thành viên 2 viết expected decision cho các case.
- Thành viên 3 kiểm tra Verify có ghi audit/event đúng.

### Test và QA

- Mỗi người tự viết unit test cho phần mình.
- Mỗi người cùng tham gia E2E test toàn hệ thống.
- Cả ba cùng thử input mới, input lỗi và thao tác sai.

### Deploy và demo

- Thành viên 1 kiểm tra UI trên live URL.
- Thành viên 2 kiểm tra API và decision flow trên live URL.
- Thành viên 3 kiểm tra database, audit log và restart.
- Cả ba cùng rehearsals và chuẩn bị video/slide.

## Chia việc trước 19/09

Chỉ làm phần generic:

- Thành viên 1: form/workspace và giao diện chung.
- Thành viên 2: API, Zod và LLM sandbox.
- Thành viên 3: Event log, Prisma schema/migration và audit UI.

Chưa làm policy, escalation, authority, uncertainty classifier hoặc 5 test chính thức trước khi đề mở.

## Checklist mỗi thành viên

- [ ] Tôi tự viết phần TypeScript/TSX của mình.
- [ ] Tôi có test cho phần mình làm.
- [ ] Tôi đã demo phần mình làm.
- [ ] Một bạn khác đã review code.
- [ ] Tôi giải thích được code mà không cần AI.

## Làm việc song song

Lịch làm song song theo từng giai đoạn nằm ở [PARALLEL-WORK-PLAN.md](PARALLEL-WORK-PLAN.md). Ba thành viên làm độc lập bằng contract và fixture, chỉ nối hệ thống tại checkpoint ngắn; không chờ nhau hoàn thành toàn bộ phần việc.
