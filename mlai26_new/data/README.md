# Synthetic datasets

- `verify/verify_cases.json`: 5 case cố định cho Verify Harness 90 giây, gồm 3 AUTO và 2 ESCALATE.
- `ground-truth/extended_ticket_cases.json`: 60 case mở rộng dùng để phát triển, regression test và đánh giá độ ổn định trên các ngách kỹ thuật.
- `ground-truth/enterprise_cross_function_cases.json`: 48 case thực tế liên phòng ban, gồm HR, Finance, Legal, Procurement, Sales, Marketing, Customer Care, Facilities, Audit, Risk, Comms, Event Ops và Executive Office.
- `adversarial/hidden_adversarial_cases.json`: 5 hidden adversarial cases, tách riêng khỏi bộ demo/Verify, gồm prompt injection, nhầm staging/production, bypass vì khẩn cấp, mâu thuẫn giữa form và free text, và request trộn routine với nguy hiểm.
- `demo/`: dữ liệu seed phục vụ giao diện demo, không dùng làm Ground Truth.

Toàn bộ ticket hiện tại là synthetic. Tên hệ thống và ngữ cảnh chỉ được dùng để mô phỏng bài toán OrganizationAI; không được diễn giải là ticket hoặc chính sách nội bộ thật của VNG.

Hidden adversarial cases không được hard-code vào UI Verify hiện tại. Khi chạy regression, phải load fixture này qua cùng decision workflow với các case bình thường.

## Phân bố bộ mở rộng

- 15 `ROUTINE`
- 15 `MISSING_INFO`
- 15 `SECURITY_RISK`
- 15 `BEYOND_AUTHORITY`

Mỗi object giữ đúng contract: `id`, `ticket_content`, `expected_action`, `expected_bucket`, `expected_reasoning_keyword`.
