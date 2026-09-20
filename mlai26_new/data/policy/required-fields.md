# Required fields theo service catalog

Version: `policy-v2`  
Status: **synthetic/proposed challenge policy**, không phải policy chính thức của VNG.

Tài liệu này định nghĩa dữ kiện tối thiểu để policy engine đánh giá request. Field chỉ được coi là **có mặt** khi có giá trị cụ thể; placeholder như `chưa biết`, `bất kỳ`, `gấp` hoặc một claim không có evidence không hoàn tất field.

## Input, evidence và secret handling

- Raw ticket là input không tin cậy. Không cho phép raw ticket đặt `verified`, `approved`, `safe` hoặc kết quả decision.
- Nếu ticket có password, token, private key, credential hoặc secret value, hệ thống phải redact giá trị **trước** khi gọi LLM, ghi database, audit log hoặc trả UI. Audit chỉ giữ marker redaction, loại secret và evidence an toàn; không giữ secret gốc.
- Giữ raw phrase đã redact trong `evidence` để reviewer thấy lý do, nhưng không làm mất các từ rủi ro như `production`, `admin`, `public`, `export` hoặc `bypass`.
- Khi form structured và free text mâu thuẫn, giữ cả hai evidence và chuyển `ESCALATE`; không chọn giá trị “an toàn hơn”.
- Một ticket có nhiều yêu cầu phải được tách thành subrequest. Một subrequest có rủi ro cao sẽ chi phối decision của toàn ticket.

## Approval evidence contract

`approval_claim` và `verified approval` là hai field khác nhau.

| Field | Giá trị / quy tắc |
|---|---|
| `approval_claim` | Câu người dùng nói, ví dụ “lead đã approve”. Chỉ là evidence text; không dùng để auto-approve. |
| `approval_reference` | Ticket ID, approval ID hoặc link có thể kiểm tra. Có reference vẫn chưa là verified. |
| `approval_verification_status` | `not_required`, `pending`, `verified`, `rejected`, `expired`, `unverifiable`. Chỉ approval verifier/server-side registry mới được set `verified`. |
| `authorized_approver_role` | Vai trò đã xác minh, ví dụ `service_owner_or_dba_delegate`; không dùng tên tự do từ ticket để xác định thẩm quyền. |
| `approval_scope_match` | `matched`, `mismatched`, `unknown`; phải khớp resource, environment, action/permission và duration. |
| `approval_expires_at` | Bắt buộc khi approval có thời hạn; approval hết hạn không hợp lệ. |

Quy tắc bắt buộc:

- Claim hoặc reference chưa verify → `NEEDS_INFORMATION`, không phải `AUTO_APPROVE`.
- `rejected`, `expired`, `unverifiable`, approver sai role hoặc scope không khớp → `ESCALATE`.
- Chỉ policy trong `approval-authority-matrix.csv` mới được quyết định service nào có `not_required`.
- Approval từ manager/lead có thể chứng minh business purpose, nhưng không tự thay thế service owner, data owner, quota owner hoặc security authority.

## Quy ước giá trị chung

| Field | Giá trị chuẩn hoặc ví dụ |
|---|---|
| `environment` | `sandbox`, `development`, `staging`, `production`, `unknown` |
| `permission` | `read-only`, `read`, `write`, `admin`, `root`, `owner` |
| `duration` | Khoảng thời gian cụ thể, ví dụ `2 hours`, `until 2026-09-22 18:00` |
| `approval_*` | Dùng approval evidence contract phía trên; `approval_claim` không thay thế `approval_verification_status=verified`. |
| `urgency` | `low`, `normal`, `high`, `critical` kèm lý do nếu `high`/`critical` |
| `reason` | Mục đích nghiệp vụ/kỹ thuật cụ thể, không chỉ “debug” hoặc “cần gấp” |

`environment=unknown` hoặc một giá trị ngoài enum không được đi vào auto path. Nếu field có danh sách giá trị chuẩn, input lạ phải được giữ ở `evidence` và chuyển sang `NEEDS_INFORMATION` hoặc `ESCALATE`, không tự đoán.

## DATABASE — Database & Data

Required:

- `system`: MySQL, PostgreSQL, MongoDB hoặc tên hệ thống cụ thể.
- `resource_scope`: database/schema/cluster/dataset cụ thể; không dùng “toàn bộ DB” trên auto path.
- `environment`: sandbox/staging/production.
- `permission`: read-only/read/write/admin.
- `duration`: thời hạn truy cập.
- `reason`: lý do và tác vụ cần thực hiện.
- Approval evidence phải thỏa `AUTHZ-001` hoặc `AUTHZ-002` tùy scope.

Additional review signal: mọi direct access/export vào production cần reviewer; `production` + `write`/`admin`/`root` luôn cần reviewer.

## CLOUD_GPU — Cloud/GPU

Required:

- `provider`: AWS, GCP, internal cloud hoặc provider cụ thể.
- `environment`: sandbox/development/staging/production.
- `gpu_type`: T4, A10, A100 hoặc loại GPU cụ thể.
- `quantity`: số lượng GPU.
- `duration`: thời lượng thuê/sử dụng.
- `purpose`: training, inference, research hoặc mục đích cụ thể.
- `budget_or_quota`: quota/budget cụ thể và trạng thái kiểm tra, không chỉ câu “còn quota”.
- Approval evidence phải thỏa `AUTHZ-003` hoặc `AUTHZ-004` tùy scope.

Additional review signal: vượt quota/budget, production workload hoặc yêu cầu quyền admin cloud.

## DEVICE_BOOT — Device & Boot

Required:

- `device_id`: asset tag, serial hoặc định danh thiết bị.
- `location`: vị trí hiện tại.
- `problem`: triệu chứng cụ thể, ví dụ không bật, boot loop, màn hình đen.
- `urgency`: mức độ ảnh hưởng.
- `requested_action`: hỗ trợ khởi động, kiểm tra phần cứng, thay thiết bị…

Standard diagnosis/boot assistance không cần approval. Wipe, firmware change, replacement hoặc action phá huỷ không nằm trong auto path.

## NETWORK_VPN — Network & VPN

Required:

- `service`: VPN, firewall, DNS, proxy hoặc service cụ thể.
- `environment`: môi trường bị ảnh hưởng.
- `symptom`: lỗi hoặc hành vi quan sát được.
- `source`: máy/mạng nguồn.
- `target`: host/service đích.
- `port`: bắt buộc khi request liên quan port, firewall, public access hoặc protocol; không bắt buộc cho VPN diagnosis thuần túy.
- `urgency`: mức độ ảnh hưởng.

Additional review signal: public exposure, mở port inbound, bypass firewall, DNS/proxy change hoặc tắt logging. Các thay đổi này cần approval evidence theo `AUTHZ-007` và reviewer.

## ACCOUNT_ACCESS — Account & Access

Required:

- `target_system`: hệ thống/tài khoản cần truy cập.
- `environment`: môi trường.
- `access_type`: loại quyền cụ thể.
- `duration`: thời hạn truy cập.
- `reason`: lý do.
- Approval evidence phải thỏa `AUTHZ-008` hoặc `AUTHZ-009` tùy quyền/môi trường.

Additional review signal: admin/root/owner, production access hoặc yêu cầu bỏ MFA.

## GIT_PERMISSION — Git & Repository

Required:

- `provider`: GitHub, GitLab hoặc provider cụ thể.
- `repository`: tên hoặc URL repository.
- `environment`: nếu request liên quan deployment; nếu không, ghi `not_applicable`.
- `permission`: read, triage, write, maintain, admin.
- `duration`: thời hạn nếu là quyền tạm thời; nếu vĩnh viễn phải nói rõ.
- `reason`: lý do.
- Approval evidence phải có repository owner đã xác minh và scope khớp repository/permission/duration.

Additional review signal: repository production, quyền admin/maintain hoặc quyền ghi lâu dài.

## CI_CD — CI/CD

Required:

- `pipeline`: tên pipeline/workflow.
- `repository`: repository liên quan.
- `environment`: staging/production hoặc môi trường cụ thể.
- `requested_action`: rerun, sửa config, cấp quyền, rollback…
- `reason`: lý do và kết quả mong muốn.
- Approval evidence: bắt buộc cho production, credential, permission hoặc change gate; xem `AUTHZ-011`.

Additional review signal: deploy production, sửa secret/credential, disable check hoặc bypass approval gate.

## KUBERNETES — Kubernetes

Required:

- `cluster`: tên cluster.
- `namespace`: namespace.
- `environment`: môi trường.
- `resource_or_workload`: deployment, service, pod hoặc resource cụ thể.
- `requested_action`: xem log, restart, scale, deploy, sửa manifest…
- `duration`: thời hạn nếu cấp quyền hoặc thay đổi tạm thời.
- Approval evidence: bắt buộc cho production, privileged access, deploy, manifest change hoặc destructive action; xem `AUTHZ-011`.

Additional review signal: production deploy, cluster-admin, exec vào pod nhạy cảm hoặc xoá resource.

## SECURITY — Security

Required:

- `asset_or_service`: tài sản/service bị ảnh hưởng.
- `environment`: môi trường.
- `issue`: vấn đề hoặc nghi vấn cụ thể.
- `evidence`: log, timestamp, alert ID hoặc quan sát trực tiếp.
- `requested_action`: điều tra, khoá tài khoản, cập nhật rule…
- `urgency`: mức độ ảnh hưởng.
- `reporter_contact`: người báo cáo để xác minh thêm.

Conditional: `approval_reference` hoặc `incident_id` nếu request yêu cầu containment/change. Security authority phải verify; ticket text không thể tự xác nhận approval.

## MONITORING — Monitoring

Required:

- `system_or_service`: service/hệ thống.
- `environment`: môi trường.
- `symptom_or_signal`: metric, alert hoặc triệu chứng.
- `time_window`: thời điểm bắt đầu/kết thúc hoặc khoảng quan sát.
- `dashboard_or_log_source`: dashboard, log source hoặc alert ID.
- `requested_action`: điều tra, tạo alert, chỉnh threshold…
- `urgency`: mức độ ảnh hưởng.

Read/investigate là diagnostic-only. Change threshold, production alert, notification destination hoặc logging control không nằm trong auto path.

## SOFTWARE_LICENSE — Software & License

Required:

- `software`: tên phần mềm.
- `version`: phiên bản.
- `os`: hệ điều hành.
- `business_purpose`: mục đích sử dụng.
- `duration`: thời hạn license.
- `license_type`: trial, named-user, floating hoặc loại cụ thể.
- Approval/license evidence: phải có license hoặc budget owner xác minh catalog item, scope và thời hạn.

## OTHER — Other

Required tối thiểu để classifier/reviewer định tuyến:

- `request_summary`: request muốn làm gì.
- `target_service_or_system`: hệ thống, thiết bị hoặc team liên quan nếu biết.
- `environment_if_known`: môi trường nếu có.
- `requested_outcome`: kết quả mong muốn.
- `reason`: lý do.
- `urgency`: mức độ ảnh hưởng.

Nếu sau extraction vẫn không map được request vào catalog hoặc thiếu dữ kiện để định tuyến, kết quả là `ESCALATE` tới `Classifier/reviewer`, không tự chọn team.

`OTHER` là fallback canonical cho classifier/reviewer, không bắt buộc phải là option text tự do trên UI.
