# VNG Support - Nhật ký phát triển

MLAI 2026, Đề A. Source tham chiếu: 7909f0c. Policy: support-guidance-v5.2.

## Công cụ và cách sử dụng

BUILD-LOG.md ghi nhận Codex/Astra hỗ trợ scaffold, policy/workflow TypeScript, UI, test hồi quy và tài liệu. Lần cập nhật hồ sơ này dùng Codex biên soạn nội dung, Artifact Tool xuất PowerPoint, ReportLab xuất PDF. Không suy ra tác giả sinh viên hay human review từ tài khoản Git.

## Workflow đã phát triển

Người dùng chọn phòng ban, nhập vấn đề, xem trước và xác nhận. Runtime redact input, trích xuất dữ kiện và áp policy deterministic. Routine nhận hướng dẫn, thiếu dữ kiện được hỏi thêm, rủi ro/vượt quyền được chuyển reviewer. Reviewer xử lý theo guard và mọi chuyển trạng thái có lý do trong audit. Verify dùng cùng API, có lưu kết quả và đọc lại dữ liệu.

## Phần công cụ hỗ trợ hiệu quả

AI hỗ trợ tạo bộ khung và rà soát lỗi để bổ sung regression test. Lịch sử ghi nhận các sửa lỗi về phạm vi approval, redaction, câu hỏi bổ sung, đọc lại Verify bằng đúng request ID và tải kết quả bất đồng bộ. Đây là mô tả công việc, chưa có phép đo số giờ tiết kiệm.

## Phần phát sinh thời gian và chi phí

Lịch sử ghi nhận false positive của bộ lọc câu trả lời, model hết budget và cuộc đua trạng thái khi tải Verify. Nhóm phải chẩn đoán, sửa guard và chạy lại kiểm thử. Chưa tổng hợp chi phí API/giờ lao động. Lần audit local gặp lỗi dependency/sandbox nên không ghi nhận fresh runtime PASS. Commit 7909f0c báo cáo 331 test pass và 1 hash-policy fail từ upstream.

## Tính năng lớn được cắt giảm

Thực thi cấp quyền và thay đổi hạ tầng thật chưa triển khai. Demo chỉ hướng dẫn và mô phỏng workflow vì chưa có tích hợp IAM, xác thực reviewer và chính sách nội bộ được xác nhận. Nhờ giới hạn này, người chấm có thể thử luồng mà không tạo tác động lên tài nguyên thật.

## Bằng chứng và phần cần hoàn tất

Scaffold có lịch sử trước sprint từ 16/09/2026; giữ nguyên lịch sử và công bố nguồn gốc. Ba người dùng thật, quote, số đo trước/sau và negative impact chưa thu thập. Source và deployment được kiểm tra riêng. Xem BUILD-LOG.md, commit 7909f0c và submission/EVIDENCE-MATRIX.md. Slide mới tập trung workflow; video được chủ dự án xử lý riêng.
