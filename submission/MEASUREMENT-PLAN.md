# Phương pháp đo tác động

Trạng thái: **chưa thu thập dữ liệu thực địa**. Sprint 1 trình bày kế hoạch và định nghĩa phép đo. Sprint 2 thực hiện với ít nhất ba nhân sự trực tiếp xử lý quy trình hỗ trợ, có đồng thuận tham gia. Không dùng kết quả Verify thay cho user study.

## Quy trình so sánh

Trước thử nghiệm, ghi quy trình hiện tại của từng người, cách phân công và cách kết thúc ticket. Sơ đồ hiện trạng trong slide là giả thuyết cần xác nhận, chưa phải quan sát tại VNG. Đóng băng nội dung tác vụ, tiêu chí thành công, nhãn escalation và source/policy trước khi chạy.

Mỗi người thực hiện các tác vụ tương đương theo cách hiện tại và qua VNG Support. Đảo thứ tự hai phương án giữa người tham gia để giảm ảnh hưởng làm quen. Ticket dùng dữ liệu synthetic, không yêu cầu secret hoặc dữ liệu production.

| Chỉ số | Định nghĩa | Cách ghi |
| --- | --- | --- |
| Thời gian hoàn thành | Từ nhận tác vụ tới kết quả được người đánh giá chấp nhận, gồm thời gian chờ | Giờ bắt đầu/kết thúc và thời gian chờ riêng, đơn vị giây |
| Công việc của reviewer | Thời gian reviewer thực sự đọc, hỏi, quyết định | Tổng giây và số lần bàn giao |
| Hỏi bổ sung | Số vòng bổ sung trước quyết định cuối | Đếm theo request và ghi lý do |
| Thành công | Kết quả khớp tiêu chí đã xác lập trước thử nghiệm | Đạt/không đạt/chưa thể kết luận |
| Bỏ sót escalation | Case phải chuyển người nhưng hệ thống không chuyển | Số bỏ sót / tổng case cần chuyển; mẫu số 0 ghi N/A |
| Chuyển tiếp thừa | Case routine bị chuyển người không cần thiết | Số chuyển thừa / tổng case routine; mẫu số 0 ghi N/A |
| Tác động bất lợi | Ví dụ mất thời gian học, hỏi lặp hoặc phụ thuộc câu trả lời | Quan sát thực tế, task, mức độ, quote được phép dùng |

## Bằng chứng cần lưu

Ghi vai trò thật, ngày thử, tham chiếu đồng thuận, source/policy, input synthetic, số đo trước/sau và quote nguyên văn được người tham gia duyệt. Lưu danh tính và chức danh để đáp ứng brief trong nơi riêng có phép truy cập của BTC. Repository công khai chỉ dùng mã người tham gia và dữ liệu đã được đồng ý công bố.

Với mỗi feedback, ghi quyết định sửa/hoãn/không sửa, lý do, commit thay đổi và kết quả kiểm tra lại. Không gán lỗi do agent phát hiện cho phản hồi người dùng. Nếu chưa quan sát được bất lợi, ghi phạm vi quan sát và trạng thái chưa đủ bằng chứng, không tuyên bố không có rủi ro.

Tập đánh giá độc lập phải tách với các case dùng để phát triển. Người đánh giá chốt nhãn trước khi chạy và giải quyết bất đồng. Báo cáo cả NEEDS_INFORMATION, lỗi không khả dụng, cỡ mẫu và giới hạn suy rộng. Ba người chỉ là nghiên cứu mô tả nhỏ, chưa đủ kết luận về toàn tổ chức.
