# AGENTS.md

Các agent làm việc trong repository này phải đọc `PROJECT-MEMORY.md` trước khi lập kế hoạch hoặc chỉnh sửa code.

## Phạm vi dự án

Đây là dự án OrganizationAI VN — Đề A, xây dựng IT Helpdesk Escalation Referee bằng TypeScript. Mục tiêu không chỉ là tạo demo chạy được mà còn tạo code mà đội thi có thể tự viết, giải thích, kiểm thử và sửa trực tiếp.

## Chỉ dẫn bắt buộc

- Viết TypeScript đầy đủ, rõ kiểu và dễ đọc. Không dùng `any` nếu chưa chứng minh được sự cần thiết.
- Không tạo abstraction sớm, framework nội bộ hoặc lớp wrapper nếu một hàm đơn giản đã đủ.
- Không tối ưu số dòng bằng cách làm mất tính rõ ràng.
- Giữ hàm ngắn, tên nghiệp vụ rõ và control flow dễ theo dõi.
- Tách riêng: input validation, LLM extraction, policy evaluation, safety validation, action execution, audit và UI.
- LLM chỉ đề xuất structured facts, evidence, explanation và escalation question. Quyết định cuối cùng phải qua deterministic validation.
- Policy phải là dữ liệu/config có `rule_id`; không hard-code kết quả theo câu chữ của Verify case.
- Khi nhiều rule cùng khớp, ưu tiên mặc định: `SECURITY_RISK` → `BEYOND_AUTHORITY` → `MISSING_INFO` → `AUTO`.
- Nếu output LLM sai schema, thiếu bằng chứng, mâu thuẫn hoặc quá mơ hồ, hệ thống phải fail safely bằng escalation.
- Không xác nhận approved/completed cho ticket thuộc bất kỳ nhánh escalation nào.
- Explanation phải dựa trên matched rules và evidence; không lưu hoặc yêu cầu chain-of-thought.
- Audit log phải ghi timestamp, input hoặc bản đã redact, action, bucket, matched rules, evidence, explanation, escalation question và human override nếu có.
- Dùng synthetic hoặc anonymized data theo `PROJECT-MEMORY.md`; không đưa dữ liệu nhạy cảm vào repository.

## Yêu cầu đối với mỗi thay đổi code

1. Nêu contract đầu vào/đầu ra trước khi thêm logic phức tạp.
2. Thêm hoặc cập nhật test mô tả hành vi nghiệp vụ.
3. Chạy kiểm tra phù hợp: typecheck, unit tests, integration tests và build khi đã có cấu hình.
4. Báo cáo ngắn gọn file đã thay đổi, hành vi mới và cách tự kiểm chứng.
5. Nếu code khó giải thích cho một sinh viên biết TypeScript ở mức cơ bản-trung bình, hãy đơn giản hóa.

## Không được tự ý

- Không triển khai tính năng ngoài brief hoặc ngoài yêu cầu hiện tại.
- Không thay thế deterministic policy bằng một prompt duy nhất.
- Không tạo dữ liệu hoặc phản hồi người dùng giả rồi trình bày là dữ liệu thật.
- Không che giấu fallback, lỗi hoặc giới hạn của hệ thống.
- Không thay đổi Ground Truth mà không cập nhật tài liệu quyết định và test liên quan.

## Definition of Done

Một phần việc chỉ hoàn thành khi code chạy được, kiểu dữ liệu hợp lệ, test tương ứng đạt, quyết định có thể audit, và thành viên đội thi có thể giải thích luồng xử lý mà không cần dựa vào chi tiết ẩn của LLM.
