# Vercel — hai package và kiểm tra phát hành

Đây là tài liệu readiness cho project Vercel hiện có. Bản sửa này chỉ đọc/sửa tài liệu: không tạo project, không đổi Production Branch, không đồng bộ secret và không deploy. Package base là `532b123c7f78a3d6c0dd03058ef113d255c272b7`; current main head là `bea350303d5812c7a72873e2cc592de9f9c2acf2`. Receipt triển khai cũ chỉ là lịch sử; đối chiếu SHA đang chạy qua `/api/support/health` trước khi dùng làm bằng chứng.

Project hiện có: acne-a6cd/vng-support, ID prj_hmxBwMixxSLC7fZzeGXI6o6VV5Rh. GitHub: dakiemdarktharr/DOCRELAY_MLAI2026. Production Branch = main đã được API xác minh. Không tạo project mới.

Build từ repo root bằng npm run build, framework Next.js. Trước push/deploy: kiểm tra unit, lint, typecheck, build và E2E mock/memory riêng tại 127.0.0.1:3227. Không chạy build đồng thời E2E. Chỉ stage file thuộc hai package, loại artifacts/screenshot/video sinh lại và secrets.

Khi deploy, APP_REVISION phải khớp SHA main thực tế. Sau deploy, đối chiếu Vercel deployment metadata và /api/support/health, kiểm tra trang chính và Verify có đúng hai bộ 5/15. Health Mongo ping chỉ chứng minh connectivity; provider=openai không chứng minh đã gọi model thành công. Bộ 5 có 3 AUTO và 2 ESCALATE, bộ 15 là synthetic curated; không suy diễn thành held-out accuracy.

Giữ nguyên model cap/counter, credentials và dữ liệu runtime. Lượt deploy không lặp lại thao tác xóa Mongo đã được ghi nhận trước đó. Lưu receipt SHA/deployment ID/URL/kết quả checks sau khi thực sự hoàn tất; receipt 01a20a7 là lịch sử.
