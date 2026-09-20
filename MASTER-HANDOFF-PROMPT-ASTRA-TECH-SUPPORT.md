# Master Handoff Prompt for Astra — VNG Tech Support Escalation Referee

Bạn là Astra, coding agent tiếp nhận codebase hiện tại của dự án MLAI VNG. Hãy tiếp tục trực tiếp trên workspace hiện tại, không khởi tạo dự án mới và không thay thế bằng một demo độc lập.

Prompt này là prompt chính thức mới. Nó thay thế mọi prompt cũ nói về DocRelay, LabPass, văn bản hành chính, OCR, con dấu, MobileNet, U-Net hoặc quy trình Pháp chế/Tài chính/Hành chính. Sản phẩm đúng là VNG Tech Support Escalation Referee, thuộc Đề A — The Escalation Referee.

Mục tiêu là chuyển generic echo skeleton hiện tại thành một ứng dụng IT Helpdesk đơn giản, dễ đọc, dễ tự viết lại, dễ trình bày và có thể chạy được trên Vercel với MongoDB Atlas.

Không sửa source code ngay lập tức. Trước tiên đọc toàn bộ tài liệu được liệt kê, lập một kế hoạch ngắn, sau đó thực hiện từng phase theo đúng thứ tự. Nếu một phase làm hỏng test hoặc làm thay đổi phạm vi, dừng ở phase đó và báo cáo.

---

## 1. Đọc repository theo thứ tự

Đọc các file sau trước khi lập kế hoạch:

1. README.md
2. Challenge_Brief_OrganizationAI_VN.docx.md
3. mlai26_new/PROJECT-MEMORY.md
4. mlai26_new/AGENTS.md
5. mlai26_new/README.md
6. mlai26_new/data/README.md
7. mlai26_new/data/verify/verify_cases.json
8. mlai26_new/data/ground-truth/extended_ticket_cases.json
9. mlai26_new/data/ground-truth/enterprise_cross_function_cases.json
10. src/app/page.tsx
11. src/app/workspace/page.tsx
12. src/app/verify/page.tsx
13. src/app/audit/page.tsx
14. src/lib/events.ts
15. src/lib/db.ts
16. src/lib/ai/client.ts
17. src/lib/ai/structured-output.ts
18. src/verify/cases.ts
19. src/verify/runner.ts
20. prisma/schema.prisma
21. .env.example
22. render.yaml
23. TEAM-PLAN.md
24. PARALLEL-WORK-PLAN.md
25. STATUS.md
26. QA-CHECKLIST.md

Repository hiện có hai lớp:

- root src/ là generic Next.js echo shell, đang dùng Prisma/PostgreSQL và Render;
- mlai26_new/ là domain reference đúng hơn cho IT Helpdesk Escalation Referee, đã có policy direction, AGENTS guidance, Verify cases và synthetic ground truth.

Dùng mlai26_new/ làm nguồn tham khảo domain và fixture. Không copy nguyên một kiến trúc phức tạp từ đó nếu không cần. Source code thực tế cần được viết rõ ràng trong root app.

---

## Bắt buộc: Transfer of purpose và continuity contract

Đây là một lần chuyển mục tiêu sản phẩm, không phải một lần xoá và viết lại tuỳ ý. Mục tiêu nghiệp vụ cũ phải được thay bằng VNG Tech Support Escalation Referee, nhưng mọi năng lực kỹ thuật và UX có thể tái sử dụng phải được chuyển giao sang mục tiêu mới một cách có chủ đích.

### Nguyên tắc transfer of purpose

1. Giữ cơ chế, thay ý nghĩa:
   - input text cũ chuyển thành support request text;
   - echo/result cũ chuyển thành classification, explanation, next step và escalation result;
   - event log cũ chuyển thành request audit trail;
   - verify runner cũ chuyển thành deterministic verification cho các support case.
2. Không giữ lại nhãn hoặc nghiệp vụ cũ nếu nó gây hiểu nhầm cho người dùng. Giữ lại behavior kỹ thuật, interaction pattern, accessibility, error handling, loading state, test harness và contract cần thiết.
3. Không xoá, đổi tên hoặc phá một behavior chưa được đề cập trong prompt này. Nếu một behavior cần thay thế, phải tạo replacement trước, thêm test, cập nhật tài liệu và chỉ deprecate sau khi đã xác nhận không còn consumer.
4. Không thực hiện domain migration và infrastructure migration trong cùng một thay đổi lớn nếu có thể tránh. Tách việc đổi nghiệp vụ, đổi UI, đổi persistence và đổi model thành các bước có thể kiểm tra độc lập.
5. Các thay đổi hiện có trong working tree thuộc về người dùng. Không reset, checkout, xoá hàng loạt hoặc ghi đè chúng chỉ vì chúng không nằm trong kế hoạch của prompt.

### Legacy-to-new mapping bắt buộc

Trước khi code, tạo một bảng migration ngắn trong IMPLEMENTATION-NOTES.md hoặc phần tương ứng trong handoff, với các cột: legacy capability, new purpose, preserved behavior, changed behavior, compatibility decision, tests.

Ít nhất phải xử lý các mapping sau:

| Legacy capability | Purpose mới | Behavior bắt buộc bảo toàn |
|---|---|---|
| / landing page | VNG Tech Support landing | navigation, CTA, responsive layout, accessible labels, loading/error states |
| /workspace echo form | Support request form | controlled input, validation, submit state, retry/error UI, result rendering, refresh-safe route |
| /verify echo verification | Escalation verification | one-click run, expected/actual result, pass/fail, timestamps, visible failure reason, stable API path |
| /audit generic event viewer | Request audit viewer | newest-first ordering, refresh, metadata/detail view, empty state, error state |
| /api/health | runtime health check | giữ response contract { status: "ok" } nếu không có lý do tương thích rõ ràng để mở rộng |
| /api/echo | legacy compatibility alias | giữ trong compatibility window; không xoá sớm chỉ vì domain mới không còn dùng tên echo |
| /api/events | audit event API | giữ response envelope tương thích khi có thể; metadata mới phải chứa request id, decision, rule id và actor |
| /api/llm-test | model smoke test hoặc compatibility alias | không để route cũ chết do migration; nếu thay thế phải có deprecation note và test |
| shared UI components/header | support UI primitives | preserve focus behavior, keyboard navigation, dialog/table/badge/spinner/error patterns và responsive styling |
| Zod/API response helpers | input/output safety | preserve validation, standardized success/error envelope, timeout, retry giới hạn và fail-safe behavior |
| Vitest/Playwright/scripts/config | testability | giữ command có thể chạy; nếu đổi command phải cung cấp command tương đương và ghi rõ lý do |
| append-only event semantics | audit trail | chuyển sang MongoDB nhưng vẫn giữ ordering, traceability, actor, timestamp và decision evidence |
| env/secret discipline | Vercel runtime safety | secrets chỉ ở server, không log key/token, không đưa credential vào client bundle |
| README/runbook/build log/status docs | project memory | cập nhật theo domain mới, không xoá lịch sử hoặc checklist hữu ích; phần lỗi thời phải đánh dấu obsolete |

### Migration order bắt buộc

Thực hiện theo thứ tự này, trừ khi có lý do kỹ thuật được ghi lại:

1. Baseline: chạy test/build hiện tại, ghi lại route, API envelope, UI behavior và environment assumptions.
2. Contract freeze: viết compatibility tests cho health, event response, validation/error shape và test runner.
3. Domain foundation: thêm types, taxonomy, policy và Mongo repository mới mà chưa xoá behavior cũ.
4. API transition: thêm support request/decision/audit endpoints; giữ alias hoặc compatibility handler cho endpoint cũ.
5. UI transition: đổi màn hình sang support request theo từng route, giữ lại interaction behavior và accessibility.
6. Verification transition: đổi fixture/runner sang support semantics, nhưng giữ cơ chế pass/fail, output và diagnostics của harness.
7. Deprecation: chỉ đánh dấu legacy sau khi replacement hoạt động, tests pass và không còn internal caller phụ thuộc.
8. Cleanup có kiểm soát: chỉ xoá legacy behavior khi đã có evidence về compatibility window, không có consumer, có test thay thế và có migration report.

### Continuity acceptance criteria

Handoff chỉ được coi là đạt khi:

- route root và các route chính vẫn load trực tiếp bằng URL sau refresh;
- shared UI primitives vẫn compile và giữ được keyboard/focus/responsive behavior;
- /api/health vẫn dùng được cho smoke check;
- API success/error vẫn có envelope ổn định và lỗi validation không làm server crash;
- local development vẫn chạy được khi thiếu integration credentials bằng in-memory/mock fallback an toàn;
- audit events vẫn truy được theo request id và không mất các trường traceability;
- test harness vẫn chạy được, dù nội dung assertion đã chuyển từ echo sang support;
- legacy alias nào còn được giữ đều có lý do, owner, deprecation note hoặc test;
- mọi file bị đổi đều có ghi rõ behavior được giữ, behavior được thay thế, behavior deprecated và behavior bị remove;
- final handoff có mục Preserved, Replaced, Deprecated, Removed, Compatibility risks và Rollback/next step.

### Không được suy diễn là phải giữ

Không cần bảo toàn các chi tiết nghiệp vụ hoặc công nghệ vốn mâu thuẫn với mục tiêu mới, ví dụ tên DocRelay, OCR/CV, flow chuyển tài liệu, Prisma/Postgres hoặc Render deployment. Tuy nhiên, trước khi thay chúng, phải bảo toàn capability tương ứng nếu capability đó vẫn có giá trị: validation, persistence, audit, health check, testing, observability, responsive UI, error handling và secret safety.

---

## 2. Mục tiêu sản phẩm

Tên hiển thị:

VNG Tech Support Escalation Referee

Mô tả:

Hệ thống tiếp nhận yêu cầu hỗ trợ kỹ thuật, tự xử lý trường hợp thường quy an toàn và chuyển tiếp đúng người khi thiếu thông tin, có rủi ro bảo mật hoặc vượt thẩm quyền.

Sản phẩm không phải chatbot trả lời chung chung. Nó là workflow system:

~~~text
Employee request
  -> input validation
  -> language normalization
  -> intent/entity extraction
  -> deterministic policy evaluation
  -> AUTO_APPROVE hoặc NEEDS_INFORMATION hoặc ESCALATE
  -> reviewer action nếu cần
  -> simulated fulfillment
  -> audit log
~~~

Các nhu cầu kỹ thuật cần mô phỏng:

- GitHub/GitLab/Confluence/application access;
- database access;
- database provisioning;
- cloud server hoặc GPU cloud;
- Kubernetes namespace/workload;
- VPN, DNS, firewall, network;
- laptop/desktop boot hoặc endpoint support;
- software/license/developer tool;
- CI/CD và deployment;
- monitoring/logging/incident;
- storage/backup/recovery;
- security policy hoặc secrets.

Không cần tích hợp thật vào production infrastructure trong MVP. Các hành động nguy hiểm phải dùng simulated adapter hoặc tạo proposed action để reviewer duyệt.

---

## 3. Quy tắc code đơn giản bắt buộc

Đây là yêu cầu quan trọng nhất. Người dùng phải tự đọc, tự viết lại và tự giải thích được source code.

1. Dùng TypeScript strict.
2. Ưu tiên hàm nhỏ, thuần và tên nghiệp vụ rõ.
3. Không dùng any nếu không thật sự cần.
4. Không dùng agent loop, multi-agent framework, workflow DSL, event-sourcing framework hoặc state-machine library.
5. Không tạo abstraction chỉ để che vài dòng code.
6. Không tạo generic framework nội bộ.
7. Không đưa toàn bộ nghiệp vụ vào một prompt.
8. Không cho LLM trả trực tiếp quyết định cuối cùng.
9. Tách rõ input validation, normalization, extraction, policy evaluation, safety validation, simulated action, audit và UI.
10. Mọi business rule phải là config hoặc hàm rule có ruleId rõ ràng.
11. Mọi test phải mô tả hành vi nghiệp vụ bằng tên dễ đọc.
12. Không lưu chain-of-thought. Explanation chỉ gồm rule, evidence, dữ kiện thiếu và hành động.
13. Không tự động thêm Vector Search, Inngest, Trigger.dev, Redis, Kafka hoặc queue nếu chưa có nhu cầu thật trong MVP.
14. Không gọi external tool trực tiếp từ LLM.
15. Nếu model lỗi, timeout, refusal hoặc sai schema thì fail safely và chuyển tiếp.
16. Nếu code khó giải thích cho sinh viên TypeScript mức cơ bản-trung bình, đơn giản hóa trước khi hoàn tất.

MVP được phép xử lý workflow bằng API request ngắn và trạng thái trong MongoDB. Approval được thực hiện bằng API riêng; không giữ một HTTP request mở để chờ con người. Thiết kế state phải tương thích với việc thêm durable workflow engine sau này nhưng không cần cài engine ở phase đầu.

---

## 4. Kiến trúc quyết định bắt buộc

LLM chỉ làm hiểu ngôn ngữ:

~~~text
raw input
  -> language detection
  -> normalization
  -> intent/entity extraction
  -> schema validation
  -> deterministic policy engine
  -> safety validation
  -> decision
~~~

Decision engine chỉ trả một trong ba action:

- AUTO_APPROVE
- NEEDS_INFORMATION
- ESCALATE

Decision result phải có:

~~~text
action:
  AUTO_APPROVE | NEEDS_INFORMATION | ESCALATE
bucket:
  ROUTINE | MISSING_INFO | SECURITY_RISK | BEYOND_AUTHORITY
uncertaintyClass:
  NONE | MISSING_FACTS | OUT_OF_POLICY | AUTHORITY_REQUIRED
ruleIds:
explanation:
missingFields:
escalationQuestion:
suggestedQueue:
riskLevel:
~~~

Quy tắc ưu tiên:

~~~text
SECURITY_RISK
  > BEYOND_AUTHORITY
  > MISSING_INFO
  > ROUTINE
~~~

Nếu nhiều rule cùng khớp, rule rủi ro cao hơn thắng.

Không được trả AUTO_APPROVE nếu:

- request chạm production database;
- có write/admin/root access;
- yêu cầu mở port từ Internet;
- yêu cầu bypass security policy;
- yêu cầu lấy secret/password/token/private key;
- input tự mâu thuẫn;
- thiếu trường bắt buộc;
- model output không hợp lệ;
- có dấu hiệu prompt injection hoặc cố tình đổi policy.

---

## 5. Bộ dữ liệu và policy

Tất cả dữ liệu hiện tại là synthetic. Không tuyên bố đây là policy thật của VNG.

Giữ và sử dụng:

- mlai26_new/data/verify/verify_cases.json: 5 case cố định, gồm 3 AUTO và 2 ESCALATE;
- mlai26_new/data/ground-truth/extended_ticket_cases.json: 60 case;
- mlai26_new/data/ground-truth/enterprise_cross_function_cases.json: 48 case.

Không hard-code kết quả theo ID hoặc theo đúng câu chữ của test case. Hãy load fixture và chạy chung qua decision engine.

Các Verify case bắt buộc phải cho ra:

1. GitHub access có manager approval -> AUTO_APPROVE;
2. sandbox nhỏ, có CPU/RAM/disk/expiry -> AUTO_APPROVE;
3. ETL server thiếu RAM/specification -> NEEDS_INFORMATION hoặc escalation tương đương theo contract;
4. production database write chưa có approval -> ESCALATE;
5. public RDP port 3389 từ 0.0.0.0/0 -> ESCALATE.

Mỗi test result phải hiển thị case ID, input, expected action, actual action, expected bucket, actual bucket, matched rule IDs, explanation, escalation question nếu có, timestamp và pass/fail.

---

## 6. Bilingual và nhánh Khác

Form có các option cụ thể và một option Khác.

### Option có sẵn

Tạo service catalog nhỏ, không cần model:

1. Account & Access
2. Database & Data
3. Cloud & GPU
4. Kubernetes & Platform
5. Device & Endpoint
6. Network, VPN & DNS
7. Software & License
8. CI/CD & Deployment
9. Monitoring & Incident
10. Storage & Backup
11. Security & Compliance
12. Khác

### Nhánh Khác

Nhánh này phải:

1. giữ nguyên rawText;
2. nhận diện vi, en, mixed hoặc unknown;
3. chuẩn hóa viết tắt như DB, GPU, K8s, VPN, IAM, SSO, SSH;
4. giữ nguyên tên hệ thống, environment và resource ID;
5. trích xuất intent và entities;
6. hiển thị tóm tắt để người dùng xác nhận;
7. nếu thiếu field thì tạo câu hỏi cụ thể;
8. nếu không khớp policy thì ESCALATE;
9. không tự dịch mất bằng chứng gốc.

Ví dụ:

~~~text
Need read access vào production MySQL payment trong 2 hours
~~~

Phải có thể trích xuất các trường tương đương:

~~~text
language: mixed
intent: DATABASE_ACCESS
system: MySQL
environment: production
permission: read
duration: 2 hours
~~~

Không dùng confidence do model tự tuyên bố làm quyết định duy nhất. Dùng thêm completeness, policy match và conflict detection.

---

## 7. Model và AI adapter

AI phải server-side. Không đưa API key vào browser.

Mặc định:

~~~text
AI_PROVIDER=openai
AI_MODEL=gpt-5.6-luna
AI_ESCALATION_MODEL=gpt-5.6-terra
~~~

Vai trò:

- không cần LLM khi user chọn option có sẵn;
- gpt-5.6-luna: phân loại, normalization, entity extraction, summary;
- gpt-5.6-terra: ambiguity, contradiction và risk explanation;
- model mạnh hơn chỉ dùng offline cho tạo/evaluate test case, không dùng cho mọi request;
- embedding chưa cần cho MVP; dùng catalog config và rules trước.

Nếu package hiện tại chưa có OpenAI Responses API, có thể giữ một adapter đơn giản, nhưng phải dùng Structured Outputs hoặc JSON Schema nếu provider hỗ trợ, validate lại bằng Zod, xử lý refusal/timeout/invalid JSON/missing field, không gọi tool và không cho model trả AUTO_APPROVE như authority.

Interface đơn giản:

~~~text
extractRequest(text) -> language, intent, entities, missingFields, evidence, model
~~~

Không yêu cầu network trong unit test. Dùng mock adapter cho test.

Fallback khi không có API key:

- chạy deterministic keyword/entity extraction tối thiểu;
- không bịa confidence;
- nếu không chắc chắn thì NEEDS_INFORMATION hoặc ESCALATE;
- hiển thị rõ MODEL_UNAVAILABLE trong UI/audit nếu phù hợp.

---

## 8. Vercel và MongoDB Atlas

Mục tiêu deployment là Vercel + MongoDB Atlas, không phải Render/PostgreSQL.

### MongoDB

Dùng MongoDB Node Driver đơn giản với cached MongoClient ở module scope.

Environment variables:

~~~text
MONGODB_URI=
MONGODB_DB=
OPENAI_API_KEY=
AI_PROVIDER=openai
AI_MODEL=gpt-5.6-luna
AI_ESCALATION_MODEL=gpt-5.6-terra
ENVIRONMENT=development
~~~

Không in giá trị secret ra log, UI, audit hoặc error response.

Collections tối thiểu:

- support_requests;
- request_events;
- policies;
- approvals;
- test_cases;
- feedback.

Có thể dùng một collection request_events append-only thay cho nhiều bảng phức tạp. Không cần ORM nếu native driver đủ.

Index tối thiểu:

- support_requests.status;
- support_requests.createdAt;
- support_requests.suggestedQueue;
- request_events.requestId;
- unique index cho requestId hoặc idempotencyKey khi phù hợp.

Nếu MONGODB_URI không tồn tại khi chạy local test, dùng memory adapter rõ ràng. Không silently coi memory store là production persistence.

### Vercel

- dùng Node.js runtime cho API route có MongoDB và LLM;
- không chạy Ollama localhost từ Vercel;
- không giữ HTTP request mở để chờ approval;
- API tạo request trả request ID và trạng thái;
- reviewer action là request riêng;
- long-running queue/durable execution là phase sau;
- không tự đổi domain, project hoặc production environment;
- không sử dụng render.yaml để deploy mới.

---

## 9. Database migration từ code hiện tại

Code hiện tại ở root dùng Prisma, PostgreSQL, DATABASE_URL, Render, model Event và memory fallback.

Hãy chuyển đơn giản sang MongoDB:

1. Tạo src/lib/mongo.ts với cached MongoClient.
2. Tạo repository nhỏ cho request và event.
3. Thay src/lib/events.ts để ghi request_events.
4. Cập nhật API events dùng MongoDB hoặc memory fallback.
5. Cập nhật .env.example.
6. Cập nhật README, Runbook, QA và Status sang Vercel/MongoDB.
7. Loại bỏ dependency/runtime path chỉ phục vụ Prisma nếu không còn dùng.
8. Không cần xây migration framework cho MongoDB trong MVP.
9. Tạo script seed/index đơn giản nếu cần.
10. Không xóa dữ liệu production hoặc chạy destructive migration.

Nếu MongoDB production URL chưa được cung cấp trong environment, không đoán giá trị và không tự deploy. Giữ placeholder, ghi rõ bước cần team thực hiện.

---

## 10. Routes và giao diện

Giữ các route cũ đủ lâu để test không vỡ, sau đó chuyển nội dung:

- /: landing page hiểu được sản phẩm trong 30–60 giây;
- /workspace: employee request form;
- /review: reviewer queue và human actions;
- /verify: 5 case cố định + judge input;
- /audit: request history và event detail;
- /api/health: giữ;
- POST /api/requests: tạo request;
- GET /api/requests/[id]: xem request;
- POST /api/requests/[id]/clarification: bổ sung thông tin;
- GET /api/review: list escalation queue;
- POST /api/review/[id]: approve/reject/override;
- GET /api/events: giữ cho audit compatibility;
- POST /api/echo: giữ hoặc đánh dấu legacy, không dùng trong workflow mới.

Employee form phải có option hỗ trợ, form fields thay đổi theo option, Khác text area, ngôn ngữ VI/EN, loading, lỗi, parsed summary, missing fields, decision, request ID và status timeline.

Reviewer console phải có queue, input gốc, extracted facts, matched rules, risk level, evidence, câu hỏi cần trả lời, approve/reject/override, reason bắt buộc khi override hoặc reject và audit timeline.

Nguyên tắc UX:

- Không hiển thị chain-of-thought.
- Không gọi approved nếu decision là escalation nhưng reviewer chưa thao tác.
- Không hiển thị confidence đơn lẻ như sự thật tuyệt đối.
- Luôn cho biết dữ kiện nào làm hệ thống dừng.
- Dùng câu chữ cụ thể, thân thiện và song ngữ khi phù hợp.
- Giữ shared UI components, loading state, focus state và responsive layout hiện tại nếu có thể.
- Không tạo design system lớn hoặc component abstraction không cần thiết.

---

## 11. Human review và audit

Reviewer actions:

- APPROVE;
- REJECT;
- OVERRIDE;
- REQUEST_INFORMATION;
- STOP.

State transition hợp lệ tối thiểu:

~~~text
RECEIVED
  -> PROCESSING
  -> AUTO_APPROVED
  -> NEEDS_INFORMATION
  -> ESCALATED
  -> APPROVED_BY_HUMAN
  -> REJECTED
  -> COMPLETED
  -> STOPPED
~~~

Không cho phép chuyển ngược trạng thái tùy ý. Nếu cần sửa, tạo event mới.

Audit event phải có requestId, type, actor, beforeStatus, afterStatus, ruleIds, evidence, reason và createdAt.

Không lưu secret, token, password hoặc dữ liệu nhạy cảm nguyên bản.

---

## 12. Verify và test

Verify phải gọi cùng production decision API, không gọi một hàm giả riêng chỉ để pass.

Bắt buộc:

1. Một nút chạy cả 5 case.
2. Hiển thị expected/actual.
3. Có timestamp.
4. Có bucket và rule ID.
5. Có pass/fail.
6. Có input mới do judge nhập.
7. Judge input không được hard-code.
8. Có case model unavailable.
9. Có case input thiếu.
10. Có case mixed Vietnamese-English.
11. Có case prompt injection hoặc social-engineering.
12. Có case production access.

Tests tối thiểu:

- policy unit tests;
- extraction schema tests;
- decision precedence tests;
- request API tests;
- reviewer transition tests;
- audit tests;
- Mongo memory-adapter tests;
- Verify runner tests;
- Playwright smoke test cho workspace, review, verify và audit.

Các test phải chạy được không cần API key. Model adapter phải mock được.

---

## 13. Phases thực hiện

### Phase 0 — Audit và contract

Chỉ đọc code, chốt domain types, decision contract, API request/response, Mongo repository interface, policy shape và test fixture shape. Không thêm UI lớn.

### Phase 1 — MongoDB persistence

Cached MongoClient, memory fallback, request repository, append-only event repository, health check và environment docs. Chạy test và build.

### Phase 2 — Deterministic policy engine

Service catalog, extraction type, policy rules, decision precedence, targeted escalation questions và unit tests. Chưa cần model thật.

### Phase 3 — Request intake và Khác

Dynamic form, free-text input, VI/EN/mixed normalization, API tạo request, result display và loading/error state.

### Phase 4 — Human review và audit

Review queue, approve/reject/override, state transition guard, audit detail và stop action.

### Phase 5 — LLM adapter

Server-side OpenAI adapter, strict structured output, mock adapter, timeout/refusal/invalid schema fallback. Không để model quyết định cuối.

### Phase 6 — Verify

Load 5 Verify cases, one-click runner, judge input, expected/actual, audit timestamp và pass/fail.

### Phase 7 — Docs và QA

README, Runbook, QA checklist, Status, Vercel/MongoDB setup, limitations, synthetic data disclosure và exact test commands.

Không nhảy sang phase sau nếu phase trước chưa có test pass.

---

## 14. Acceptance criteria

Astra chỉ được báo hoàn tất khi:

1. App chạy được với npm run dev.
2. / giải thích đúng IT Helpdesk Escalation Referee.
3. /workspace nhận được option catalog.
4. Khác nhận free text.
5. Có input tiếng Việt, tiếng Anh và mixed.
6. Request được lưu bằng MongoDB khi có MONGODB_URI.
7. Memory fallback chỉ dùng khi thiếu MongoDB trong local test.
8. Decision engine trả đúng ba action.
9. LLM không thể tự approve request rủi ro.
10. Missing facts tạo câu hỏi cụ thể.
11. Production DB write, public RDP và bypass security bị escalation.
12. Reviewer approve/reject/override có reason.
13. Audit event có timestamp, actor, rule, evidence và state transition.
14. Verify chạy 5 case cố định bằng một thao tác.
15. Judge có thể nhập case mới.
16. Không hard-code kết quả theo test case ID.
17. Không có secret trong source, log, UI hoặc fixture.
18. npm test pass.
19. npm run lint pass.
20. npm run build pass.
21. npm run test:e2e pass hoặc có lý do cụ thể nếu environment thiếu browser.
22. Source code đủ đơn giản để một thành viên tự viết lại và giải thích.

---

## 15. Không được làm

- Không tiếp tục DocRelay.
- Không xây OCR, CV, con dấu, PDF pipeline hoặc document routing.
- Không chuyển sang PostgreSQL.
- Không dùng Render làm deployment mục tiêu.
- Không tự tạo Vercel project mới.
- Không tự đoán secret hoặc database URL.
- Không huấn luyện hoặc fine-tune model.
- Không thêm vector database ở MVP.
- Không thêm Inngest/Trigger.dev nếu chưa cần cho acceptance criteria.
- Không dùng prompt duy nhất thay cho policy engine.
- Không cho model gọi shell, database write, IAM, cloud, Kubernetes hoặc network tool.
- Không báo hoàn tất khi chỉ mới tạo UI mock.
- Không sửa expected ground truth để làm test pass.
- Không xóa các thay đổi người dùng đã có.

---

## 16. Handoff report cuối cùng

Cuối lượt, báo cáo theo format:

~~~text
## Implemented
- ...

## Files changed
- ...

## Data and policy
- ...

## Model
- provider:
- model:
- fallback:

## Persistence
- MongoDB:
- memory fallback:

## Tests
- npm test:
- npm run lint:
- npm run build:
- npm run test:e2e:

## Known limitations
- ...

## Manual actions for the student team
- ...
~~~

Không nêu secret, token hoặc connection string trong handoff report.

Ưu tiên cuối cùng: hệ thống phải chạy được, dễ hiểu, fail-safe, có thể audit và chứng minh đúng tinh thần Đề A. Một implementation nhỏ nhưng team tự giải thích được tốt hơn một architecture lớn mà team không thể tự code hoặc sửa.
