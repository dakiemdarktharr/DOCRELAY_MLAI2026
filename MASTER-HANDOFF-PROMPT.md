# Master Handoff Prompt — DocRelay

Bạn là coding agent tiếp nhận dự án MLAI VNG. Hãy tiếp tục từ codebase hiện tại trong workspace, không khởi tạo lại dự án và không xóa các thay đổi đang có.

## Mục tiêu thay đổi

Chuyển sản phẩm từ generic shell/LabPass concept sang **DocRelay** — nền tảng AI điều phối văn bản hành chính gửi đi và nhận vào.

Tagline: **“Nhận đúng – duyệt đúng – chuyển đúng.”**

DocRelay phải giúp doanh nghiệp:

- tiếp nhận văn bản từ bên ngoài;
- nhận diện cơ quan gửi, loại văn bản, nội dung chính và department phù hợp;
- xử lý văn bản gửi đi qua đúng quy trình phê duyệt;
- tự động chuyển văn bản đã được `AUTO_APPROVE` hoặc `ADMIN_APPROVE` đến department cần nhận;
- ghi lại đầy đủ lý do, người xử lý, thời điểm và các thay đổi trong audit log.

## Nguyên tắc bảo toàn bắt buộc

1. Giữ nguyên các animation, transition, loading state, hover state, dialog behavior, responsive behavior, spacing rhythm, card treatment, navigation orientation và component style đang có. Không đơn giản hóa giao diện bằng cách xóa các hiệu ứng hiện hữu.
2. Giữ nguyên cấu trúc Next.js App Router, Tailwind CSS, Prisma/PostgreSQL, Zod, Lucide icons, Vitest và Playwright trừ khi có lý do kỹ thuật rõ ràng.
3. Giữ nguyên các route và API hiện có cho đến khi route mới đã thay thế an toàn:
   - `/`
   - `/workspace`
   - `/verify`
   - `/audit`
   - `GET /api/health`
   - `POST /api/echo`
   - `GET /api/events`
   - `POST /api/llm-test`
4. Không dùng `git reset --hard`, không xóa database, không xóa `.env*`, không thay đổi secret và không thay đổi production URL.
5. Giữ nguyên **database URL hiện tại** trong environment/deployment settings. Không hard-code hoặc in `DATABASE_URL` ra giao diện, log, commit hay prompt kết quả. Nếu giá trị thật không xuất hiện trong workspace, phải đọc từ environment hiện tại hoặc giữ nguyên placeholder; tuyệt đối không tự đoán.
6. Giữ nguyên **Vercel project, domain, deployment URL, environment variables và database connection hiện tại** nếu chúng tồn tại ngoài repo. Không chuyển hosting, không tạo project mới và không thay đổi domain nếu chưa được yêu cầu trực tiếp. Repo hiện có `render.yaml` từ generic scaffold; không tự động coi đó là quyền chuyển deployment từ Vercel sang Render.
7. Các URL production, database URL, repository URL và hosting identifier phải được coi là dữ liệu cấu hình bất biến. Nếu agent không truy cập được, báo rõ trong handoff thay vì phát minh giá trị mới.

## Codebase hiện tại cần được kế thừa

- Next.js `15.5.25`, React `19.1.1`, TypeScript, Tailwind `3.4.17`.
- Prisma `6.16.2` với PostgreSQL và model `Event` hiện có.
- API response chuẩn hóa, Zod validation, server-side LLM wrapper, in-memory fallback cho local khi thiếu `DATABASE_URL`.
- UI primitives trong `src/components/ui.tsx`: `Button`, `Card`, `Badge`, `Alert`, `Input`, `Textarea`, `Spinner`, `Table`, `Dialog`.
- Visual tokens hiện có: `ink #172033`, `paper #f5f7fb`, `line #dfe5ef`, `accent #3056d3`, shadow card nhẹ.
- Giữ loading spinner, `transition`, hover states, focus rings, rounded cards, dialog overlay, bảng có horizontal overflow và bố cục desktop/mobile hiện tại.

## Hướng sản phẩm DocRelay

### Hai luồng chính

**1. Văn bản nhận vào**

Người dùng upload PDF/ảnh hoặc nhập metadata. Hệ thống trích xuất:

- cơ quan gửi;
- số hiệu và ngày ban hành;
- loại văn bản;
- chủ đề và nội dung chính;
- deadline hoặc hành động cần thực hiện;
- department nhận phù hợp.

Dataset ảnh con dấu từ các bộ/ngành được dùng như một tín hiệu nhận diện nguồn phát hành và phát hiện bất thường. Con dấu không được coi là bằng chứng duy nhất để kết luận văn bản thật/giả.

**2. Văn bản gửi đi**

Người dùng tạo hoặc upload bản nháp. Hệ thống kiểm tra nơi nhận, loại văn bản, department khởi tạo, trường bắt buộc và yêu cầu phê duyệt. Sau khi được chấp thuận, văn bản tự động chuyển đến department nhận hoặc kênh dispatch đã cấu hình, đồng thời lưu lịch sử.

## Ba department cho MVP

Dùng ba department chức năng sau, không tự ý đổi tên trong UI nếu chưa có yêu cầu:

1. **Pháp chế & Tuân thủ** — giấy phép, công văn pháp lý, yêu cầu giải trình và văn bản cần phê duyệt.
2. **Tài chính – Kế toán** — thuế, hóa đơn, thanh toán, ngân hàng, mua sắm và kiểm toán.
3. **Hành chính – Nhân sự** — lao động, bảo hiểm, hồ sơ nhân sự, hành chính và văn bản cơ quan nhà nước.

Đây là nhóm department cho MVP theo giả định nghiệp vụ; thiết kế nên cho phép mở rộng department bằng cấu hình, không hard-code toàn bộ logic vào UI.

## Decision engine và human control

Decision engine phải deterministic, explainable và nằm ngoài LLM. LLM chỉ hỗ trợ OCR/đọc hiểu/trích xuất có schema; không được tự thay policy engine.

- `AUTO_APPROVE`: dữ liệu đủ, văn bản rõ, tuyến xử lý an toàn; hệ thống tự động route.
- `NEEDS_INFORMATION`: thiếu trang, ảnh mờ, thiếu nơi nhận, thiếu deadline hoặc thiếu trường bắt buộc; hiển thị câu hỏi cụ thể.
- `ESCALATE`: văn bản có rủi ro pháp lý/tài chính, bất thường về nguồn/con dấu, xung đột metadata hoặc vượt ngưỡng thẩm quyền; chuyển admin review.
- `ADMIN_APPROVE`: kết quả thao tác của admin sau khi review một case bị escalate; sau đó hệ thống route văn bản.
- Cho phép `REJECT` và `OVERRIDE` có lý do bắt buộc. Không cho phép state transition sai.

`AUTO_APPROVE` chỉ có nghĩa là hệ thống được phép phân loại/route theo policy; không được diễn đạt thành kết luận pháp lý rằng văn bản chắc chắn hợp lệ.

## Visual direction theo VNG

Bám tinh thần website và Brand Book chính thức của VNG: công nghệ, hiện đại, rõ ràng, trực tiếp, thân thiện, nhiều khoảng trắng và không quá hành chính.

- Primary orange: `#F05A22` — logo, CTA, active accent.
- Blue: `#0068FF` — link, thao tác công nghệ, thông tin hệ thống.
- Deep indigo: `#374EA2` — navigation, headings, trust/compliance surfaces.
- Yellow: `#FFCC04` — `NEEDS_INFORMATION`, deadline warning.
- Green: `#03CA77` — approved/completed/success.
- Có thể dùng gradient `#253C80 → #29A7DE` cho hero/analytics và `#EC9224 → #ED5A26` cho điểm nhấn, nhưng không lạm dụng.
- Giữ nền sáng, chữ đậm dễ đọc, card bo góc, shadow nhẹ và hierarchy hiện tại. Màu trạng thái phải có text/label đi kèm, không chỉ dựa vào màu.

## Giao diện cần hướng tới

- `/` trở thành landing/dashboard giới thiệu DocRelay, có CTA vào Inbox, Outbox, Verify và Audit.
- `/workspace` trở thành nơi tạo/upload văn bản nhận vào hoặc gửi đi, hiển thị trạng thái xử lý, department đề xuất, deadline và bằng chứng.
- `/verify` trở thành màn hình test các policy case chính thức: auto route, thiếu dữ liệu, escalate, admin approve, reject và audit.
- `/audit` giữ lại bảng sự kiện và dialog chi tiết, mở rộng để hiển thị document ID, direction, source, department, previous state, new state, actor và reason.
- Bổ sung inbox/outbox/queue nếu cần, nhưng giữ navigation đơn giản và orientation hiện tại; không biến giao diện thành dashboard dày đặc khó trình bày.

## Database và API

Mở rộng Prisma bằng migration an toàn, giữ model `Event`. Có thể thêm các model `Document`, `DocumentRoute`, `ReviewAction`, `Department` hoặc tương đương, nhưng phải:

- không làm mất dữ liệu Event;
- có index cho trạng thái, department, direction và `createdAt`;
- lưu metadata và audit evidence cần thiết;
- không lưu secret hoặc file nhạy cảm ngoài cơ chế được phê duyệt;
- giữ in-memory fallback cho local nếu phù hợp, nhưng production phải dùng PostgreSQL qua `DATABASE_URL`.

## Dataset và demo

Thiết kế adapter để dataset con dấu có thể được nạp từ file/config về sau. Không giả vờ xác thực pháp lý nếu dataset chưa có nhãn giả mạo đủ mạnh. MVP nên hiển thị confidence, evidence và giới hạn của mô hình.

Demo tối thiểu phải có:

1. một văn bản nhận vào được route đến Pháp chế & Tuân thủ;
2. một văn bản gửi đi được route qua Tài chính – Kế toán;
3. một case thiếu thông tin trả về `NEEDS_INFORMATION`;
4. một case rủi ro chuyển `ESCALATE`, admin `ADMIN_APPROVE`, sau đó tự động route;
5. audit log đầy đủ cho toàn bộ state transition.

## Kiểm thử và kết thúc công việc

Chạy và sửa lỗi cho:

- `npm test`
- `npm run lint`
- `npm run build`
- `npm run test:e2e`

Cập nhật expected Verify cases, test input hợp lệ/thiếu/sai/mơ hồ, state transition bất hợp lệ, route sai department, duplicate submission và refresh/restart persistence.

Không tự nhận đã kiểm tra Vercel, database production hoặc URL live nếu chưa có bằng chứng thực tế. Cuối cùng báo cáo ngắn gọn:

- file đã thay đổi;
- các animation/style/orientation đã được giữ lại;
- migration và test đã chạy;
- production URL/database/hosting nào được giữ nguyên (chỉ nêu tên biến hoặc domain công khai, không in secret);
- phần nào còn cần team xác nhận.

Ưu tiên cao nhất: bảo toàn nền tảng hiện tại, biến DocRelay thành một workflow hai chiều có thể demo được, và giữ decision boundary minh bạch giữa AI, policy engine và admin.
