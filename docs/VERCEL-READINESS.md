# Vercel readiness check — main

Ngày kiểm tra: **2026-09-22**. Đây là checklist kiểm tra khả năng chạy trên Vercel; không phải thao tác khởi tạo project, đổi setting hay deploy.

## Kết luận

| Hạng mục | Kết quả |
| --- | --- |
| Framework | Pass — Next.js 15.5.25, vercel.json nhận framework nextjs |
| Install | Pass — npm ci |
| Production build | Pass — npm run build |
| Unit/integration tests | Pass — 26 files, 301 tests |
| Live host | Pass — vng-support.vercel.app/api/support/health trả status ok |
| Live revision = main | **Fail tại thời điểm audit** — host đang trả revision cũ |
| Production Branch trong dashboard | Chưa xác minh — cần quyền dashboard của chủ project |
| Vercel initialization/deployment | **Không thực hiện** |

## Revision đối chiếu

- GitHub main khi kiểm tra: 825df2a120ba99e28fde08bb8460dadecbd01421.
- Live health sourceRevision: 01a20a7128b58a0e09e8e6f6ed1fe10a1f4a85a3.
- Vì hai SHA khác nhau, URL public hiện không chứng minh production đang chạy commit mới nhất của main.

Health response còn cho biết runtime đang dùng storage MongoDB durable, provider OpenAI, policy support-guidance-v5.2 và marker MLAI_SUPPORT_REFEREE_V3.

## Cấu hình Vercel cần đối chiếu thủ công

Trong project Vercel hiện có của repo:

| Setting | Giá trị cần kiểm tra |
| --- | --- |
| Repository | dakiemdarktharr/DOCRELAY_MLAI2026 |
| Production Branch | main |
| Root Directory | Repo root (.) |
| Framework Preset | Next.js |
| Install Command | npm ci hoặc auto-detected npm install |
| Build Command | npm run build |
| Output | Next.js default; không dùng render.yaml |
| Region | sin1 theo vercel.json |

Environment variables phải được thiết lập ở server-side Vercel project, tối thiểu gồm AI_PROVIDER, OPENAI_API_KEY, AI_MODEL/AI_ESCALATION_MODEL, MONGODB_URI, MONGODB_DB, APP_REVISION nếu không dùng sẵn VERCEL_GIT_COMMIT_SHA. Không commit giá trị secret.

## Post-deploy verification

Sau khi **chủ project** chủ động kiểm tra Production Branch và deploy main, chạy:

~~~bash
curl -fsSL https://vng-support.vercel.app/api/support/health
git rev-parse main
~~~

Chỉ coi production đã bám main khi data.sourceRevision bằng SHA main của deployment đó, đồng thời kiểm tra /verify bằng submission-4 và de-a-v3. Một HTTP 200 hoặc health ok riêng lẻ không đủ vì deployment cũ cũng có thể health tốt.

## Những gì chưa làm

- Không chạy vercel link, vercel init, vercel deploy hay vercel --prod.
- Không import GitHub repo vào project Vercel.
- Không đổi Production Branch, environment variables, domain, alias hoặc MongoDB.
- Không merge tài liệu cleanup vào main trong bước kiểm tra này.
