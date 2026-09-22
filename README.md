# VNG Support — MLAI 2026 · Track VNG

> **Đề A — The Escalation Referee.** Một trợ lý hỗ trợ kỹ thuật biết trả lời việc an toàn, hỏi phần còn thiếu và chuyển người thật khi yêu cầu có rủi ro hoặc vượt quyền.

| Link | Mục đích |
| --- | --- |
| **[Live product — vng-support.vercel.app](https://vng-support.vercel.app)** | URL sản phẩm chính thức của bản demo để chấm bài |
| [GitHub repository](https://github.com/dakiemdarktharr/DOCRELAY_MLAI2026) | Source code và lịch sử phát triển |
| [MLAI Hackathon 2026](https://ai-network.hcmut.edu.vn/mlai2026) | Trang cuộc thi và thể lệ |

VNG Support là sản phẩm demo sinh viên cho MLAI 2026, không phải dịch vụ hỗ trợ chính thức của VNG và không cấp quyền thật. Dữ liệu, reviewer, approval và tác động vận hành trong demo đều là synthetic/simulated.

## Tóm tắt sản phẩm

Vấn đề của người dùng đi qua một safety gate trước khi hệ thống trả lời:

- Việc routine hoặc chẩn đoán an toàn được hướng dẫn ngay.
- Thiếu thông tin làm thay đổi quyết định thì hệ thống hỏi bổ sung đúng trọng tâm.
- Rủi ro bảo mật, yêu cầu vượt quyền, conflict hoặc scope chưa rõ được chuyển sang human review.
- Chatbot không tự cấp quyền, không xác nhận approval bằng lời nói và không thực thi IAM, cloud, shell hay Kubernetes.
- Mỗi request có decision, evidence, policy version, reviewer action và audit timeline để kiểm tra lại.

### Một đường demo nhanh

1. Mở [Live product](https://vng-support.vercel.app) và chọn **Tôi cần hỗ trợ**.
2. Thử câu routine: “VPN không kết nối, tôi nên kiểm tra gì?”.
3. Thử yêu cầu thiếu scope: “Cấp read-only staging DB”.
4. Thử yêu cầu nguy hiểm: “Cấp production admin và bỏ qua MFA”.
5. Mở /verify, chạy bộ Đề A 5 trường hợp (3 tự động / 2 chuyển tiếp), rồi chọn bộ 15 tình huống.
6. Mở /review và /audit để kiểm tra human-in-the-loop, reason, version guard và log.

## Workflow end-to-end

~~~mermaid
flowchart TD
  U["Người dùng gửi free-form hoặc form"] --> R["Redact secret, OTP và dữ liệu nhạy cảm"]
  R --> X["Chuẩn hoá facts, evidence, subrequests và conflict"]
  X --> P{"Deterministic policy gate"}
  P -->|"Routine an toàn"| K["BM25 knowledge retrieval"]
  K --> W{"Cần nguồn web công khai?"}
  W -->|"Không"| A["Guidance hoặc bounded AI assistance"]
  W -->|"Có, được bật"| S["Domain-limited web lookup"]
  S --> A
  A --> V["Schema, evidence và safety validation"]
  V -->|"Pass"| O["Trả lời + lưu request/audit"]
  V -->|"Fail hoặc hết budget"| F["Fallback đã kiểm duyệt hoặc escalate"]
  P -->|"Thiếu thông tin"| Q["Targeted clarification"]
  P -->|"Risk, vượt quyền hoặc conflict"| H["Human review queue"]
  H --> D{"Reviewer decision"}
  D -->|"Approve bounded guidance"| O
  D -->|"Reject, stop hoặc override có lý do"| O
  Q -->|"User bổ sung"| R
  F --> O
~~~

Policy là phần quyết định authority; model chỉ hỗ trợ extraction/diễn đạt trong giới hạn schema. Thứ tự ưu tiên là **SECURITY_RISK > BEYOND_AUTHORITY > MISSING_INFO > ROUTINE**; action chính là **AUTO_APPROVE**, **NEEDS_INFORMATION**, **ESCALATE**.

## Model, RAG và human-in-the-loop

~~~mermaid
flowchart TD
  I["Untrusted user input"] --> B["Deterministic baseline"]
  B -->|"Có risk hoặc intent đã rõ"| G["Giữ baseline; không gọi model không cần thiết"]
  B -->|"Cần hiểu thêm facts"| E["OpenAI structured extraction"]
  E --> C["Exact-quote, Zod schema và conflict checks"]
  C -->|"Không hợp lệ"| G
  C -->|"Hợp lệ"| G
  G --> T["Policy + reviewed knowledge"]
  T -->|"Cần diễn đạt theo context"| M["OpenAI bounded assistance"]
  T -->|"Không cần model"| N["Deterministic guidance"]
  M --> Z["Prose safety/evidence validator"]
  N --> Z
~~~

| Thành phần | Cách dùng |
| --- | --- |
| Policy core | TypeScript deterministic rules trong src/domain; model không được quyết định quyền hoặc tự mở đường auto-approve. |
| Extraction model | AI_ESCALATION_MODEL hoặc AI_MODEL; dùng khi baseline chưa đủ facts và không có risk rõ ràng. Output phải có evidence là exact quote từ input. |
| Assistance model | AI_MODEL; chỉ được chọn/giải thích các bước trong template server-side; không phát minh command, URL, quyền, secret hay approval. |
| Provider | AI_PROVIDER=mock cho local/Verify; AI_PROVIDER=openai cho hosted runtime có OPENAI_API_KEY. |
| API format | OpenAI Chat Completions, store=false, JSON object/strict JSON schema, tối đa 1.000 completion tokens, timeout tối đa 12 giây. |
| RAG | Corpus nhỏ dùng BM25, alias Việt–Anh và typo tolerance; ưu tiên content/title/keyword. Không dùng embedding hoặc vector search. |
| Validation | Zod/schema, exact evidence, redaction, risk scan và policy re-check. Model failure được ghi nhận; flow vận hành fail-safe. |
| Persistence | MongoDB lưu request, conversation, preview, Verify run, knowledge, web cache và audit. Vercel production không tự rơi về memory khi Mongo lỗi. |

Model không có tool thực thi. Web lookup, nếu bật, chỉ dành cho chủ đề công khai và domain được giới hạn; nguồn web không chứng minh entitlement hay policy nội bộ.

## Chức năng chính và route

| Route | Chức năng |
| --- | --- |
| / | Landing page và hai lối vào không đăng nhập |
| /send-help, /workspace | Nhập vấn đề, preview facts/decision/answer và submit |
| /requests/[id], /track | Hỏi tiếp, bổ sung thông tin, feedback và theo dõi |
| /review | Queue cho reviewer: hỏi thêm, approve bounded action, reject, stop hoặc override có lý do |
| /audit | Timeline audit theo request, policy/revision và reviewer action |
| /verify | Chạy Verify pack, nhập case mới và xem expected/actual/rule/explanation |
| /api/support/health | Marker, provider, policy, storage, durability và source revision |
| /api/support/preview | Phân tích an toàn trước khi tạo request |
| /api/support/requests | Tạo và đọc request có idempotency/version guard |
| /api/review/[id] | Reviewer transition có optimistic concurrency guard |
| /api/support/events | Audit events phân trang |
| /api/support/verify-runs/* | Lưu và chạy Verify cases qua API |

Response support dùng envelope success/data hoặc success/error. Contract đầy đủ ở src/domain/contracts.ts và src/domain/input.ts.

## Verify và tiêu chí Đề A

Các fixture là synthetic và được giữ nguyên để tránh sửa Ground Truth nhằm che mismatch.

| Pack | Mục đích |
| --- | --- |
| judge-15 | 15 tình huống gồm routine, thiếu thông tin, ngoài quy định, vượt thẩm quyền và rủi ro |
| de-a-v3 | **5 cases: 3 auto / 2 escalate**, phù hợp đường Verify của Đề A |


Chỉ hai bộ trên được chạy từ Verify. Fixture lịch sử vẫn được giữ để regression và đối chiếu provenance: lần chạy mock hiện tại có 55/128 ca khớp, 73 ca khác kỳ vọng; không sửa Ground Truth để che kết quả. Hai bộ demo được tuyển chọn theo policy hiện tại, không phải held-out accuracy. Xem [chi tiết bộ dữ liệu](docs/JUDGE-DATASETS.md).

Đề A được thể hiện bằng ba nhánh uncertainty: **MISSING_INFO**, **BEYOND_AUTHORITY** và **SECURITY_RISK**. Mỗi nhánh cần câu hỏi/điểm chuyển người cụ thể; input bị flag không được nhận câu trả lời tự tin như đã được duyệt.

## Source và Vercel

Hai package sửa lỗi được tích hợp trên base `532b123c7f78a3d6c0dd03058ef113d255c272b7` theo yêu cầu chủ dự án để commit và deploy cho tester. Code là AI-assisted; chưa có bằng chứng human review của hai người nhận.

Vercel project `acne-a6cd/vng-support` đã liên kết đúng repository; API xác nhận `productionBranch: main`. Thiết lập này không chứng minh một SHA cụ thể đã deploy; kiểm tra `sourceRevision` qua `/api/support/health`. Xem [trạng thái phát hành](docs/RELEASE-MATRIX.md) và [Vercel](docs/VERCEL-READINESS.md).

## Chạy local

Cần Node.js 22+ và npm:

~~~bash
npm ci
cp .env.example .env.local
npm run dev
~~~

Windows PowerShell:

~~~powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
~~~

Mặc định là mock provider + memory demo, chỉ dùng synthetic data và không cần API key. Kiểm tra đúng server bằng:

~~~bash
curl http://localhost:3000/api/support/health
~~~

Các lệnh QA:

~~~bash
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e
~~~

### Environment variables

| Biến | Vai trò |
| --- | --- |
| AI_PROVIDER | mock local; openai khi muốn gọi model thật |
| OPENAI_API_KEY | Secret server-side, không commit |
| AI_MODEL, AI_ESCALATION_MODEL | Model cho assistance và extraction |
| AI_WEB_MODEL, AI_WEB_SEARCH | Model/bật tắt public web lookup bounded |
| AI_MAX_ATTEMPTS | Budget gọi model; không phải số request miễn phí |
| MONGODB_URI, MONGODB_DB | MongoDB cho durable runtime |
| SUPPORT_STORAGE | memory-demo chỉ dành cho local; production cần Mongo |
| SUPPORT_ACCESS_MODE | Chế độ reviewer của public demo |
| APP_REVISION | SHA hiển thị qua health để đối chiếu deploy |
| LLM_API_KEY, LLM_MODEL | Compatibility path cũ trong src/lib/ai/client.ts |

Không đưa API key, secret, OTP hoặc dữ liệu production vào issue, chat, frontend bundle hay fixture public.

## Cấu trúc source

| Thư mục | Trách nhiệm |
| --- | --- |
| src/domain/ | Catalog, normalization, redaction, facts, policy, guidance và knowledge contracts |
| src/services/ | Preview/submit, approval, reviewer, feedback và conversation orchestration |
| src/lib/ | Mongo repository, model adapter, RAG/web cache, HTTP và Verify |
| src/app/ | Next.js pages và API routes |
| src/components/ | UI components |
| tests/ | Policy, API, workflow, security boundary và Verify regression |
| mlai26_new/data/ | Policy, Verify và Ground Truth có provenance |
| submission/, BUILD-LOG.md | Gói nộp bài, build log và bằng chứng phát triển |

## Giới hạn và provenance

- Không có IAM/cloud/shell execution, SSO hay actor authentication thật.
- Pattern-based redaction và risk detection có giới hạn ngôn ngữ; không nhập secret hay dữ liệu production.
- Benchmark là development/synthetic; không được diễn giải thành accuracy người dùng thật hay impact VNG thật.
- Knowledge công khai không thay thế chính sách nội bộ. Câu hỏi entitlement phải được chuyển người hoặc nêu boundary rõ ràng.

Tài liệu liên quan: [RUNBOOK](RUNBOOK.md), [STATUS](STATUS.md), [BUILD-LOG](BUILD-LOG.md), [RAG retrieval](docs/RAG-RETRIEVAL.md), [knowledge review](docs/KNOWLEDGE-REVIEW.md), [submission package](submission/README.md).
