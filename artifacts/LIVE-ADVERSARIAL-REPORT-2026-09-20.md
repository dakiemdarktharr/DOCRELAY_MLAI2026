# Báo cáo kiểm thử đối kháng bản demo

Ngày chạy: 2026-09-20  
URL: <https://labpass-five.vercel.app>  
Kho mã: <https://github.com/dakiemdarktharr/DOCRELAY_MLAI2026>  
Mục tiêu: kiểm tra bản demo theo brief OrganizationAI/VNG, đặc biệt là khả năng tự xử lý ca thường quy, không khẳng định khi thiếu dữ kiện, chuyển đúng người phụ trách và lưu dấu vết kiểm toán.

## 1. Kết luận ngắn

Bộ kiểm tra Verify hiện tại chạy tốt trên các ca đã cài sẵn, nhưng bản demo vẫn có hai lỗi cần ưu tiên trước khi giám khảo thử các ca lạ:

1. **Mức P1 — tranh chấp gửi trùng:** cùng một mã chống gửi trùng gửi đồng thời 10 lần, đã quan sát 2/10 phản hồi trả về bản ghi còn `RECEIVED`, `version=0`, chưa có quyết định; 8/10 phản hồi trả về bản ghi hoàn tất. Người dùng có thể tưởng workflow đã xong trong khi phân tích vẫn đang chạy.
2. **Mức P1 — reviewer vượt điều kiện thiếu thông tin:** yêu cầu `NEEDS_INFORMATION` còn thiếu `verifiedApproval` có thể gọi `APPROVE`, sau đó `FULFILL`, và trở thành `COMPLETED`. Quyết định bên trong vẫn giữ `NEEDS_INFORMATION/MISSING_INFO`; chỉ có trạng thái hồ sơ bị đẩy qua. Điều này phá vỡ nguyên tắc “thiếu dữ kiện hoặc approval chưa xác minh thì không hoàn tất”, dù thao tác demo không có side effect hạ tầng thật.

Hai lỗi trên chưa được sửa trong lượt kiểm thử này. Cần tạo bản vá riêng, bổ sung kiểm thử hồi quy, rồi chạy lại ma trận trước khi đưa vào bản chấm.

## 2. Bằng chứng đã chạy

| Nhóm | Kết quả | Ghi chú |
|---|---:|---|
| Verify đề A v3 | **5/5 đạt** | 3 ca tự duyệt, 2 ca chuyển người phụ trách; đúng phân bố brief |
| Verify Migration v3 | **10/10 đạt** | Hướng dẫn, thiếu thông tin, lỗi mô hình, mâu thuẫn, injection, handoff, wipe |
| Input mới trên giao diện Verify | **Đạt** | Mở port 3389 công khai được chuyển Security/Network, không tự duyệt |
| Kiểm tra sức khỏe | **HTTP 200** | Bản live dùng MongoDB và nhà cung cấp mô hình OpenAI; chế độ mô phỏng không gọi hạ tầng thật |
| Kiểm tra an toàn API | **Đạt** | Xác nhận bắt buộc, field lạ, enum sai, content type, JSON hỏng, Origin lạ, UUID sai và body quá lớn bị chặn |
| Che bí mật | **Đạt với ca password** | Giá trị giả lập không xuất hiện trong response; chỉ còn `[REDACTED]` |
| Chuyển tiếp yêu cầu nguy hiểm | **Đạt** | Secret/public exposure, injection, production, quyền đặc biệt đều bị chuyển người phụ trách |
| Reviewer cạnh tranh | **Đạt một phần** | Stop/Reject dùng cùng version: một thành công, một `VERSION_CONFLICT` |
| Tải đồng thời bản xem trước | **Đạt** | 10 request structured đồng thời đều HTTP 200 và `AUTO_APPROVE` |
| Mã nguồn giao diện | **Đạt sơ bộ** | Không tìm thấy `dangerouslySetInnerHTML`, `innerHTML`, `eval`, localStorage hoặc sessionStorage trong vùng giao diện đã quét |

## 3. Hai lỗi tái hiện

### 3.1. Tranh chấp chống gửi trùng

Các bước:

1. Tạo payload hợp lệ, `confirmed=true`, dùng cùng một `idempotencyKey`.
2. Gửi đồng thời 10 yêu cầu tới `POST /api/support/requests`.
3. Đọc toàn bộ response.

Kết quả quan sát: tất cả request dùng chung một id, nhưng một phần response trả `status=RECEIVED`, `version=0`, chưa có `decision` và chỉ có event tiếp nhận; phần còn lại trả `version=1` cùng quyết định cuối.

Nguyên nhân mã nguồn: nhánh thua thao tác chèn bản ghi trong `submitSupport` lấy bản ghi hiện tại rồi trả ngay. Nó không chờ hoặc đọc lại cho đến khi nhánh thắng hoàn tất phân tích và cập nhật phiên bản.

Ảnh hưởng khi chấm: giám khảo hoặc giao diện có thể thấy cùng một request lúc “đã gửi xong”, lúc “chưa có quyết định”; khó chứng minh tính nhất quán của workflow và audit.

Hướng sửa đề xuất:

- Sau khi gặp bản ghi trùng, chờ ngắn có giới hạn rồi đọc lại cho đến khi `version > 0` hoặc trạng thái lỗi cuối.
- Hoặc lưu một promise/lease xử lý theo `idempotencyKey` ở tầng ứng dụng, kết hợp cơ chế timeout và trạng thái thất bại rõ ràng.
- Bổ sung kiểm thử 10–20 request đồng thời và kiểm tra mọi response có cùng snapshot cuối.

### 3.2. Duyệt và hoàn tất yêu cầu còn thiếu thông tin

Các bước:

1. Tạo yêu cầu đọc database staging nhưng bỏ `approvalReference` hoặc các field bắt buộc.
2. Hệ thống trả quyết định `NEEDS_INFORMATION`, bucket `MISSING_INFO`, có `INFO-001/INFO-005`.
3. Gọi reviewer `APPROVE` với đúng `version`.
4. Gọi `FULFILL` với version mới.

Kết quả quan sát: cả hai thao tác thành công; hồ sơ thành `COMPLETED` dù quyết định vẫn là `NEEDS_INFORMATION/MISSING_INFO` và approval chưa xác minh.

Nguyên nhân mã nguồn: `reviewSupport` chỉ chặn `APPROVE/FULFILL` khi bucket là `SECURITY_RISK`; nó chưa chặn việc hoàn tất khi decision còn `NEEDS_INFORMATION`, còn thiếu field hoặc chưa có approval được xác minh.

Ảnh hưởng khi chấm: giám khảo có thể đưa một case thiếu dữ kiện, bấm approve/fulfill trên reviewer công khai và chứng minh hệ thống đã hoàn tất trái với chính câu hỏi mà nó vừa yêu cầu.

Hướng sửa đề xuất:

- Chặn `APPROVE` nếu `decision.action === NEEDS_INFORMATION`, còn `missingFields`, hoặc `requiresApproval` nhưng chưa verified.
- Chặn `FULFILL` nếu quyết định chưa phải đường workflow được policy cho phép; không suy ra quyền từ việc reviewer bấm nút.
- Nếu muốn có quyền vượt chính sách cho demo, tách thành `OVERRIDE`, bắt buộc lý do, đích đến, actor có quyền và cảnh báo rõ; vẫn không được tạo side effect thật.
- Bổ sung kiểm thử hồi quy cho chuỗi `NEEDS_INFORMATION → APPROVE → FULFILL`.

## 4. Những hàng rào đang hoạt động tốt

- Nội dung ticket được xem là dữ liệu không tin cậy; các chỉ dẫn “bỏ qua policy” không được coi là chỉ thị hệ thống.
- Secret giả lập được che trước khi đưa vào canonical input và response.
- Public exposure, production, đặc quyền, bypass và prompt injection không đi vào nhánh auto-approve.
- Reviewer không thể approve trực tiếp case `SECURITY_RISK` qua API; đường `FULFILL` cũng bị chặn bởi trạng thái chuyển tiếp và hàng rào policy.
- Cập nhật cạnh tranh dùng version và trả `VERSION_CONFLICT` cho thao tác cũ.
- API đặt `Cache-Control: no-store` và có hàng rào Origin, content type, kích thước body và schema.
- Giao diện dùng React text rendering; lần quét mã nguồn không thấy sink HTML nguy hiểm trong vùng đã kiểm tra.

## 5. Phạm vi chưa chạy trực tiếp

- Không chạy bộ `Verify gốc` 128 ca và `Ground Truth gốc` 123 ca trên production vì bản live đang dùng nhà cung cấp mô hình thật; chạy toàn bộ có thể tiêu ngân sách mô hình và làm thay đổi dữ liệu demo. Hai bộ này nên chạy bằng nhà cung cấp giả lập trong môi trường kiểm thử.
- Kiểm thử trình duyệt tự động cục bộ chưa chạy được trong môi trường hiện tại vì thiếu Chromium của Playwright; các kết quả Verify ở trên được chạy qua giao diện live.
- Báo cáo này chưa khẳng định hiệu năng tải lớn của MongoDB/Vercel; 10 bản xem trước đồng thời chỉ là smoke load test (kiểm tra tải nhẹ).

## 6. Tài liệu và bộ ca tiếp theo

- Bộ ca mới: [`mlai26_new/data/adversarial/judge_stress_cases.json`](../mlai26_new/data/adversarial/judge_stress_cases.json).
- Bộ hidden adversarial cũ vẫn giữ nguyên để không mất lịch sử; bộ mới bổ sung các nhánh reviewer, chống gửi trùng, redaction, model fault và mâu thuẫn field/free text.
- Khi sửa lỗi, cập nhật `STATUS.md`, thêm liên kết tới báo cáo này, chạy lại `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` và toàn bộ bộ ca đối kháng.
