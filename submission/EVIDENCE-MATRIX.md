# Trạng thái bằng chứng

Tham chiếu source `7909f0c`. Không phải biên bản chạy production.

| Yêu cầu | Bằng chứng trong hồ sơ | Giới hạn còn lại |
| --- | --- | --- |
| Live URL | Link sản phẩm và health trong README/runbook | Chưa đối chiếu SHA live trong lần làm hồ sơ này |
| Verify | Bảng input/expected/cách chạy 5 case và bộ 15 mở rộng | Rubric chung ghi 4 case; runtime hiện chạy 5/15, không có nút riêng 4 case |
| Input mới | Hướng dẫn chọn phòng ban, nhập hai input mới ở Verify | Kết quả phụ thuộc lần chạy thực tế của giám khảo |
| 5 slide | PPTX mới, đúng 5 mục, có sơ đồ workflow editable | Kết quả thực địa chưa có; Slide 3 trình bày phương pháp dự kiến |
| Video | Chủ dự án yêu cầu xử lý riêng | Không tạo, khôi phục hoặc đính kèm video trong lần cập nhật này |
| Build log | PDF 1 trang và Markdown, dẫn lịch sử đầy đủ | Chi phí tiền/giờ chưa được tổng hợp; human review chưa xác nhận |
| Human-in-the-loop | Review/STOP/OVERRIDE và audit trong source | Reviewer public-demo không xác thực; không có thực thi/rollback hạ tầng |
| Ba người dùng và feedback | Kế hoạch đo + mẫu trống | Chưa có danh tính/vai trò đã xác minh, quote, before/after hoặc sửa từ feedback thật |
| Tác động bất lợi | Có phương pháp quan sát và trường ghi nhận | Chưa có quan sát thực địa; không giả lập thành bằng chứng |
| QA source | Commit 7909f0c ghi 331 pass, 1 hash-policy fail có từ upstream | Không chạy lại toàn bộ runtime suite trong lần làm tài liệu |
| Dữ liệu / policy | Fixture synthetic và policy support-guidance-v5.2 | Không phải policy VNG được xác nhận, không phải held-out accuracy |

Brief Mục 5 phân biệt Sprint 1 chấm phương pháp và Sprint 2 chấm bằng chứng thực tế. Checklist chung ở Mục 4 cũng nêu người dùng thực tế; hồ sơ công bố rõ trạng thái để BTC áp dụng theo vòng, không tự nhận đủ bằng chứng.
