# Bilingual glossary

Version: `policy-v2`

Glossary này giúp parser nhận diện các cách diễn đạt khác nhau và map về canonical meaning ổn định. Raw phrase của user phải được giữ ở dạng đã redact trong `evidence`; canonicalization không được xoá hoặc làm mất các từ rủi ro như `production`, `admin`, `secret`, `root`, `public`, `export` hoặc `bypass`.

## Thuật ngữ nghiệp vụ và hỗ trợ

| Vietnamese | English / synonyms | Canonical meaning | Canonical value |
|---|---|---|---|
| quyền truy cập | access, access permission | authorization/access request | `access_permission` |
| cấp quyền | grant access, provision access | tạo hoặc mở quyền | `grant_access` |
| thu hồi quyền | revoke access, remove access | xoá quyền | `revoke_access` |
| quyền chỉ đọc | read-only, read access | không ghi dữ liệu | `read-only` |
| quyền ghi | write access | được thay đổi dữ liệu | `write` |
| quyền quản trị | admin access, administrator | quyền đặc quyền | `admin` |
| quyền root | root access, superuser | quyền cao nhất trên hệ thống | `root` |
| tài khoản chủ sở hữu | owner account, account owner | quyền sở hữu toàn bộ scope | `owner` |
| lead/manager đã duyệt | manager approval, lead approval, my manager approved | claim người dùng nêu về approval | `approval_claim` |
| mã/link phê duyệt | approval ID, ticket ID, approval link | reference có thể kiểm tra | `approval_reference` |
| approval đã xác minh | verified approval, verifier confirmed | trạng thái chỉ do server-side verifier set | `approval_verification_status=verified` |
| approval bị từ chối/hết hạn | rejected approval, expired approval | approval không còn hợp lệ | `approval_verification_status=rejected_or_expired` |
| phạm vi phê duyệt | approved scope, approved for this database | resource/action/duration approval phải bao phủ | `approval_scope_match` |
| môi trường thử nghiệm | sandbox, test environment | môi trường cô lập/thử nghiệm | `sandbox` |
| môi trường phát triển | development, dev | môi trường development | `development` |
| môi trường staging | staging, pre-production | môi trường tiền production | `staging` |
| môi trường production | production, prod, live | môi trường đang phục vụ thật | `production` |
| thời hạn truy cập | duration, time window, access period | khoảng thời gian quyền có hiệu lực | `duration` |
| lý do nghiệp vụ | reason, purpose, business justification | mục đích cần xử lý | `reason` |
| mức độ khẩn cấp | urgency, priority, severity | độ ưu tiên/ảnh hưởng | `urgency` |

## Thiết bị, mạng và nền tảng

| Vietnamese | English / synonyms | Canonical meaning | Canonical value |
|---|---|---|---|
| máy bị treo | computer is frozen, device hangs | device không phản hồi | `device_frozen` |
| bật máy | boot, start device, power on | khởi động thiết bị | `boot_device` |
| khởi động lại | restart, reboot | restart device/service/workload | `restart` |
| không khởi động được | no boot, won't start, boot failure | lỗi khởi động | `boot_failure` |
| mạng riêng ảo | VPN, virtual private network | kết nối VPN | `vpn` |
| tường lửa | firewall | network security control | `firewall` |
| cổng mạng | port, network port | port/protocol của service | `port` |
| mở cổng công khai | expose public port, public inbound port | mở truy cập từ Internet | `public_port` |
| triển khai | deploy, release | đưa workload/config lên môi trường | `deploy` |
| cụm Kubernetes | Kubernetes cluster, k8s cluster | cluster Kubernetes | `kubernetes_cluster` |
| namespace | namespace | phạm vi resource Kubernetes | `namespace` |

## Dữ liệu, cloud và phát triển phần mềm

| Vietnamese | English / synonyms | Canonical meaning | Canonical value |
|---|---|---|---|
| cơ sở dữ liệu | database, DB, datastore | database system | `database` |
| quota GPU | GPU quota, compute quota | giới hạn tài nguyên cloud/GPU | `gpu_quota` |
| ngân sách | budget, spend limit | giới hạn chi phí | `budget` |
| máy chủ GPU | GPU instance, GPU node | tài nguyên compute có GPU | `gpu_resource` |
| repository | repo, code repository | Git repository | `repository` |
| pipeline | workflow, build pipeline | luồng CI/CD | `pipeline` |
| log | logs, logging data | dữ liệu ghi nhận hoạt động | `logs` |
| cảnh báo | alert, alarm | tín hiệu monitoring | `alert` |
| license | software licence, subscription | quyền sử dụng phần mềm | `license` |

## Từ khóa rủi ro và bảo mật

| Vietnamese | English / synonyms | Canonical meaning | Canonical value |
|---|---|---|---|
| mật khẩu | password | secret credential | `password` |
| bí mật | secret, secret value | secret/credential cần bảo vệ | `secret` |
| token | API token, bearer token | credential dạng token | `token` |
| khoá riêng tư | private key, SSH private key | private cryptographic key | `private_key` |
| thông tin xác thực | credential, login credential | dữ liệu xác thực | `credential` |
| bỏ qua chính sách | ignore policy, bypass policy | yêu cầu vượt policy | `policy_bypass` |
| tắt MFA | disable MFA, turn off 2FA | vô hiệu hoá kiểm soát xác thực | `disable_mfa` |
| tắt audit/logging | disable audit, turn off logging | vô hiệu hoá khả năng kiểm toán | `disable_audit` |
| production write | ghi production, sửa dữ liệu live | thay đổi dữ liệu production | `production_write` |
| xuất/dump dữ liệu | export data, database dump, copy customer data | data exfiltration hoặc data export cần kiểm soát | `data_export` |
| upload lên repo/laptop | upload to repo, copy to my laptop, personal drive | destination không được xác minh | `unmanaged_destination` |
| phần mềm unsigned/sideload | unsigned driver, sideload extension, unapproved software | software/security risk | `unapproved_software` |

## Mapping cách nói thường gặp

| User phrase | Canonical interpretation | Ghi chú |
|---|---|---|
| “Cho em access DB” | `intent=DATABASE_ACCESS` | Chưa đủ system/resource_scope/environment/permission/duration/reason/approval evidence. |
| “Chỉ SELECT thôi” | `permission=read-only` | Không được bỏ qua một claim khác như `admin` hoặc `production`. |
| “Cho quyền full để khỏi chờ” | `permission=admin` | Có thể là authority risk; cần reviewer. |
| “Lead đã approve rồi” | `approval_claim` | Không được map thẳng thành approval verified hoặc AUTO_APPROVE. |
| “Approval ở ticket ABC-123” | `approval_reference=ABC-123` | Reference phải được verifier kiểm tra role, scope, thời hạn và expiry. |
| “Mở port 3389 tạm cho QA” | `public_port`, `security_risk=true` | Route Security; không auto-approve. |
| “Gửi password hiện tại” | `secret_type=password` | Route Security; tuyệt đối không hiển thị secret. |
| “Dump customer DB vào repo private/laptop” | `data_export`, `unmanaged_destination` | Route Security + Data owner; private repo không tự làm destination an toàn. |
| “Máy bị đơ” | `problem=device_frozen` | Route IT Helpdesk; vẫn hỏi device_id/location/urgency. |
| “Bật máy không lên” | `problem=boot_failure` | Route IT Helpdesk. |
| “Cần 1 con A100 để train 6 tiếng” | `gpu_type=A100`, `purpose=training`, `duration=6 hours` | Vẫn cần provider, quantity, quota/budget và approval. |
| Form nói `QA/read-only` nhưng text nói `production/write` | `structured_free_text_conflict` | Giữ cả hai evidence và route `ESCALATE`; không lấy giá trị ít rủi ro hơn. |
