# Support migration status — 20/09/2026

## Cập nhật giao diện cũ + workflow v3

- Khôi phục orange/NAVI, Nunito/Baloo2, home hai nút, form employee hai cột và các panel reviewer/audit/Verify. `/send-help` và `/workspace` dùng cùng UI; preview có quay lại sửa; reviewer có lọc và URL chi tiết tải lại được.
- Giữ nguyên backend policy/workflow v3. Nguồn UI/font và khác biệt so với prototype được ghi tại `UI-RESTORATION.md`; không thay đổi provenance bằng commit mới.
- QA cuối cho thay đổi UI: 87/87 unit/integration, 24/24 E2E desktop/mobile PASS (75.25s, 0 retry/flaky); lint và production build PASS trên checkout riêng. Typecheck cũng được kiểm tra riêng; build bao gồm kiểm tra TypeScript.
- E2E cuối chạy tại checkout riêng `C:/Users/ANHKHOI/AppData/Local/Temp/mlai26-ui-validation-20260920`, port3216, base `69b1649` + UI changes. Đây là checkout của cùng repository, dùng mock/memory. Report có rootDir tương ứng.
- Trong lúc QA, `src/domain/contracts.ts` ở workspace chính được chỉnh bởi thao tác khác và không còn khớp catalog (ví dụ `STORAGE_BACKUP` thay `STORAGE`). File đó được bảo toàn, không đưa vào commit UI; không suy diễn kết quả QA này áp dụng cho bản domain đang viết dở.
- `main` vẫn giữ tree không có `src` theo yêu cầu đội tự code.

Phases 0–7 đã có implementation, test và documentation cho demo local. Đây là repository `mlai26`, không phải bản LabPass/DocRelay trong repository khác. Live persistence/model/deployment vẫn là các bước chưa xác nhận bên dưới.

## Runtime

- Canonical request/decision contract, 13 service groups, taxonomy/fields, versioned policy và GUIDE-001…008.
- Preview, confirmed idempotent submit, deterministic precedence, redaction, scoped demo approval.
- Model mock/OpenAI adapter, evidence/schema checks, fail-safe, bounded calls, safe assistance và deterministic explanations.
- Employee feedback/clarification, public demo reviewer, guarded transitions/CAS, embedded audit/history và feedback counts.
- Verify cùng API, judge input mới, Đề A v3 đúng3auto/2escalate. 123 Ground Truth +5Verify gốc giữ nguyên byte-for-byte và được báo mismatch riêng.
- Generic UI chuyển `/legacy/*`; các API health/echo/events được giữ. Không thao tác hạ tầng thật.

## Evidence hiện tại

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
