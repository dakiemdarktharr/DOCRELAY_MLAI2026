# Student implementation status — main

Theo yêu cầu mới của người dùng: merge mọi thay đổi ngoài `src/` vào main, để người dùng tự viết source. Tree main chủ động không chứa `src/`; tests/config/fixtures đã có để làm contract và bài tập. Chưa có runtime mới, không thể dùng kết quả QA cũ để tuyên bố main build/test thành công.

- Hướng dẫn học: `LUNA-SRC-TUTOR-PROMPT.md`, 8 chặng và bản đồ từng file.
- Chế độ hỗ trợ: gia sư/reviewer theo root `AGENTS.md`, không tự sinh hoặc restore source.
- Bản AI-assisted được giữ nguyên ở `codex/support-v3-migration`, commit `69b16493143b1fd48d41487012ff0db77999a042`; lịch sử Git không bị xóa hoặc sửa ngày.
- Chưa triển khai main thiếu source. Cần tự viết, chạy lại QA trên implementation mới, rồi mới xét live deployment.

## Bản tham khảo — không phải trạng thái main hiện tại

Các mục bên dưới ghi lại implementation và QA tại commit `69b1649` để tham khảo. Phases 0–7 của bản đó đã có code/test; source của nó không được nhận vào tree main trong lần merge chọn lọc này.

## Runtime của bản tham khảo

- Canonical request/decision contract, 13 service groups, taxonomy/fields, versioned policy và GUIDE-001…008.
- Preview, confirmed idempotent submit, deterministic precedence, redaction, scoped demo approval.
- Model mock/OpenAI adapter, evidence/schema checks, fail-safe, bounded calls, safe assistance và deterministic explanations.
- Employee feedback/clarification, public demo reviewer, guarded transitions/CAS, embedded audit/history và feedback counts.
- Verify cùng API, judge input mới, Đề A v3 đúng3auto/2escalate. 123 Ground Truth +5Verify gốc giữ nguyên byte-for-byte và được báo mismatch riêng.
- Generic UI chuyển `/legacy/*`; các API health/echo/events được giữ. Không thao tác hạ tầng thật.

## Evidence của bản tham khảo

- Baseline trước migration: 12 unit/integration tests, lint và build PASS.
- Phase gates domain3, policy17, supportAPI4, model6, reviewer8 ban đầu (nay10), Verify18 PASS.
- Full test: 87/87 PASS; lint, typecheck và production build PASS. E2E20/20 desktop/mobile PASS (51.9s, không retry, 0flaky), sau sửa regression từ khóa ETL. `artifacts/e2e-results.json` là report runner. Lượt cuối chạy ngoài sandbox Windows để Playwright tự cleanup server thành công; không dừng process3000.
- Original fixture report: 128 total, 48 matched action+bucket, 80 mismatch với expected cũ; không case ESCALATE gốc nào thành AUTO trong lượt này. Đây là compatibility analysis, không phải pass rate với policy mới hay production accuracy. Xem `artifacts/original-fixture-evaluation.json`.
- Hash check giữ nguyên toàn bộ nguồn policy/verify/ground-truth có trong `artifacts/migration-baseline-manifest.json`.
- E2E dùng port3216, app marker `MLAI_SUPPORT_REFEREE_V3`, mock/memory; không dùng port3000 PID48292 của repository khác.

## Chưa xác nhận / giới hạn

- Live Mongo connection, persistence qua restart và live OpenAI models chưa test; không có credential trong repo này. Memory không bền vững hoặc chia sẻ instance.
- Regex extraction/redaction có giới hạn ngôn ngữ; medium model chỉ chọn bước đã kiểm duyệt. Catalog đầy đủ không có nghĩa đầy đủ automation nghiệp vụ.
- Không SSO/actor identity, external tools, IAM/DB/cloud execution, production data, approval authority thật. Public reviewer chỉ synthetic demo.
- Chưa xác nhận public deployment của migration. Blueprint Render cũ vẫn là generic; cần environment Support v3.
- npm audit từ dependency install báo6 advisories (2moderate/4high); không force-upgrade major ngoài phạm vi migration.
- Phần học sinh tự viết/review cần ghi riêng. Source migration do Astra/Codex hỗ trợ không được ghi là tự viết hay dùng commit mới để thay đổi nguồn gốc scaffold.

## Git và provenance

Baseline commit `4009759` trên `main` (20/09/2026 16:20 +07), remote `dakiemdarktharr/DOCRELAY_MLAI2026`. Migration được tập hợp trên nhánh `codex/support-v3-migration` để review. Audit phase0 ghi nhận trạng thái chưa commit ở thời điểm kiểm tra ban đầu; sau đó đã có baseline commit. Không rewrite lịch sử hoặc timestamp. Tài liệu phân công TEAM-PLAN/PARALLEL-WORK-PLAN là lịch sử kế hoạch; prompt migration hiện tại cho phép agent triển khai và phải công bố AI assistance.
