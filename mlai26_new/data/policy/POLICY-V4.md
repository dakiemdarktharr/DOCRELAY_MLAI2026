# Executable policy v4

Version runtime: `support-guidance-v4`  
Scope: synthetic Sprint 1 demo; không phải policy chính thức của VNG.

Các file policy-v2 trong thư mục này là nguồn challenge gốc và được giữ
byte-for-byte để bảo toàn baseline. Tài liệu này là addendum/runtime policy
v4, mô tả các rule đã được triển khai trong `src/domain/` sau stress test.

## Contract mapping

Runtime dùng camelCase cho canonical data:

| Policy source | Runtime |
| --- | --- |
| `resource_scope` | `resourceScope` |
| `requested_action` | `requestedAction` |
| `approval_reference` | `approvalReference` |
| `matchedRuleIds` | `ruleIds` |
| `targetedQuestions` | `targetedQuestions` và alias tương thích `questions` |

Mỗi decision ghi `policyVersion`, approval status/reference và
`subrequestOutcomes`. Audit ghi thêm targeted questions, next step, redaction
markers, approval metadata và kết quả từng subrequest.

## Invariant thực thi

- Secret được redact trước extraction/model, persistence, audit và response.
- Mỗi subrequest được evaluate riêng; kết quả cuối lấy bucket có precedence cao nhất.
- Database export và mọi direct production database access không có auto path.
- Device auto workflow chỉ chấp nhận intent chẩn đoán chuẩn; update driver, wipe, replacement và destructive action không đi vào safe path.
- `OTHER` luôn route `Classifier/reviewer` với câu hỏi cụ thể; không tự gán IT Helpdesk.
- Mọi request thuộc service `SECURITY`, kể cả câu hỏi compliance, đi qua security/reviewer flow (`AUTH-010`).
- Approval chỉ do server verifier xác nhận theo role, scope và expiry. Pending dẫn đến hỏi thêm; expired, unverifiable hoặc mismatch dẫn đến escalation.
- Request còn missing facts/approval không thể được reviewer approve hoặc override thành approved.
- Security risk không thể approve/fulfill trong demo. Mọi human action cần reason và mọi auto fulfillment re-check policy/approval.
- Model output không thể đặt decision/approval, dùng field sai service hoặc mở auto path từ intent mà deterministic classifier không xác minh.

## Safe routine paths

Các workflow routine vẫn chỉ là mô phỏng. Safe paths gồm database read
non-production với approval đúng scope, GPU sandbox/development trong quota,
standard account/Git access có approval, approved software/license, device
diagnosis chuẩn, network/CI/Kubernetes/monitoring diagnostic trong điều kiện
đã khai báo. Các path khác fail closed sang hỏi thêm hoặc human review.

Registry `DEMO-*` trong `src/services/approvals.ts` chỉ chứa record synthetic
để kiểm thử các route này; không đại diện người, resource hoặc phê duyệt thật.

## v4.1 integration — 2026-09-21

Retains v4 authority, service routing and per-subrequest evaluation. Adds judge-approved intent-specific missing facts, at most three employee clarification questions, separate reviewer prompts for risk, and explicit demo resource limits (2 T4/A10 GPUs, 4 CPU, 16 GB RAM, 100 GB disk, 8 hours). Unknown requests still require classification review. Labelled fact fragments describe their preceding request; full-input risk detection remains. Database exports require a controlled destination. All reviewer actions require a reason; missing information remains blocked with INVALID_TRANSITION or MISSING_INFORMATION. The old Ground Truth remains unchanged and discrepancies are visible.
