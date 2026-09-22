# Chạy từ bản clone sạch

Source nội dung: `7909f0c`, Node.js 22 trở lên, npm, Git. Dùng `package-lock.json` đã commit và `npm ci`. Không cần cài Vercel để chạy local. Các lệnh dưới đây dành cho PowerShell và thư mục clone mới chưa tồn tại.

```powershell
git clone https://github.com/dakiemdarktharr/DOCRELAY_MLAI2026.git vng-support-demo
Set-Location vng-support-demo
git rev-parse HEAD
node --version
npm --version
npm ci
Copy-Item .env.example .env.local
npm run db:generate
npm run dev -- --hostname 127.0.0.1 --port 3000
```

File mẫu dùng mock model và memory demo, không cần API key hoặc MongoDB. `.env.local` thuộc máy local, không commit. Không dùng `npm run start` cho demo memory vì production yêu cầu MongoDB. Prisma generate tạo type cho phần tương thích, không cần migrate database để chạy workflow support memory.

Trong cửa sổ PowerShell thứ hai:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/support/health | ConvertTo-Json -Depth 6
Start-Process http://127.0.0.1:3000
Start-Process http://127.0.0.1:3000/verify
```

Health phải phản ánh mock và memory local. Memory không bền vững sau khi server khởi động lại. Mở trang chủ, chọn phòng ban, nhập yêu cầu, xem trước rồi xác nhận. ID nhân viên tùy chọn và không xác thực danh tính. Tại Verify, chọn de-a-v3 và chạy toàn bộ 5 case. Lưu URL kết quả, mở request/audit và thử input mới với phòng ban đã chọn.

## Kiểm tra source

Dừng dev server bằng Ctrl+C, sau đó chạy tuần tự:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright tự tạo server mock/memory tại `127.0.0.1:3227`, không dùng lại server cũ. Bảo đảm cổng trống, không dừng tiến trình không liên quan. Không chạy build và E2E đồng thời vì cùng dùng `.next`. Browser download cần Internet; E2E có thể cập nhật artifacts nên không tự stage tất cả file sinh ra.

Commit `7909f0c` báo cáo 331 test pass và 1 test hash policy fail từ thay đổi tài liệu upstream. Đây là known baseline, không phải PASS toàn bộ. Khi chạy lại, giữ output lỗi và SHA thực tế; không đổi hash/fixture chỉ để làm xanh báo cáo. Hồ sơ mới không tuyên bố đã chạy lại suite hay workflow production.

## Đối chiếu bản trực tuyến

```powershell
Invoke-RestMethod https://vng-support.vercel.app/api/support/health | ConvertTo-Json -Depth 6
```

Ghi `sourceRevision`, `policy`, `storage`, `durable`, `provider` cùng thời điểm kiểm tra. Mongo ping chỉ xác nhận kết nối, không chứng minh đã lưu được workflow hoặc đã gọi OpenAI. Source GitHub và alias Vercel phải được đối chiếu riêng. Nếu lỗi mạng/TLS hoặc API không truy cập được, ghi rõ chưa xác minh, không suy ra sản phẩm hỏng hoặc source mới đã live.

Hồ sơ này không thay đổi cấu hình deployment, secret, budget hoặc database. Dùng synthetic data khi tự kiểm thử.
