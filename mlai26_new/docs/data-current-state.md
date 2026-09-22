# Historical snapshot — VNG Sentinel data state (2026-09-20)

Ngày cập nhật: 2026-09-20  
Dự án: OrganizationAI VN — Challenge A: The Escalation Referee

> Đây là snapshot lịch sử trước khi runtime policy và judge packs hiện tại được tích hợp. Không dùng file này làm nguồn hiện trạng. Xem [README root](../../README.md), [judge datasets](../../docs/JUDGE-DATASETS.md), [data README](../data/README.md) và code trong repository root.

## 1. Tóm tắt

Thư mục `data/` hiện có **133 ticket cases** dạng synthetic:

- 5 case trong fixture Verify gốc (`verify_cases.json`), gồm 2 AUTO và 3 ESCALATE; các pack judge hiện tại được mô tả riêng ở `support-v3.json` và `judge-15.json`.
- 60 case kỹ thuật mở rộng.
- 48 case liên phòng ban.
- 15 case adversarial theo bộ yêu cầu gần nhất.
- 5 hidden adversarial case để bắt lỗi prompt injection, mâu thuẫn intake và request nguy hiểm bị ngụy trang.

Toàn bộ dữ liệu hiện tại là synthetic. Tên hệ thống, phòng ban, resource và ticket chỉ mô phỏng bối cảnh doanh nghiệp; không được diễn giải là dữ liệu hoặc chính sách nội bộ thật của VNG.

## 2. Inventory hiện tại

| File | Số lượng | Vai trò |
|---|---:|---|
| `data/verify/verify_cases.json` | 5 | Fixture gốc lịch sử: 2 AUTO / 3 ESCALATE |
| `data/verify/support-v3.json` | 15 | Gồm pack `de-a-v3` 5 case và `extended-v3` 10 case |
| `data/verify/judge-15.json` | 15 | Pack judge hiện tại dành cho 15 tình huống |
| `data/ground-truth/extended_ticket_cases.json` | 60 | Case kỹ thuật và Data Ops mở rộng |
| `data/ground-truth/enterprise_cross_function_cases.json` | 48 | Case liên phòng ban trong doanh nghiệp |
| `data/ground-truth/synthetic_tickets.json` | 15 | Bộ test adversarial theo phân bố 5/3/3/4 |
| `data/adversarial/hidden_adversarial_cases.json` | 5 | Hidden adversarial regression cases |
| `data/README.md` | — | Hướng dẫn sử dụng các bộ dữ liệu |

## 3. Phân bố theo bucket

Tổng hợp bốn bộ JSON:

| Bucket | Số lượng |
|---|---:|
| `ROUTINE` | 44 |
| `MISSING_INFO` | 31 |
| `BEYOND_AUTHORITY` | 31 |
| `SECURITY_RISK` | 32 |
| **Tổng Ground Truth mở rộng** | **123** |

Trong đó, 5 case của Verify Harness được tách riêng vì phục vụ bài kiểm tra nhanh, không nên trộn với toàn bộ regression dataset.

## 4. Nội dung đã có

### 4.1. Routine requests

Đã có các yêu cầu standard như:

- GitHub repository access.
- Jira và Confluence access.
- Corporate VPN.
- Sandbox nhỏ với CPU/RAM, TTL và manager approval.
- Một số tình huống false-positive như tài liệu có chữ `Production DB`, `RDP` hoặc `blockchain` nhưng bản thân request chỉ xin quyền đọc tài liệu hoặc công cụ standard.

### 4.2. Missing information

Đã có các nhóm:

- Airflow, Spark, Flink, dbt và Kafka Connect.
- Debezium CDC và feature-store ETL.
- PostgreSQL, Redis, MongoDB, ClickHouse, Trino.
- Các hệ thống phục vụ Finance, HR, Marketing, Legal, Audit, ESG và Customer Care.

Các case chủ yếu thiếu CPU, RAM, instance size, throughput hoặc timeframe.

### 4.3. Beyond authority

Đã có các nhóm:

- Read/Write access vào Zalo Production DB.
- Read/Write access vào ZaloPay Production DB.
- Read/Write access vào VNGGames Production DB.
- Export hoặc dump dữ liệu production.
- Các request 11, 12, 16, 20, 24, 40 và 64 GPU instances.
- Các tình huống người yêu cầu có manager approval nghiệp vụ nhưng chưa có system owner, DBA, capacity hoặc Director approval.

### 4.4. Security risk

Đã có các dạng:

- Mở public RDP, SSH, PostgreSQL, Redis, Docker daemon, Kubernetes API, Grafana, Jupyter, VNC, NVR và Ethereum RPC.
- Torrent, BitTorrent, crypto mining và unauthorized software.
- Disable EDR hoặc bypass security/change-control.
- Xin kubeconfig admin, Vault token hoặc secret qua Slack.
- Social engineering bằng ngôn ngữ khẩn cấp và viện dẫn cấp lãnh đạo.
- Request nguy hiểm không liên quan đến vấn đề gốc, ví dụ laptop bị lỗi nhưng yêu cầu drop bảng production.

## 5. Schema hiện tại

### Verify cases

File `verify_cases.json` là fixture gốc lịch sử: 5 case gồm 2 `ROUTINE` AUTO và 3 case cần `ESCALATE` vì thiếu thông tin, vượt thẩm quyền hoặc rủi ro bảo mật. Fixture này được giữ nguyên để regression/provenance.

Judge-facing hiện tại dùng hai pack khác: `support-v3.json` với `pack=de-a-v3` (5 case, 3 AUTO / 2 ESCALATE) và `judge-15.json` (15 tình huống). Không sửa fixture gốc để làm kết quả đẹp hơn.

### Ground Truth mở rộng

`extended_ticket_cases.json` và `enterprise_cross_function_cases.json` dùng cùng schema 5 field:

```text
id
ticket_content
expected_action
expected_bucket
expected_reasoning_keyword
```

### Synthetic tickets theo yêu cầu mới nhất

`synthetic_tickets.json` dùng schema 7 field:

```text
id
category
ticket_content
expected_action
expected_bucket
expected_reasoning
route_to
```

## 6. Vấn đề cần lưu ý

### 6.1. Phân biệt fixture gốc và judge packs hiện tại

Snapshot này từng ghi `verify_cases.json` là Verify Harness nhanh và đề xuất đổi phân bố. Đó là trạng thái lịch sử. Fixture gốc hiện vẫn giữ nguyên 2 AUTO / 3 ESCALATE; pack Đề A đúng 3 AUTO / 2 ESCALATE là `support-v3.json` với `pack=de-a-v3`, còn bộ judge mở rộng là `judge-15.json`. Xem [docs/JUDGE-DATASETS.md](../../docs/JUDGE-DATASETS.md).

### 6.2. Policy integration — trạng thái lịch sử

Snapshot này từng ghi policy source chưa được tích hợp. Runtime hiện tại đã có deterministic evaluator ở `src/domain/policy.ts`, rule source ở `src/domain/policy-source.ts`, policy version `support-guidance-v5.2` và regression tests. Các file policy-v2 trong thư mục này vẫn là provenance/nguồn đề xuất synthetic; không được đọc đoạn lịch sử này như mô tả runtime hiện tại.

### 6.3. Chưa có expected structured extraction

Các case chưa lưu đầy đủ:

- `expected_extracted_fields`.
- `missing_fields`.
- `matched_rules`.
- `evidence_spans`.
- `expected_escalation_question`.
- `must_not_affirm`.

Các field này cần thiết để kiểm thử LLM extraction, Explainable AI và safety validator.

### 6.4. Trạng thái thư mục dữ liệu trong snapshot

Tại thời điểm snapshot, `data/adversarial/` đã có hidden cases và `data/demo/` chưa có file. `data/policy/` thực tế đã có policy source; phần “chưa có file” trong bản cũ là không chính xác. Runtime evaluator hiện nằm ở repository root, không nằm trong `mlai26_new/data/`.

## 7. Dữ liệu còn thiếu

### 7.1. Policy integration

Không tự tạo một JSON policy độc lập nếu nó làm drift khỏi `policy-v2`. Decision-engine lane cần chuyển policy source hiện tại thành typed TypeScript/config có test, bao gồm:

- `approval_claim` tách khỏi `approval_verification_status=verified`.
- Authority role, scope match và expiry được kiểm tra server-side.
- Secret redaction trước LLM/database/audit/UI.
- Standard diagnostic hoặc non-production safe path có thể auto-approve.
- Missing fact hoặc approval chưa xác minh → `NEEDS_INFORMATION`.
- Production data, privileged access, public exposure, exfiltration, bypass và unauthorized software → `ESCALATE`.

### 7.2. Intake form fixtures

Cần dữ liệu cho các form:

- Application access.
- Login/MFA.
- VPN/network.
- Software/license.
- Database/data access.
- Server/ETL/sandbox.
- Security incident.

Mỗi form nên có case hợp lệ, thiếu field, sai format, mâu thuẫn và request có nhiều ý.

### 7.3. Approval và authority fixtures

Cần mô phỏng:

- Approval hợp lệ.
- Approval từ sai người.
- Approval hết hạn.
- Approval chỉ cho business purpose nhưng không cho quyền production.
- Approval qua Slack/Zalo nhưng không xác minh được.
- Người yêu cầu dùng urgency để bypass approval.

### 7.4. Hidden adversarial cases

Đã có 5 case trong `data/adversarial/hidden_adversarial_cases.json` để kiểm tra:

- Prompt injection.
- Gọi production là staging.
- Dùng từ “temporary”, “chỉ 10 phút”, “P1” để che rủi ro.
- Mâu thuẫn giữa form và free text.
- Một ticket chứa đồng thời request routine và request nguy hiểm.

Các nhóm còn nên bổ sung ở vòng sau: viết resource size bằng chữ và keyword nguy hiểm trong ngữ cảnh thực sự an toàn.

### 7.5. Workflow và audit fixtures

Cần seed data cho các trạng thái:

```text
SUBMITTED
→ EXTRACTED
→ NEEDS_INFO
→ ESCALATED
→ ADMIN_APPROVED / ADMIN_REJECTED
→ OVERRIDDEN
→ COMPLETED
```

Mỗi transition cần có timestamp, actor, reason, input reference và action.

### 7.6. Attachment fixtures

Cần một số file giả lập hoặc metadata giả lập cho:

- Screenshot lỗi VPN.
- Approval email.
- Server log.
- CSV synthetic.
- Screenshot MFA error.
- File có thông tin mâu thuẫn với phần text.
- File chứa prompt injection.

Không đưa credential, token, PII hoặc dữ liệu production thật vào repository.

### 7.7. Sprint 2 evidence

Dữ liệu người dùng thật không nên synthetic. Sprint 2 cần:

- Ít nhất 3 người trực tiếp xử lý quy trình.
- Chức danh và vai trò thực tế.
- Consent.
- Phản hồi nguyên văn.
- Tỷ lệ escalation bị bỏ sót.
- Tỷ lệ escalation thừa.
- Một cải tiến sản phẩm bắt nguồn từ feedback.
- Ít nhất một bất cập phát sinh khi sử dụng hệ thống.

## 8. Thứ tự đề xuất — kế hoạch lịch sử

Danh sách dưới đây là kế hoạch tại ngày 2026-09-20, giữ lại để provenance. Các mục Verify/policy integration đã thay đổi sau đó; không dùng danh sách này làm backlog hiện tại.

## 9. Kết luận của snapshot

Tại thời điểm 2026-09-20, tài liệu kết luận dữ liệu chưa đủ cho dispatcher hoàn chỉnh. Đây là kết luận lịch sử. Runtime hiện tại và ranh giới judge pack được mô tả ở [README root](../../README.md), [docs/JUDGE-DATASETS.md](../../docs/JUDGE-DATASETS.md), `src/domain/` và `src/services/verification.ts`.
