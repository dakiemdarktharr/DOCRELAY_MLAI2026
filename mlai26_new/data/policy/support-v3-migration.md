# Policy migration support-guidance-v3 — 20/09/2026

Đây là policy demo synthetic triển khai từ master prompt hiện tại, không phải chính sách VNG được xác nhận. File policy/fixture gốc được giữ nguyên, không ghi đè. Hash baseline ở `artifacts/migration-baseline-manifest.json`.

## Nguồn policy runtime

`src/domain/policy-source.ts` chứa rule IDs/reasons/priority và safe guidance labels; `catalog.ts` là taxonomy; `policy.ts` đánh giá facts; `text.ts` normalization/extraction/conflict/risk; `guidance.ts` chứa bước đã kiểm duyệt. Model không thay được policy source. Rules không so sánh case ID hoặc nguyên văn fixture.

Decision có action AUTO_APPROVE / NEEDS_INFORMATION / ESCALATE, requestKind, handlingMode, riskLevel, bucket, uncertaintyClass, ruleIds, safeEvidence, missingFields, questions, userReason, adminReason, nextStep, assignedTeam, policyVersion. Precedence SECURITY_RISK > BEYOND_AUTHORITY > MISSING_INFO > ROUTINE.

## Conflict giải quyết công khai

| Dữ liệu/thiết kế trước | v3 / lý do |
| --- | --- |
| Verify gốc2AUTO/3ESCALATE | Giữ nguyên; pack support-v3 riêng5case có3guidance AUTO/2production-public ESCALATE theo yêu cầu mới |
| Manager/lead nói đã approve →AUTO trong nhiều fixtures | Không verified. INFO-005 hỏi scoped approval; demo registry xác minh exact resource/env/permission/duration/expiry, sai scope AUTH-007 |
| ETL thiếu sizing →ESCALATE/MISSING_INFO | NEEDS_INFORMATION theo contract mới, trừ khi có rủi ro khác ưu tiên cao hơn |
| OTHER mặc định escalation | OTHER chỉ intake; classify theo label/nhóm thật; chưa đủ dữ kiện hỏi thêm, không có safe path thì AUTH-005 |
| Device diagnosis cần asset ID/location | GUIDE-001…008 không đòi field không cần thiết; repair ticket cần ID/location |
| Từ reset dẫn escalate | Chưa rõ restart/factory reset →INFO-RESET. Sau clarification restart được guide; explicit factory reset/wipe cần review, không chỉ dẫn xóa dữ liệu |
| Export customer/prod tới laptop có khi BEYOND_AUTHORITY | SEC-005 SECURITY_RISK theo precedence mới |
| Chưa human control | Reviewer thay trạng thái mô phỏng và audit; không hạ/ghi đè quyết định policy. Security request không được approve/complete. Human approve BEYOND_AUTHORITY được prompt hiện tại cho phép trong demo; khác chỉ dẫn cũ “không approved bất kỳ escalation” |

Factory-reset wording trong prompt có hai ý: “factory reset mơ hồ hỏi thêm” và “factory reset chưa ownership/backup luôn escalate”. v3 hiểu yêu cầu reset **chưa rõ loại** là hỏi thêm; yêu cầu factory reset rõ ràng hoặc corporate wipe đi review. Admin có thể yêu cầu ownership/backup/mục đích, nhưng demo không tự wipe kể cả có claim backup.

GUIDE-001 shutdown/restart,002frozen-device,003VPN,004Wi-Fi,005approved software,006account self-service,007peripherals,008general how-to. Chỉ trả steps an toàn; không quyền mới/secret/data deletion/public exposure/production side effect. Medium assistance là model chọn/reorder vetted steps, không tự sinh command. B có tối đa3lượt hướng dẫn; sau đó handoff. C/D handoff ngay.

FAIL-001 model unavailable/timeout/refusal/budget, FAIL-002 invalid schema/instructions, FAIL-003 thiếu evidence/scope/ambiguity. Không trả auto khi model path thất bại. Known-risk deterministic path không cần gọi model. Explanations luôn deterministic dựa rule/evidence, không lưu chain-of-thought.

## Dataset và evaluation

CSV authority gốc có5dòng AUTHZ-005/006/012/013/014 chỉ9cột thay vì10. Không tự sửa file hoặc diễn giải cột lệch thành authority. Runtime dùng rule data typed và registry scoped riêng; CSV chỉ là tài liệu nguồn chờ nhóm hiệu đính có version.

Original Verify5 + Ground Truth123 không đổi. `tests/support-verify.test.ts` chạy cùng production route, lưu mỗi expected/actual/rule/explanation/time/requestId vào `artifacts/original-fixture-evaluation.json`. Mismatch được trình bày, không tự “sửa đúng” expected. Bản v3 mới có policy reason gắn rule riêng và integration tests. Không coi old-dataset match rate là accuracy policy mới.

## Compatibility window và deprecation

Từ migration này tới khi có version thay thế được nhóm công bố (chưa có ngày xóa): giữ `/api/health`, `/api/events`, `/api/echo`, envelope/ordinary echo validation, Prisma generic events, generic UI và Verify ở `/legacy/*`. Root `/workspace`, `/verify`, `/audit` nay dành Support; legacy vẫn có link từ các màn hình mới.

Deprecated cho workflow support: generic echo main navigation, generic LLM sandbox và Render PostgreSQL blueprint như một cấu hình đủ cho Support. Không xóa chúng. Hardening có chủ đích: echo redact credential values; sandbox từ chối recognized secrets, redact output, lỗi generic; default model retries0 dùng chung budget, SDK retries0. Ordinary echo và explicit unit-test retry behavior còn test.

Không có migration xóa/đổi schema dữ liệu cũ; Mongo v3 namespace riêng. Memory là local/demo fallback; deploy bền vững cần Mongo. Public reviewer chỉ synthetic, không nhận diện người thật. Không production credential/data trong source/fixture/log/audit.
