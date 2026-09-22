# Project Memory

## Mục tiêu dự án

Xây dựng sản phẩm cho OrganizationAI VN — Đề A: **The Escalation Referee**.

Sản phẩm là một AI Agent hỗ trợ IT Helpdesk: đọc ticket, đối chiếu Ground Truth, tự xử lý trường hợp an toàn và chuyển tiếp trường hợp thiếu thông tin, có rủi ro bảo mật hoặc vượt thẩm quyền. Khi chuyển tiếp, hệ thống phải tạo câu hỏi cụ thể để Human IT Admin có thể quyết định ngay.

## Nguyên tắc thống nhất về code

Code của dự án phải:

1. Được viết đầy đủ bằng TypeScript, bật kiểm tra kiểu nghiêm ngặt khi khởi tạo cấu hình dự án.
2. Đáp ứng đúng challenge brief và tinh thần: vận hành thực tế, an toàn, có trách nhiệm giải trình và có human-in-the-loop.
3. Dễ đọc, dễ hiểu, dễ trình bày và dễ sửa trực tiếp bởi thành viên đội thi.
4. Ưu tiên cấu trúc rõ ràng hơn kỹ thuật thông minh nhưng khó giải thích.
5. Không chứa khối code sinh tự động quá lớn mà thành viên không thể tự viết lại hoặc giải thích.
6. Không hard-code kết quả của test case; business rules phải được biểu diễn thành policy/config có tên và mã rule rõ ràng.
7. Dùng LLM cho hiểu ngôn ngữ tự nhiên, trích xuất dữ kiện và tạo giải thích/câu hỏi; dùng deterministic validation cho quyết định an toàn cuối cùng.
8. Mọi quyết định phải có dữ liệu kiểm toán: input, timestamp, action, matched rule, evidence và lý do ngắn gọn.
9. Không lưu hoặc hiển thị chain-of-thought nội bộ. Explanation chỉ gồm rule, bằng chứng, dữ kiện thiếu và hành động.
10. Mọi nhánh quan trọng phải có test dễ đọc, trong đó tên test mô tả hành vi nghiệp vụ.

## Tiêu chuẩn triển khai

- Dùng kiểu dữ liệu domain rõ ràng; tránh `any` và type assertion không cần thiết.
- Validate tất cả dữ liệu đi qua boundary bằng schema, ví dụ Zod.
- Ưu tiên hàm nhỏ, thuần và chỉ làm một việc.
- Tên biến, hàm và file phải phản ánh nghiệp vụ IT Helpdesk.
- Comment giải thích **vì sao** có rule hoặc guard; không comment lặp lại code.
- Error và fallback phải tường minh. Kết quả không hợp lệ hoặc quá mơ hồ phải chuyển tiếp an toàn.
- Auto-action chỉ chạy sau khi structured output, policy evaluation và safety validation đều hợp lệ.
- Câu hỏi escalation phải cụ thể và có lựa chọn hành động; không dùng câu chung chung như “Please review”.
- Giữ policy, dữ liệu Ground Truth, Verify cases và code xử lý ở các lớp riêng biệt.

## Kiến trúc quyết định đã thống nhất

```text
Ticket text
  → LLM extraction
  → schema validation
  → deterministic policy evaluation
  → safety validation
  → AUTO hoặc ESCALATE
  → audit log
  → human override khi cần
```

LLM không được trực tiếp thực thi hành động có rủi ro. Deterministic layer là nơi áp dụng rule precedence, chặn quyết định không nhất quán và thực hiện fail-safe escalation.

## Dữ liệu

- Sprint 1 dùng ticket, danh tính, approval, resource specification và audit event synthetic hoặc đã ẩn danh.
- Cần tối thiểu 15 Ground Truth cases và 5 Verify cases gồm 3 AUTO, 2 ESCALATE.
- Dữ liệu adversarial phải có paraphrase, lỗi chính tả, song ngữ, nhiều yêu cầu trong một ticket, xung đột rule và prompt injection.
- Nếu chính sách không phải tài liệu chính thức của VNG, phải ghi rõ đây là synthetic/proposed challenge policy.
- Không đưa credential, token, dữ liệu cá nhân hoặc thông tin production thật vào repository.
- Sprint 2 cần người dùng và phản hồi thật; ticket dùng để thử nghiệm vẫn có thể là synthetic.

## Quy tắc cộng tác

Người dùng đã bỏ yêu cầu bắt buộc chia hai package. Có thể triển khai và commit local trên máy này khi được yêu cầu; không cần số package hoặc số commit cố định. Ghi rõ base, diff, kiểm tra và AI assistance. Không suy ra human review từ Git identity. Bảo toàn thay đổi chưa commit; quyền commit không tự cấp quyền push, merge hoặc deploy. Prompt package cũ chỉ là lịch sử.

Trước mỗi thay đổi lớn, phải xác định rõ yêu cầu nghiệp vụ, contract dữ liệu và tiêu chí kiểm thử. Sau mỗi thay đổi, phải giải thích được luồng xử lý bằng ngôn ngữ đơn giản và chỉ ra file/test liên quan. Nếu một giải pháp đúng nhưng quá khó để thành viên đội thi tự giải thích hoặc chỉnh sửa, phải đơn giản hóa trước khi chấp nhận.

