# Giao diện cũ + Support v3 — 20/09/2026

## Phạm vi và contract

Theo yêu cầu người dùng, nhánh `codex/support-v3-migration` dùng lại giao diện orange/NAVI từ workspace `typescript_maxxing`, tích hợp policy/workflow Support v3 hiện có. Không thay tree của `main` đang dành cho đội tự viết `src`.

- Tái sử dụng home hai nút, NAVI SVG/cursor, font Nunito/Baloo2 và các style liên quan. Giữ license font; không coi code/asset tái sử dụng là mới sáng tác hoặc thay đổi mốc nguồn gốc bằng commit mới.
- `/send-help` là lối vào employee; `/workspace` tiếp tục dùng cùng component. Freeform có nhóm hỗ trợ + mô tả; structured có taxonomy/fields v3. Preview khóa intake, cho quay lại sửa trước confirmed submit.
- Giữ input/output của `/api/support/*`, `/api/review/*`, decision authority, redaction, state guards, audit và Verify. Không chép backend, environment, dữ liệu hoặc dependency stack từ workspace cũ.
- Kết quả gửi dẫn tới `/requests/[id]`, giữ hướng dẫn A–D, clarification và handoff. Reviewer vẫn có các action v3, reason và version guard.
- Navigation dùng Verify thay nút QR của prototype: migration hiện chưa có QR endpoint. Các link hiển thị đều trỏ tới chức năng có thật.
- Generic `/legacy/*` và `/api/health`, `/api/events`, `/api/echo` vẫn được giữ.

## File dự kiến thay đổi

Layout, home, CSS, header, UI primitives, employee/reviewer/result/history/audit/verify presentation, font/SVG assets, E2E selectors và tài liệu. Không đổi domain/services/API hay fixture để phục vụ thay đổi giao diện.

## Kiểm chứng

So sánh home/help với server prototype port 3000 chỉ đọc. Chạy unit, lint, typecheck/build và E2E desktop/mobile trên server của repository này tại port 3216. Kết quả thực tế ghi trong STATUS và BUILD-LOG sau kiểm chứng.

## Kết quả và nguồn bằng chứng

- Tái sử dụng presentation từ source prototype; phiên server prototype port 3000 trả trang không có CSS trong lượt chụp nên không dùng ảnh đó để khẳng định pixel parity. Đã xem ảnh desktop/mobile của giao diện được khôi phục.
- E2E mới kiểm tra nền cam, đúng hai lối vào, NAVI trên desktop/touch/reduced motion, `/send-help` và alias, preview khóa/sửa, reviewer deep link/reload/filter, cùng toàn bộ nghiệp vụ v3 trước đó.
- Lượt đầu phát hiện selector nhãn bộ lọc reviewer cần `aria-label` rõ ràng (đã sửa). Sau đó file `src/domain/contracts.ts` bị thay đổi đồng thời bên ngoài tác vụ UI, khiến catalog không còn khớp `serviceGroups`.
- Giữ nguyên file đang được sửa; QA cuối chạy trên checkout riêng từ `69b1649` cộng đúng các thay đổi UI, không đưa bản domain đang viết dở vào commit giao diện. 87 unit/integration và 24 E2E PASS, không retry. Report tại `artifacts/e2e-results.json`; ảnh home/help-preview/assistance/reviewer cho cả hai viewport.
- `main` không bị cập nhật. Policy, services, API và fixtures của commit giao diện giữ nguyên so với `69b1649`.
