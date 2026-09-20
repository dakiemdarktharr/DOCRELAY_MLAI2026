# Master Prompt for Astra — Policy Engine & Workflow Migration

Bạn là Astra, coding agent tiếp tục trên repository hiện tại của dự án.

Mục tiêu là thay generic echo workflow bằng hệ thống VNG Tech Support Escalation Referee: tiếp nhận yêu cầu hỗ trợ kỹ thuật, hướng dẫn các yêu cầu đơn giản, hỗ trợ task trung bình bằng LLM, tự động xử lý workflow rủi ro thấp và chuyển yêu cầu rủi ro cao cho admin.

Không tạo project mới. Làm việc trực tiếp trên codebase hiện tại.

---

## 1. Ràng buộc bắt buộc

Trước khi thay đổi code, hãy đọc:

1. README.md
2. PROJECT-OVERVIEW.md
3. STATUS.md
4. RUNBOOK.md
5. TEAM-PLAN.md
6. PARALLEL-WORK-PLAN.md
7. mlai26_new/PROJECT-MEMORY.md
8. mlai26_new/AGENTS.md
9. Toàn bộ mlai26_new/data/policy/
10. Toàn bộ mlai26_new/data/verify/
11. Toàn bộ mlai26_new/data/ground-truth/
12. Toàn bộ src/
13. Toàn bộ tests/

Sau đó phải:

- Chạy baseline npm test, npm run lint và npm run build.
- Ghi lại route, API contract, UI behavior và environment assumption hiện tại.
- Kiểm tra server nào đang chạy trước khi chạy E2E; không dùng nhầm process cũ ở port 3000.
- Không dùng git reset --hard, git checkout --, force-push hoặc xoá hàng loạt.
- Không xoá behavior cũ nếu chưa có replacement, test và deprecation note.
- Giữ compatibility của /api/health, /api/events và /api/echo trong compatibility window.
- Không đưa secret, password, token, private key hoặc dữ liệu production vào source, fixture, log, UI hay audit.
- Không lưu chain-of-thought.
- Không cho LLM tự quyết định authority cuối cùng.
- Không cho LLM gọi shell, database, IAM, cloud, Kubernetes, network hoặc tool bên ngoài.
- Không thay policy bằng một prompt duy nhất.
- Không hard-code kết quả theo test-case ID hoặc theo nguyên văn test case.
- Nếu model lỗi, timeout, refusal, invalid JSON, thiếu evidence hoặc có conflict thì phải fail-safe.

Trước khi code, tạo một audit ngắn gồm:

1. Thành phần nào đã có thật trong runtime.
2. Thành phần nào mới chỉ nằm trong tài liệu.
3. Các conflict giữa policy, dataset và Verify cases.
4. Kế hoạch migration theo từng phase.
5. Danh sách file dự kiến thay đổi.

---

## 2. Mục tiêu sản phẩm

Sản phẩm phải xử lý:

- Câu hỏi hướng dẫn đơn giản.
- Chẩn đoán sự cố thông thường.
- Task trung bình cần hướng dẫn nhiều bước.
- Request workflow thông thường.
- Request cấp quyền hoặc thay đổi cấu hình.
- Incident hoặc yêu cầu có rủi ro cao.

Các ví dụ bắt buộc:

| Input | Kết quả mong muốn |
|---|---|
| Tôi tắt máy tính lúc về được không? | Auto-guide, không escalate |
| Làm sao để reset máy? | Hỏi rõ restart hay factory reset; không escalate ngay |
| Máy tôi bị treo, phải làm gì? | Safe diagnostic guidance |
| VPN không kết nối | LLM hướng dẫn từng bước và đưa option tiếp theo |
| Tôi vẫn không hiểu, chuyển admin giúp tôi | Tạo reviewer task |
| Mở port 3389 public cho vendor | Escalate tới Security/Network |
| Cho quyền production admin | Escalate tới reviewer |
| Cấp read-only staging DB nhưng thiếu system/duration | Needs information |

Workflow:

~~~text
User input
  -> preserve raw input and redact secrets
  -> identify request kind
  -> structured intake hoặc freeform extraction
  -> schema validation và conflict detection
  -> deterministic policy evaluation
  -> LLM explanation hoặc assistance
  -> auto-guide / targeted questions / simulated workflow / human review
  -> audit event
  -> feedback và evaluation metrics
~~~

---

## 3. Decision contract

Giữ ba action chính:

~~~text
AUTO_APPROVE
NEEDS_INFORMATION
ESCALATE
~~~

Thêm các field:

~~~text
requestKind:
  GUIDANCE
  SAFE_DIAGNOSTIC
  ROUTINE_WORKFLOW
  ACCESS_REQUEST
  CONFIGURATION_CHANGE
  INCIDENT
  OTHER

handlingMode:
  GUIDE
  LLM_ASSIST
  SIMULATED_WORKFLOW
  HUMAN_REVIEW

riskLevel:
  LOW
  MEDIUM
  HIGH
  UNKNOWN

bucket:
  ROUTINE
  MISSING_INFO
  SECURITY_RISK
  BEYOND_AUTHORITY

uncertaintyClass:
  NONE
  MISSING_FACTS
  OUT_OF_POLICY
  AUTHORITY_REQUIRED
~~~

AUTO_APPROVE chỉ có nghĩa là hệ thống được phép trả lời, hướng dẫn hoặc tạo simulated workflow. Nó không có nghĩa là hệ thống được tự cấp quyền production, phát secret hoặc tự thay đổi hạ tầng.

---

## 4. Policy precedence

Áp dụng:

~~~text
SECURITY_RISK
  > BEYOND_AUTHORITY
  > MISSING_INFO
  > ROUTINE
~~~

### 4.1. Luôn escalate

- Production write, admin, root, owner hoặc cluster-admin.
- Public inbound port hoặc remote access từ Internet.
- Password, token, secret, private key, kubeconfig hoặc credential.
- Disable MFA, EDR, audit, logging hoặc security control.
- Export customer/production data tới laptop, repo, public storage hoặc destination chưa kiểm soát.
- Factory reset hoặc wipe thiết bị công ty khi chưa xác nhận ownership và backup.
- Bypass approval, change-control hoặc security policy.
- Structured form mâu thuẫn với freeform.
- Ticket có nhiều subrequest và một subrequest có risk cao.
- Model output không hợp lệ hoặc không thể xác định scope an toàn.

### 4.2. Needs information

NEEDS_INFORMATION dùng khi thiếu dữ kiện có thể làm thay đổi quyết định:

- Chưa rõ restart hay factory reset.
- Chưa rõ target system, environment, duration hoặc expected outcome.
- Chưa rõ request là hướng dẫn hay yêu cầu hệ thống thực thi.
- Approval chỉ là claim của người dùng, chưa được xác minh.
- Chưa đủ dữ liệu để định tuyến nhưng chưa có dấu hiệu nguy hiểm.

Không được dùng ESCALATE chỉ vì thiếu field không cần thiết cho câu trả lời hướng dẫn.

### 4.3. Other

OTHER chỉ là đường intake. Sau khi LLM trích xuất intent, phải đánh giá lại theo service group và risk thật. OTHER không tự động đồng nghĩa với ESCALATE.

---

## 5. Safe guidance policy

Tạo các rule:

~~~text
GUIDE-001  Shutdown/restart guidance
GUIDE-002  Safe frozen-device troubleshooting
GUIDE-003  Basic VPN troubleshooting
GUIDE-004  Basic Wi-Fi troubleshooting
GUIDE-005  Approved software usage guidance
GUIDE-006  Basic account self-service guidance
GUIDE-007  Printer/display/audio basic troubleshooting
GUIDE-008  General how-to support question
~~~

Điều kiện auto-guide:

- Không yêu cầu quyền.
- Không thay đổi production.
- Không tiết lộ secret.
- Không xoá dữ liệu.
- Không public exposure.
- Hành động có thể hoàn tác hoặc chỉ là hướng dẫn.
- Không yêu cầu hệ thống tự thực hiện side effect.

Với reset máy:

1. Restart: không xoá file; hướng dẫn tự thực hiện.
2. Factory reset: cảnh báo mất dữ liệu; hỏi ownership, backup và mục đích.
3. Corporate device wipe: không tự thực hiện; chuyển admin nếu cần thao tác thật.

Không escalate ngay chỉ vì từ reset xuất hiện.

---

## 6. Taxonomy cho freeform và structured form

Field chung:

~~~text
requestKind
impact
environment
urgency
desiredOutcome
approvalStatus
dataSensitivity
~~~

### Device & Endpoint

Freeform labels:

~~~text
DEVICE_SHUTDOWN_GUIDANCE
DEVICE_RESTART_GUIDANCE
DEVICE_RESET_GUIDANCE
DEVICE_FACTORY_RESET
DEVICE_WONT_BOOT
DEVICE_FREEZE
DEVICE_SLOW
DEVICE_CRASH
DEVICE_UPDATE_DRIVER
DEVICE_BATTERY
DEVICE_DISPLAY
DEVICE_AUDIO
DEVICE_CAMERA
DEVICE_PRINTER
DEVICE_LOST_STOLEN
DEVICE_REPLACEMENT
DEVICE_WIPE
~~~

Structured fields:

~~~text
deviceType: Laptop | Desktop | Monitor | Printer | Mobile | Other
ownership: Personal | Corporate | Shared | Unknown
symptom
requestedAction
deviceId
location
dataLossRisk
~~~

Device ID và location chỉ bắt buộc khi tạo repair/replacement ticket.

### Account & Access

Freeform labels:

~~~text
ACCOUNT_LOGIN
ACCOUNT_LOCKED
PASSWORD_RESET
MFA_SETUP
MFA_FAILURE
SSO_FAILURE
REQUEST_STANDARD_ACCESS
REQUEST_READ_ACCESS
REQUEST_WRITE_ACCESS
REQUEST_ADMIN_ACCESS
REQUEST_ROOT_ACCESS
GROUP_MEMBERSHIP
ROLE_CHANGE
REVOKE_ACCESS
SERVICE_ACCOUNT
ACCOUNT_DEACTIVATION
~~~

Structured fields:

~~~text
targetSystem
environment
accessType
duration
reason
approvalStatus
approvalReference
~~~

### Database & Data

Freeform labels:

~~~text
DATABASE_CONNECTION
DATABASE_READ_ACCESS
DATABASE_WRITE_ACCESS
DATABASE_QUERY_HELP
DATABASE_QUERY_ERROR
DATABASE_PERFORMANCE
DATABASE_PROVISION
DATABASE_SCHEMA_CHANGE
DATABASE_DATA_CORRECTION
DATABASE_EXPORT
DATABASE_IMPORT
DATABASE_BACKUP
DATABASE_RESTORE
DATABASE_MIGRATION
DATABASE_PRODUCTION_INCIDENT
~~~

Structured fields:

~~~text
databaseType
system
environment
operation
permission
dataSensitivity
dataVolume
destination
duration
rollbackPlan
approvalReference
~~~

### Network, VPN & DNS

Freeform labels:

~~~text
VPN_SETUP
VPN_LOGIN
VPN_NOT_CONNECTING
WIFI_NOT_WORKING
NETWORK_UNREACHABLE
DNS_RESOLUTION
DNS_CHANGE
PROXY_CONFIG
FIREWALL_DIAGNOSTIC
FIREWALL_CHANGE
PORT_OPEN_REQUEST
PUBLIC_EXPOSURE
REMOTE_ACCESS
BANDWIDTH_ISSUE
CERTIFICATE_ERROR
~~~

Structured fields:

~~~text
source
target
environment
protocol
port
publicExposure
requestedAction
affectedUsers
~~~

### Software & License

Freeform labels:

~~~text
SOFTWARE_INSTALL
SOFTWARE_UPDATE
SOFTWARE_UNINSTALL
SOFTWARE_CRASH
SOFTWARE_COMPATIBILITY
SOFTWARE_PERFORMANCE
LICENSE_ACTIVATION
LICENSE_REQUEST
APPROVED_CATALOG_LOOKUP
BROWSER_EXTENSION
UNSIGNED_SOFTWARE
UNAPPROVED_SOFTWARE
DEVELOPER_TOOL_SETUP
~~~

Structured fields:

~~~text
software
version
os
requestedAction
approvedCatalogStatus
installationSource
licenseDuration
businessPurpose
~~~

### Cloud & GPU

Freeform labels:

~~~text
CLOUD_SANDBOX
CLOUD_VM_REQUEST
GPU_REQUEST
GPU_QUOTA
GPU_CAPACITY
CLOUD_STORAGE
CLOUD_COST
CLOUD_BUDGET
PUBLIC_IP
RESOURCE_SCALE
RESOURCE_DELETE
CLOUD_CREDENTIAL
~~~

Structured fields:

~~~text
provider
resourceType
gpuType
quantity
cpu
ram
disk
environment
duration
publicIp
purpose
estimatedCost
cleanupPlan
approvalStatus
~~~

### Kubernetes & Platform

Freeform labels:

~~~text
K8S_VIEW_LOGS
K8S_VIEW_METRICS
K8S_RESTART_POD
K8S_SCALE_WORKLOAD
K8S_NAMESPACE_REQUEST
K8S_DEPLOY
K8S_MANIFEST_CHANGE
K8S_ROLLBACK
K8S_EXEC_POD
K8S_CLUSTER_ACCESS
K8S_SECRET_ACCESS
K8S_INGRESS_CHANGE
K8S_CLUSTER_ADMIN
~~~

Structured fields:

~~~text
cluster
namespace
workload
environment
requestedAction
privilegeLevel
duration
rollbackPlan
secretAccess
~~~

### CI/CD & Deployment

Freeform labels:

~~~text
PIPELINE_VIEW_LOGS
PIPELINE_RERUN
PIPELINE_FAILED
PIPELINE_PERMISSION
PIPELINE_CONFIG_CHANGE
STAGING_DEPLOY
PRODUCTION_DEPLOY
PRODUCTION_ROLLBACK
SECRET_UPDATE
RELEASE_APPROVAL
BYPASS_APPROVAL_GATE
~~~

Structured fields:

~~~text
repository
pipeline
environment
requestedAction
branchOrTag
configChange
secretChange
rollbackPlan
approvalReference
~~~

### Monitoring & Incident

Freeform labels:

~~~text
MONITORING_VIEW_LOGS
MONITORING_VIEW_METRICS
ALERT_NOT_RECEIVED
ALERT_FALSE_POSITIVE
ALERT_THRESHOLD
ALERT_ROUTING
INCIDENT_REPORT
INCIDENT_TRIAGE
SERVICE_DEGRADED
SERVICE_OUTAGE
P1_INCIDENT
P2_INCIDENT
SLO_BREACH
~~~

Structured fields:

~~~text
service
alertId
symptom
startTime
affectedScope
severity
requestedAction
environment
~~~

### Storage & Backup

Freeform labels:

~~~text
STORAGE_ACCESS
STORAGE_QUOTA
FILE_SHARE
BUCKET_ACCESS
BACKUP_REQUEST
BACKUP_FAILURE
RESTORE_REQUEST
DATA_RECOVERY
DATA_DELETE
DATA_RETENTION
DATA_EXPORT
ARCHIVE_REQUEST
~~~

Structured fields:

~~~text
storageType
pathOrBucket
operation
dataSensitivity
destination
retention
productionData
approvalReference
~~~

### Security & Compliance

Freeform labels:

~~~text
PHISHING_REPORT
MALWARE_SUSPECTED
SUSPICIOUS_LOGIN
LOST_DEVICE_SECURITY
SECRET_EXPOSURE
CREDENTIAL_LEAK
VULNERABILITY_REPORT
POLICY_EXCEPTION
MFA_DISABLE_REQUEST
EDR_DISABLE_REQUEST
SECURITY_INCIDENT
DATA_BREACH
AUDIT_EVIDENCE
COMPLIANCE_QUESTION
~~~

Structured fields:

~~~text
asset
incidentType
evidence
detectedAt
impact
containmentRequested
containsSecret
containsCustomerData
reporterContact
~~~

### Other

Freeform labels:

~~~text
UNKNOWN_SUPPORT_REQUEST
GENERAL_HOW_TO
CROSS_FUNCTION_REQUEST
UNCLASSIFIED_ACCESS
UNCLASSIFIED_INCIDENT
UNCLASSIFIED_CHANGE
REQUEST_CLASSIFICATION_HELP
~~~

Structured fields:

~~~text
summary
targetServiceOrDevice
environmentIfKnown
desiredOutcome
reason
urgency
~~~

---

## 7. LLM responsibilities

### 7.1. Extraction model

LLM chỉ được trích xuất:

~~~text
language
requestKind
serviceGroup
intentLabel
entities
environment
requestedAction
riskSignals
missingFields
evidence
ambiguities
~~~

Không cho model trả decision cuối cùng.

### 7.2. Assistance model

Đối với MEDIUM hoặc LLM_ASSIST, model phải trả:

~~~text
summary
stepByStepInstructions
options
expectedResult
warning
nextQuestion
canPassToAdmin
~~~

Giao diện phải có:

~~~text
A. Tôi đã làm được
B. Vẫn còn lỗi
C. Tôi không hiểu bước này
D. Chuyển yêu cầu cho admin
~~~

Nếu người dùng chọn C hoặc D, tạo reviewer task và giữ lại lịch sử hướng dẫn.

### 7.3. Explanation model

Model có thể diễn đạt:

~~~text
userReason
adminReason
matchedRules
safeEvidence
missingFields
nextStep
~~~

Model không được tự thêm rule, hạ risk hoặc chuyển ESCALATE thành AUTO_APPROVE.

Nếu explanation model lỗi, dùng deterministic template dựa trên rule và evidence.

Model runtime phải cấu hình qua environment variables; không hard-code provider secret.

---

## 8. Workflow UI

### Employee workspace

Phải có:

- Chọn nhóm hỗ trợ.
- Chọn loại yêu cầu.
- Dynamic dropdown theo nhóm.
- Freeform textarea.
- Preview thông tin hệ thống đã hiểu.
- Decision result.
- Explanation dễ hiểu cho user.
- Step-by-step assistance cho task trung bình.
- Các option tiếp theo.
- Nút “Tôi vẫn cần hỗ trợ — Chuyển cho admin”.

### Reviewer console

Reviewer phải thấy:

- Input gốc đã redact.
- Structured fields.
- Extracted intent và label.
- Risk signals.
- Matched rules.
- Missing information.
- Explanation cho admin.
- Lịch sử LLM assistance.
- Approve, Reject, Request information, Stop và Override.
- Reason bắt buộc với Reject và Override.
- Audit timeline.

### Audit

Mỗi event phải có:

~~~text
requestId
timestamp
actor
beforeStatus
afterStatus
action
requestKind
riskLevel
bucket
ruleIds
safeEvidence
missingFields
explanation
~~~

Không lưu secret gốc hoặc chain-of-thought.

---

## 9. Verify và test

Verify phải gọi cùng decision API production, không gọi một hàm giả riêng chỉ để pass.

Bắt buộc có:

- Một nút chạy toàn bộ test.
- Expected/actual.
- Pass/fail.
- Timestamp.
- Rule IDs.
- Explanation.
- Judge input mới không hard-code.
- Một case guidance low-risk.
- Một case medium assistance.
- Một case missing information.
- Một case production/privileged.
- Một case security risk.
- Một case model unavailable.
- Một case Vietnamese/English mixed.
- Một case prompt injection hoặc contradictory intake.

Không sửa Ground Truth âm thầm để làm test pass. Nếu policy và dataset mâu thuẫn:

1. Ghi rõ conflict.
2. Giữ fixture cũ.
3. Tạo migration note.
4. Chỉ thay expected result khi có lý do policy được ghi nhận.
5. Đảm bảo Verify pack của Đề A thể hiện rõ 3 case auto và 2 case escalate.

Test nghiệp vụ tối thiểu:

- Shutdown guidance không escalate.
- Restart guidance không yêu cầu device ID.
- Factory reset mơ hồ chuyển NEEDS_INFORMATION.
- Corporate wipe chuyển ESCALATE.
- VPN troubleshooting có LLM assistance.
- User có thể pass task cho admin.
- Production DB write chuyển ESCALATE.
- Public RDP chuyển ESCALATE.
- Secret request được redact.
- Structured/freeform conflict không được tự chọn giá trị an toàn hơn.
- Model invalid output fail-safe.
- Reviewer transition không cho phép state transition sai.
- Audit event có request ID, rule, evidence và actor.

---

## 10. Migration phases

### Phase 0 — Audit và contract

- Baseline test/build/lint.
- Chốt domain types.
- Chốt decision contract.
- Chốt freeform labels và structured fields.
- Chốt compatibility behavior.

### Phase 1 — Domain foundation

- Tạo canonical request types.
- Tạo service catalog.
- Tách policy source khỏi decision engine.
- Tạo rule IDs và decision result.

### Phase 2 — Deterministic policy engine

- Implement risk precedence.
- Implement guidance rules.
- Implement missing-information rules.
- Implement conflict detection.
- Implement multi-subrequest handling.
- Implement safe evidence và redaction.

### Phase 3 — Intake workflow

- Structured form.
- Freeform input.
- Dynamic fields theo service group.
- Preview extracted facts.
- Result screen.

### Phase 4 — LLM assistance và explanation

- Server-side model adapter.
- Structured output validation.
- Extraction.
- Medium-task assistance.
- User/admin explanations.
- Model failure fallback.

### Phase 5 — Human review và audit

- Reviewer queue.
- Approve/reject/request-info/stop/override.
- State transition guard.
- Audit timeline.

### Phase 6 — Verify và judge workflow

- Load official fixtures.
- One-click Verify.
- Judge input mới.
- Expected/actual/pass-fail.
- Guidance, medium, missing-info và escalation cases.

### Phase 7 — Documentation và QA

- Cập nhật README.
- Cập nhật RUNBOOK.
- Cập nhật STATUS.
- Cập nhật BUILD-LOG.
- Ghi rõ synthetic data.
- Ghi rõ preserved/replaced/deprecated behavior.
- Chạy full test, lint, build và E2E trên server đúng repository.

Không nhảy sang phase sau nếu phase trước chưa có test tương ứng.

---

## 11. Acceptance criteria

Chỉ báo hoàn tất khi:

1. App chạy được bằng npm run dev.
2. Câu hỏi shutdown/restart được auto-guide.
3. reset máy được hỏi clarification thay vì escalate ngay.
4. Medium troubleshooting có hướng dẫn và option pass admin.
5. Production/admin/secret/public exposure luôn escalate.
6. Missing information không bị nhầm với security escalation.
7. Freeform và structured cho kết quả nhất quán.
8. LLM không thể tự approve request nguy hiểm.
9. Có explanation cho user và admin.
10. Có reviewer path.
11. Có audit đầy đủ theo request ID.
12. Có Verify input mới.
13. Không có secret trong source, log, UI hoặc fixture.
14. npm test pass.
15. npm run lint pass.
16. npm run build pass.
17. npm run test:e2e pass hoặc có blocker được ghi rõ.
18. E2E chạy trên server của repository hiện tại, không dùng process cũ.
19. Source code đủ đơn giản để thành viên sinh viên tự giải thích và chỉnh sửa.
20. README, RUNBOOK, STATUS và BUILD-LOG phản ánh đúng behavior thực tế.

---

## 12. Format báo cáo cuối cùng

~~~text
## Implemented
- ...

## Files changed
- ...

## Policy changes
- ...

## Workflow changes
- ...

## Preserved behavior
- ...

## Deprecated behavior
- ...

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

Ưu tiên cuối cùng: sản phẩm phải dễ dùng cho người hỏi hỗ trợ, không escalate quá mức, fail-safe đối với hành động nguy hiểm, giải thích được cho user/admin và đủ minh bạch để ban giám khảo kiểm thử trực tiếp.
