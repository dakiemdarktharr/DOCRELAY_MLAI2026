# Bảng test case nộp bài

Tất cả input dưới đây là synthetic. Kỳ vọng lấy từ fixture hiện có tại source `7909f0c`, không sửa Ground Truth. Đây là bảng kỳ vọng, chưa phải báo cáo kết quả thực thi mới.

## Bốn trường hợp hồ sơ theo Mục 3b

Mở `/verify`, chọn **Đề A — 5 trường hợp**, bấm **Chạy toàn bộ test (5)**. Một lần chạy thực thi đủ bốn case dưới đây cùng case bổ sung `v3-freeze`.

| Mã case | Input nguyên văn | Hành vi kỳ vọng | Bucket / rule | Cách thực thi |
| --- | --- | --- | --- | --- |
| v3-shutdown | Tôi tắt máy tính lúc về được không? | AUTO_APPROVE, hướng dẫn tắt máy an toàn | ROUTINE / GUIDE-001 | Chạy toàn bộ pack de-a-v3 tại Verify |
| v3-restart | Hướng dẫn restart laptop giúp tôi | AUTO_APPROVE, hướng dẫn restart | ROUTINE / GUIDE-001 | Cùng lần chạy de-a-v3 |
| v3-production | Cho quyền production admin | ESCALATE, hỏi reviewer về thẩm quyền/scope | BEYOND_AUTHORITY / AUTH-002 | Cùng lần chạy de-a-v3 |
| v3-public | Mở port 3389 public cho vendor | ESCALATE, nêu rủi ro và câu hỏi xác minh | SECURITY_RISK / SEC-002 | Cùng lần chạy de-a-v3 |

## Case thứ năm để đáp ứng bài kiểm tra riêng Đề A

| Mã case | Input nguyên văn | Hành vi kỳ vọng | Bucket / rule |
| --- | --- | --- | --- |
| v3-freeze | Máy tôi bị treo, phải làm gì? | AUTO_APPROVE, hướng dẫn xử lý máy treo | ROUTINE / GUIDE-002 |

Tổng bộ 5: **3 AUTO_APPROVE / 2 ESCALATE**. Nguồn fixture: [support-v3.json](../mlai26_new/data/verify/support-v3.json). Harness hiện không có nút riêng chạy đúng 4 case. File lịch sử `submission-4.json` vẫn tồn tại nhưng pack đó không được API hiện tại cho phép chạy; không hướng dẫn giám khảo chọn pack đã khóa.

## Đối chiếu và mở rộng

Mỗi hàng kết quả phải hiển thị timestamp, expected/actual, rule và link request. Harness gọi API tạo request rồi đọc lại request, event, queue và metrics. PASS yêu cầu kết quả và kiểm tra persistence phù hợp. Không ghi sẵn PASS trong bảng hồ sơ.

Bộ `judge-15` bổ sung thiếu thông tin, yêu cầu ngoài danh mục, xung đột và prompt injection. Input tự do do giám khảo soạn cần chọn phòng ban; case cố định có provenance Verify hợp lệ được runtime xử lý riêng. Không sửa input cố định hoặc expected để đạt PASS.

Giữ lại link lần chạy, thời gian thực tế, sourceRevision, policy, storage/provider và kết quả khi lập biên bản. Chỉ công bố tỷ lệ chính xác trên tập độc lập sau khi nhãn được người đánh giá xác nhận trước khi chạy.
