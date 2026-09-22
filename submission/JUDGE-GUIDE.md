# Quy trình giám khảo

Source tham chiếu: `7909f0c`. Link trực tuyến có thể đang chạy revision khác. Kiểm tra `/api/support/health` và ghi `sourceRevision`, `policy`, `storage`, `durable` trước khi dùng kết quả làm bằng chứng phát hành.

| Thời gian theo brief | Thao tác | Kết quả cần xem |
| --- | --- | --- |
| 0:00–1:00 | Mở https://vng-support.vercel.app/, chọn **Tôi cần hỗ trợ**. Chọn **Phòng ban**, để trống ID nhân viên, nhập vấn đề. Xem trước rồi xác nhận. | Thao tác không cần tài khoản/cài đặt. Có hướng dẫn hoặc yêu cầu bổ sung hợp lý. |
| 1:00–3:00 | Mở https://vng-support.vercel.app/verify. Chọn **Đề A — 5 trường hợp**, bấm **Chạy toàn bộ test (5)**. | Bảng expected/actual, pass/fail, timestamp, rule, request và audit. Xem lưu ý 4/5 case bên dưới. |
| 3:00–5:00 | Ở ô input mới của Verify, chọn phòng ban và nhập lần lượt hai yêu cầu do giám khảo tự soạn, trong đó có tình huống bất thường. | Xử lý hoặc từ chối có lý do. Kiểm tra cả câu hỏi bổ sung và trạng thái đọc lại dữ liệu. |
| 5:00–6:30 | Kiểm tra riêng Đề A: bộ 5 có ba routine và hai escalation, rồi thử một yêu cầu mơ hồ dựa trên policy của đội. | Hai escalation phải đúng loại rủi ro/thẩm quyền. Ba routine không bị chuyển tiếp sai. Câu hỏi chuyển tiếp phải giúp reviewer quyết định. |
| 6:30–7:30 | Mở request từ kết quả Verify hoặc vào `/review`. Với request kiểm thử còn có thể xử lý, chọn **Dừng xử lý** và nhập lý do. Dùng một request khác cho **Điều chỉnh quyết định** sang hỏi thêm/từ chối nếu trạng thái cho phép. | Trạng thái thay đổi và audit ghi actor demo, thời gian, lý do. Không dùng request đã dừng để giả định mọi chuyển trạng thái vẫn hợp lệ. |
| 7:30–8:00 | Đối chiếu audit, slide và hồ sơ. | Phân biệt phần đã vận hành, phần mô phỏng và phần chưa đo. |

## Bảng test và kết quả

Xem [TEST-CASES.md](TEST-CASES.md). Bộ Đề A 5 case chứa đủ bốn case bảng hồ sơ và thêm một routine, giữ tỷ lệ 3 tự động / 2 chuyển tiếp. Đây là một lựa chọn runtime, không phải hai nút Verify riêng. Brief chung yêu cầu 4 case còn Đề A yêu cầu 5; đội cần nêu rõ cấu hình hiện có nếu BTC yêu cầu đối chiếu.

Bộ **15 tình huống** là kiểm tra mở rộng, không bắt buộc chạy hết trong phiên chấm 8 phút. Đây là dữ liệu synthetic được chọn khi phát triển, không phải tập kiểm thử độc lập của giám khảo.

Kết quả **PASS** chỉ có ý nghĩa với lần chạy thực tế và điều kiện ghi nhận. Link kết quả `/verify?run=...` đọc lại lần chạy đã lưu. Nếu lỗi mạng/rate limit làm lần chạy gián đoạn, chờ theo thông báo và chọn **Tiếp tục lần kiểm thử**. Với memory local, khởi động lại server sẽ mất dữ liệu.

## Đọc một quyết định

Mở request và kiểm tra input đã redact, trạng thái, lý do, rule, dữ kiện thiếu, câu hỏi chuyển tiếp và bước tiếp theo. Với request từ Verify, chọn bộ lọc nguồn Verify/tất cả trong review nếu cần. Đối chiếu lịch sử/audit bằng đúng request ID, không dựa vào vị trí trong danh sách mới nhất.

AUTO_APPROVE ở case routine có nghĩa cho phép trả hướng dẫn an toàn. Không có thực thi lệnh, cấp quyền IAM hay thay đổi production. STOP dừng workflow trong ứng dụng; OVERRIDE điều chỉnh quyết định trong các guard cho phép, không hoàn tác hạ tầng bên ngoài.
