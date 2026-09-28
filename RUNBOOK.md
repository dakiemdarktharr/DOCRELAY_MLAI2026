# VNG Support — Hướng dẫn vận hành

Hướng dẫn thao tác sản phẩm nằm trong [README](README.md). File này dành cho cài đặt, kiểm tra và bảo trì repository.

## Chạy local

Dùng Node.js 22+ và npm. Trong PowerShell, tại thư mục repository:

```powershell
npm ci
Copy-Item .env.example .env.local
npm run db:generate
npm run dev
```

Chỉ sao chép `.env.example` khi chưa có `.env.local`; giữ cấu hình cá nhân đã có. Mở `http://localhost:3000`. Cấu hình mẫu sử dụng model mock và `memory-demo`.

## Kiểm tra trước khi phát hành

```powershell
npm run lint
npm run typecheck
npm test
npm run build
$env:SUPPORT_E2E_PRODUCTION='true'
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=mobile
npm audit
```

Playwright tự khởi động server riêng tại `127.0.0.1:3227` với model mock và bộ nhớ tạm. Chạy build xong mới chạy E2E vì cùng sử dụng `.next`. Chạy desktop và mobile riêng để mỗi lượt có server và hạn mức request riêng. Không dừng một tiến trình khác đang dùng cổng này.

Báo cáo, ảnh chụp và video do test sinh ra cần được kiểm tra riêng trước khi đưa vào Git. Kết quả local không thay thế kiểm tra dịch vụ đang triển khai.

## Đối chiếu bản triển khai

Website: [vng-support.vercel.app](https://vng-support.vercel.app). Dùng project Vercel hiện có `acne-a6cd/vng-support`.

```powershell
git rev-parse HEAD
Invoke-RestMethod https://vng-support.vercel.app/api/support/health
```

Đối chiếu `sourceRevision` với commit đã triển khai, cùng `status`, `policy`, `storage` và `durable`. Runtime lưu dữ liệu qua MongoDB; cấu hình nằm trong môi trường của project. `.vercelignore` loại environment files, dependencies, artifacts và worktree khỏi gói upload. Không đưa secret vào Git hoặc output kiểm tra.

Sau khi triển khai, kiểm tra trang chọn vai trò, popup lần đầu, URL/QR, trang gửi, reviewer, lịch sử và Verify trên desktop/mobile. Việc chạy kiểm thử có ghi dữ liệu hoặc gọi model trên site cần được phân biệt với kiểm tra chỉ đọc.

## Tiếp tục một lượt Verify

Mở **Kiểm thử**, chọn lượt đã lưu rồi tiếp tục sau khi lỗi mạng hoặc giới hạn tần suất đã hết. Trường hợp có thể thử lại giữ nguyên mã yêu cầu. Một kết quả không khớp policy vẫn được ghi là không đạt; không thay kỳ vọng để che lỗi.

## Bảo trì dữ liệu và policy

- [Bộ dữ liệu kiểm thử](docs/JUDGE-DATASETS.md) mô tả các pack hiện có.
- [Quản trị knowledge](docs/KNOWLEDGE-REVIEW.md) hướng dẫn tạo revision mới và kiểm tra nguồn.
- [Hợp đồng đánh giá](docs/EVALUATION.md) mô tả đầu vào và cách tính kết quả.
- [Workflow theo bằng chứng](docs/EVIDENCE-WORKFLOW-FOLLOWUP.md) mô tả yêu cầu bổ sung dữ liệu và điều kiện chuyển reviewer.

Các policy gốc trong `mlai26_new/data/policy/` là dữ liệu lịch sử được bảo vệ bằng checksum tại `artifacts/migration-baseline-manifest.json`. Giữ nguyên chúng để hồi quy; policy runtime nằm trong `src/domain/policy-source.ts` và `src/domain/policy.ts`. `POLICY-REVIEW.md` mô tả policy-v2 trước tích hợp, không phải trạng thái runtime hiện tại.

Các báo cáo release, migration và prompt bàn giao cũ có thể tra cứu trong lịch sử Git. Tài liệu vận hành hiện hành không yêu cầu áp lại patch hay chia thành hai package.

## Kiểm tra Mongo trong môi trường thử nghiệm riêng

Chỉ dùng Mongo local hoặc credential thử nghiệm giới hạn trên database mới, tên `sprint1_test_<suffix>`. Không copy URI/credential production. Giữ `AI_PROVIDER=mock`, `AI_MAX_ATTEMPTS=0`, model keys và `DATABASE_URL` rỗng. Đặt `MONGODB_URI`, `MONGODB_DB` riêng cùng `SUPPORT_ACCESS_MODE=public-demo`, chạy server tại3227. Health ping thành công chưa chứng minh persistence sau restart.

Trong terminal khác, tạo duy nhất dữ liệu synthetic rồi giữ lại các biến:

```powershell
$baseUrl = 'http://127.0.0.1:3227'
$body = @{rawText='Restart synthetic laptop'; fields=@{department='engineering'}; confirmed=$true; idempotencyKey=[guid]::NewGuid().ToString()} | ConvertTo-Json
$before = (Invoke-RestMethod "$baseUrl/api/support/requests" -Method Post -ContentType 'application/json' -Body $body).data
$requestId = $before.id
if (-not $requestId) { throw 'Create failed' }
$beforeJson = $before | ConvertTo-Json -Depth 40 -Compress
```

Dừng đúng server vừa khởi chạy, rồi khởi động lại với cùng URI/database. Đọc lại:

```powershell
$after = (Invoke-RestMethod "$baseUrl/api/support/requests/$requestId").data
if (($after | ConvertTo-Json -Depth 40 -Compress) -cne $beforeJson) { throw 'Restart read-back differs' }
```

Mở hai tab reviewer cùng request/version, bấm Stop: một thành công, một409; version chỉ tăng1 và chỉ có một event STOP. Ngắt Mongo thử nghiệm rồi thử đọc/ghi: phải503, không fallback memory hoặc lộ URI. Chạy lại với một credential synthetic có nhãn và kiểm tra response/document/audit chỉ giữ bản redact. Ghi kết quả kèm commit, Node/Mongo version và DB name; không log URI, secret hoặc raw personal input, không xóa collection/reset budget. Test adapter mock không thay thế quy trình live này.

## Giới hạn riêng tư và phép đo local

Redaction chỉ nhận diện một số credential/pattern; không ẩn danh toàn diện CCCD, điện thoại, tên, điểm hoặc OTP/secret bị làm rối. Dữ liệu chưa nhận diện có thể đến model, storage, audit và UI. Chỉ dùng synthetic hoặc đã ẩn danh trước; dữ liệu gõ vào form vẫn tồn tại trong trình duyệt trước xử lý.

`node scripts/measure-support-latency.mjs` dùng server loopback3227 mock/memory, bỏ5 warmup rồi đo20 preview tuần tự, trả p50/p95/max HTTP+JSON. Ghi kèm OS, Node, commit và dev/start mode. Preview có thể lưu trong memory cache; không tạo support request. Không chạy cùng E2E, không coi đây là tốc độ Mongo/model/production hoặc bằng chứng cần song song hóa pipeline.

`.github/workflows/qa.yml` chạy unit/lint/types/build và E2E desktop/mobile riêng bằng production build, không có deploy step. Kết quả local và hosted CI phải ghi riêng; việc có config không chứng minh GitHub Actions đã chạy thành công.
