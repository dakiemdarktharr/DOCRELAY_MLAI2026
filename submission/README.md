# Hồ sơ nộp VNG Support

MLAI 2026, OrganizationAI, Đề A: The Escalation Referee. Bộ hồ sơ này dựa trên source `7909f0cc8f99629f114b528cde8a989450bc1de7`, policy `support-guidance-v5.2`. Đây là mốc source để đối chiếu nội dung, không phải xác nhận SHA đã triển khai. Xem lịch sử Git để xác định commit của bộ hồ sơ.

## Các hạng mục

| Hạng mục | Đường dẫn / file |
| --- | --- |
| Sản phẩm trực tuyến | https://vng-support.vercel.app/ |
| Verify | https://vng-support.vercel.app/verify |
| Source và lịch sử commit | https://github.com/dakiemdarktharr/DOCRELAY_MLAI2026 |
| 5 slide, trọng tâm workflow | [VNG-SUPPORT-5-SLIDES.pptx](VNG-SUPPORT-5-SLIDES.pptx) |
| Nội dung slide và lời thuyết trình | [SLIDE-NOTES.md](SLIDE-NOTES.md) |
| Build log 1 trang | [BUILD-LOG-ONE-PAGE.pdf](BUILD-LOG-ONE-PAGE.pdf), [bản văn bản](BUILD-LOG-ONE-PAGE.md) |
| Bảng test case và cách thực thi | [TEST-CASES.md](TEST-CASES.md), [CSV](TEST-CASES.csv) |
| Quy trình chấm và hướng dẫn local | [JUDGE-GUIDE.md](JUDGE-GUIDE.md), [RUNBOOK.md](RUNBOOK.md) |
| Phương pháp đo và mẫu ghi nhận | [MEASUREMENT-PLAN.md](MEASUREMENT-PLAN.md), [USER-FEEDBACK-TEMPLATE.md](USER-FEEDBACK-TEMPLATE.md) |
| Trạng thái bằng chứng | [EVIDENCE-MATRIX.md](EVIDENCE-MATRIX.md) |
| Video demo tối đa 3 phút | Ngoài phạm vi cập nhật này, đội thi quay và bổ sung riêng. |

## Cách chấm nhanh

Mở sản phẩm, chọn **Tôi cần hỗ trợ**, chọn **Phòng ban**, nhập vấn đề, xem trước rồi xác nhận. ID nhân viên là tùy chọn, đang phát triển, không phải xác thực danh tính. Mở trực tiếp `/verify`, chọn **Đề A — 5 trường hợp (3 tự động / 2 chuyển tiếp)** và bấm **Chạy toàn bộ test (5)**. Tiếp tục thử hai input mới, kiểm tra request trong `/review`, thực hiện dừng/điều chỉnh có lý do và đọc audit.

Brief Mục 3b và rubric chung nói 4 case, trong khi bài kiểm tra Đề A yêu cầu 5 case. Bảng test ghi rõ 4 case hồ sơ và ánh xạ vào bộ 5. Runtime hiện chạy bộ 5 hoặc bộ 15 bằng một nút, chưa có lựa chọn riêng chỉ chạy 4 case. Không tuyên bố hai yêu cầu này hoàn toàn tương đương.

## Phạm vi bằng chứng

Đây là sản phẩm demo sinh viên, không phải dịch vụ chính thức hoặc chính sách nội bộ được VNG xác nhận. Ticket, tài nguyên, approval và vai trò reviewer đều mô phỏng. Chưa thu thập dữ liệu từ ba người dùng thật, quote hoặc số đo tác động. Sprint 1 trình bày phương pháp đo dự kiến; Sprint 2 cần bằng chứng thực tế theo brief.

Commit source `7909f0c` ghi nhận 331 unit/integration pass và 1 lỗi kiểm tra hash tài liệu policy có từ upstream. Đây là kết quả được ghi trong commit, không phải lần test mới của bộ hồ sơ. Không sửa fixture hay baseline để che lỗi. Health và bản chạy trực tuyến cần đối chiếu riêng trước khi nộp.

Toàn bộ tài liệu mới và slide có hỗ trợ từ Codex. Việc commit không xác nhận sinh viên đã review, tự viết hoặc chứng minh hiệu quả thực địa.
