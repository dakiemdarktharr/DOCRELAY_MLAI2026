# Nội dung trình bày 5 slide

Deck: [VNG-SUPPORT-5-SLIDES.pptx](VNG-SUPPORT-5-SLIDES.pptx). Các ô workflow, mũi tên và chữ là đối tượng PowerPoint chỉnh sửa được. Nguồn theo từng slide nằm trong speaker notes. Không có slide bìa bổ sung ngoài năm mục brief yêu cầu.

## Slide 1 - Quy trình tiếp nhận hỗ trợ kỹ thuật

Mô hình hiện trạng giả định: gửi vấn đề, hỏi lại dữ kiện, tìm người có thẩm quyền, xử lý và báo kết quả. Cần xác nhận workflow này với người dùng thật; chưa có khảo sát thực tế tại VNG. VNG Support tập trung hướng dẫn việc thường quy, chuyển yêu cầu vượt quyền kèm câu hỏi cụ thể và lưu quyết định để kiểm tra lại.

Lời trình bày: “Sản phẩm giải quyết bước phân loại trong quy trình hỗ trợ kỹ thuật. Yêu cầu đơn giản có thể nhận hướng dẫn ngay. Yêu cầu thiếu dữ kiện cần hỏi lại, còn yêu cầu liên quan tới quyền hoặc bảo mật cần người quyết định. Sơ đồ hiện trạng là giả thuyết thiết kế để kiểm chứng trong thử nghiệm người dùng.”

## Slide 2 - Luồng xử lý và quyền quyết định

Input gồm phòng ban bắt buộc và vấn đề kỹ thuật; ID nhân viên là tùy chọn, chưa dùng để xác thực. Người dùng nhập, xem trước và xác nhận. Runtime ẩn dữ liệu nhạy cảm, chuẩn hóa dữ kiện và áp policy. Ba nhánh là routine nhận hướng dẫn, thiếu thông tin nhận câu hỏi và rủi ro/vượt quyền tới nhân viên. Dữ kiện bổ sung được đánh giá lại. Output và chuyển trạng thái có audit.

Lời trình bày: “Policy quyết định nhánh xử lý. Hệ thống chỉ trả hướng dẫn cho việc an toàn. Khi thiếu thông tin, hệ thống hỏi đúng dữ kiện cần thiết rồi đánh giá lại. Khi có rủi ro hoặc vượt thẩm quyền, nhân viên xem hồ sơ và quyết định trong phạm vi cho phép. Mọi thao tác dừng, từ chối hoặc điều chỉnh đều cần lý do.”

## Slide 3 - Đối chiếu workflow và phương pháp đo

Chưa có số liệu tác động. Kế hoạch dùng ít nhất ba nhân sự có đồng thuận, thực hiện tác vụ tương đương ở workflow hiện tại và workflow đề xuất, đảo thứ tự thử nghiệm. Đo tổng thời gian kể cả chờ, số lần hỏi thêm, thời gian reviewer, tỷ lệ bỏ sót và chuyển tiếp thừa. Lưu quote, bất lợi quan sát được và commit sửa từ feedback.

Lời trình bày: “Ở Sprint 1, nhóm trình bày phương pháp đo dự kiến. Nhóm sẽ so sánh hai luồng trên tác vụ tương đương và ghi riêng thời gian chờ, công việc của reviewer. Kết quả phải đi kèm feedback thực tế và những khó khăn phát sinh. Hiện chưa có số liệu để khẳng định giảm thời gian hoặc tăng độ chính xác ngoài thực địa.”

## Slide 4 - Kiến trúc và phạm vi mô phỏng

Next.js phục vụ UI và API. API xử lý validation/redaction, policy quyết định hành động, knowledge/model hỗ trợ khi cần và output được kiểm tra. Mongo lưu request, Verify và audit trong hosted runtime được cấu hình; local mặc định dùng mock/memory. Ticket, approval, reviewer và tác động hạ tầng là synthetic/simulated. Model không có công cụ thực thi IAM/shell.

Lời trình bày: “Người dùng và Verify đi qua cùng API. Quy tắc xử lý giữ quyền quyết định, mô hình hỗ trợ hiểu hoặc diễn đạt trong phạm vi kiểm tra. Local dùng mock và memory; bản hosted dùng cấu hình riêng cần đối chiếu qua health. Đây là workflow mô phỏng, không tự cấp quyền hay thay đổi production.”

## Slide 5 - Giới hạn, rủi ro và bước tiếp theo

Mẫu ngôn ngữ có thể bỏ sót rủi ro; cần dữ liệu độc lập. Reviewer demo chưa xác thực; cần bổ sung trước khi dùng dữ liệu thật. Chưa có user study. Source còn lỗi hash tài liệu policy đã được upstream ghi nhận; không che bằng cách sửa baseline. Giám khảo kiểm tra Verify 5 case, hai input mới, can thiệp và audit.

Lời trình bày: “Giám khảo có thể chạy bộ Đề A gồm ba routine và hai escalation, thử hai input mới rồi kiểm tra thao tác can thiệp và audit. Bộ 15 case mở rộng là dữ liệu phát triển, không thay thế đánh giá độc lập. Các bước tiếp theo là xử lý lỗi kiểm thử đã biết, xác thực người xử lý và thu thập bằng chứng từ người dùng thật.”

## Nguồn để đối chiếu

- [Challenge brief](../Challenge_Brief_OrganizationAI_VN.docx.md), Mục 2A, 3, 4 và 5.
- [Intake](../src/app/workspace/page.tsx), [identity](../src/domain/employee-identity.ts).
- [Policy](../src/domain/policy.ts), [support](../src/services/support.ts), [review](../src/services/review.ts).
- [Verify](../src/app/verify/page.tsx), [harness](../src/lib/support-verify.ts), [health](../src/app/api/support/health/route.ts).
- [Kế hoạch đo](MEASUREMENT-PLAN.md), [trạng thái bằng chứng](EVIDENCE-MATRIX.md).
