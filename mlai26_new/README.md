# OrganizationAI VN — Đề A

Workspace này giữ policy, dataset và provenance cho sản phẩm IT Helpdesk Escalation Referee.

## Runtime hiện tại

Ứng dụng đang chạy từ repository root, không phải một app riêng bên trong `mlai26_new/`:

- `src/`: Next.js UI/API, deterministic policy, model adapter, reviewer, audit và Verify.
- `tests/`: unit, integration và end-to-end tests.
- `mlai26_new/data/`: policy source, Verify packs, Ground Truth và adversarial fixtures.

Trước khi chỉnh sửa code, đọc `PROJECT-MEMORY.md` và `AGENTS.md`.

## Nguyên tắc dữ liệu

- Ticket, danh tính, approval và audit demo là synthetic hoặc đã ẩn danh.
- Ground Truth và policy được lưu riêng, có mã rule rõ ràng.
- Không lưu credential, token hoặc dữ liệu production thật.
- Policy trong thư mục này là synthetic/proposed challenge policy, không phải policy chính thức của VNG.

## Verify hiện tại

- `data/verify/support-v3.json`: pack `de-a-v3`, 5 case, 3 AUTO và 2 ESCALATE.
- `data/verify/judge-15.json`: 15 case dành cho judge.
- `data/verify/verify_cases.json`: fixture gốc lịch sử, giữ để regression/provenance và không phải pack judge-facing hiện tại.

Nguồn mô tả chính: [README root](../README.md), [judge datasets](../docs/JUDGE-DATASETS.md) và [policy migration](data/policy/support-v3-migration.md).
