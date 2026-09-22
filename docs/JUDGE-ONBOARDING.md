# Hướng dẫn giám khảo và truy cập bằng QR

Thay đổi có AI assistance, tiếp nối commit `1ed0954` trên nhánh `codex/evidence-workflow-followup`. Không suy ra human review hoặc deployment từ commit. Checkout gốc có thay đổi chưa commit nên phần triển khai nằm trong worktree riêng; không đưa những thay đổi ngoài phạm vi vào commit này.

## Trải nghiệm

- Lần đầu mở tab: popup trắng bo tròn, viền cam, minh họa SVG với mũi tên đỏ; nội dung cuộn bên trong và nút **Đã hiểu** luôn ở cuối khung. Popup giữ focus bàn phím và khóa cuộn trang phía sau.
- Chọn **Tôi cần hỗ trợ**: mũi tên chỉ chế độ, danh mục, các ô nhập, **Gửi**, phản hồi, xác nhận, A/B/C/D, hỏi tiếp và lịch sử. Các bước không có trên giao diện hiện tại được bỏ qua. Nút **Gửi** vẫn chạy preview; bước xác nhận mới lưu hồ sơ.
- Chọn **Dành cho nhân viên**: hướng dẫn lọc danh sách, mở hồ sơ, đọc bằng chứng, nhập lý do, quyết định và kiểm tra nhật ký. Hướng dẫn không tự click, gửi request hoặc phê duyệt.
- Có thể bấm **Tiếp theo** hoặc **Bỏ qua hướng dẫn**. Mỗi vai trò được ghi nhận ngay khi bắt đầu, nên thoát giữa chừng rồi quay lại cũng không lặp.
- Cờ `vng-guide-v1:intro`, `sender`, `reviewer` nằm trong `sessionStorage`. Refresh và quay về trang chọn vai trò không lặp; đóng tab rồi mở link trong tab mới sẽ có hướng dẫn lại. Tab được trình duyệt khôi phục/nhân bản có thể giữ session theo hành vi của trình duyệt. Khi storage bị chặn, bộ nhớ trang là phương án dự phòng, không duy trì qua refresh.

## URL / QR

Nút **URL / QR** ở đầu trái header trên mọi trang. Mã tạo ngay trong trình duyệt bằng `qrcode.react`; không gửi URL đến dịch vụ QR bên ngoài. Nội dung luôn là `window.location.origin + '/'`, không chứa mã hồ sơ, query hoặc fragment. Quét bằng camera điện thoại sẽ mở trang chọn hai vai trò; thiết bị mới sẽ thấy hướng dẫn lần đầu.

Popup có URL, nút sao chép, mở trang chọn vai trò và đóng. Nếu clipboard bị chặn, ô URL được chọn để sao chép thủ công. URL localhost chỉ hoạt động trên máy đang chạy; quét từ điện thoại cần truy cập bản triển khai hoặc địa chỉ mạng có thể kết nối. Không hardcode URL production và không thay đổi cấu hình deployment.

## Kiểm chứng

Dùng dữ liệu synthetic, model mock và kho memory-demo; không gọi LLM/DB production.

Kết quả tại thay đổi này: lint, typecheck, production build và 323 unit test đạt; E2E desktop 28 đạt, mobile 27 đạt, 1 bỏ qua theo cấu hình vì video demo chỉ ghi trên desktop. `git diff --check` đạt. Đã xem ảnh chụp popup, hướng dẫn và QR ở desktop/mobile. Mức tin cậy cao cho các luồng và kích thước đã kiểm tra; chưa xác nhận bản triển khai hoặc thiết bị vật lý.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
$env:SUPPORT_E2E_PRODUCTION='true'
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=mobile
```

Tùy chọn E2E production chạy bản build tại localhost, giúp tránh biên dịch Next dev đồng thời với trình duyệt trên máy ít RAM. Rate limit vẫn bật; mỗi test sử dụng IP giả lập riêng để mô phỏng khách truy cập độc lập. Chạy từng project với server riêng như trên: Verify còn gọi API nội bộ qua loopback, nên gộp cả hai project quá nhanh có thể chạm giới hạn 30 request/phút của địa chỉ này. Fixture hồi quy ghi nhận khách đã xem hướng dẫn, trong khi bộ `judge-guide.spec.ts` dùng tab mới không có cờ để kiểm tra lần đầu.

Các kiểm tra mới bao gồm:

- Popup cuộn nội bộ, giữ focus, luồng hướng dẫn thực tế cho hai vai trò; quay lại, refresh và đóng/mở tab.
- Giải mã pixel QR bằng `jsqr`, so sánh URL gốc, kiểm tra copy và mở đích quét trong tab mới.
- Không tràn ngang ở 320 × 568, 390 × 844 và 844 × 390 trên trang đầu, gửi, workspace, theo dõi, danh sách/chi tiết reviewer, chi tiết yêu cầu, audit, Verify và các trang legacy. Popup QR nằm trong viewport và cuộn được.
- Luồng gửi, hội thoại, bổ sung, chuyển nhân viên, quyết định, audit và Verify chạy trên Chromium desktop và cấu hình điện thoại Pixel 7. Đây là browser emulation, không phải bằng chứng đã kiểm tra mọi điện thoại thật hoặc Safari/iOS.

Ảnh chụp/video và báo cáo có timestamp được tạo cục bộ trong `artifacts/`, `test-results/` và `submission/`; không thay thế bằng chứng release lịch sử trong commit này.
