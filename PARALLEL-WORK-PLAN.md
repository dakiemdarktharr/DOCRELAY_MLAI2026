# Kế hoạch làm việc song song — Sprint 1

Mục tiêu: trong mọi giai đoạn luôn có cả 3 thành viên đang làm code/test/evidence. Không chia theo kiểu một người làm xong rồi người khác mới bắt đầu.

## Ba làn công việc

| Làn | Thành viên | Kết quả chính |
|---|---|---|
| A | Thành viên 1 | Nhập yêu cầu và giao diện |
| B | Thành viên 2 | Decision engine bằng TypeScript |
| C | Thành viên 3 | Human review và audit backend |

Ba làn dùng chung các type trong `src/domain/contracts.ts`, nhưng mỗi người có thể làm bằng mock data trước khi API thật nối vào.

## Giai đoạn 1 — Chốt contract, làm song song

### Thành viên 1

- Dựng form nhập yêu cầu.
- Dựng workspace và màn hình hiển thị kết quả mẫu.
- Dùng fixture `sample-request.json` và `sample-decision.json`.

### Thành viên 2

- Viết `Request`, `DecisionResult`, `Question` type.
- Viết decision engine thuần TypeScript với input giả.
- Viết test cho ba trạng thái quyết định.

### Thành viên 3

- Viết `ReviewItem`, `AuditEvent` type.
- Viết review state machine: pending → approved/rejected/overridden.
- Dựng audit log bằng memory adapter trước, chưa cần chờ database.

Kết quả cuối giai đoạn: cả ba đều có code chạy được độc lập bằng fixture.

## Giai đoạn 2 — Mỗi người hoàn thành một vertical slice

### Thành viên 1

- Nối form với API nhận yêu cầu.
- Hiển thị loading, lỗi, dữ liệu thiếu và kết quả.
- Viết unit test và một E2E test cho workspace.

### Thành viên 2

- Hoàn thiện policy/decision engine.
- Tạo API trả về `AUTO_APPROVE`, `NEEDS_INFORMATION` hoặc `ESCALATE`.
- Tạo câu hỏi cụ thể cho trường hợp cần hỏi thêm.

### Thành viên 3

- Làm hàng đợi review.
- Làm API và nút approve/reject/override.
- Ghi audit event cho mỗi thao tác.

Không ai chờ API của người khác: dùng interface và mock response đã chốt ở giai đoạn 1.

## Giai đoạn 3 — Nối hệ thống, vẫn làm song song

### Thành viên 1

- Nối result UI với decision API.
- Nối UI review với review API.
- Sửa UX để giám khảo thao tác ít bước.

### Thành viên 2

- Nối decision engine vào API thật.
- Thêm extraction/LLM adapter nhưng giữ decision cuối bằng policy engine.
- Viết test input mới và input không chắc chắn.

### Thành viên 3

- Đổi memory adapter sang Prisma/PostgreSQL.
- Hoàn thiện `/api/events` và audit detail.
- Nối Verify runner với API thật và audit event.

## Giai đoạn 4 — Kiểm thử và triển khai, không biến thành “một người làm tester”

### Thành viên 1

- Test tất cả màn hình bằng Playwright.
- Sửa lỗi UX, refresh, double click và input lỗi.
- Chuẩn bị kịch bản demo phần giao diện.

### Thành viên 2

- Test decision table và các trường hợp biên.
- Kiểm tra không approve khi dữ liệu bị gắn cờ.
- Viết phần giải thích decision để trình bày với giám khảo.

### Thành viên 3

- Test persistence, migration và restart.
- Kiểm tra audit không bị mất hoặc sửa sai.
- Chuẩn bị deployment/reliability evidence.

Ở giai đoạn này, mỗi người test phần mình; Thành viên 3 không chịu toàn bộ QA.

## Giai đoạn 5 — Rehearsal và nộp bài

### Thành viên 1

- Điều khiển demo UI và thao tác chính.
- Kiểm tra live URL từ trình duyệt mới.

### Thành viên 2

- Giải thích decision engine và chạy các case mới.
- Kiểm tra kết quả Verify expected/actual.

### Thành viên 3

- Mở audit log, review queue và override.
- Kiểm tra live database, timestamp và evidence.

Cả ba cùng chạy full rehearsal, sửa lỗi thuộc phần mình và cùng xác nhận checklist cuối.

## Luật để không bị chờ việc

1. Chốt contract trước, implementation dùng mock khi dependency chưa xong.
2. Không chờ quá 15 phút; nếu bị chặn, chuyển sang test, fixture, docs hoặc backup task của chính làn đó.
3. Mỗi làn luôn có một task chính và một task dự phòng.
4. Chỉ merge tại các checkpoint ngắn; không bắt cả đội chờ một pull request lớn.
5. Mỗi thành viên phải tự viết code và test cho làn của mình.
6. Mỗi core diff được một thành viên khác review.

## Checkpoint chung

- Sau giai đoạn 1: kiểm tra types và fixture.
- Sau giai đoạn 2: mỗi làn chạy độc lập.
- Sau giai đoạn 3: chạy full flow.
- Sau giai đoạn 4: chạy test, build, migration và live smoke test.
- Trước nộp: cả ba cùng rehearsal và ký xác nhận phần mình.
